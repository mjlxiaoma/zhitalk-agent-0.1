import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Vercel Cron Job 配置
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SERVICE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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

// 发送邮件通知
async function sendEmailNotification(subject: string, message: string) {
  if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
    console.warn("邮件未配置");
    return;
  }

  try {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);
    await transporter.sendMail({
      from: `"服务监控" <${EMAIL_CONFIG.auth.user}>`,
      to: EMAIL_TO,
      subject: `【服务告警】${subject}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #e74c3c;">🚨 服务告警</h2>
            <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0;">
              <strong>${subject}</strong>
            </div>
            <pre style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">${message}</pre>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              时间: ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}
            </p>
          </div>
        </div>
      `,
    });
    console.log(`✓ 邮件通知已发送`);
  } catch (error) {
    console.error("邮件发送失败:", error);
  }
}

export async function GET(request: Request) {
  // 验证 Cron Secret（防止被恶意调用）
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 开始心跳检测...`);

  try {
    const response = await fetch(`${SERVICE_URL}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[${timestamp}] ✓ 服务正常`);
      
      return NextResponse.json({
        status: "success",
        message: "服务正常",
        data,
      });
    } else {
      const errorMsg = `服务异常\n服务地址: ${SERVICE_URL}\nHTTP 状态码: ${response.status}`;
      console.error(`[${timestamp}] ✗ ${errorMsg}`);
      
      await sendEmailNotification("服务异常", errorMsg);
      
      return NextResponse.json(
        { status: "error", message: errorMsg },
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMsg = `服务不可达\n服务地址: ${SERVICE_URL}\n错误: ${error instanceof Error ? error.message : "未知错误"}`;
    console.error(`[${timestamp}] ✗ ${errorMsg}`);
    
    await sendEmailNotification("服务不可达", errorMsg);
    
    return NextResponse.json(
      { status: "error", message: errorMsg },
      { status: 500 }
    );
  }
}
