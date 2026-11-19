import type { MetadataRoute } from "next";
import { COLORS, PERSON } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PERSON.fullName} Portfolio`,
    short_name: PERSON.fullName,
    description: PERSON.seoDescription,
    start_url: "/",
    display: "standalone",
    background_color: COLORS.paper,
    theme_color: COLORS.paper,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
