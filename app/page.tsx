import Link from "next/link";
import { ArrowRight, Sparkles, FileText, MessageSquare, Target, CheckCircle2, Zap, Users, TrendingUp } from "lucide-react";
import { GifShowcase } from "@/components/gif-showcase";

export const metadata = {
  title: "AI 智能面试官 - 简历优化、模拟面试、面试题解答",
  description: "专注编程领域的 AI 智能面试官，提供简历优化、模拟面试、面试题解答等功能，助你在求职路上更进一步",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50 bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="size-6 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-blue-500/30 transition-colors" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              AI 简历官
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              登录
            </Link>
            <Link
              href="/chat"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm font-medium overflow-hidden"
            >
              <span className="relative z-10">开始试用</span>
              <ArrowRight className="size-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 max-w-7xl">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium backdrop-blur-sm">
            <Zap className="size-4" />
            <span>AI 驱动的智能面试助手</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              AI 智能面试官
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-medium text-muted-foreground">
            专注编程领域，尤其前端开发
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            让 AI 帮你优化简历、模拟真实面试场景、解答面试难题
            <br />
            <span className="text-blue-600 dark:text-blue-400 font-medium">助你在求职路上更进一步</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/chat"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-blue-500/50 transition-all text-lg font-semibold overflow-hidden"
            >
              <span className="relative z-10">立即体验</span>
              <ArrowRight className="size-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <StatItem icon={<Users className="size-5" />} value="1000+" label="用户使用" />
            <StatItem icon={<MessageSquare className="size-5" />} label="AI 对话" value="24/7" />
            <StatItem icon={<TrendingUp className="size-5" />} value="95%" label="满意度" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              核心功能
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">全方位提升你的面试竞争力</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FileText className="size-8" />}
            title="简历优化"
            description="AI 深度分析你的简历，提供专业的优化建议，让你的简历在众多候选人中脱颖而出"
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<MessageSquare className="size-8" />}
            title="模拟面试"
            description="真实还原面试场景，提供针对性的面试问题，帮你提前适应面试节奏，增强自信"
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<Target className="size-8" />}
            title="面试题解答"
            description="覆盖前端开发各个领域的面试题库，详细解析每道题目，助你全面掌握知识点"
            gradient="from-orange-500 to-red-500"
          />
        </div>
      </section>

      {/* GIF Showcase Section */}
      <GifShowcase />

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                为什么选择我们？
              </span>
            </h2>
            <div className="space-y-5">
              <BenefitItem text="专注前端开发领域，问题更精准" />
              <BenefitItem text="基于真实面试场景，模拟更真实" />
              <BenefitItem text="AI 智能分析，建议更专业" />
              <BenefitItem text="24/7 随时可用，练习更自由" />
            </div>
          </div>
          
          <div className="relative">
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 p-12 flex items-center justify-center overflow-hidden">
              {/* 装饰性网格 */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              <div className="relative text-center space-y-6 z-10">
                <div className="relative inline-block">
                  <Sparkles className="size-24 text-blue-600 dark:text-blue-400" />
                  <div className="absolute inset-0 bg-blue-500/30 blur-2xl animate-pulse" />
                </div>
                <div>
                  <p className="text-2xl font-bold mb-2">AI 驱动</p>
                  <p className="text-muted-foreground text-lg">让每一次练习都更有价值</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 md:py-28 max-w-7xl">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-12 md:p-16 text-center overflow-hidden">
          {/* 装饰性元素 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              准备好开始了吗？
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              让 AI 智能面试官成为你求职路上的得力助手
            </p>
            <Link
              href="/chat"
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white text-purple-600 hover:bg-white/90 hover:shadow-2xl transition-all text-lg font-bold"
            >
              开始对话
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground max-w-7xl">
          <p>© 2024 AI 简历官 · 基于 Vercel AI Chatbot 构建</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:border-border transition-all hover:shadow-xl hover:-translate-y-1">
      <div className={`mb-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="flex-shrink-0 mt-1">
        <div className="relative">
          <CheckCircle2 className="size-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <p className="text-lg font-medium">{text}</p>
    </div>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center space-y-2">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2">
        {icon}
      </div>
      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
