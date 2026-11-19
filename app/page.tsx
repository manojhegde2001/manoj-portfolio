import Image from "next/image";
import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { EXPERIENCE, PERSON, PROJECTS } from "@/config/site";

const wrap = "px-(--gutter) py-[clamp(64px,9vw,110px)]";
const eyebrow = "font-mono text-[0.76rem] uppercase tracking-[0.12em]";
const h2 = "mt-3 mb-10 text-[clamp(2.4rem,6vw,4.6rem)] leading-none font-extrabold tracking-[-0.03em]";
const outLink =
  "border-b-2 border-ink font-mono text-[0.8rem] uppercase tracking-[0.08em] hover:bg-lime focus-visible:bg-lime";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only z-50 border-2 border-ink bg-lime px-4 py-2 font-mono text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to work
      </a>

      <JsonLd />
      <Hero />

      <main>
        <section
          className={`${wrap} grid items-center gap-x-[clamp(32px,6vw,96px)] gap-y-8 md:grid-cols-[1fr_auto]`}
          aria-labelledby="about-title"
        >
          <div>
            <p className={eyebrow}>01 — About</p>
            <h2 id="about-title" className={h2}>
              Hi, I&apos;m {PERSON.fullName.split(" ")[0]}.
            </h2>
            <p className="text-[clamp(1.1rem,1.8vw,1.35rem)] leading-relaxed">{PERSON.summary}</p>
            <p className="mt-4 font-mono text-[0.8rem] uppercase tracking-[0.08em] text-muted">
              Based in {PERSON.location} · {PERSON.years} years
            </p>
          </div>
          <Image
            src="/avatar.png"
            alt={`Pixelated photo of ${PERSON.fullName}`}
            width={64}
            height={64}
            unoptimized
            className="order-first size-[clamp(160px,24vw,320px)] [image-rendering:pixelated] border-2 border-ink shadow-[7px_7px_0_var(--color-ink)] md:order-none"
          />
        </section>

        <section id="work" className={`${wrap} scroll-mt-4 border-t-2 border-ink`} aria-labelledby="work-title">
          <p className={eyebrow}>02 — Selected work</p>
          <h2 id="work-title" className={h2}>
            Things I&apos;ve shipped.
          </h2>
          {/* Masonry: CSS columns stack cards at their natural height, so columns finish level. */}
          <div className="gap-8 md:columns-2 xl:columns-3">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i % 3} />
            ))}
          </div>
        </section>

        <section
          id="experience"
          className={`${wrap} scroll-mt-4 border-t-2 border-ink`}
          aria-labelledby="experience-title"
        >
          <p className={eyebrow}>03 — Experience</p>
          <h2 id="experience-title" className={h2}>
            Where I work.
          </h2>
          <ol className="space-y-10">
            {EXPERIENCE.map((job) => (
              <li key={`${job.company}-${job.date}`} className="grid gap-4 md:grid-cols-[240px_1fr]">
                <div>
                  <p className="text-[1.4rem] font-extrabold tracking-[-0.02em]">{job.company}</p>
                  <p className="font-mono text-[0.74rem] uppercase tracking-[0.08em] text-muted">{job.date}</p>
                </div>
                <div>
                  <h3 className="text-[1.15rem] font-bold">{job.role}</h3>
                  <ul className="mt-3 space-y-2 leading-relaxed">
                    {job.points.map((pt) => (
                      <li key={pt} className="relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:size-2 before:border-[1.5px] before:border-ink before:bg-lime">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className={`${wrap} scroll-mt-4 border-t-2 border-ink`} aria-labelledby="contact-title">
          <p className={eyebrow}>04 — Contact</p>
          <h2 id="contact-title" className={`${h2} !mb-6`}>
            Say hello.
          </h2>
          <a
            className="mail inline-block border-b-4 border-ink text-[clamp(1.5rem,5vw,4rem)] font-extrabold tracking-[-0.03em] break-all"
            href={`mailto:${PERSON.email}`}
          >
            {PERSON.email}
          </a>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <li>
              <a className={outLink} href={PERSON.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className={outLink} href={PERSON.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className={outLink} href={PERSON.resume} target="_blank" rel="noopener noreferrer">
                Résumé ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t-2 border-ink px-(--gutter) py-6 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">
        © {PERSON.fullName} · Built with Next.js and matter-js
      </footer>
    </>
  );
}
