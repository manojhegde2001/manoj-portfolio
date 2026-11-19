import Matter from "matter-js";
import { createLetterBody, createLid, createPillBody, createWalls, wakeBody } from "./bodies";

const SVG_NS = "http://www.w3.org/2000/svg";
import {
  AUTO_DROP_MS,
  BAR_HEIGHT,
  DRAG,
  GRAVITY,
  MAX_FRAME_GAP_MS,
  MAX_STEPS_PER_FRAME,
  MOBILE_BREAKPOINT,
  PILL_HEIGHT,
  PILL_PADDING_X,
  SOUND,
  STEP_MS,
  TOP_GUTTER,
  WIND,
  type GravityPreset,
} from "./constants";
import { createMeasurer, type Measurer } from "./measure";
import { Blipper } from "./sound";

const { Engine, Composite, Body, Constraint, Events } = Matter;

export interface WorldConfig {
  name: string;
  skills: readonly string[];
  /** Optional 24×24 SVG path per skill, drawn before the label. */
  skillIcons?: Readonly<Record<string, string>>;
  /** Width the icon adds to a pill (icon + gap), in px. */
  skillIconWidth?: number;
  mobileSkillCount: number;
  pillColors: readonly string[];
  letterColors: readonly string[];
  inkColor: string;
  paperColor: string;
}

export interface WorldCallbacks {
  /** Fired whenever the number of loose letters changes (and on every rebuild). */
  onCount(loose: number, total: number): void;
}

/** What the UI can do to the world. */
export interface PhysicsApi {
  dropAll(): void;
  shake(): void;
  cycleGravity(): GravityPreset;
  setSound(on: boolean): void;
  reset(): void;
}

export interface PhysicsWorld extends PhysicsApi {
  start(): void;
  stop(): void;
  rebuild(): void;
  destroy(): void;
}

type Kind = "letter" | "pill";

interface Thing {
  el: HTMLDivElement;
  body: Matter.Body;
  w: number;
  h: number;
  kind: Kind;
}

interface Drag {
  thing: Thing;
  constraint: Matter.Constraint;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Imperative physics world bound to one container element.
 * DOM elements are synced to bodies with `transform` only.
 */
export function createPhysicsWorld(
  layer: HTMLDivElement,
  config: WorldConfig,
  callbacks: WorldCallbacks,
): PhysicsWorld {
  const host = layer.parentElement ?? layer;
  const measurer: Measurer = createMeasurer(host);
  const sound = new Blipper();

  let gravityIndex = 0;

  // Per-build state (reset by teardown()).
  let engine: Matter.Engine | null = null;
  let things: Thing[] = [];
  const byEl = new WeakMap<EventTarget, Thing>();
  const drags = new Map<number, Drag>();
  let timers: number[] = [];
  let listeners: AbortController | null = null;
  let width = 0;
  let height = 0;
  let lidAdded = false;
  let touched = false;
  let lastCount = -1;

  // Loop state.
  let raf = 0;
  let running = false;
  let last = 0;
  let acc = 0;

  /* ---------------- build / teardown ---------------- */

  function teardown() {
    listeners?.abort();
    listeners = null;
    timers.forEach(clearTimeout);
    timers = [];
    drags.clear();
    if (engine) {
      Events.off(engine, "collisionStart", onCollision);
      Composite.clear(engine.world, false, true);
      Engine.clear(engine);
      engine = null;
    }
    things = [];
    layer.replaceChildren();
    lidAdded = false;
    lastCount = -1;
  }

  function build() {
    teardown();
    const rect = layer.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (width < 1 || height < 1) return;

    const floorY = height - BAR_HEIGHT;
    const eng = Engine.create({ gravity: { x: 0, y: GRAVITY[gravityIndex].y, scale: 0.001 } });
    engine = eng;
    listeners = new AbortController();
    const signal = listeners.signal;

    Events.on(eng, "collisionStart", onCollision);
    Composite.add(eng.world, createWalls(width, height, floorY));

    buildLetters(eng, floorY);
    buildPills(eng);

    layer.addEventListener("pointermove", onWind, { signal });

    for (const t of things) place(t);
    reportCount();

    // A gentle hint that letters come loose: the last one falls off by itself.
    timers.push(
      window.setTimeout(() => {
        if (touched) return;
        const lastLetter = [...things].reverse().find((t) => t.kind === "letter" && t.body.isStatic);
        if (lastLetter) wake(lastLetter, 0.08);
      }, AUTO_DROP_MS),
    );
  }

  function buildLetters(eng: Matter.Engine, floorY: number) {
    const lines = config.name.trim().split(/\s+/);
    const widths = lines.map((line) => [...line].map((ch) => measurer.letter(ch)));
    const lineW = widths.map((ws) => ws.reduce((s, x) => s + x, 0));
    const widest = Math.max(...lineW, 1);
    const fs = Math.max(
      48,
      Math.min(230, (width * 0.86) / (widest / 100), ((floorY - TOP_GUTTER) * 0.7) / (lines.length * 0.86)),
    );
    const lineHeight = fs * 0.84;
    const boxH = fs * 0.78;
    const centerY = TOP_GUTTER + (floorY - TOP_GUTTER) * 0.4;
    let k = 0;

    lines.forEach((line, li) => {
      let x = (width - (lineW[li] * fs) / 100) / 2;
      const y = centerY - (lines.length * lineHeight) / 2 + lineHeight * li + lineHeight / 2;
      [...line].forEach((ch, ci) => {
        const w = (widths[li][ci] * fs) / 100;
        const bw = w * 0.94;
        const el = document.createElement("div");
        el.className = "thing letter";
        el.style.width = `${bw}px`;
        el.style.height = `${boxH}px`;
        el.style.fontSize = `${fs}px`;
        const span = document.createElement("span");
        span.style.setProperty("--k", String(k++));
        span.textContent = ch;
        el.appendChild(span);
        register(eng, el, createLetterBody(x + w / 2, y, bw, boxH), bw, boxH, "letter");
        x += w;
      });
    });
  }

  function buildPills(eng: Matter.Engine) {
    const skills = width < MOBILE_BREAKPOINT ? config.skills.slice(0, config.mobileSkillCount) : config.skills;
    skills.forEach((skill, i) => {
      const h = PILL_HEIGHT;
      const icon = config.skillIcons?.[skill];
      const iconW = icon ? (config.skillIconWidth ?? 0) : 0;
      const w = Math.min(measurer.pill(skill) + iconW + PILL_PADDING_X, width - 24);
      const bg = config.pillColors[i % config.pillColors.length];
      const el = document.createElement("div");
      el.className = "thing pill";
      if (icon) {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "pill-icon");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", icon);
        svg.append(path);
        el.append(svg);
      }
      el.append(skill);
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.background = bg;
      el.style.color = bg.toLowerCase() === config.inkColor.toLowerCase() ? config.paperColor : config.inkColor;
      const minX = w / 2 + 12;
      const maxX = Math.max(minX, width - w / 2 - 12);
      const body = createPillBody(rand(minX, maxX), -60 - i * 85, w, h, rand(-0.6, 0.6));
      register(eng, el, body, w, h, "pill");
    });
  }

