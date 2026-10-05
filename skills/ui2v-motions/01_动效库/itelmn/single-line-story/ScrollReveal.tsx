"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealDirection = "up" | "left" | "right";

type RevealProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
};

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

function useRevealMotion(delay: number, direction: RevealDirection, headline = false) {
  const reduceMotion = useReducedMotion();
  const hiddenTransform = direction === "left"
    ? "translate3d(-34px, 0, 0)"
    : direction === "right"
      ? "translate3d(34px, 0, 0)"
      : `translate3d(0, ${headline ? 46 : 32}px, 0)`;

  return {
    initial: reduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          transform: `${hiddenTransform} scale(0.985)`,
          clipPath: headline ? "inset(0 -8% 16% -8%)" : "none",
        },
    whileInView: {
      opacity: 1,
      transform: "translate3d(0, 0, 0) scale(1)",
      clipPath: headline ? "inset(-12% -8% -12% -8%)" : "none",
    },
    viewport: { once: true, amount: headline ? 0.42 : 0.16, margin: "0px 0px -7% 0px" },
    transition: {
      delay: reduceMotion ? 0 : delay,
      duration: reduceMotion ? 0.2 : headline ? 0.82 : 0.68,
      ease: easeOutExpo,
    },
  };
}

export function Reveal({ ariaLabel, children, className, delay = 0, direction = "up" }: RevealProps) {
  return <motion.div aria-label={ariaLabel} className={className} {...useRevealMotion(delay, direction)}>{children}</motion.div>;
}

export function RevealArticle({ children, className, delay = 0, direction = "up" }: RevealProps) {
  return <motion.article className={className} {...useRevealMotion(delay, direction)}>{children}</motion.article>;
}

export function RevealFigure({ children, className, delay = 0, direction = "up" }: RevealProps) {
  return <motion.figure className={className} {...useRevealMotion(delay, direction)}>{children}</motion.figure>;
}

export function RevealHeading({
  as = "h2",
  children,
  className,
  delay = 0,
}: Omit<RevealProps, "direction"> & { as?: "h1" | "h2" }) {
  const revealMotion = useRevealMotion(delay, "up", true);

  return as === "h1"
    ? <motion.h1 className={className} {...revealMotion}>{children}</motion.h1>
    : <motion.h2 className={className} {...revealMotion}>{children}</motion.h2>;
}
