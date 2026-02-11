# 添加新的 AI 代理

为 zhitalk-agent 项目添加一个新的 AI 代理。

## 输入参数
- $ARGUMENTS: 代理名称和描述，格式为 "代理名称: 代理描述"

## 任务步骤

1. 首先阅读现有的代理实现作为参考：
   - `lib/ai/agent/classify.ts` - 意图分类器
   - `lib/ai/agent/resume-opt.ts` - 简历优化代理
   - `lib/ai/agent/mock-interview.ts` - 模拟面试代理
   - `lib/ai/agent/common.ts` - 通用聊天代理

2. 在 `lib/ai/agent/` 目录下创建新的代理文件，遵循以下模式：
   - 导出一个 `create[AgentName]Agent` 函数
   - 使用 `streamText` 从 `ai` 包
   - 定义清晰的系统提示词
   - 根据需要配置 tools

3. 更新 `lib/ai/agent/classify.ts`：
   - 在 `UserIntent` 类型中添加新的意图类型
   - 在分类提示词中添加新意图的描述

4. 更新 `app/(chat)/api/chat/route.ts`：
   - 导入新的代理
   - 在 switch 语句中添加新意图的处理分支

5. 确保代码风格与项目一致：
   - 使用 TypeScript
   - 中文注释
   - 遵循现有的命名规范

## 示例

如果参数是 "code-review: 代码审查代理"，则：
- 创建 `lib/ai/agent/code-review.ts`
- 添加意图类型 `code_review`
- 实现代码审查相关的系统提示词和逻辑