  function register(eng: Matter.Engine, el: HTMLDivElement, body: Matter.Body, w: number, h: number, kind: Kind) {
    const thing: Thing = { el, body, w, h, kind };
    things.push(thing);
    byEl.set(el, thing);
    Composite.add(eng.world, body);
    const signal = listeners?.signal;
    el.addEventListener("pointerdown", onDown, { signal });
    el.addEventListener("pointermove", onMove, { signal });
    el.addEventListener("pointerup", onUp, { signal });
    el.addEventListener("pointercancel", onUp, { signal });
    el.addEventListener("lostpointercapture", onUp, { signal });
    layer.appendChild(el);
  }

  /* ---------------- helpers ---------------- */

  function place(t: Thing) {
    const { x, y } = t.body.position;
    t.el.style.transform = `translate3d(${x - t.w / 2}px,${y - t.h / 2}px,0) rotate(${t.body.angle}rad)`;
  }

  function wake(t: Thing, spin = 0) {
    if (wakeBody(t.body, spin) && t.kind === "letter") {
      t.el.classList.add("loose");
      t.el.style.color = pick(config.letterColors);
      reportCount();
    }
  }

  function reportCount() {
    let total = 0;
    let loose = 0;
    for (const t of things) {
      if (t.kind !== "letter") continue;
      total++;
      if (!t.body.isStatic) loose++;
    }
    if (loose !== lastCount) {
      lastCount = loose;
      callbacks.onCount(loose, total);
    }
  }

