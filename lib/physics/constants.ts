/** Collision categories (bit flags). */
export const CAT = {
  WALL: 0x0001,
  PILL: 0x0002,
  LOOSE: 0x0004,
  FROZEN: 0x0008,
} as const;

/** Frozen letters ignore pills, so pills fall *through* the word. */
export const MASK = {
  FROZEN: CAT.WALL | CAT.LOOSE,
  PILL: CAT.WALL | CAT.PILL | CAT.LOOSE,
  LOOSE: 0xffff,
} as const;

export interface GravityPreset {
  name: "Earth" | "Moon" | "Zero-G";
  y: number;
}
export const GRAVITY: readonly GravityPreset[] = [
  { name: "Earth", y: 1 },
  { name: "Moon", y: 0.22 },
  { name: "Zero-G", y: 0 },
];

/** Fixed timestep: Matter warns above 16.667ms and gets unstable with variable deltas. */
export const STEP_MS = 1000 / 60;
export const MAX_STEPS_PER_FRAME = 3;
/** Clamp for a single frame gap (tab switch, long task). */
export const MAX_FRAME_GAP_MS = 100;

/** Layout. */
export const BAR_HEIGHT = 64;
export const TOP_GUTTER = 70;
export const PILL_HEIGHT = 48;
export const PILL_PADDING_X = 46; // total horizontal padding + borders
export const MOBILE_BREAKPOINT = 640;

/** Interaction. */
export const DRAG = { stiffness: 0.16, damping: 0.14 } as const;
export const WIND = { radius: 120, strength: 0.0042 } as const;
export const AUTO_DROP_MS = 2800;

/** Sound. */
export const SOUND = { minIntervalMs: 35, minSpeed: 2.5 } as const;

/** Letter physics. */
export const LETTER_BODY = { density: 0.004, friction: 0.5, frictionAir: 0.012, restitution: 0.32 } as const;
export const PILL_BODY = { density: 0.0016, friction: 0.3, frictionAir: 0.01, restitution: 0.5 } as const;
export const WALL_BODY = { isStatic: true, friction: 0.6, restitution: 0.2 } as const;
