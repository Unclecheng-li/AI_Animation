"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type MotionSectionProps = {
  children: ReactNode;
  className: string;
  id?: string;
  hero?: boolean;
};

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function MotionSection({ children, className, id, hero = false }: MotionSectionProps) {
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion
    ? { opacity: 1, y: 0, clipPath: "inset(0 0 0 0)" }
    : {
      opacity: 0,
        y: hero ? 0 : 18,
        clipPath: hero ? "inset(0 0 10% 0 round 0 0 36px 36px)" : "inset(0 0 0 0)",
      };

  return (
    <motion.section
      className={className}
      id={id}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0 0 round 0 0 0 0)" }}
      viewport={{ once: true, amount: hero ? 0.02 : 0.08, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduceMotion ? 0.2 : hero ? 0.9 : 0.56, ease: easeOutExpo }}
    >
      {children}
    </motion.section>
  );
}
