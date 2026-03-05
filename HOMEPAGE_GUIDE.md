# AI 智能面试官 - 首页使用指南

## 📁 文件结构

```
app/
├── page.tsx                    # 新的首页（根路径 /）
└── (chat)/
    └── chat/
        └── page.tsx           # 聊天页面（/chat 路径）

components/
└── gif-showcase.tsx           # GIF 展示组件

public/
└── gifs/                      # GIF 文件存放目录
    ├── README.md
    ├── resume-optimization.gif
    ├── mock-interview.gif
    └── question-answer.gif
```

## 🎨 首页功能

### 1. 响应式设计
- 桌面端：3 列网格布局展示功能和 GIF
- 移动端：轮播图展示 GIF，带左右切换按钮和指示点

### 2. 主要区域
- **Header**: 顶部导航栏，包含 Logo 和"开始使用"按钮
- **Hero Section**: 主标题和产品介绍
- **Features Section**: 三大核心功能卡片
- **GIF Showcase**: GIF 动图展示区域
- **CTA Section**: 行动号召区域
- **Footer**: 页脚信息

## 🖼️ 添加 GIF 动图

### 方法 1：直接添加文件
1. 将你的 GIF 文件放到 `public/gifs/` 目录
2. 按照以下命名：
   - `resume-optimization.gif` - 简历优化演示
   - `mock-interview.gif` - 模拟面试场景
   - `question-answer.gif` - 面试题解答

### 方法 2：自定义配置
编辑 `components/gif-showcase.tsx` 文件中的 `gifItems` 数组：

```typescript
const gifItems = [
  {
    id: 1,
    title: "你的标题",
    description: "你的描述",
    src: "/gifs/your-gif-name.gif",
    alt: "替代文本",
    icon: YourIcon, // 从 lucide-react 导入
  },
  // 添加更多...
];
```

## 🎯 路由说明

- `/` - 首页（新创建）
- `/chat` - 聊天页面（原来的根路径）
- `/chat/[id]` - 特定对话页面

## 🎨 自定义样式

### 修改主题色
编辑 `app/globals.css` 中的 CSS 变量：
```css
:root {
  --primary: hsl(240 5.9% 10%);
  /* 其他颜色变量... */
}
```

### 修改首页内容
编辑 `app/page.tsx`：
- 修改标题、描述文本
- 调整功能卡片内容
- 更改按钮文字和链接

## 📱 移动端适配

首页已完全适配移动端：
- 响应式布局（使用 Tailwind 的 `md:` 断点）
- 移动端轮播图（带触摸支持）
- 自适应字体大小
- 优化的间距和内边距

## 🚀 启动应用

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

访问 `http://localhost:3000` 查看首页
访问 `http://localhost:3000/chat` 进入聊天界面

## 💡 提示

1. **GIF 占位符**: 如果 GIF 文件不存在，会显示带图标的占位符
2. **图片优化**: GIF 使用 `unoptimized` 属性以保持动画效果
3. **性能建议**: GIF 文件大小建议控制在 5MB 以内
4. **推荐尺寸**: 1280x720 或 16:9 比例

## 🔧 常见问题

### Q: 如何修改首页的标题？
A: 编辑 `app/page.tsx` 中的 `<h1>` 标签内容

### Q: 如何添加更多功能卡片？
A: 在 `app/page.tsx` 的 Features Section 中添加更多 `<FeatureCard />` 组件

### Q: 如何修改 GIF 数量？
A: 编辑 `components/gif-showcase.tsx` 中的 `gifItems` 数组，添加或删除项目

### Q: 移动端轮播图不工作？
A: 确保组件使用了 `"use client"` 指令，并且 React 状态正常工作
