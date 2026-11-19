// Generates the pixel-art cursors in public/cursors/.
// Run: node scripts/cursors.mjs
// Each cursor is a 16×16 grid: K = ink outline, W = fill, . = transparent.
// Output: <name>.png at 32px (1x) and <name>@2x.png at 64px, hard-edged.

import { mkdirSync } from "node:fs";
import sharp from "sharp";

const INK = [18, 18, 18];
const FILL = { arrow: [255, 255, 255], pointer: [212, 255, 63], grab: [212, 255, 63], grabbing: [212, 255, 63] };

const CURSORS = {
  arrow: [
    "K...............",
    "KK..............",
    "KWK.............",
    "KWWK............",
    "KWWWK...........",
    "KWWWWK..........",
    "KWWWWWK.........",
    "KWWWWWWK........",
    "KWWWWWWWK.......",
    "KWWWWWWWWK......",
    "KWWWWWKKKKK.....",
    "KWWKWWK.........",
    "KWK.KWWK........",
    "KK..KWWK........",
    "K....KWWK.......",
    ".....KKKK.......",
  ],
  pointer: [
    ".....KK.........",
    "....KWWK........",
    "....KWWK........",
    "....KWWK........",
    "....KWWKKK......",
    "....KWWKWWKKK...",
    "....KWWKWWKWWKK.",
    ".KK.KWWKWWKWWKWK",
    "KWWKKWWWWWWWWKWK",
    "KWWWKWWWWWWWWWWK",
    ".KWWWWWWWWWWWWWK",
    "..KWWWWWWWWWWWWK",
    "..KWWWWWWWWWWWK.",
    "...KWWWWWWWWWWK.",
    "....KWWWWWWWWK..",
    "....KKKKKKKKKK..",
  ],
  grab: [
    ".....KK.KK......",
    "....KWWKWWKKK...",
    "....KWWKWWKWWK..",
    "..KKKWWKWWKWWK..",
    "..KWKWWKWWKWWK..",
    "..KWKWWKWWKWWKK.",
    "..KWWWWWWWWWWKWK",
    "..KWWWWWWWWWWWWK",
    "KKKWWWWWWWWWWWWK",
    "KWWKWWWWWWWWWWWK",
    ".KWWWWWWWWWWWWK.",
    "..KWWWWWWWWWWWK.",
    "...KWWWWWWWWWK..",
    "....KWWWWWWWWK..",
    "....KKKKKKKKKK..",
    "................",
  ],
  grabbing: [
    "................",
    "................",
    "................",
    ".....KK.KK.KK...",
    "....KWWKWWKWWK..",
    "...KKWWKWWKWWKK.",
    "..KWKWWKWWKWWKWK",
    "..KWWWWWWWWWWWWK",
    "..KWWWWWWWWWWWWK",
    "..KWWWWWWWWWWWWK",
    "...KWWWWWWWWWWK.",
    "...KWWWWWWWWWWK.",
    "....KWWWWWWWWK..",
    "....KKKKKKKKKK..",
    "................",
    "................",
  ],
};

mkdirSync("public/cursors", { recursive: true });

for (const [name, rows] of Object.entries(CURSORS)) {
  rows.forEach((r, y) => {
    if (r.length !== 16) throw new Error(`${name} row ${y} is ${r.length} wide`);
  });
  const px = Buffer.alloc(16 * 16 * 4);
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const c = ch === "K" ? INK : ch === "W" ? FILL[name] : null;
      if (!c) return;
      px.set([...c, 255], (y * 16 + x) * 4);
    }),
  );
  const base = sharp(px, { raw: { width: 16, height: 16, channels: 4 } });
  await base.clone().resize(32, 32, { kernel: "nearest" }).png().toFile(`public/cursors/${name}.png`);
  await base.clone().resize(64, 64, { kernel: "nearest" }).png().toFile(`public/cursors/${name}@2x.png`);
  console.log(`public/cursors/${name}.png`);
}
