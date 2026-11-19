/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT ME. Everything personal on the site comes from here.
 *  Strings that start with "[FILL IN" are rendered with a dashed
 *  highlight so you can spot what still needs real content.
 * ─────────────────────────────────────────────────────────────
 */

/** Production URL, used for canonical links and Open Graph. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://manoj-portfolio-8qzy.vercel.app";

/** Letters in the hero. A space starts a new line. */
export const NAME = "MANOJ HEGDE";

export const PERSON = {
  fullName: "Manoj Hegde",
  role: "Full-stack developer",
  location: "Bengaluru",
  years: "3",
  tagline: "Full-stack dev · Next.js · NestJS · MongoDB",
  summary:
    "Full-stack developer with 3 years of experience building scalable web applications with Next.js, NestJS, React, Node.js, TypeScript and MongoDB. I design RESTful APIs, database schemas, role-based access control and optimized frontends, and deliver production systems from development to cloud deployment.",
  /** Search-result snippet. Keep it around 150 characters. */
  seoDescription:
    "Full-stack developer in Bengaluru with 3 years building scalable web apps in Next.js, NestJS, React, Node.js and MongoDB. Projects, experience and contact.",
  /** Shown in search results and link previews. Served from /public. */
  avatar: "/avatar-512.png",
  education: "MS Ramaiah University of Applied Sciences",
  email: "manojhegde2001@gmail.com",
  github: "https://github.com/manojhegde2001",
  linkedin: "https://www.linkedin.com/in/manoj-hegde-dev",
  instagram: "https://www.instagram.com/__its_manoj____/",
  resume: "https://drive.google.com/file/d/1BJUfBodWE-f1FB9m9I2QiTxa9tS0C_NU/view",
} as const;

/** Skill pills that rain into the hero. Order matters: phones show only the first `MOBILE_SKILL_COUNT`. */
export const SKILLS: readonly string[] = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "NestJS",
  "Express",
  "MongoDB",
  "Redux",
  "Tailwind",
  "AWS",
  "GCP",
  "Firebase",
  "Jest",
  "Git",
];
export const MOBILE_SKILL_COUNT = 8;

/** Brand palette. Also mirrored as CSS tokens in app/globals.css. */
export const COLORS = {
  paper: "#f1ece1",
  ink: "#121212",
  lime: "#d4ff3f",
  coral: "#ff6b4a",
  sky: "#7fb4ff",
  sun: "#ffd23f",
} as const;

/** Pill backgrounds cycle through these. */
export const PILL_COLORS: readonly string[] = [
  COLORS.lime,
  COLORS.coral,
  COLORS.sky,
  COLORS.sun,
  "#ffffff",
  COLORS.ink,
];

/** A loose letter picks one of these. */
export const LETTER_COLORS: readonly string[] = ["#ff4d2e", "#2f5bff", "#0f9d58", "#9b5de5"];

export interface Project {
  title: string;
  /** One or two lines: what it is and how it was built. */
  problem: string;
  /** Square logo mark in /public, shown beside the title. */
  logo?: string;
  tags: readonly string[];
  link?: string;
  /** Card header colour. */
  accent: string;
}

export const PROJECTS: readonly Project[] = [
  {
    title: "Vrutta",
    problem:
      "A professional networking platform for people and businesses, built end to end with secure JWT authentication, scalable REST APIs and optimized database queries for faster API responses.",
    logo: "/projects/vrutta.svg",
    tags: ["Next.js", "Node.js", "Express.js", "MongoDB", "AWS"],
    link: "https://vrutta.net",
    accent: COLORS.lime,
  },
  {
    title: "Vartula",
    problem:
      "Free, private tools that run entirely in the browser: SVG animation, charts, image conversion, PDFs, test data and bookkeeping.",
    logo: "/projects/vartula.svg",
    tags: ["Next.js", "React 19", "TypeScript", "Tailwind", "Playwright", "Vercel"],
    link: "https://www.vartula.net",
    accent: COLORS.sky,
  },
  {
    title: "Online Mandi",
    problem:
      "A full-stack real-time marketplace for farmers and vendors, using Next.js server-side rendering for SEO, scalable cloud backend services and WebSockets to reduce data latency.",
    logo: "/projects/online-mandi.svg",
    tags: ["Next.js", "Firebase", "Node.js", "GCP", "WebSockets"],
    link: "https://onlinemandi.in/",
    accent: COLORS.coral,
  },
  {
    title: "Surya Transport",
    problem:
      "A freelance website for a logistics company serving automotive manufacturers across India, with service and facility pages, a client showcase, video content managed from Google Sheets, and an enquiry form.",
    logo: "/projects/surya-transport.svg",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind", "Google Sheets", "Framer Motion"],
    link: "https://www.suryatransport.in/",
    accent: COLORS.sky,
  },
  {
    title: "Sanatanadhara",
    problem:
      "A freelance website for an online Sanskrit and Kannada coaching service, offering personalized one-on-one classes for CBSE and State Board students and adults.",
    logo: "/projects/sanskrit-coaching.png",
    tags: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "RizzUI", "Vercel"],
    link: "https://www.sanatanadhara.in/",
    accent: COLORS.lime,
  },
  {
    title: "KMB Associates",
    problem:
      "A freelance website for a Bengaluru loan and finance consultancy, presenting home, mortgage, business and MSME loan services with scroll-triggered animations.",
    logo: "/projects/kmb-associates.png",
    tags: ["Next.js 16", "React 19", "JavaScript", "Tailwind", "Vercel"],
    link: "https://www.kmbassociates.in/",
    accent: COLORS.coral,
  },
  {
    title: "Terminal Portfolio",
    problem: "A portfolio you explore by typing CLI commands to see projects, skills and experience.",
    logo: "/projects/terminal-portfolio.svg",
    tags: ["React", "Next.js", "Terminal UI", "Vercel"],
    link: "https://terminal-portfolio-green-nu.vercel.app/",
    accent: COLORS.sun,
  },
];

