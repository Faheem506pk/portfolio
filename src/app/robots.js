export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/mfiadmin/",
    },
    sitemap: "https://faheem506pk.vercel.app/sitemap.xml",
  };
}
