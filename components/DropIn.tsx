"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface DropInProps {
  index: number;
  className?: string;
  children: ReactNode;
}

/**
 * Adds `.in` when the card scrolls into view, which starts the CSS bounce.
 * Hiding before reveal only happens under `@media (scripting: enabled)`, so cards
 * are always visible without JS, and reduced motion skips the animation entirely.
 */
export function DropIn({ index, className = "", children }: DropInProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className={`drop ${className}`} style={{ "--i": index } as CSSProperties}>
      {children}
    </article>
  );
}
