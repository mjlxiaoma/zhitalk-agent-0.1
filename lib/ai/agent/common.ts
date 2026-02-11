import {
  convertToModelMessages,
  smoothStream,
  stepCountIs,
  streamText,
  type UIMessageStreamWriter,
} from "ai";
import type { Session } from "next-auth";
import { systemPrompt } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import { createDocument } from "@/lib/ai/tools/create-document";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { isProductionEnvironment } from "@/lib/constants";
import type { ChatMessage } from "@/lib/types";

export function commonAgent({
  messages,
  selectedChatModel,
  session,
  dataStream,
  onFinish,
}: {
  messages: ChatMessage[];
  selectedChatModel: string;
  session: Session;
  dataStream: UIMessageStreamWriter;
  onFinish?: (params: { usage: any }) => Promise<void>;
}) {
  return streamText({
    model: myProvider.languageModel(selectedChatModel),
    system: systemPrompt({ selectedChatModel }),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    experimental_activeTools:
      selectedChatModel === "chat-model-reasoning"
        ? []
        : [
            "getWeather",
            "createDocument",
            "updateDocument",
            "requestSuggestions",
          ],
    experimental_transform: smoothStream({ chunking: "word" }),
    tools: {
      getWeather,
      createDocument: createDocument({ session, dataStream }),
      updateDocument: updateDocument({ session, dataStream }),
      requestSuggestions: requestSuggestions({
        session,
        dataStream,
      }),
    },
    experimental_telemetry: {
      isEnabled: isProductionEnvironment,
      functionId: "stream-text",
    },
    onFinish,
  });
}
