"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Adds `.in` to its element the first time it scrolls into view. CSS decides what that animates
 * (see the timeline rules in globals.css). Content is only hidden before reveal under
 * `(scripting: enabled) and (prefers-reduced-motion: no-preference)`, so it's never lost.
 */
export function Reveal({ as: Tag = "div", className = "", children }: { as?: "div" | "li"; className?: string; children: ReactNode }) {
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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // @ts-expect-error -- ref type differs between li and div, both are HTMLElement
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
