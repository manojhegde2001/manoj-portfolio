"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { COLORS, LETTER_COLORS, MOBILE_SKILL_COUNT, NAME, PERSON, PILL_COLORS, SKILLS } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PILL_ICON_GAP, PILL_ICON_SIZE, SKILL_ICONS } from "@/lib/skill-icons";
import { GRAVITY, type GravityPreset } from "@/lib/physics/constants";
import type { PhysicsApi, WorldConfig } from "@/lib/physics/world";
import { Controls } from "./Controls";

// Client-only, separate chunk: matter-js never reaches the server bundle.
const PhysicsHero = dynamic(() => import("./PhysicsHero"), { ssr: false });

const WORLD_CONFIG: WorldConfig = {
  name: NAME,
  skills: SKILLS,
  skillIcons: SKILL_ICONS,
  skillIconWidth: PILL_ICON_SIZE + PILL_ICON_GAP,
  mobileSkillCount: MOBILE_SKILL_COUNT,
  pillColors: PILL_COLORS,
  letterColors: LETTER_COLORS,
  inkColor: COLORS.ink,
  paperColor: COLORS.paper,
};

function hintFor(loose: number, total: number): ReactNode {
  if (loose === 0) return "↑ grab a letter. throw something.";
  if (loose < total)
    return (
      <>
        <b>
          {loose}/{total}
        </b>{" "}
        letters loose · keep going
      </>
    );
  return (
    <>
      all <b>{total}</b> loose. you broke my name → reset
    </>
  );
}

/** Interactive half of the hero: lazy physics layer + bottom bar (hint, controls). */
export function HeroInteractive() {
  const reduced = useReducedMotion();
  const apiRef = useRef<PhysicsApi | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState({ loose: 0, total: 0 });
  const [gravity, setGravity] = useState<GravityPreset["name"]>(GRAVITY[0].name);
  const [soundOn, setSoundOn] = useState(false);

  // Fetch the physics chunk once the main thread is free, so it never competes with first paint.
  useEffect(() => {
    if (reduced) return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 300);
    return () => clearTimeout(id);
  }, [reduced]);

  // The hero's CSS swaps the static fallback for the live layer via this attribute.
  useEffect(() => {
    const hero = barRef.current?.closest<HTMLElement>(".hero");
    if (!hero) return;
    if (ready) hero.dataset.physics = "on";
    else delete hero.dataset.physics;
  }, [ready]);

  const onCount = useCallback((loose: number, total: number) => setCount({ loose, total }), []);
  const onReady = useCallback((r: boolean) => {
    setReady(r);
    if (!r) {
      // A new world starts on Earth with sound off; keep the labels honest.
      setGravity(GRAVITY[0].name);
      setSoundOn(false);
    }
  }, []);
  const live = ready && !reduced;

  return (
    <>
      {idle && !reduced && (
        <PhysicsHero config={WORLD_CONFIG} apiRef={apiRef} onCount={onCount} onReady={onReady} />
      )}

      <div className="hero-bar" ref={barRef}>
        <p className="hero-tag font-mono text-[0.74rem] uppercase tracking-[0.04em] whitespace-nowrap">
          {PERSON.tagline}
        </p>
        <p
          className="physics-only hidden font-mono text-[0.76rem] uppercase tracking-[0.04em] min-[900px]:block"
          aria-hidden="true"
        >
          {hintFor(count.loose, count.total)}
        </p>
        {live && (
          <Controls
            gravity={gravity}
            soundOn={soundOn}
            onDrop={() => apiRef.current?.dropAll()}
            onShake={() => apiRef.current?.shake()}
            onGravity={() => {
              const next = apiRef.current?.cycleGravity();
              if (next) setGravity(next.name);
            }}
            onSound={() => {
              const next = !soundOn;
              apiRef.current?.setSound(next);
              setSoundOn(next);
            }}
            onReset={() => apiRef.current?.reset()}
          />
        )}
      </div>
    </>
  );
}
