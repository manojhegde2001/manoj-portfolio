import { COLORS, NAME, PERSON, PILL_COLORS, SKILLS } from "@/config/site";
import { HeroInteractive } from "./HeroInteractive";

const initials = PERSON.fullName
  .split(" ")
  .map((p) => p[0])
  .join("");

const navLink =
  "border-b-2 border-transparent hover:border-ink focus-visible:border-ink py-1";

/**
 * Server-rendered hero shell. Everything here works without JS:
 * the real <h1>, the nav, and a static fallback of the name and skills.
 * The physics layer mounts on top and hides the fallback once it's ready.
 */
export function Hero() {
  const lines = NAME.trim().split(/\s+/);
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">
        {PERSON.fullName}, {PERSON.role.toLowerCase()} in {PERSON.location}
      </h1>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-[5] flex items-center justify-between px-(--gutter) py-[22px]">
        <a href="#top" className="pointer-events-auto text-[1.15rem] font-extrabold tracking-[-0.02em]">
          {initials}
          <b className="mx-[3px] border-2 border-ink bg-lime px-[5px]">/</b>dev
        </a>
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex gap-[clamp(12px,2.4vw,22px)] font-mono text-[0.74rem] uppercase tracking-[0.08em]"
        >
          <a className={navLink} href="#work">
            Work
          </a>
          <a className={`${navLink} max-[420px]:hidden`} href="#experience">
            Experience
          </a>
          <a className={`${navLink} max-[520px]:hidden`} href="#play">
            Play
          </a>
          <a className={navLink} href="#contact">
            Contact
          </a>
          <a className={navLink} href={PERSON.resume} target="_blank" rel="noopener noreferrer">
            Résumé<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </header>

      <div className="hero-fallback">
        <p className="fallback-name" aria-hidden="true">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <ul className="fallback-skills" aria-label="Skills">
          {SKILLS.map((skill, i) => {
            const bg = PILL_COLORS[i % PILL_COLORS.length];
            return (
              <li
                key={skill}
                className="pill"
                style={{ background: bg, color: bg === COLORS.ink ? COLORS.paper : COLORS.ink }}
              >
                {skill}
              </li>
            );
          })}
        </ul>
      </div>

      <HeroInteractive />
    </section>
  );
}
