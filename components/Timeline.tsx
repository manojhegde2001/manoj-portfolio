import Image from "next/image";
import { EDUCATION, EXPERIENCE } from "@/config/site";

const dateCls = "font-mono text-[0.74rem] uppercase tracking-[0.04em] text-muted";
const card = "border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--color-ink)] sm:p-6";

/** Square marker on the timeline line. */
function Marker({ fill, pulse = false }: { fill: string; pulse?: boolean }) {
  return (
    <span className="absolute top-6 -left-[11px] grid size-5 place-items-center" aria-hidden="true">
      {pulse && <span className="absolute size-5 bg-lime motion-safe:animate-ping" />}
      <span className={`relative size-5 border-2 border-ink ${fill}`} />
    </span>
  );
}

/**
 * Work history and education as one vertical timeline.
 * md+: dates sit in a left column beside the line. Phones: the date moves into the card.
 */
export function Timeline() {
  return (
    <ol className="grid">
      {EXPERIENCE.map((job) => (
        <li key={`${job.company}-${job.date}`} className="grid md:grid-cols-[200px_1fr] md:gap-x-10">
          <p className={`${dateCls} hidden pt-7 text-right md:block`}>{job.date}</p>
          <div className="relative border-l-2 border-ink pb-10 pl-7 md:pl-10">
            <Marker fill={job.current ? "bg-lime" : "bg-white"} pulse={job.current} />
            <article className={card}>
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
                {job.points.map((pt) => (
                  <li
                    key={pt}
                    className="relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:size-2 before:border-[1.5px] before:border-ink before:bg-lime"
                  >
                    {pt}
                  </li>
                ))}
              </ul>

              {job.stack && (
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${job.company} tech stack`}>
                  {job.stack.map((t) => (
                    <li key={t} className="rounded-full border-[1.5px] border-ink px-2.5 py-0.5 font-mono text-[0.68rem]">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        </li>
      ))}

      {EDUCATION.map((ed, i) => (
        <li key={ed.title} className="grid md:grid-cols-[200px_1fr] md:gap-x-10">
          <p className={`${dateCls} hidden pt-5 text-right md:block`}>{ed.date}</p>
          {/* The line stops at the last entry. */}
          <div className={`relative pl-7 md:pl-10 ${i < EDUCATION.length - 1 ? "border-l-2 border-ink pb-6" : "border-l-2 border-transparent"}`}>
            <span className="absolute top-0 -left-[2px] h-6 w-[2px] bg-ink" aria-hidden="true" />
            <span className="absolute top-4 -left-[11px] size-5 border-2 border-ink bg-sky" aria-hidden="true" />
            <div className="flex items-center gap-4 border-2 border-ink bg-white px-5 py-4 shadow-[6px_6px_0_var(--color-ink)]">
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
        </li>
      ))}
    </ol>
  );
}
