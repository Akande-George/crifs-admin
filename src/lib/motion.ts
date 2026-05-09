import { type Variants } from "motion/react";

/* ─── Shared Motion Variants ─── */

/** Cards, table rows — subtle lift on hover */
export const hoverLift: Variants = {
  initial: { y: 0 },
  hover: {
    y: -2,
    transition: { duration: 0.12, ease: [0.25, 1, 0.5, 1] },
  },
};

/** Buttons, list items — press scale */
export const press: Variants = {
  initial: { scale: 1 },
  tap: {
    scale: 0.97,
    transition: { duration: 0.08, ease: "easeIn" },
  },
};

/** Modals, confirmations */
export const dialogEntry: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

/** Right-side review panels */
export const sheetEntry: Variants = {
  hidden: { x: "100%", opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: [0.25, 1, 0.5, 1] },
  },
  exit: {
    x: "100%",
    opacity: 0.8,
    transition: { duration: 0.24, ease: "easeIn" },
  },
};

/** Tab content transitions */
export const tabContent: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.16, ease: [0.25, 1, 0.5, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.1 },
  },
};

/** Fade in on mount */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

/** Skeleton → content transition */
export const skeletonToContent: Variants = {
  skeleton: { opacity: 1 },
  content: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

/** Staggered children container */
export const stagger = (staggerMs = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerMs,
    },
  },
});

/** Individual stagger child */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
  },
};

/** Sidebar collapse animation */
export const sidebarCollapse = {
  expanded: { width: 240 },
  collapsed: { width: 64 },
  transition: { duration: 0.24, ease: [0.25, 1, 0.5, 1] },
};

/** Status badge pulse */
export const statusPulse: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.08, 1],
    transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
  },
};

/** Pipeline dot fill stagger */
export const pipelineDot: Variants = {
  empty: { scale: 0.8, opacity: 0.3 },
  filled: {
    scale: [0.8, 1.1, 1],
    opacity: 1,
    transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
  },
};
