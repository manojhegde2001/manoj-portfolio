import Image from "next/image";
import type { Project } from "@/config/site";
import { DropIn } from "./DropIn";

const linkBtn =
  "inline-flex items-center gap-1 border-2 border-ink bg-white px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.03em] shadow-[0_3px_0_var(--color-ink)] hover:bg-lime focus-visible:bg-lime";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { title, problem, logo, tags, link, accent } = project;
  return (
    <DropIn
      index={index}
      className="card mb-8 flex break-inside-avoid flex-col border-2 border-ink bg-white shadow-[7px_7px_0_var(--color-ink)]"
    >
      <div className="h-3 border-b-2 border-ink sm:h-5" style={{ background: accent }} aria-hidden="true" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-3">
          {logo && (
            <Image src={logo} alt="" width={44} height={44} unoptimized={logo.endsWith(".svg")} className="size-11 shrink-0 object-contain" />
          )}
          <h3 className="text-[1.6rem] leading-tight font-extrabold tracking-[-0.02em]">{title}</h3>
        </div>
        <p className="mt-2 leading-relaxed text-muted">{problem}</p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${title} tech stack`}>
          {tags.map((tag) => (
            <li key={tag} className="rounded-full border-[1.5px] border-ink px-2.5 py-0.5 font-mono text-[0.68rem]">
              {tag}
            </li>
          ))}
        </ul>

        {link && (
          <div className="flex flex-wrap gap-3 pt-5">
            <a className={linkBtn} href={link} target="_blank" rel="noopener noreferrer">
              Live ↗<span className="sr-only">: {title} (opens in a new tab)</span>
            </a>
          </div>
        )}
      </div>
    </DropIn>
  );
}
