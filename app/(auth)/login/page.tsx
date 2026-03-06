"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { type LoginActionState, login } from "../actions";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: router and updateSession are stable refs
  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "邮箱或密码错误，请检查后重试！",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "请输入有效的邮箱和密码（密码至少6位）！",
      });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      
      // 延迟跳转到聊天页面
      setTimeout(() => {
        router.push("/chat");
      }, 500);
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
      {/* 背景装饰 - 多层渐变球 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-300/10 to-purple-300/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* 装饰性网格 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Logo 和返回首页 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6 hover:scale-105 transition-transform">
            <span className="text-3xl">✨</span>
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              AI 简历官
            </span>
          </Link>
        </div>

        {/* 登录卡片 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5">
          <div className="flex flex-col items-center justify-center gap-3 mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2 shadow-lg">
              <span className="text-3xl">👋</span>
            </div>
            <h3 className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              欢迎回来
            </h3>
            <p className="text-muted-foreground">
              使用邮箱和密码登录你的账户
            </p>
          </div>

          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>登录</SubmitButton>
            <p className="mt-6 text-center text-muted-foreground text-sm">
              还没有账户？{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer bg-transparent border-none"
              >
                免费注册
              </button>
            </p>
          </AuthForm>
        </div>

        {/* 底部装饰文字 */}
        <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          专注编程领域的 AI 智能面试官
        </p>
      </div>
    </div>
  );
}
