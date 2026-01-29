# 添加新的 AI 工具

为 zhitalk-agent 项目添加一个新的 AI 工具。

## 输入参数
- $ARGUMENTS: 工具名称和功能描述，格式为 "工具名称: 功能描述"

## 任务步骤

1. 首先阅读现有的工具实现作为参考：
   - `lib/ai/tools/create-document.ts` - 创建文档工具
   - `lib/ai/tools/evaluate-skills.ts` - 技能评估工具
   - `lib/ai/tools/get-weather.ts` - 天气查询工具

2. 在 `lib/ai/tools/` 目录下创建新的工具文件，遵循以下模式：
   ```typescript
   import { tool } from 'ai';
   import { z } from 'zod';

   export const myTool = tool({
     description: '工具描述',
     parameters: z.object({
       // 参数定义
     }),
     execute: async ({ /* 参数 */ }) => {
       // 实现逻辑
     },
   });
   ```

3. 更新 `lib/ai/tools/index.ts`（如果存在）导出新工具

4. 在需要使用该工具的代理中引入：
   - 修改相应的 agent 文件
   - 在 `streamText` 调用中添加到 tools 配置

5. 确保：
   - 使用 zod 进行参数验证
   - 提供清晰的工具描述（AI 会根据描述决定何时使用）
   - 处理错误情况
   - 添加中文注释

## 工具类型建议

根据项目特点，常用工具类型：
- 文档操作：创建、更新、删除
- 数据查询：获取用户信息、历史记录
- 外部 API：第三方服务调用
- 计算工具：评分、分析、统计
