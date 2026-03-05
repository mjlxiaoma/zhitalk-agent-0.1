"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FileText, MessageSquare, Target } from "lucide-react";

// 配置你的 GIF 图片信息
const gifItems = [
  {
    id: 1,
    title: "简历优化演示",
    description: "AI 分析简历并提供优化建议",
    src: "/gifs/resume-optimization.gif", // 替换为你的 GIF 路径
    alt: "简历优化功能演示",
    icon: FileText,
  },
  {
    id: 2,
    title: "模拟面试场景",
    description: "真实还原面试对话流程",
    src: "/gifs/mock-interview.gif", // 替换为你的 GIF 路径
    alt: "模拟面试功能演示",
    icon: MessageSquare,
  },
  {
    id: 3,
    title: "面试题解答",
    description: "详细解析前端面试题",
    src: "/gifs/question-answer.gif", // 替换为你的 GIF 路径
    alt: "面试题解答功能演示",
    icon: Target,
  },
];

export function GifShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? gifItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === gifItems.length - 1 ? 0 : prev + 1));
  };

  const currentItem = gifItems[currentIndex];

  return (
    <section className="container mx-auto px-4 py-16 max-w-7xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        功能演示
      </h2>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {gifItems.map((item) => (
          <GifCard key={item.id} item={item} />
        ))}
      </div>

      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <div className="relative">
          <GifCard item={currentItem} />

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-background transition-colors"
            aria-label="上一个"
            type="button"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-background transition-colors"
            aria-label="下一个"
            type="button"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {gifItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`跳转到第 ${index + 1} 个`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GifCard({ item }: { item: (typeof gifItems)[0] }) {
  const [imageError, setImageError] = useState(false);
  const Icon = item.icon;

  return (
    <div className="group relative rounded-xl border border-border/50 bg-card overflow-hidden hover:border-border transition-all hover:shadow-lg">
      <div className="aspect-video relative bg-muted overflow-hidden">
        {!imageError ? (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover"
            unoptimized // GIF 需要 unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          // 占位符：当 GIF 不存在时显示
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="text-center space-y-3">
              <Icon className="size-16 mx-auto text-primary/40" />
              <p className="text-sm text-muted-foreground px-4">
                GIF 演示图片
                <br />
                <span className="text-xs">请添加到 public/gifs/</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
        <p className="text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
}