  function pointer(e: PointerEvent): Matter.Vector {
    const r = layer.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  /** Recover anything that escaped the arena or went numerically bad. */
  function sanitize(t: Thing) {
    const b = t.body;
    const { x, y } = b.position;
    const bad = !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(b.angle);
    const out = x < -300 || x > width + 300 || y > height + 300 || y < -3000;
    if (!bad && !out) return;
    Body.setPosition(b, { x: width / 2, y: lidAdded ? t.h : -t.h });
    Body.setAngle(b, 0);
    Body.setVelocity(b, { x: 0, y: 0 });
    Body.setAngularVelocity(b, 0);
  }

  /* ---------------- dragging ---------------- */

  function onDown(e: PointerEvent) {
    if (!engine || (e.pointerType === "mouse" && e.button !== 0)) return;
    const thing = byEl.get(e.currentTarget as EventTarget);
    if (!thing) return;
    for (const d of drags.values()) if (d.thing === thing) return; // already held by another finger
    e.preventDefault();
    thing.el.setPointerCapture(e.pointerId);
    wake(thing);
    const p = pointer(e);
    const constraint = Constraint.create({
      pointA: p,
      bodyB: thing.body,
      pointB: { x: p.x - thing.body.position.x, y: p.y - thing.body.position.y },
      stiffness: DRAG.stiffness,
      damping: DRAG.damping,
      length: 0,
    });
    Composite.add(engine.world, constraint);
    drags.set(e.pointerId, { thing, constraint });
    thing.el.classList.add("grab");
    touched = true;
  }

  function onMove(e: PointerEvent) {
    const d = drags.get(e.pointerId);
    if (d) d.constraint.pointA = pointer(e);
  }

  function onUp(e: PointerEvent) {
    const d = drags.get(e.pointerId);
    if (!d) return;
    drags.delete(e.pointerId);
    if (engine) Composite.remove(engine.world, d.constraint);
    d.thing.el.classList.remove("grab");
  }

  /** Cursor "wind": loose bodies get nudged away from a mouse pointer. */
  function onWind(e: PointerEvent) {
    if (e.pointerType === "touch" || drags.size > 0 || !running) return;
    const p = pointer(e);
    for (const t of things) {
      const b = t.body;
      if (b.isStatic) continue;
      const dx = b.position.x - p.x;
      const dy = b.position.y - p.y;
      const d = Math.hypot(dx, dy);
      if (d < WIND.radius && d > 1) {
        const f = (1 - d / WIND.radius) * WIND.strength * b.mass;
        Body.applyForce(b, b.position, { x: (dx / d) * f, y: (dy / d) * f });
      }
    }
  }

  function onCollision(ev: Matter.IEventCollision<Matter.Engine>) {
    if (!sound.on) return;
    for (const pair of ev.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      const v = Math.hypot(a.velocity.x - b.velocity.x, a.velocity.y - b.velocity.y);
      if (v > SOUND.minSpeed) {
        sound.hit(v, a.label === "letter" || b.label === "letter" ? "letter" : "pill");
        break;
      }
    }
  }

  /* ---------------- loop ---------------- */

  function tick(now: number) {
    if (!running) return;
    acc += Math.min(now - last, MAX_FRAME_GAP_MS);
    last = now;
    const eng = engine;
    if (eng) {
      let n = 0;
      while (acc >= STEP_MS && n < MAX_STEPS_PER_FRAME) {
        Engine.update(eng, STEP_MS);
        acc -= STEP_MS;
        n++;
      }
      if (n === MAX_STEPS_PER_FRAME) acc = 0; // drop the backlog instead of spiralling
      let allInside = true;
      for (const t of things) {
        if (t.body.isStatic) continue;
        sanitize(t);
        place(t);
        if (t.body.position.y < t.h) allInside = false;
      }
      if (!lidAdded && allInside) {
        Composite.add(eng.world, createLid(width));
        lidAdded = true;
      }
    }
    raf = requestAnimationFrame(tick);
  }

  /* ---------------- public API ---------------- */

  const world: PhysicsWorld = {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      // Release any held objects; a pointerup may never arrive while hidden.
      for (const id of [...drags.keys()]) {
        const d = drags.get(id);
        if (d && engine) Composite.remove(engine.world, d.constraint);
        d?.thing.el.classList.remove("grab");
      }
      drags.clear();
    },
    rebuild: build,
    destroy() {
      world.stop();
      teardown();
      measurer.destroy();
      sound.close();
    },
    dropAll() {
      touched = true;
      for (const t of things) if (t.kind === "letter") wake(t, rand(0.02, 0.09));
    },
    shake() {
      touched = true;
      for (const t of things) {
        if (t.body.isStatic) continue;
        Body.setVelocity(t.body, { x: rand(-9, 9), y: -rand(9, 15) });
        Body.setAngularVelocity(t.body, rand(-0.15, 0.15));
      }
    },
    cycleGravity() {
      gravityIndex = (gravityIndex + 1) % GRAVITY.length;
      const preset = GRAVITY[gravityIndex];
      if (engine) {
        engine.gravity.y = preset.y;
        if (preset.y === 0) {
          for (const t of things) {
            if (!t.body.isStatic) Body.setVelocity(t.body, { x: rand(-4, 4), y: rand(-4, 4) });
          }
        }
      }
      return preset;
    },
    setSound(on) {
      if (on) sound.enable();
      else sound.disable();
    },
    reset() {
      touched = false;
      build();
    },
  };

  build();
  return world;
}
