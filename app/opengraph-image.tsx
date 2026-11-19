import { ImageResponse } from "next/og";
import { COLORS, NAME, PERSON, PILL_COLORS, SKILLS } from "@/config/site";

export const alt = `${PERSON.fullName}, ${PERSON.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const lines = NAME.trim().split(/\s+/);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: COLORS.paper,
          color: COLORS.ink,
          padding: 64,
          border: `12px solid ${COLORS.ink}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 900, lineHeight: 0.86, letterSpacing: -6 }}>
          {lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {SKILLS.slice(0, 7).map((s, i) => {
            const bg = PILL_COLORS[i % PILL_COLORS.length];
            return (
              <div
                key={s}
                style={{
                  display: "flex",
                  fontSize: 30,
                  fontWeight: 700,
                  padding: "10px 26px",
                  borderRadius: 999,
                  border: `4px solid ${COLORS.ink}`,
                  background: bg,
                  color: bg === COLORS.ink ? COLORS.paper : COLORS.ink,
                }}
              >
                {s}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", fontSize: 30 }}>
          {PERSON.role} · {PERSON.location}
        </div>
      </div>
    ),
    size,
  );
}
