const LETTER_FONT = "800 100px var(--font-display)";
const PILL_FONT = "700 17px var(--font-sans)";

export interface Measurer {
  /** Glyph width in px at a 100px font size. */
  letter(ch: string): number;
  /** Rendered width of a pill label in px (text only). */
  pill(text: string): number;
  destroy(): void;
}

function probe(host: HTMLElement, font: string, letterSpacing = "normal") {
  const el = document.createElement("span");
  el.className = "probe";
  el.setAttribute("aria-hidden", "true");
  el.style.font = font;
  el.style.letterSpacing = letterSpacing;
  host.appendChild(el);
  return el;
}

/** Hidden spans that use the real web fonts, so body sizes match the rendered glyphs. */
export function createMeasurer(host: HTMLElement): Measurer {
  const l = probe(host, LETTER_FONT, "-0.02em");
  const p = probe(host, PILL_FONT);
  const cache = new Map<string, number>();
  const measure = (el: HTMLElement, key: string, text: string) => {
    const hit = cache.get(key);
    if (hit !== undefined) return hit;
    el.textContent = text;
    const w = el.getBoundingClientRect().width;
    cache.set(key, w);
    return w;
  };
  return {
    letter: (ch) => measure(l, `l:${ch}`, ch),
    pill: (text) => measure(p, `p:${text}`, text),
    destroy() {
      l.remove();
      p.remove();
    },
  };
}

/**
 * Resolve once the display + UI fonts are usable (or after `timeoutMs`).
 * Explicitly requests the weights we measure with, since `fonts.ready` alone
 * can resolve before a weight has ever been requested.
 */
export async function waitForFonts(host: HTMLElement, timeoutMs = 1500): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const tmp = probe(host, LETTER_FONT);
  const pillTmp = probe(host, PILL_FONT);
  const display = getComputedStyle(tmp).fontFamily;
  const ui = getComputedStyle(pillTmp).fontFamily;
  tmp.remove();
  pillTmp.remove();
  const loads = Promise.all([
    document.fonts.load(`800 100px ${display}`),
    document.fonts.load(`700 17px ${ui}`),
  ]).then(() => document.fonts.ready);
  await Promise.race([
    loads.catch(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}
