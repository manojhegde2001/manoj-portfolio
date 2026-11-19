import Matter from "matter-js";
import { CAT, LETTER_BODY, MASK, PILL_BODY, WALL_BODY } from "./constants";

const { Bodies, Body } = Matter;

/**
 * A letter starts frozen in the word.
 * It is created dynamic and *then* made static, so Matter saves its mass/inertia
 * in `_original` and can restore them on wake. Creating it with `isStatic: true`
 * leaves mass = Infinity on wake, which produces NaN positions.
 */
export function createLetterBody(x: number, y: number, w: number, h: number): Matter.Body {
  const body = Bodies.rectangle(x, y, w, h, {
    label: "letter",
    ...LETTER_BODY,
    chamfer: { radius: Math.min(10, w / 4) },
    collisionFilter: { category: CAT.FROZEN, mask: MASK.FROZEN, group: 0 },
  });
  Body.setStatic(body, true);
  return body;
}

export function createPillBody(x: number, y: number, w: number, h: number, angle: number): Matter.Body {
  return Bodies.rectangle(x, y, w, h, {
    label: "pill",
    angle,
    ...PILL_BODY,
    chamfer: { radius: h / 2 },
    collisionFilter: { category: CAT.PILL, mask: MASK.PILL, group: 0 },
  });
}

const wall = (x: number, y: number, w: number, h: number) =>
  Bodies.rectangle(x, y, w, h, {
    label: "wall",
    ...WALL_BODY,
    collisionFilter: { category: CAT.WALL, mask: 0xffff, group: 0 },
  });

/** Floor sits on top of the bottom bar; side walls are tall so thrown things can't escape. */
export function createWalls(width: number, height: number, floorY: number): Matter.Body[] {
  return [
    wall(width / 2, floorY + 100, width + 600, 200),
    wall(-100, -height, 200, height * 5),
    wall(width + 100, -height, 200, height * 5),
  ];
}

/** Ceiling, added once everything has fallen in so nothing floats away in zero-g. */
export function createLid(width: number): Matter.Body {
  return wall(width / 2, -100, width + 600, 200);
}

/** Wake a frozen body: restore mass, switch it to the LOOSE category. Returns true if it was frozen. */
export function wakeBody(body: Matter.Body, spin = 0): boolean {
  const wasFrozen = body.isStatic;
  if (wasFrozen) {
    Body.setStatic(body, false);
    body.collisionFilter.category = CAT.LOOSE;
    body.collisionFilter.mask = MASK.LOOSE;
  }
  if (spin) Body.setAngularVelocity(body, spin * (Math.random() < 0.5 ? -1 : 1));
  return wasFrozen;
}
