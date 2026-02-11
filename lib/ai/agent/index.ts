import { convertToModelMessages, createUIMessageStream } from "ai";
import { unstable_cache as cache } from "next/cache";
import type { Session } from "next-auth";
import type { ModelCatalog } from "tokenlens/core";
import { fetchModels } from "tokenlens/fetch";
import { getUsage } from "tokenlens/helpers";
import type { ChatModel } from "@/lib/ai/models";
import type { RequestHints } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import type { ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { generateUUID } from "@/lib/utils";
import { classifyUserIntent } from "./classify";
import { commonAgent } from "./common";
import { mockInterviewAgent } from "./mock-interview";
import { resumeOptAgent } from "./resume-opt";

type AgentStreamResult =
  | ReturnType<typeof commonAgent>
  | ReturnType<typeof resumeOptAgent>
  | ReturnType<typeof mockInterviewAgent>;

/**
 * Options for creating a chat stream
 */
export type CreateChatStreamOptions = {
  /** Selected chat model ID */
  selectedChatModel: ChatModel["id"];

  /** Complete message history including the new message */
  messages: ChatMessage[];

  /** Authenticated user session (used for tool configuration) */
  session: Session;

  /** Request hints (geolocation, etc.) */
  requestHints: RequestHints;

  /** Chat ID for associating messages */
  chatId: string;

  /** Callback when stream finishes */
  onFinish?: (result: { messages: any[]; usage?: AppUsage }) => Promise<void>;

  /** Callback when error occurs */
  onError?: (error: Error) => string;
};

/**
 * Result of creating a chat stream
 */
export type CreateChatStreamResult = {
  /** The UI message stream (not yet converted to SSE) */
  stream: ReadableStream;
};

/**
 * Get TokenLens catalog with caching
 */
const getTokenlensCatalog = cache(
  async (): Promise<ModelCatalog | undefined> => {
    try {
      return await fetchModels();
    } catch (err) {
      console.warn(
        "TokenLens: catalog fetch failed, using default catalog",
        err
      );
      return; // tokenlens helpers will fall back to defaultCatalog
    }
  },
  ["tokenlens-catalog"],
  { revalidate: 24 * 60 * 60 } // 24 hours
);

/**
 * 创建通用的 onFinish 处理函数
 * 用于处理 TokenLens 使用量统计和数据流写入
 */
function createAgentOnFinishHandler({
  selectedChatModel,
  dataStream,
  setFinalUsage,
}: {
  selectedChatModel: string;
  dataStream: ReturnType<typeof createUIMessageStream> extends Promise<unknown>
    ? never
    : Parameters<
        Parameters<typeof createUIMessageStream>[0]["execute"]
      >[0]["writer"];
  setFinalUsage: (usage: AppUsage) => void;
}) {
  return async ({ usage }: { usage: any }) => {
    try {
      const providers = await getTokenlensCatalog();
      const modelId = myProvider.languageModel(selectedChatModel).modelId;

      if (!modelId || !providers) {
        setFinalUsage(usage);
        dataStream.write({
          type: "data-usage",
          data: usage,
        });
        return;
      }

      const summary = getUsage({ modelId, usage, providers });
      const mergedUsage = { ...usage, ...summary, modelId } as AppUsage;
      setFinalUsage(mergedUsage);
      dataStream.write({ type: "data-usage", data: mergedUsage });
    } catch (err) {
      console.warn("TokenLens enrichment failed", err);
      setFinalUsage(usage);
      dataStream.write({ type: "data-usage", data: usage });
    }
  };
}

/**
 * Create a chat stream with AI model interaction
 *
 * This function encapsulates all AI-related logic including:
 * - Model configuration and system prompts
 * - Tool registration and execution
 * - Stream creation and management
 * - Usage tracking and TokenLens integration
 *
 * @param options - Configuration options for the chat stream
 * @returns A promise that resolves to the chat stream result
 */
export function createChatStream(
  options: CreateChatStreamOptions
): CreateChatStreamResult {
  const { selectedChatModel, messages, session, onFinish, onError } = options;

  let finalMergedUsage: AppUsage | undefined;

  const stream = createUIMessageStream({
    execute: async ({ writer: dataStream }) => {
      // 分类用户意图
      const classification = await classifyUserIntent({ messages });
      console.log(classification, "================>classification");

      // 创建公共的 onFinish 处理函数
      const agentOnFinish = createAgentOnFinishHandler({
        selectedChatModel,
        dataStream,
        setFinalUsage: (usage) => {
          finalMergedUsage = usage;
        },
      });

      let result: AgentStreamResult;

      if (classification.resume_opt) {
        result = await resumeOptAgent({
          messages: convertToModelMessages(messages),
          model: selectedChatModel,
          onFinish: agentOnFinish,
        });
      } else if (classification.mock_interview) {
        result = await mockInterviewAgent({
          messages: convertToModelMessages(messages),
          model: selectedChatModel,
          onFinish: agentOnFinish,
        });
      } else {
        // 默认处理：related_topics 和 others
        result = commonAgent({
          messages,
          selectedChatModel,
          session,
          dataStream,
          onFinish: agentOnFinish,
        });
      }

      result.consumeStream();

      dataStream.merge(
        result.toUIMessageStream({
          sendReasoning: true,
        })
      );
    },
    generateId: generateUUID,
    onFinish: async ({ messages: streamMessages }) => {
      if (onFinish) {
        await onFinish({
          messages: streamMessages,
          usage: finalMergedUsage,
        });
      }
    },
    onError: (error: unknown) => {
      if (onError && error instanceof Error) {
        return onError(error);
      }
      return "Oops, an error occurred!";
    },
  });

  return {
    stream,
  };
}
