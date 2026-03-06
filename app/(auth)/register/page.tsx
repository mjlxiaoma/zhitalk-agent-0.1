"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { type RegisterActionState, register } from "../actions";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: router is stable ref
  useEffect(() => {
    if (state.status === "user_exists") {
      toast({ type: "error", description: "该邮箱已被注册，请直接登录或使用其他邮箱！" });
    } else if (state.status === "failed") {
      toast({ type: "error", description: "注册失败，请稍后重试！" });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "请输入有效的邮箱和密码（密码至少6位）！",
      });
    } else if (state.status === "success") {
      console.log("Registration successful, email:", email, "password length:", password?.length);
      toast({ type: "success", description: "注册成功！正在为您登录..." });
      setIsSuccessful(true);
      
      // 在客户端登录
      const doSignIn = async () => {
        try {
          console.log("Attempting to sign in...");
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          console.log("Sign in result:", result);

          if (result?.error) {
            console.error("Sign in error:", result.error);
            toast({ type: "error", description: "自动登录失败，请手动登录！" });
            // 即使登录失败，也跳转到登录页
            router.push("/login");
          } else {
            console.log("Sign in successful, redirecting to chat...");
            // 登录成功，跳转到聊天页面
            router.push("/chat");
          }
        } catch (error) {
          console.error("Sign in exception:", error);
          toast({ type: "error", description: "自动登录失败，请手动登录！" });
          router.push("/login");
        }
      };
      
      doSignIn();
    }
  }, [state.status, router, email, password]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    setPassword(formData.get("password") as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
      {/* 背景装饰 - 多层渐变球 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-300/10 to-pink-300/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* 装饰性网格 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Logo 和返回首页 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6 hover:scale-105 transition-transform">
            <span className="text-3xl">✨</span>
            <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
              AI 简历官
            </span>
          </Link>
        </div>

        {/* 注册卡片 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/5">
          <div className="flex flex-col items-center justify-center gap-3 mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-2 shadow-lg">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="font-bold text-3xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              创建账户
            </h3>
            <p className="text-muted-foreground">
              使用邮箱和密码创建你的账户
            </p>
          </div>

          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>注册</SubmitButton>
            <p className="mt-6 text-center text-muted-foreground text-sm">
              已有账户？{" "}
              <a
                href="/login"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:underline hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                立即登录
              </a>
            </p>
          </AuthForm>
        </div>

        {/* 底部装饰文字 */}
        <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          开启你的 AI 面试之旅
        </p>
      </div>
    </div>
  );
}
