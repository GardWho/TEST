import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  keywords?: string;
  noindex?: boolean;
};

const SITE_URL = "https://rg-equitation-education-equine.fr";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/acceuil/acceuil3.jpg`;

export function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  keywords,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    // 1. Titre
    document.title = title;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // 3. Meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // 4. Robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute("content", noindex ? "noindex, nofollow" : "index, follow");

    // 5. Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonical);

    // 6. Open Graph
    const ogTags = [
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:image", content: ogImage },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "RG Équitation & Éducation Équine" },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // 7. Twitter Card
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });
  }, [title, description, canonical, ogImage, keywords, noindex]);

  return null;
}

// ─────────────────────────────────────────────────────────────
// Données structurées JSON-LD (LocalBusiness) — À appeler une fois
// ─────────────────────────────────────────────────────────────
export function LocalBusinessSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "RG Équitation & Éducation Équine",
      image: `${SITE_URL}/images/logo-fnoir.png`,
      logo: `${SITE_URL}/images/logo-fnoir.png`,
      url: SITE_URL,
      telephone: "+33652053778",
      email: "contact@rg-equitation-education-equine.fr",
      address: {
        "@type": "PostalAddress",
        streetAddress: "24 rue Minvielle",
        addressLocality: "Bordeaux",
        postalCode: "33000",
        addressRegion: "Gironde",
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 44.837789,
        longitude: -0.57918,
      },
      priceRange: "25€ - 800€",
      areaServed: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 44.837789,
          longitude: -0.57918,
        },
        geoRadius: "50000",
      },
      description:
        "Monitrice d'équitation diplômée d'État à Bordeaux. Cours particuliers et collectifs, travail du cheval, rééducation, débourrage & éducation.",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "09:00",
          closes: "19:00",
        },
      ],
      sameAs: ["https://www.instagram.com/rgequitationeducationequine"],
    };

    let script = document.querySelector("#local-business-schema");
    if (!script) {
      script = document.createElement("script");
      script.id = "local-business-schema";
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, []);

  return null;
}