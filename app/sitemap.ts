import type { MetadataRoute } from "next";
import { PERSON, SITE_URL } from "@/config/site";

/** Cached, so lastModified is the build time and the sitemap stays static. */
async function buildTime() {
  "use cache";
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: SITE_URL,
      lastModified: await buildTime(),
      changeFrequency: "monthly",
      priority: 1,
      images: [new URL(PERSON.avatar, SITE_URL).toString()],
    },
  ];
}
