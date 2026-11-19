import {
  siExpress,
  siFirebase,
  siGit,
  siGooglecloud,
  siJest,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siRedux,
  siTailwindcss,
  siTypescript,
} from "simple-icons";

/**
 * SVG path data (24×24 viewBox) for each skill pill, keyed by the label in config SKILLS.
 * Icons come from Simple Icons (CC0). They're drawn in one colour (currentColor) so they
 * sit on any pill background. Skills without an entry just show text.
 */
export const SKILL_ICONS: Readonly<Record<string, string>> = {
  "Next.js": siNextdotjs.path,
  React: siReact.path,
  TypeScript: siTypescript.path,
  "Node.js": siNodedotjs.path,
  NestJS: siNestjs.path,
  Express: siExpress.path,
  MongoDB: siMongodb.path,
  Redux: siRedux.path,
  Tailwind: siTailwindcss.path,
  // Simple Icons removed the AWS logo at Amazon's request, so AWS gets a plain cloud.
  AWS: "M6.5 19.5a5 5 0 0 1-.6-9.96 6.5 6.5 0 0 1 12.4-1.9A5.5 5.5 0 0 1 17.5 19.5z",
  GCP: siGooglecloud.path,
  Firebase: siFirebase.path,
  Jest: siJest.path,
  Git: siGit.path,
};

/** Rendered icon size and the gap after it, in px. Keep in sync with .pill-icon in globals.css. */
export const PILL_ICON_SIZE = 18;
export const PILL_ICON_GAP = 8;
