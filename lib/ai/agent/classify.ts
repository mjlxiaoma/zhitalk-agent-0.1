import { generateObject } from "ai";
import { z } from "zod";
import type { ChatModel } from "@/lib/ai/models";
import { myProvider } from "@/lib/ai/providers";
import type { ChatMessage } from "@/lib/types";

/**
 * 分类结果结构 - 布尔值格式
 */
export const ClassificationResultSchema = z.object({
  resume_opt: z.boolean().describe("是否为简历优化意图"),
  mock_interview: z.boolean().describe("是否为模拟面试意图"),
  related_topics: z.boolean().describe("是否为编程/面试相关话题"),
  others: z.boolean().describe("是否为其他话题"),
});

export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

/**
 * 分类系统提示词
 */
const CLASSIFICATION_SYSTEM_PROMPT = `你是一个互联网大公司的资深程序员和面试官，尤其擅长前端技术栈，包括 HTML、CSS、JavaScript、TypeScript、React、Vue、Node.js、小程序等技术。

请根据用户输入的内容，判断用户属于哪一种情况，并输出 JSON 格式。

## 分类说明

1. **resume_opt（简历优化）**
   - 用户想要优化、修改、审阅简历
   - 用户询问简历相关的建议
   - 用户提供了简历内容并寻求反馈
   - 关键词：简历、CV、resume、优化简历、修改简历、简历建议、帮我看看简历

2. **mock_interview（模拟面试）**
   - 用户想要进行模拟面试
   - 用户请求面试练习或面试场景模拟
   - 用户想要扮演面试者角色
   - 关键词：模拟面试、面试练习、面试场景、当面试官

3. **related_topics（编程/面试/简历相关话题）**
   - 用户询问编程技术问题
   - 用户询问面试题目或面试技巧
   - 用户讨论技术栈、框架、工具
   - 用户询问职业发展、技术学习路径
   - 关键词：技术问题、面试题、如何学习、技术选型、代码问题

4. **others（其他话题）**
   - 闲聊、问候
   - 与编程、面试、简历无关的话题
   - 生活问题、娱乐话题
   - 其他领域的咨询

## 输出格式

返回一个 JSON 对象，包含 4 个布尔值字段，只有一个应该为 true：
{
  "resume_opt": true/false,
  "mock_interview": true/false,
  "related_topics": true/false,
  "others": true/false
}

重要：4 个字段中只能有一个为 true，其他必须为 false。`;

/**
 * 分类选项
 */
export type ClassifyUserIntentOptions = {
  /** 用户消息历史 */
  messages: ChatMessage[];

  /** 使用的模型 ID */
  modelId?: ChatModel["id"];
};

/**
 * 分类用户意图
 *
 * 使用 AI 模型分析用户消息，判断用户的意图类型
 *
 * @param options - 分类选项
 * @returns 分类结果（布尔值对象）
 */
export async function classifyUserIntent(
  options: ClassifyUserIntentOptions
): Promise<ClassificationResult> {
  const { messages, modelId = "chat-model" } = options;

  // 提取最后一条用户消息作为分类依据
  const lastUserMessage = messages.filter((msg) => msg.role === "user").pop();

  if (!lastUserMessage) {
    throw new Error("No user message found for classification");
  }

  // 构建用于分类的提示
  const userContent = lastUserMessage.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");

  try {
    const result = await generateObject({
      model: myProvider.languageModel(modelId),
      system: CLASSIFICATION_SYSTEM_PROMPT,
      prompt: `用户输入：${userContent}\n\n请判断用户意图并返回 JSON 格式的分类结果。`,
      schema: ClassificationResultSchema,
      temperature: 0.1,
    });

    console.log("Classification result:", result.object);
    return result.object;
  } catch (error) {
    console.error("Classification error:", error);

    // 如果分类失败，返回默认分类（related_topics）
    return {
      resume_opt: false,
      mock_interview: false,
      related_topics: true,
      others: false,
    };
  }
}

/**
 * 获取激活的意图类型
 */
export function getActiveIntent(
  classification: ClassificationResult
): string | null {
  if (classification.resume_opt) {
    return "resume_opt";
  }
  if (classification.mock_interview) {
    return "mock_interview";
  }
  if (classification.related_topics) {
    return "related_topics";
  }
  if (classification.others) {
    return "others";
  }
  return null;
}

/**
 * 获取意图的中文描述
 */
export function getIntentDescription(intentKey: string): string {
  const descriptions: Record<string, string> = {
    resume_opt: "简历优化",
    mock_interview: "模拟面试",
    related_topics: "编程/面试相关话题",
    others: "其他话题",
  };

  return descriptions[intentKey] || "未知";
}

/**
 * 判断意图是否在服务范围内
 */
export function isIntentInScope(classification: ClassificationResult): boolean {
  return !classification.others;
}
