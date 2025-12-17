# zhitalk-agent 项目规则

## 项目概述
- 项目类型: Next.js AI 聊天应用
- AI SDK: Vercel AI SDK
- 数据库: PostgreSQL + Drizzle ORM
- 样式: Tailwind CSS

## 通用规则
- 使用中文回复
- 代码注释使用中文
- 遵循项目现有的代码风格
- 修改代码前先阅读相关文件

## 目录结构
- `app/` - Next.js App Router 页面
- `lib/ai/` - AI 相关配置（模型、提示词、providers）
- `lib/db/` - 数据库配置
- `components/` - React 组件
- `artifacts/` - Artifact 处理逻辑

## Opus 4.5 专用规则
当使用 Opus 模型时：
- 进行深入的代码分析和架构评估
- 提供详细的实现方案和权衡分析
- 主动发现潜在问题和优化点
- 编写高质量、可维护的代码

## Sonnet 专用规则
当使用 Sonnet 模型时：
- 平衡速度和质量
- 提供清晰的解释
- 专注于任务完成

## Haiku 专用规则
当使用 Haiku 模型时：
- 保持简洁高效
- 快速响应简单任务
- 避免过度分析
