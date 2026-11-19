import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { PERSON, SITE_URL } from "@/config/site";
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

const title = `${PERSON.fullName}, ${PERSON.role}`;
const description = `${PERSON.fullName} is a ${PERSON.role.toLowerCase()} in ${PERSON.location} with ${PERSON.years} years building React, Next.js and Node.js products. Grab a letter and throw it.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  authors: [{ name: PERSON.fullName, url: PERSON.github }],
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: PERSON.fullName,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#f1ece1",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