export interface Job {
  role: string;
  company: string;
  location?: string;
  date: string;
  /** True for the job you hold now: it gets the pulsing marker and a "Now" tag. */
  current?: boolean;
  points: readonly string[];
  /** Main tech used there, shown as chips. */
  stack?: readonly string[];
}

export const EXPERIENCE: readonly Job[] = [
  {
    role: "Full Stack Developer",
    company: "Mistura Software Technologies",
    location: "Bengaluru",
    date: "Jul 2026 – Present",
    current: true,
    points: [
      "Develop full-stack features for the Ifric platform using Next.js on the frontend and NestJS on the backend.",
      "Build and maintain the Digital Passport product using Next.js and NestJS.",
      "Contribute across the stack on both projects, from frontend UI to backend APIs.",
    ],
    stack: ["Next.js", "NestJS", "TypeScript"],
  },
  {
    role: "Full Stack Developer",
    company: "Invenzo Labs",
    location: "Bengaluru",
    date: "Aug 2023 – Jun 2026",
    points: [
      "Architected and delivered end-to-end features for the TechNova HRMS using the MERN stack, with secure, scalable Node.js and MongoDB APIs and efficient schema design for payroll, attendance and performance modules.",
      "Optimized full-stack performance for the Lulu Hypermarket e-commerce platform with frontend lazy loading and streamlined API data fetching.",
      "Developed a centralized state management system and a reusable UI component library alongside scalable backend architectures.",
      "Built secure role-based access control (RBAC) and responsive dashboards for the Healing Pharma system, integrating third-party services with asynchronous client-server data flows.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Redux", "AWS"],
  },
];

export interface Study {
  title: string;
  school: string;
  date: string;
  /** Square logo in /public. */
  logo?: string;
}

/** Shown at the end of the experience timeline. */
export const EDUCATION: readonly Study[] = [
  {
    title: "B.Tech, Computer Science",
    school: "MS Ramaiah University of Applied Sciences",
    date: "2023",
    logo: "/education/ramaiah.png",
  },
];

/**
 * Numbers in the About section. These are written by hand (not counted from the lists above),
 * because they include work that isn't shown on the site.
 */
export const STATS: readonly { value: string; label: string }[] = [
  { value: "3+", label: "Years building" },
  { value: "10+", label: "Projects shipped" },
  { value: "5+", label: "Freelance sites" },
  { value: "2", label: "Companies" },
];

export interface Focus {
  title: string;
  blurb: string;
  /** Skill names; ones listed in lib/skill-icons.ts get a logo. */
  skills: readonly string[];
  color: string;
}

/** "What I do" cards in the About section. */
export const FOCUS: readonly Focus[] = [
  {
    title: "Frontend",
    blurb: "Fast, responsive interfaces with server-side rendering, reusable components and clean state management.",
    skills: ["React", "Next.js", "TypeScript", "Redux", "Tailwind"],
    color: COLORS.lime,
  },
  {
    title: "Backend",
    blurb: "REST APIs, database schemas, JWT auth and role-based access control that hold up in production.",
    skills: ["Node.js", "NestJS", "Express", "MongoDB", "Jest"],
    color: COLORS.sky,
  },
  {
    title: "Data & Cloud",
    blurb: "Shipping from development to deployment on AWS, GCP and Vercel, with Firebase for real-time apps.",
    skills: ["AWS", "GCP", "Firebase", "Git"],
    color: COLORS.sun,
  },
];

/** Contact section intro. */
export const CONTACT_NOTE = "Have a project, a role, or just a question? My inbox is open.";

export const isPlaceholder = (s: string) => s.startsWith("[FILL IN");
