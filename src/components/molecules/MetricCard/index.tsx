"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { StatCounter } from "@/components/atoms/StatCounter";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MetricCardProps {
  title: string;
  value: number;
  formatter?: (value: number) => string;
  trend?: {
    value: number;
    label: string;
  };
  icon: React.ElementType;
  iconColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  formatter,
  trend,
  icon: Icon,
  iconColor = "bg-brand-50 text-brand-500",
  className,
}: MetricCardProps) {
  const prefersReduced = useReducedMotion();

  const trendDirection = trend
    ? trend.value > 0
      ? "up"
      : trend.value < 0
        ? "down"
        : "neutral"
    : null;

  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
        ? TrendingDown
        : Minus;

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border border-neutral-200 bg-surface p-5 transition-shadow",
        className
      )}
      whileHover={prefersReduced ? {} : { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.12, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <StatCounter
            value={value}
            formatter={formatter}
            className="text-2xl font-semibold text-neutral-900 tracking-tight"
          />
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              trendDirection === "up" && "text-success-600",
              trendDirection === "down" && "text-danger-600",
              trendDirection === "neutral" && "text-neutral-500"
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-neutral-400">{trend.label}</span>
        </div>
      )}

      {/* Decorative gradient */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-brand-50 to-transparent opacity-60" />
    </motion.div>
  );
}
