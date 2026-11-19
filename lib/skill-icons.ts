import {
  siExpress,
  siFirebase,
  siGit,
  siGithub,
  siInstagram,
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

/** Icons for the contact links (24×24 path data, drawn with fill-rule evenodd). */
export const SOCIAL_ICONS = {
  github: siGithub.path,
  instagram: siInstagram.path,
  // Simple Icons no longer ships the LinkedIn logo, so this is a simple "in" mark.
  linkedin:
    "M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM5.9 7a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0zM6.1 9.8h2.8V18H6.1zM11 9.8h2.7v1.2c.5-.9 1.6-1.4 2.8-1.4c2.4 0 3.1 1.5 3.1 3.8V18h-2.8v-4c0-1.1-.3-1.8-1.3-1.8c-1.1 0-1.6.8-1.6 1.9V18H11z",
  // Plain document with a folded corner and two text lines.
  resume: "M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM13 3.5V9h5.5zM8 13h8v1.6H8zM8 16.5h8v1.6H8z",
} as const;

/** Rendered icon size and the gap after it, in px. Keep in sync with .pill-icon in globals.css. */
export const PILL_ICON_SIZE = 18;
export const PILL_ICON_GAP = 8;
