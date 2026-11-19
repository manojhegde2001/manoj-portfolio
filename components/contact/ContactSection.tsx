import { CONTACT_NOTE, PERSON } from "@/config/site";
import { SOCIAL_ICONS } from "@/lib/skill-icons";
import { CopyEmail } from "./CopyEmail";
import { LocalTime } from "./LocalTime";

const handle = (url: string) => new URL(url).pathname.replace(/^\/|\/$/g, "");

const LINKS = [
  { label: "GitHub", href: PERSON.github, sub: `@${handle(PERSON.github)}`, icon: SOCIAL_ICONS.github, bg: "bg-white" },
  { label: "LinkedIn", href: PERSON.linkedin, sub: handle(PERSON.linkedin), icon: SOCIAL_ICONS.linkedin, bg: "bg-sky" },
  { label: "Instagram", href: PERSON.instagram, sub: `@${handle(PERSON.instagram)}`, icon: SOCIAL_ICONS.instagram, bg: "bg-coral" },
  { label: "Résumé", href: PERSON.resume, sub: "PDF on Google Drive", icon: SOCIAL_ICONS.resume, bg: "bg-sun" },
] as const;

const btn =
  "inline-flex items-center gap-2 border-2 border-ink px-5 py-2.5 font-mono text-[0.8rem] uppercase tracking-[0.04em] shadow-[0_4px_0_var(--color-ink)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:translate-y-0.5 active:shadow-none";

/** Left: invitation, email and actions. Right: profiles card with location and local time. */
export function ContactBody() {
  return (
    <div className="grid items-start gap-x-[clamp(32px,6vw,96px)] gap-y-12 lg:grid-cols-[1.25fr_1fr]">
      <div>
        <p className="text-[clamp(1.1rem,1.8vw,1.35rem)] leading-relaxed">{CONTACT_NOTE}</p>
        <a
          className="mail mt-6 inline-block border-b-4 border-ink text-[clamp(1.35rem,2.6vw,2.4rem)] leading-tight font-extrabold tracking-[-0.03em] [overflow-wrap:anywhere]"
          href={`mailto:${PERSON.email}`}
        >
          {PERSON.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className={`${btn} bg-lime`} href={`mailto:${PERSON.email}`}>
            Send an email →
          </a>
          <CopyEmail email={PERSON.email} className={`${btn} bg-white`} />
        </div>
      </div>

      <div className="border-2 border-ink bg-white shadow-[7px_7px_0_var(--color-ink)]">
        <p className="border-b-2 border-ink bg-ink px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.04em] text-paper">
          Find me elsewhere
        </p>
        <ul>
          {LINKS.map(({ label, href, sub, icon, bg }) => (
            <li key={label} className="border-b-2 border-ink">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-5 py-3.5 hover:bg-paper focus-visible:bg-paper"
              >
                <span className={`grid size-10 shrink-0 place-items-center border-2 border-ink ${bg}`} aria-hidden="true">
                  <svg className="size-5 fill-current" viewBox="0 0 24 24">
                    <path d={icon} fillRule="evenodd" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{label}</span>
                  <span className="block truncate font-mono text-[0.72rem] text-muted">{sub}</span>
                </span>
                <span className="font-mono transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">
                  ↗
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <dl className="grid grid-cols-2 font-mono text-[0.72rem] uppercase tracking-[0.04em]">
          <div className="border-r-2 border-ink px-5 py-3">
            <dt className="text-muted">Based in</dt>
            <dd className="mt-0.5 text-ink">{PERSON.location}, India</dd>
          </div>
          <div className="px-5 py-3">
            <dt className="text-muted">Local time</dt>
            <dd className="mt-0.5 text-ink">
              <LocalTime />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
