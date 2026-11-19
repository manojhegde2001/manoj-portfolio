import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { COLORS, EXPERIENCE, PERSON, PILL_COLORS, SITE_URL, SKILLS } from "@/config/site";

export const alt = `${PERSON.fullName}, ${PERSON.role} in ${PERSON.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = COLORS.ink;

/** Cached so the image is built once at build time (cacheComponents treats file reads as uncached). */
async function getAvatarDataUrl() {
  "use cache";
  const avatar = await readFile(join(process.cwd(), "public", PERSON.avatar));
  return `data:image/png;base64,${avatar.toString("base64")}`;
}

export default async function OpengraphImage() {
  const avatarSrc = await getAvatarDataUrl();
  const company = EXPERIENCE[0]?.company;
  const host = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: COLORS.paper,
          color: ink,
          border: `12px solid ${ink}`,
          padding: "52px 60px",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontSize: 24,
                letterSpacing: 3,
                textTransform: "uppercase",
                background: COLORS.lime,
                border: `3px solid ${ink}`,
                padding: "6px 14px",
              }}
            >
              Portfolio
            </div>
            <div style={{ display: "flex", fontSize: 104, fontWeight: 900, lineHeight: 0.95, letterSpacing: -4, marginTop: 22 }}>
              {PERSON.fullName}
            </div>
            <div style={{ display: "flex", fontSize: 38, marginTop: 18 }}>
              {PERSON.role} · {PERSON.location}
            </div>
            {company && (
              <div style={{ display: "flex", fontSize: 28, marginTop: 10, color: "#4a4a4a" }}>
                Currently at {company}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {SKILLS.slice(0, 6).map((s, i) => {
              const bg = PILL_COLORS[i % PILL_COLORS.length];
              return (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    fontSize: 26,
                    fontWeight: 700,
                    padding: "8px 22px",
                    borderRadius: 999,
                    border: `3px solid ${ink}`,
                    background: bg,
                    color: bg === ink ? COLORS.paper : ink,
                  }}
                >
                  {s}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", fontSize: 26, letterSpacing: 1 }}>{host}</div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only */}
        <img
          src={avatarSrc}
          alt=""
          width={400}
          height={400}
          style={{ border: `6px solid ${ink}`, boxShadow: `14px 14px 0 ${ink}` }}
        />
      </div>
    ),
    size,
  );
}
