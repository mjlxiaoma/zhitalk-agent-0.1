# 心跳检测通知配置指南

## 邮件通知配置（QQ邮箱）

### 1. 获取 QQ 邮箱授权码

1. 登录 QQ 邮箱网页版：https://mail.qq.com
2. 点击顶部"设置" → "账户"
3. 找到"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
4. 开启"IMAP/SMTP服务"或"POP3/SMTP服务"
5. 点击"生成授权码"，按提示用手机QQ扫码验证
6. 复制生成的授权码（16位字符，类似：abcdabcdabcdabcd）

### 2. 配置环境变量

在 `.env.local` 文件中添加：

```bash
# 邮件配置
EMAIL_HOST=smtp.qq.com
EMAIL_PORT=465
EMAIL_USER=你的QQ邮箱@qq.com
EMAIL_PASSWORD=刚才获取的授权码
EMAIL_TO=2075498242@qq.com
```

**注意：**
- `EMAIL_USER` 填你自己的 QQ 邮箱（发件邮箱）
- `EMAIL_PASSWORD` 填授权码，不是 QQ 密码
- `EMAIL_TO` 已经设置为 2075498242@qq.com（收件邮箱）

### 3. 安装依赖

```bash
pnpm install
```

### 4. 测试邮件发送

本地测试：
```bash
pnpm heartbeat
```

如果配置正确，30分钟后（连续2次检测失败）会收到测试邮件。

## 其他通知方式

### 钉钉机器人（可选）

**配置步骤：**

1. 打开钉钉群 → 群设置 → 智能群助手 → 添加机器人 → 自定义机器人
2. 设置机器人名称（如：服务监控）
3. 安全设置选择"自定义关键词"，填入：`服务告警`
4. 复制 Webhook 地址
5. 在 `.env.local` 中添加：
   ```
   DINGTALK_WEBHOOK_URL=https://oapi.dingtalk.com/robot/send?access_token=xxxxx
   ```

### 企业微信机器人（可选）

**配置步骤：**

1. 打开企业微信群 → 群设置 → 群机器人 → 添加群机器人
2. 设置机器人名称（如：服务监控）
3. 复制 Webhook 地址
4. 在 `.env.local` 中添加：
   ```
   WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxx
   ```

### 自定义 Webhook（可选）

如果你有自己的通知服务，可以配置自定义 Webhook：

```
HEARTBEAT_WEBHOOK_URL=https://your-notification-service.com/webhook
```

**Webhook 会收到的数据格式：**
```json
{
  "service": "ai-chatbot",
  "status": "error",
  "message": "服务不可达...",
  "timestamp": "2024-03-09T10:30:00.000Z",
  "url": "https://your-domain.com"
}
```

## 告警策略

- 连续失败 2 次才发送告警（避免误报）
- 服务恢复时也会发送通知
- 每 15 分钟检测一次

## 部署到服务器

1. 配置环境变量（`.env.local` 或 `.env.production`）：
   ```bash
   NEXT_PUBLIC_APP_URL=https://你的域名.com
   EMAIL_USER=你的QQ邮箱@qq.com
   EMAIL_PASSWORD=你的授权码
   EMAIL_TO=2075498242@qq.com
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 启动服务：
   ```bash
   pnpm start:pm2
   pnpm heartbeat:pm2
   ```

4. 查看日志：
   ```bash
   pm2 logs ai-chatbot-heartbeat
   ```

5. 停止心跳检测：
   ```bash
   pnpm heartbeat:stop
   ```

## 测试通知

可以临时停止主服务来测试告警是否正常：
```bash
pm2 stop ai-chatbot
# 等待 30 分钟（2次检测失败）
# 应该会收到告警邮件
pm2 start ai-chatbot
# 下次检测时会收到恢复通知邮件
```

## 常见问题

### 1. 邮件发送失败

- 检查授权码是否正确（不是 QQ 密码）
- 确认已开启 SMTP 服务
- 查看日志中的具体错误信息

### 2. 收不到邮件

- 检查垃圾邮件箱
- 确认 EMAIL_TO 邮箱地址正确
- 查看 PM2 日志确认是否发送成功

### 3. 邮件格式问题

邮件包含 HTML 格式，如果显示异常，可以查看纯文本版本。
