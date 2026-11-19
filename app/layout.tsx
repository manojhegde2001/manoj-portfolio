import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { PERSON, SITE_URL, SKILLS } from "@/config/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-jetbrains",
  display: "swap",
});

const title = `${PERSON.fullName} · ${PERSON.role} in ${PERSON.location}`;
const description = PERSON.seoDescription;
const [firstName, ...rest] = PERSON.fullName.split(" ");
const githubUser = new URL(PERSON.github).pathname.replace(/\//g, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${PERSON.fullName}` },
  description,
  applicationName: `${PERSON.fullName} Portfolio`,
  keywords: [
    ...new Set([
      PERSON.fullName,
      `${PERSON.fullName} portfolio`,
      "full stack developer",
      `full stack developer ${PERSON.location}`,
      "Next.js developer",
      "NestJS developer",
      "React developer",
      "Node.js developer",
      "MERN stack developer",
      ...SKILLS,
    ]),
  ],
  authors: [{ name: PERSON.fullName, url: SITE_URL }],
  creator: PERSON.fullName,
  publisher: PERSON.fullName,
  category: "technology",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    firstName,
    lastName: rest.join(" "),
    username: githubUser,
    url: "/",
    title,
    description,
    siteName: `${PERSON.fullName} Portfolio`,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f1ece1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
