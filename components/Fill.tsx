import { isPlaceholder } from "@/config/site";

/** Renders config text; "[FILL IN …]" placeholders get a dashed highlight so they're easy to spot. */
export function Fill({ text }: { text: string }) {
  return isPlaceholder(text) ? <span className="placeholder">{text}</span> : <>{text}</>;
}
