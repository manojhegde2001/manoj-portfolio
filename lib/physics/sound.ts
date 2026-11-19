import { SOUND } from "./constants";

export type BlipKind = "letter" | "pill";

type AudioCtor = typeof AudioContext;

/**
 * Tiny WebAudio blips. The AudioContext is created lazily on the first `enable()`,
 * which must be called from a user gesture (the Sound button).
 */
export class Blipper {
  private ctx: AudioContext | null = null;
  private last = 0;
  on = false;

  enable() {
    if (!this.ctx) {
      const w = window as Window & { webkitAudioContext?: AudioCtor };
      const Ctor = window.AudioContext ?? w.webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
    }
    void this.ctx.resume();
    this.on = true;
    this.play(8, "pill");
  }

  disable() {
    this.on = false;
    void this.ctx?.suspend();
  }

  /** Rate-limited collision sound. Returns true if it played. */
  hit(speed: number, kind: BlipKind): boolean {
    if (!this.on || !this.ctx) return false;
    const now = performance.now();
    if (now - this.last < SOUND.minIntervalMs) return false;
    this.last = now;
    this.play(speed, kind);
    return true;
  }

  close() {
    this.on = false;
    void this.ctx?.close();
    this.ctx = null;
  }

  private play(speed: number, kind: BlipKind) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = kind === "letter" ? "triangle" : "sine";
    osc.frequency.value = (kind === "letter" ? 120 : 340) + Math.random() * 140;
    gain.gain.setValueAtTime(Math.min(0.14, speed * 0.012), t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  }
}
