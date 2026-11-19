"use client";

import { useEffect, useRef } from "react";
import { COLORS } from "@/config/site";
import {
  BLOCK_H,
  WORLD_H,
  WORLD_W,
  createGame,
  drop,
  step,
  type Block,
  type DropResult,
  type GameState,
  type Status,
} from "@/lib/game/stack";

export interface StackUpdate {
  status: Status;
  score: number;
  result: DropResult | null;
}

interface Props {
  labels: readonly string[];
  colors: readonly string[];
  reduced: boolean;
  onUpdate: (u: StackUpdate) => void;
}

/** Canvas renderer + input for the stack game. Loaded only after the visitor presses Play. */
export default function StackGame({ labels, colors, reduced, onUpdate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const onUpdateRef = useRef(onUpdate);
  const reducedRef = useRef(reduced);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
    reducedRef.current = reduced;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    stateRef.current = createGame(labels, colors, COLORS.ink);
    const font = getComputedStyle(canvas).fontFamily;
    let scale = 1;
    let dpr = 1;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      scale = width / WORLD_W;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Only run while the game is on screen.
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    const drawBlock = (b: Block, y: number, camY: number, rot = 0) => {
      const s = scale * dpr;
      const px = b.x * s;
      const py = (WORLD_H - (y - camY) - BLOCK_H) * s;
      const w = b.w * s;
      const h = BLOCK_H * s;
      ctx.save();
      ctx.translate(px + w / 2, py + h / 2);
      ctx.rotate(rot);
      ctx.fillStyle = b.color;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.lineWidth = 2 * dpr;
      ctx.strokeStyle = COLORS.ink;
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      if (b.label) {
        ctx.font = `700 ${Math.max(10, 13 * scale) * dpr}px ${font}`;
        if (ctx.measureText(b.label).width + 12 * dpr < w) {
          ctx.fillStyle = b.color === COLORS.ink ? COLORS.paper : COLORS.ink;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(b.label, 0, 1 * dpr);
        }
      }
      ctx.restore();
    };

    const draw = (g: GameState) => {
      ctx.fillStyle = COLORS.paper;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground line under the base block.
      const groundY = (WORLD_H + g.camY) * scale * dpr;
      if (groundY < canvas.height) {
        ctx.fillStyle = "#e2dbca";
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
        ctx.fillStyle = COLORS.ink;
        ctx.fillRect(0, groundY, canvas.width, 3 * dpr);
      }

      // Skip blocks far below the view.
      for (const b of g.stack) {
        if ((b.level + 1) * BLOCK_H >= g.camY) drawBlock(b, b.level * BLOCK_H, g.camY);
      }
      if (g.status !== "over") drawBlock(g.moving, g.moving.level * BLOCK_H, g.camY);
      for (const d of g.debris) drawBlock(d, d.y, g.camY, d.rot);
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const g = stateRef.current;
      if (g && visible) {
        step(g, dt, reducedRef.current);
        draw(g);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [labels, colors]);

  const act = () => {
    const g = stateRef.current;
    if (!g) return;
    if (g.status === "over") {
      stateRef.current = createGame(labels, colors, COLORS.ink);
      onUpdateRef.current({ status: "ready", score: 0, result: null });
      return;
    }
    const result = drop(g);
    onUpdateRef.current({ status: g.status, score: g.score, result });
  };

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      aria-label="Stack game. Press Space or Enter, or tap, to drop a block."
      className="block size-full cursor-pointer touch-manipulation font-mono outline-none"
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.focus();
        act();
      }}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (!e.repeat) act();
        }
      }}
    />
  );
}
