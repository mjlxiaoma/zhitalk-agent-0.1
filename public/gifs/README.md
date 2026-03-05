# GIF 动图说明

请将你的 GIF 动图文件放在这个目录下，并按照以下命名：

1. `resume-optimization.gif` - 简历优化演示
2. `mock-interview.gif` - 模拟面试场景
3. `question-answer.gif` - 面试题解答

## 如何添加 GIF

1. 将 GIF 文件复制到 `public/gifs/` 目录
2. 确保文件名与上述命名一致
3. 如果需要修改 GIF 配置，编辑 `components/gif-showcase.tsx` 文件

## 建议

- GIF 文件大小建议控制在 5MB 以内，以确保加载速度
- 推荐尺寸：1280x720 或 16:9 比例
- 如果需要添加更多 GIF，可以在 `components/gif-showcase.tsx` 中的 `gifItems` 数组添加新项
