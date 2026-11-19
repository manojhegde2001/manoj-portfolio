/**
 * "Stack the Stack": pure game logic, no DOM. World units, y grows upward from the ground.
 * The renderer maps WORLD_W × WORLD_H onto whatever canvas size it has.
 */

export const WORLD_W = 400;
export const WORLD_H = 500;
export const BLOCK_H = 30;
export const START_W = 220;
/** Within this many units of the block below counts as a perfect drop. */
export const PERFECT_TOLERANCE = 5;
/** Every Nth perfect drop in a row grows the block back by GROW units. */
const COMBO_GROW_EVERY = 3;
const GROW = 12;
const GRAVITY = 1500;
/** The camera starts this far below the ground, so the floor is visible. */
const FLOOR = 48;

export type Status = "ready" | "playing" | "over";
export type DropResult = "perfect" | "cut" | "miss";

export interface Block {
  x: number;
  w: number;
  level: number;
  label: string;
  color: string;
}

export interface Debris extends Block {
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
}

export interface GameState {
  status: Status;
  stack: Block[];
  moving: Block;
  dir: 1 | -1;
  debris: Debris[];
  /** Blocks placed on top of the base. */
  score: number;
  combo: number;
  /** World y at the bottom of the view. */
  camY: number;
  labels: readonly string[];
  colors: readonly string[];
  inkColor: string;
}

export function createGame(labels: readonly string[], colors: readonly string[], inkColor: string): GameState {
  const base: Block = { x: (WORLD_W - START_W) / 2, w: START_W, level: 0, label: "npm init", color: inkColor };
  const state: GameState = {
    status: "ready",
    stack: [base],
    moving: base,
    dir: 1,
    debris: [],
    score: 0,
    combo: 0,
    camY: -FLOOR,
    labels,
    colors,
    inkColor,
  };
  spawn(state);
  return state;
}

/** Horizontal speed in world units per second; ramps up with height. */
export function speedFor(level: number, reduced: boolean): number {
  const v = Math.min(150 + level * 8, 400);
  return reduced ? v * 0.7 : v;
}

function bounds(w: number) {
  return { min: -w * 0.3, max: WORLD_W - w * 0.7 };
}

function spawn(state: GameState) {
  const top = state.stack[state.stack.length - 1];
  const level = top.level + 1;
  const i = level - 1;
  state.dir = level % 2 === 1 ? 1 : -1;
  const { min, max } = bounds(top.w);
  state.moving = {
    x: state.dir === 1 ? min : max,
    w: top.w,
    level,
    label: state.labels[i % state.labels.length] ?? "",
    color: state.colors[i % state.colors.length] ?? state.inkColor,
  };
}

function addDebris(state: GameState, b: Block, side: -1 | 1) {
  state.debris.push({
    ...b,
    y: b.level * BLOCK_H,
    vx: side * (40 + Math.random() * 40),
    vy: 60,
    rot: 0,
    vr: side * (1.5 + Math.random() * 2),
  });
}

/** Drop the moving block. Starts the game on the first call. */
export function drop(state: GameState): DropResult | null {
  if (state.status === "over") return null;
  state.status = "playing";

  const top = state.stack[state.stack.length - 1];
  const m = state.moving;
  const left = Math.max(m.x, top.x);
  const right = Math.min(m.x + m.w, top.x + top.w);
  const overlap = right - left;

  if (overlap <= 0) {
    addDebris(state, m, m.x < top.x ? -1 : 1);
    state.status = "over";
    state.combo = 0;
    return "miss";
  }

  let result: DropResult;
  let placed: Block;
  if (Math.abs(m.x - top.x) <= PERFECT_TOLERANCE) {
    state.combo += 1;
    let w = top.w;
    let x = top.x;
    if (state.combo % COMBO_GROW_EVERY === 0 && w < START_W) {
      const grown = Math.min(START_W, w + GROW);
      x -= (grown - w) / 2;
      w = grown;
    }
    placed = { ...m, x, w };
    result = "perfect";
  } else {
    state.combo = 0;
    placed = { ...m, x: left, w: overlap };
    // The part that hangs over the edge falls off.
    const cutX = m.x < top.x ? m.x : right;
    addDebris(state, { ...m, x: cutX, w: m.w - overlap }, m.x < top.x ? -1 : 1);
    result = "cut";
  }

  state.stack.push(placed);
  state.score = state.stack.length - 1;
  spawn(state);
  return result;
}

/** Advance the simulation by dt seconds. */
export function step(state: GameState, dt: number, reduced: boolean) {
  if (state.status !== "over") {
    const m = state.moving;
    const { min, max } = bounds(m.w);
    m.x += state.dir * speedFor(m.level, reduced) * dt;
    if (m.x > max) {
      m.x = max;
      state.dir = -1;
    } else if (m.x < min) {
      m.x = min;
      state.dir = 1;
    }
  }

  for (const d of state.debris) {
    d.vy -= GRAVITY * dt;
    d.y += d.vy * dt;
    d.x += d.vx * dt;
    if (!reduced) d.rot += d.vr * dt;
  }
  state.debris = state.debris.filter((d) => d.y > state.camY - BLOCK_H * 6);

  // Keep the moving block around 60% up the view.
  const target = Math.max(-FLOOR, (state.moving.level + 1) * BLOCK_H - WORLD_H * 0.6);
  state.camY = reduced ? target : state.camY + (target - state.camY) * Math.min(1, dt * 6);
}
