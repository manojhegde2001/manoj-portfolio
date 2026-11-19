import { Hero } from "@/components/hero/Hero";
import { JsonLd } from "@/components/JsonLd";
import { PlaySection } from "@/components/game/PlaySection";
import { ProjectCard } from "@/components/ProjectCard";
import { AboutBody } from "@/components/AboutSection";
import { ContactBody } from "@/components/contact/ContactSection";
import { Timeline } from "@/components/Timeline";
import { PERSON, PROJECTS } from "@/config/site";

const wrap = "px-(--gutter) py-[clamp(64px,9vw,110px)]";
const eyebrow = "font-mono text-[0.76rem] uppercase tracking-[0.03em]";
const h2 = "mt-3 mb-10 text-[clamp(2.4rem,6vw,4.6rem)] leading-none font-extrabold tracking-[-0.03em]";

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
        <section id="about" className={`${wrap} scroll-mt-4`} aria-labelledby="about-title">
          <AboutBody
            heading={
              <>
                <p className={eyebrow}>01 — About</p>
                <h2 id="about-title" className={h2}>
                  Hi, I&apos;m {PERSON.fullName.split(" ")[0]}.
                </h2>
              </>
            }
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
          className={`${wrap} scroll-mt-4 overflow-x-clip border-t-2 border-ink`}
          aria-labelledby="experience-title"
        >
          <p className={eyebrow}>03 — Experience</p>
          <h2 id="experience-title" className={h2}>
            Where I work.
          </h2>
          <Timeline />
        </section>

        <section id="play" className={`${wrap} scroll-mt-4 border-t-2 border-ink`} aria-labelledby="play-title">
          <p className={eyebrow}>04 — Play</p>
          <h2 id="play-title" className={h2}>
            Stack the stack.
          </h2>
          <PlaySection />
        </section>

        <section id="contact" className={`${wrap} scroll-mt-4 border-t-2 border-ink`} aria-labelledby="contact-title">
          <p className={eyebrow}>05 — Contact</p>
          <h2 id="contact-title" className={h2}>
            Say hello.
          </h2>
          <ContactBody />
        </section>
      </main>

      <footer className="border-t-2 border-ink px-(--gutter) py-6 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-muted">
        © {PERSON.fullName} · Built with Next.js and matter-js
      </footer>
    </>
  );
}
