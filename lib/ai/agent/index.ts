import {
  convertToModelMessages,
  createUIMessageStream,
} from "ai";
import { classifyUserIntent } from "./classify";
import { resumeOptAgent } from "./resume-opt";
import { mockInterviewAgent } from "./mock-interview";
import { commonAgent } from "./common";
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

/**
 * Options for creating a chat stream
 */
export interface CreateChatStreamOptions {
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
  onFinish?: (result: {
    messages: any[];
    usage?: AppUsage;
  }) => Promise<void>;
  
  /** Callback when error occurs */
  onError?: (error: Error) => string;
}

/**
 * Result of creating a chat stream
 */
export interface CreateChatStreamResult {
  /** The UI message stream (not yet converted to SSE) */
  stream: ReadableStream;
}

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
export async function createChatStream(
  options: CreateChatStreamOptions
): Promise<CreateChatStreamResult> {
  const {
    selectedChatModel,
    messages,
    session,
    requestHints,
    chatId,
    onFinish,
    onError,
  } = options;

  let finalMergedUsage: AppUsage | undefined;

  const stream = createUIMessageStream({
    execute: async ({ writer: dataStream }) => {
      // 分类用户意图
      const classification = await classifyUserIntent({ messages });
      console.log(classification,'================>classification');
      
      let result;

      if (classification.resume_opt) {
        result = await resumeOptAgent({
          messages: convertToModelMessages(messages),
          model: selectedChatModel,
        });
      } else if (classification.mock_interview) {
        result = await mockInterviewAgent({
          messages: convertToModelMessages(messages),
          model: selectedChatModel,
        });
      } else {
        // 默认处理：related_topics 和 others
        result = commonAgent({
          messages,
          selectedChatModel,
          session,
          dataStream,
          onFinish: async ({ usage }) => {
            try {
              const providers = await getTokenlensCatalog();
              const modelId =
                myProvider.languageModel(selectedChatModel).modelId;

              if (!modelId) {
                finalMergedUsage = usage;
                dataStream.write({
                  type: "data-usage",
                  data: finalMergedUsage,
                });
                return;
              }

              if (!providers) {
                finalMergedUsage = usage;
                dataStream.write({
                  type: "data-usage",
                  data: finalMergedUsage,
                });
                return;
              }

              const summary = getUsage({ modelId, usage, providers });
              finalMergedUsage = { ...usage, ...summary, modelId } as AppUsage;
              dataStream.write({ type: "data-usage", data: finalMergedUsage });
            } catch (err) {
              console.warn("TokenLens enrichment failed", err);
              finalMergedUsage = usage;
              dataStream.write({ type: "data-usage", data: finalMergedUsage });
            }
          },
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
