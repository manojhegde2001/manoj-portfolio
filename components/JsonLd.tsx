import { EXPERIENCE, PERSON, PROJECTS, SITE_URL, SKILLS } from "@/config/site";

/**
 * Structured data (schema.org) so search engines and AI crawlers understand who this
 * site is about: a Person, the WebSite, the profile page, and the projects.
 */
export function JsonLd() {
  const personId = `${SITE_URL}/#person`;
  const current = EXPERIENCE[0];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: PERSON.fullName,
        url: SITE_URL,
        image: new URL(PERSON.avatar, SITE_URL).toString(),
        jobTitle: PERSON.role,
        description: PERSON.summary,
        email: `mailto:${PERSON.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: PERSON.location,
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
        ...(current && { worksFor: { "@type": "Organization", name: current.company } }),
        alumniOf: { "@type": "CollegeOrUniversity", name: PERSON.education },
        knowsAbout: [...SKILLS],
        sameAs: [PERSON.github, PERSON.linkedin, PERSON.instagram],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${PERSON.fullName} Portfolio`,
        inLanguage: "en-IN",
        author: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: `${PERSON.fullName}, ${PERSON.role}`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#projects`,
        name: "Selected projects",
        itemListElement: PROJECTS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.title,
            description: p.problem,
            ...(p.link && { url: p.link }),
            keywords: p.tags.join(", "),
            creator: { "@id": personId },
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so no string in the data can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
