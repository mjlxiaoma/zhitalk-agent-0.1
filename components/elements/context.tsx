"use client";

import type { ComponentProps } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import type { ApiUsageSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ContextProps = ComponentProps<"button"> & {
  apiUsage?: ApiUsageSummary;
};

const PERCENT_MAX = 100;

// Lucide CircleIcon geometry
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_RADIUS = 10;
const ICON_STROKE_WIDTH = 2;

type ContextIconProps = {
  percent: number; // 0 - 100
};

export const ContextIcon = ({ percent }: ContextIconProps) => {
  const radius = ICON_RADIUS;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / PERCENT_MAX);

  return (
    <svg
      aria-label={`${percent.toFixed(2)}% of api calls used`}
      height="28"
      role="img"
      style={{ color: "currentcolor" }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="28"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={radius}
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={radius}
        stroke="currentColor"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={ICON_STROKE_WIDTH}
        transform={`rotate(-90 ${ICON_CENTER} ${ICON_CENTER})`}
      />
    </svg>
  );
};

export const Context = ({ className, apiUsage, ...props }: ContextProps) => {
  const used = apiUsage?.used;
  const max = apiUsage?.maxApiCalls;
  const authLabel = apiUsage?.isAuthenticated ? "注册用户" : "游客";
  const hasMax = typeof max === "number" && Number.isFinite(max) && max > 0;
  const safeUsed = typeof used === "number" && Number.isFinite(used) ? used : 0;
  const usedPercent = hasMax ? Math.min(100, (safeUsed / max) * 100) : 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex select-none items-center gap-1 rounded-md text-sm",
            "cursor-pointer bg-background text-foreground",
            "outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          type="button"
          {...props}
        >
          <span className="hidden font-medium text-muted-foreground">
            {usedPercent.toFixed(1)}%
          </span>
          <ContextIcon percent={usedPercent} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit p-3" side="top">
        <div className="min-w-[240px] space-y-2">
          <div className="flex items-start justify-between text-sm">
            <span>{authLabel}</span>
            <span className="text-muted-foreground">
              {hasMax ? `${safeUsed} / ${max} 次` : `${safeUsed} 次`}
            </span>
          </div>
          <div className="space-y-2">
            <Progress className="h-2 bg-muted" value={usedPercent} />
          </div>
          <div className="pt-1 text-muted-foreground text-xs">每日调用次数</div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
