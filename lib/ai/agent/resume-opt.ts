import { streamText, type CoreMessage } from "ai";
import { myProvider } from "@/lib/ai/providers";

const systemPrompt = `你是一位资深的简历优化专家，拥有多年互联网大厂招聘和面试经验。

## 你的任务
帮助用户优化他们的技术简历，使其更具竞争力。

## 工作流程
1. 如果用户还没有提供简历内容，请友好地提示他们发送简历文本
2. 收到简历后，从以下几个方面进行优化建议：
   - 整体结构和排版
   - 技术栈描述的准确性和专业性
   - 项目经验的亮点提炼
   - 量化成果的表达
   - 语言表达的简洁性

## 沟通风格
- 专业、友好、有建设性
- 给出具体可操作的修改建议
- 适当解释修改的原因`;

// 检查消息中是否包含简历内容
function hasResumeContent(messages: CoreMessage[]): boolean {
  const userMessages = messages.filter((m) => m.role === "user");
  return userMessages.some((m) => {
    const content = typeof m.content === "string" ? m.content : "";
    return content.length > 200 || /简历|工作经验|项目经验|技术栈|教育背景/.test(content);
  });
}

export async function resumeOptAgent({
  messages,
  model = "chat-model",
}: {
  messages: CoreMessage[];
  model?: string;
}) {
  // 如果没有简历内容，添加引导提示
  const finalMessages = hasResumeContent(messages)
    ? messages
    : [
        ...messages,
        {
          role: "assistant" as const,
          content: "请把你的简历文本内容发给我，我来帮你优化。",
        },
      ];

  return streamText({
    model: myProvider.languageModel(model),
    system: systemPrompt,
    messages: finalMessages,
  });
}
