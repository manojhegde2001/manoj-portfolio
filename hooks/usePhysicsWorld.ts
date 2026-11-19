"use client";

import { useEffect, useRef, type RefObject } from "react";
import { waitForFonts } from "@/lib/physics/measure";
import { createPhysicsWorld, type PhysicsApi, type PhysicsWorld, type WorldConfig } from "@/lib/physics/world";

export interface UsePhysicsWorldOptions {
  config: WorldConfig;
  /** Receives the control API once the world exists, and null after teardown. */
  apiRef: RefObject<PhysicsApi | null>;
  onCount?: (loose: number, total: number) => void;
  onReady?: (ready: boolean) => void;
}

const RESIZE_DEBOUNCE_MS = 250;

/**
 * Owns the physics world's lifecycle for a container element:
 * waits for fonts, builds the world, pauses it off-screen or in a hidden tab,
 * rebuilds on width changes, and tears everything down on unmount
 * (safe under React Strict Mode's mount → unmount → mount).
 */
export function usePhysicsWorld(layerRef: RefObject<HTMLDivElement | null>, options: UsePhysicsWorldOptions) {
  const latest = useRef(options);
  useEffect(() => {
    latest.current = options;
  });

  // Rebuild only when the content actually changes.
  const { name, skills } = options.config;
  const contentKey = `${name}|${skills.join("\u0000")}`;

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    let cancelled = false;
    let world: PhysicsWorld | null = null;
    let onScreen = true;
    let tabVisible = document.visibilityState === "visible";
    let lastWidth = window.innerWidth;
    let resizeTimer: number | undefined;

    const sync = () => {
      if (!world) return;
      if (onScreen && tabVisible) world.start();
      else world.stop();
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      sync();
    };

    // Only width changes rebuild; mobile URL-bar height changes must not.
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => world?.rebuild(), RESIZE_DEBOUNCE_MS);
    };

    waitForFonts(layer).then(() => {
      if (cancelled) return;
      world = createPhysicsWorld(layer, latest.current.config, {
        onCount: (loose, total) => latest.current.onCount?.(loose, total),
      });
      latest.current.apiRef.current = world;
      io.observe(layer);
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", onResize);
      sync();
      latest.current.onReady?.(true);
    });

    return () => {
      cancelled = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      if (world) {
        world.destroy();
        world = null;
        latest.current.apiRef.current = null;
        latest.current.onReady?.(false);
      }
    };
    // contentKey stands in for config.name / config.skills.
  }, [layerRef, contentKey]);
}
