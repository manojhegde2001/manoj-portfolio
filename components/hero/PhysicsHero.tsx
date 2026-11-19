"use client";

import { useRef, type RefObject } from "react";
import { usePhysicsWorld } from "@/hooks/usePhysicsWorld";
import type { PhysicsApi, WorldConfig } from "@/lib/physics/world";

export interface PhysicsHeroProps {
  config: WorldConfig;
  apiRef: RefObject<PhysicsApi | null>;
  onCount: (loose: number, total: number) => void;
  onReady: (ready: boolean) => void;
}

/** The physics layer. Loaded with next/dynamic (ssr: false), so matter-js is its own client chunk. */
export default function PhysicsHero({ config, apiRef, onCount, onReady }: PhysicsHeroProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  usePhysicsWorld(layerRef, { config, apiRef, onCount, onReady });
  return <div ref={layerRef} className="things" aria-hidden="true" />;
}
