import Image from "next/image";
import { EXPERIENCE, FOCUS, PERSON, STATS } from "@/config/site";
import { SKILL_ICONS } from "@/lib/skill-icons";

const current = EXPERIENCE.find((j) => j.current);

/** About body: intro + avatar, a stats strip, and "What I do" cards. Heading comes from the page. */
export function AboutBody({ heading }: { heading: React.ReactNode }) {
  return (
    <>
      <div className="grid items-center gap-x-[clamp(32px,6vw,96px)] gap-y-10 md:grid-cols-[1fr_auto]">
        <div>
          {heading}
          <p className="text-[clamp(1.1rem,1.8vw,1.35rem)] leading-relaxed">{PERSON.summary}</p>
          {current && (
            <p className="mt-6 inline-flex flex-wrap items-center gap-x-2 gap-y-1 border-2 border-ink bg-white px-3 py-2 font-mono text-[0.76rem] uppercase tracking-[0.04em]">
              <span className="relative grid size-2.5 place-items-center" aria-hidden="true">
                <span className="absolute size-2.5 rounded-full bg-lime motion-safe:animate-ping" />
                <span className="relative size-2.5 rounded-full border border-ink bg-lime" />
              </span>
              Currently · {current.role} at <b>{current.company}</b>
            </p>
          )}
        </div>

        <div className="relative order-first justify-self-start md:order-none md:justify-self-end">
          <Image
            src="/avatar.png"
            alt={`Pixelated photo of ${PERSON.fullName}`}
            width={64}
            height={64}
            unoptimized
            className="size-[clamp(160px,24vw,320px)] border-2 border-ink shadow-[7px_7px_0_var(--color-ink)] [image-rendering:pixelated]"
          />
          <span
            className="absolute -top-3 -right-4 rotate-6 border-2 border-ink bg-lime px-3 py-1 font-mono text-[0.78rem] uppercase tracking-[0.04em] shadow-[0_3px_0_var(--color-ink)]"
            aria-hidden="true"
          >
            Hello!
          </span>
          <span
            className="absolute -bottom-4 -left-3 -rotate-3 border-2 border-ink bg-white px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.04em] shadow-[0_3px_0_var(--color-ink)]"
            aria-hidden="true"
          >
            📍 {PERSON.location}
          </span>
        </div>
      </div>

      <dl className="mt-14 grid grid-cols-2 border-2 border-ink bg-white lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`px-5 py-5 sm:px-6 ${i % 2 === 0 ? "border-r-2 border-ink" : ""} ${i < 2 ? "border-b-2 border-ink lg:border-b-0" : ""} ${i === 1 ? "lg:border-r-2" : ""}`}
          >
            <dt className="font-mono text-[0.7rem] uppercase tracking-[0.04em] text-muted">{s.label}</dt>
            <dd className="mt-1 text-[clamp(2.2rem,4.5vw,3.4rem)] leading-none font-extrabold tracking-[-0.03em] tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-14 mb-5 font-mono text-[0.76rem] uppercase tracking-[0.03em]">What I do</h3>
      <ul className="grid gap-6 md:grid-cols-3">
        {FOCUS.map((f) => (
          <li key={f.title} className="flex flex-col border-2 border-ink bg-white shadow-[6px_6px_0_var(--color-ink)]">
            <div className="h-3 border-b-2 border-ink" style={{ background: f.color }} aria-hidden="true" />
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="text-[1.35rem] font-extrabold tracking-[-0.02em]">{f.title}</p>
              <p className="mt-2 leading-relaxed text-muted">{f.blurb}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-5" aria-label={`${f.title} skills`}>
                {f.skills.map((s) => (
                  <li
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink px-2.5 py-1 font-mono text-[0.68rem]"
                  >
                    {SKILL_ICONS[s] && (
                      <svg className="size-3.5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={SKILL_ICONS[s]} />
                      </svg>
                    )}
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
