# 开发环境管理

管理 zhitalk-agent 项目的开发环境。

## 输入参数
- $ARGUMENTS: 操作类型
  - `start` - 启动开发服务器
  - `build` - 构建项目
  - `check` - 检查项目状态
  - `deps` - 检查依赖
  - `clean` - 清理缓存

## 操作命令

### start - 启动开发服务器
```bash
pnpm dev
```
启动 Next.js 开发服务器（使用 Turbo）

### build - 构建项目
```bash
pnpm build
```
构建生产版本，检查是否有编译错误

### check - 检查项目状态
执行以下检查：
1. `pnpm lint` - ESLint 检查
2. `pnpm format:check` - Prettier 格式检查
3. TypeScript 类型检查

### deps - 检查依赖
1. 检查过时的依赖：`pnpm outdated`
2. 检查安全漏洞：`pnpm audit`
3. 检查未使用的依赖

### clean - 清理缓存
```bash
rm -rf .next
rm -rf node_modules/.cache
```

## 环境变量

项目需要的环境变量（参考 `.env.example`）：
- `DATABASE_URL` - PostgreSQL 连接字符串
- `AUTH_SECRET` - NextAuth 密钥
- `DEEPSEEK_API_KEY` - DeepSeek API 密钥
- 其他 AI 服务密钥

## 常见问题排查

### 端口占用
```bash
# Windows
netstat -ano | findstr :3000
# 然后 kill 对应进程
```

### 数据库连接失败
1. 检查 PostgreSQL 服务是否运行
2. 验证 DATABASE_URL 格式
3. 检查网络/防火墙设置

### 依赖安装问题
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```
