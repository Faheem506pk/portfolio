"use client"

export function JsonLd({ profile }) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://faheem506pk.vercel.app/#person",
    name: profile?.name || "Muhammad Faheem Iqbal",
    alternateName: ["Faheem Iqbal", "Faheem Awan", "faheem506pk", "Muhammad Faheem", "Faheem Iqbal Awan"],
    givenName: "Muhammad Faheem",
    familyName: "Iqbal",
    jobTitle: profile?.role || "Software Engineer",
    description: profile?.summary || "Software Engineer & Frontend Developer from Islamabad, Pakistan. Expert in React.js, Next.js, TypeScript, and modern web technologies.",
    url: "https://faheem506pk.vercel.app",
    image: profile?.image_url || "https://faheem506pk.vercel.app/assets/images/faheem506pk.jpeg",
    email: profile?.email || "faheemiqbalm@gmail.com",
    telephone: "+92-332-5194976",
    nationality: {
      "@type": "Country",
      name: "Pakistan"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Islamabad",
      addressRegion: "Islamabad Capital Territory",
      addressCountry: "PK"
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Chakwal",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chakwal",
        addressRegion: "Punjab",
        addressCountry: "PK"
      }
    },
    knowsAbout: [
      "React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3",
      "Node.js", "WordPress", "Tailwind CSS", "Ant Design", "Material UI",
      "Firebase", "MongoDB", "REST APIs", "SEO", "Web Development",
      "Frontend Development", "Responsive Design", "Figma", "Git"
    ],
    worksFor: {
      "@type": "Organization",
      name: "MicroMerger Pvt Ltd",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Islamabad",
        addressCountry: "PK"
      }
    },
    sameAs: [
      profile?.social_linkedin || "https://www.linkedin.com/in/faheem506pk/",
      profile?.social_github || "https://github.com/faheem506pk",
      profile?.social_portfolio || "https://faheem506pk.vercel.app"
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://faheem506pk.vercel.app/#website",
    url: "https://faheem506pk.vercel.app",
    name: `${profile?.name || "Faheem506pk"} — Developer Portfolio`,
    description: profile?.summary || "Portfolio of Muhammad Faheem Iqbal, Software Engineer & Frontend Developer from Pakistan",
    publisher: { "@id": "https://faheem506pk.vercel.app/#person" },
    inLanguage: "en-US"
  }

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://faheem506pk.vercel.app/#profilepage",
    url: "https://faheem506pk.vercel.app",
    name: `${profile?.name || "Muhammad Faheem Iqbal"} — Portfolio`,
    mainEntity: { "@id": "https://faheem506pk.vercel.app/#person" },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://faheem506pk.vercel.app" },
        { "@type": "ListItem", position: 2, name: "Skills", item: "https://faheem506pk.vercel.app/#skills" },
        { "@type": "ListItem", position: 3, name: "Experience", item: "https://faheem506pk.vercel.app/#experience" },
        { "@type": "ListItem", position: 4, name: "Projects", item: "https://faheem506pk.vercel.app/#portfolio" },
        { "@type": "ListItem", position: 5, name: "Contact", item: "https://faheem506pk.vercel.app/#contact" }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  )
}
