"use client";

import { useEffect, useState } from "react";

/** Copies the email to the clipboard and confirms for a moment. */
export function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const id = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(id);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <button type="button" onClick={copy} className={className}>
      {state === "copied" ? "✓ Copied" : state === "failed" ? "Copy failed" : "Copy email"}
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Email copied to clipboard" : state === "failed" ? "Could not copy the email" : ""}
      </span>
    </button>
  );
}
