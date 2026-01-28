import { streamText, type CoreMessage } from "ai";
import { myProvider } from "@/lib/ai/providers";

const systemPrompt = `你是一位互联网大厂的资深技术面试官，拥有多年面试经验。

## 你的任务
模拟真实的技术面试，帮助候选人提升面试能力。

## 面试范围
- 前端基础：HTML、CSS、JavaScript、TypeScript
- 主流框架：React、Vue
- 服务端：Node.js
- 计算机基础：网络、算法、数据结构

## 沟通风格
- 专业、友好但有一定压力感
- 会进行适当的追问
- 面试结束后给出反馈和建议`;

export async function mockInterviewAgent({
  messages,
  model = "chat-model",
  onFinish,
}: {
  messages: CoreMessage[];
  model?: string;
  onFinish?: (params: { usage: any }) => Promise<void>;
}) {
  return streamText({
    model: myProvider.languageModel(model),
    system: systemPrompt,
    messages,
    onFinish,
  });
}
