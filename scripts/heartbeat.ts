import "dotenv/config";
import nodemailer from "nodemailer";

const HEARTBEAT_INTERVAL = 15 * 60 * 1000; // 15分钟
const SERVICE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const WEBHOOK_URL = process.env.HEARTBEAT_WEBHOOK_URL; // 通知 Webhook
const DINGTALK_WEBHOOK = process.env.DINGTALK_WEBHOOK_URL; // 钉钉机器人
const WECOM_WEBHOOK = process.env.WECOM_WEBHOOK_URL; // 企业微信机器人

// 邮件配置
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || "smtp.qq.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};
const EMAIL_TO = process.env.EMAIL_TO || "2075498242@qq.com";

let consecutiveFailures = 0;
const MAX_FAILURES_BEFORE_ALERT = 2; // 连续失败2次才告警，避免误报

// 创建邮件发送器
let transporter: nodemailer.Transporter | null = null;
if (EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.pass) {
  transporter = nodemailer.createTransport(EMAIL_CONFIG);
}

// 发送邮件通知
async function sendEmailNotification(subject: string, message: string) {
  if (!transporter) {
    console.warn("邮件未配置，跳过邮件通知");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"服务监控" <${EMAIL_CONFIG.auth.user}>`,
      to: EMAIL_TO,
      subject: `【服务告警】${subject}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #e74c3c; margin-top: 0;">🚨 服务告警</h2>
            <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0;">
              <strong>${subject}</strong>
            </div>
            <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto;">${message}</pre>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              时间: ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}
            </p>
          </div>
        </div>
      `,
    });
    console.log(`✓ 邮件通知已发送到: ${EMAIL_TO}`);
  } catch (error) {
    console.error("邮件发送失败:", error);
  }
}

// 发送钉钉通知
async function sendDingTalkNotification(message: string) {
  if (!DINGTALK_WEBHOOK) return;

  try {
    await fetch(DINGTALK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msgtype: "text",
        text: {
          content: `【服务告警】\n${message}\n时间: ${new Date().toLocaleString("zh-CN")}`,
        },
      }),
    });
  } catch (error) {
    console.error("钉钉通知发送失败:", error);
  }
}

// 发送企业微信通知
async function sendWeComNotification(message: string) {
  if (!WECOM_WEBHOOK) return;

  try {
    await fetch(WECOM_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msgtype: "text",
        text: {
          content: `【服务告警】\n${message}\n时间: ${new Date().toLocaleString("zh-CN")}`,
        },
      }),
    });
  } catch (error) {
    console.error("企业微信通知发送失败:", error);
  }
}

// 发送自定义 Webhook 通知
async function sendWebhookNotification(message: string, status: string) {
  if (!WEBHOOK_URL) return;

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: "ai-chatbot",
        status,
        message,
        timestamp: new Date().toISOString(),
        url: SERVICE_URL,
      }),
    });
  } catch (error) {
    console.error("Webhook 通知发送失败:", error);
  }
}

// 发送告警通知
async function sendAlert(subject: string, message: string, status: "error" | "warning") {
  console.error(`🚨 ${subject}\n${message}`);
  
  await Promise.all([
    sendEmailNotification(subject, message),
    sendDingTalkNotification(message),
    sendWeComNotification(message),
    sendWebhookNotification(message, status),
  ]);
}

async function checkHealth() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 开始心跳检测...`);

  try {
    const response = await fetch(`${SERVICE_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[${timestamp}] ✓ 服务正常`, {
        status: data.status,
        uptime: `${Math.floor(data.uptime / 60)}分钟`,
        memory: `${Math.floor(data.memory.heapUsed / 1024 / 1024)}MB`,
      });
      
      // 服务恢复正常
      if (consecutiveFailures >= MAX_FAILURES_BEFORE_ALERT) {
        await sendAlert(
          "服务已恢复正常",
          `服务地址: ${SERVICE_URL}\n运行时长: ${Math.floor(data.uptime / 60)}分钟\n内存使用: ${Math.floor(data.memory.heapUsed / 1024 / 1024)}MB`,
          "warning"
        );
      }
      consecutiveFailures = 0;
    } else {
      consecutiveFailures++;
      const errorMsg = `服务地址: ${SERVICE_URL}\nHTTP 状态码: ${response.status}\n连续失败次数: ${consecutiveFailures}`;
      console.error(`[${timestamp}] ✗ 服务异常 - ${errorMsg}`);
      
      if (consecutiveFailures >= MAX_FAILURES_BEFORE_ALERT) {
        await sendAlert("服务异常", errorMsg, "error");
      }
    }
  } catch (error) {
    consecutiveFailures++;
    const errorMsg = `服务地址: ${SERVICE_URL}\n连续失败次数: ${consecutiveFailures}\n错误信息: ${error instanceof Error ? error.message : "未知错误"}`;
    console.error(`[${timestamp}] ✗ 服务不可达 - ${errorMsg}`);
    
    if (consecutiveFailures >= MAX_FAILURES_BEFORE_ALERT) {
      await sendAlert("服务不可达", errorMsg, "error");
    }
  }
}

// 立即执行一次
checkHealth();

// 每15分钟执行一次
setInterval(checkHealth, HEARTBEAT_INTERVAL);

console.log(`心跳检测已启动，间隔: ${HEARTBEAT_INTERVAL / 1000 / 60}分钟`);
