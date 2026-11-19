"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { PILL_COLORS, SKILLS } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { StackUpdate } from "./StackGame";

// Separate chunk, fetched only when the visitor presses Play.
const StackGame = dynamic(() => import("./StackGame"), {
  ssr: false,
  loading: () => <p className="grid size-full place-items-center font-mono text-sm">Loading…</p>,
});

const BEST_KEY = "stack-best";

function readBest(): number {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(n: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(n));
  } catch {
    // Storage blocked (private mode etc.): best score just isn't remembered.
  }
}

const btn =
  "inline-flex items-center gap-2 border-2 border-ink bg-lime px-5 py-2.5 font-mono text-[0.8rem] uppercase tracking-[0.04em] shadow-[0_4px_0_var(--color-ink)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:translate-y-0.5 active:shadow-none";

const stat = "font-mono text-[0.7rem] uppercase tracking-[0.05em] text-muted";

export function PlaySection() {
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [status, setStatus] = useState<StackUpdate["status"]>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");

  const bestRef = useRef(0);

  const start = () => {
    bestRef.current = Math.max(bestRef.current, readBest());
    setBest(bestRef.current);
    setStatus("ready");
    setScore(0);
    setFlash(null);
    setAnnounce("");
    setGameKey((k) => k + 1);
    setStarted(true);
  };

  const onUpdate = useCallback((u: StackUpdate) => {
    setStatus(u.status);
    setScore(u.score);
    setFlash(u.result === "perfect" ? "Perfect!" : null);
    if (u.status === "ready") setAnnounce("");
    if (u.status === "over") {
      const isBest = u.score > bestRef.current;
      if (isBest) {
        bestRef.current = u.score;
        setBest(u.score);
        saveBest(u.score);
      }
      setAnnounce(
        `Game over. You stacked ${u.score} ${u.score === 1 ? "block" : "blocks"}.${isBest ? " New best!" : ""}`,
      );
    }
  }, []);

  return (
    <div className="grid items-start gap-10 md:grid-cols-[1fr_auto]">
      <div>
        <p className="text-[clamp(1.1rem,1.8vw,1.35rem)] leading-relaxed">
          Drop skill blocks onto the stack. Anything hanging over the edge gets sliced off, so line them up. Land{" "}
          <b>three perfect drops</b> in a row and your block grows back.
        </p>
        <p className="mt-3 font-mono text-[0.8rem] uppercase tracking-[0.04em] text-muted">
          Tap, click, or press Space to drop
        </p>

        <dl className="mt-8 flex gap-10">
          <div>
            <dt className={stat}>Score</dt>
            <dd className="text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-extrabold tabular-nums">{score}</dd>
          </div>
          <div>
            <dt className={stat}>Best</dt>
            <dd className="text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-extrabold tabular-nums">{best}</dd>
          </div>
        </dl>

        <button type="button" className={`${btn} mt-8`} onClick={start}>
          {started ? "↻ Restart" : "▶ Play"}
        </button>

        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>

      <div className="relative aspect-[4/5] w-full border-2 border-ink bg-paper shadow-[7px_7px_0_var(--color-ink)] md:w-[clamp(320px,36vw,520px)]">
        {started ? (
          <>
            <StackGame key={gameKey} labels={SKILLS} colors={PILL_COLORS} reduced={reduced} onUpdate={onUpdate} />
            {/* On phones the scoreboard sits above the board, so mirror the score inside it. */}
            <p className="pointer-events-none absolute top-3 left-3 font-mono text-[0.72rem] tracking-[0.04em] uppercase md:hidden" aria-hidden="true">
              Score <b className="text-base tabular-nums">{score}</b> · Best <b className="tabular-nums">{best}</b>
            </p>
            <div className="pointer-events-none absolute inset-x-0 top-12 flex justify-center md:top-4">
              {status === "ready" && (
                <span className="border-2 border-ink bg-white px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.04em]">
                  Tap to drop
                </span>
              )}
              {status === "playing" && flash && (
                <span key={score} className="border-2 border-ink bg-lime px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.04em]">
                  {flash}
                </span>
              )}
              {status === "over" && (
                <span className="border-2 border-ink bg-coral px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.04em]">
                  Game over · {score} · tap to retry
                </span>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={start}
            className="group grid size-full place-items-center"
            aria-label="Play Stack the Stack"
          >
            <span className="flex flex-col items-center gap-2" aria-hidden="true">
              {SKILLS.slice(0, 4).map((s, i) => (
                <span
                  key={s}
                  className="border-2 border-ink px-4 py-1.5 font-mono text-[0.75rem] font-semibold"
                  style={{ background: PILL_COLORS[i % PILL_COLORS.length], marginLeft: (i % 2 ? 1 : -1) * 18 }}
                >
                  {s}
                </span>
              ))}
              <span className={`${btn} mt-6 group-hover:-translate-y-0.5`}>▶ Play</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
