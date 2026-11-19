import Image from "next/image";
import type { CSSProperties } from "react";
import { EDUCATION, EXPERIENCE } from "@/config/site";
import { Reveal } from "./Reveal";

const dateCls = "font-mono text-[0.74rem] uppercase tracking-[0.04em] text-muted";
const card = "border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--color-ink)] sm:p-6";

/** The vertical line segment for one entry. It draws downward when the entry is revealed. */
function Line({ className = "inset-y-0" }: { className?: string }) {
  return <span className={`tl-line absolute left-0 w-[2px] bg-ink ${className}`} aria-hidden="true" />;
}

/** Square marker on the line. Pops in after the line reaches it. */
function Marker({ fill, top, pulse = false }: { fill: string; top: string; pulse?: boolean }) {
  return (
    <span className={`tl-marker absolute -left-[9px] grid size-5 place-items-center ${top}`} aria-hidden="true">
      {pulse && <span className="absolute size-5 bg-lime motion-safe:animate-ping" />}
      <span className={`relative size-5 border-2 border-ink ${fill}`} />
    </span>
  );
}

/**
 * Work history and education as one vertical timeline. Each entry animates in as it scrolls into
 * view (rules under "TIMELINE" in globals.css).
 * md+: dates sit in a left column beside the line. Phones: the date moves into the card.
 */
export function Timeline() {
  return (
    <ol className="grid">
      {EXPERIENCE.map((job) => (
        <Reveal as="li" key={`${job.company}-${job.date}`} className="tl-item grid md:grid-cols-[200px_1fr] md:gap-x-10">
          <p className={`tl-date ${dateCls} hidden pt-7 text-right md:block`}>{job.date}</p>
          <div className="relative pb-10 pl-7 md:pl-10">
            <Line />
            <Marker fill={job.current ? "bg-lime" : "bg-white"} top="top-6" pulse={job.current} />
            <article className={`tl-card ${card}`}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-[1.35rem] leading-tight font-extrabold tracking-[-0.02em]">{job.company}</h3>
                {job.current && (
                  <span className="border-2 border-ink bg-lime px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.04em]">
                    Now
                  </span>
                )}
              </div>
              <p className="mt-1 font-bold">
                {job.role}
                {job.location && <span className="font-normal text-muted"> · {job.location}</span>}
              </p>
              <p className={`${dateCls} mt-1 md:hidden`}>{job.date}</p>

              <ul className="mt-4 space-y-2 leading-relaxed">
                {job.points.map((pt, i) => (
                  <li
                    key={pt}
                    style={{ "--p": i } as CSSProperties}
                    className="tl-point relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:size-2 before:border-[1.5px] before:border-ink before:bg-lime"
                  >
                    {pt}
                  </li>
                ))}
              </ul>

              {job.stack && (
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${job.company} tech stack`}>
                  {job.stack.map((t, i) => (
                    <li
                      key={t}
                      style={{ "--p": job.points.length + i * 0.5 } as CSSProperties}
                      className="tl-point rounded-full border-[1.5px] border-ink px-2.5 py-0.5 font-mono text-[0.68rem]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        </Reveal>
      ))}

      {EDUCATION.map((ed, i) => {
        const last = i === EDUCATION.length - 1;
        return (
          <Reveal as="li" key={ed.title} className="tl-item grid md:grid-cols-[200px_1fr] md:gap-x-10">
            <p className={`tl-date ${dateCls} hidden pt-5 text-right md:block`}>{ed.date}</p>
            <div className={`relative pl-7 md:pl-10 ${last ? "" : "pb-6"}`}>
              {/* The line stops at the last entry's marker. */}
              <Line className={last ? "top-0 h-6" : "inset-y-0"} />
              <Marker fill="bg-sky" top="top-4" />
              <div className="tl-card flex items-center gap-4 border-2 border-ink bg-white px-5 py-4 shadow-[6px_6px_0_var(--color-ink)]">
                {ed.logo && (
                  <Image src={ed.logo} alt="" width={56} height={56} className="size-12 shrink-0 object-contain sm:size-14" />
                )}
                <div className="min-w-0">
                  {i === 0 && (
                    <p className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.04em] text-muted">Education</p>
                  )}
                  <h3 className="font-bold">{ed.title}</h3>
                  <p className="text-muted">
                    {ed.school}
                    <span className="md:hidden"> · {ed.date}</span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
