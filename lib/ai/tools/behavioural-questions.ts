import { tool } from "ai";
import { z } from "zod";

// 行为面试题数据源 URL
const BEHAVIOURAL_QUESTIONS_URL =
  "https://raw.githubusercontent.com/mianshipai/mianshipai-web/refs/heads/main/docs/hr-exam/behavioural-test.md";

/**
 * 获取 HR 行为面试题和答案
 * 从远程 markdown 文件获取行为面试相关内容
 */
export const getBehaviouralQuestions = tool({
  description:
    "获取 HR 行为面试题和答案。当用户询问关于 HR 行为面试、STAR 法则、行为面试技巧或需要行为面试题目练习时，使用此工具获取相关内容。",
  inputSchema: z.object({
    topic: z
      .string()
      .describe(
        "用户感兴趣的具体话题，例如：团队合作、领导力、冲突处理、压力管理等（可选）"
      )
      .optional(),
  }),
  execute: async ({ topic }) => {
    try {
      const response = await fetch(BEHAVIOURAL_QUESTIONS_URL);

      if (!response.ok) {
        return {
          error: `无法获取行为面试题数据，HTTP 状态码：${response.status}`,
        };
      }

      const content = await response.text();

      // 如果用户指定了具体话题，可以在返回时提供筛选提示
      return {
        content,
        topic: topic || "全部",
        source: BEHAVIOURAL_QUESTIONS_URL,
        message: topic
          ? `已获取行为面试题内容，请根据用户关注的「${topic}」话题进行针对性解答。`
          : "已获取完整的行为面试题内容，可以帮助用户进行面试准备。",
      };
    } catch (error) {
      return {
        error: `获取行为面试题时发生错误：${error instanceof Error ? error.message : "未知错误"}`,
      };
    }
  },
});
