"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StatCounterProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
}

/**
 * Animated counter that counts up to the target value on mount.
 * Falls back to instant display with prefers-reduced-motion.
 */
export function StatCounter({
  value,
  duration = 0.6,
  formatter = (v) => Math.round(v).toLocaleString("en-NG"),
  className,
}: StatCounterProps) {
  const prefersReduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => formatter(v));

  useEffect(() => {
    if (prefersReduced) {
      motionValue.set(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.25, 1, 0.5, 1],
    });

    return () => controls.stop();
  }, [value, duration, prefersReduced, motionValue]);

  return <motion.span className={className}>{display}</motion.span>;
}
