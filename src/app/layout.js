import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutWrapper from "@/components/layout-wrapper";
import { JsonLd } from "@/components/json-ld";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import GAListener from "@/components/ga-listener";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://faheem506pk.vercel.app";
const PROFILE_IMAGE = `${SITE_URL}/assets/images/faheem506pk.jpeg`;

// Initialize Supabase Client for Server Side
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function getProfile() {
  try {
    const { data } = await supabase.from("profiles").select("*").single();
    return data;
  } catch (error) {
    console.error("Error fetching profile for SEO:", error);
    return null;
  }
}

export async function generateMetadata() {
  const profile = await getProfile();

  const title = profile?.name
    ? `${profile.name} — ${profile.role || "Software Engineer"}`
    : "Muhammad Faheem Iqbal — Software Engineer & Frontend Developer | Pakistan";

  const description =
    profile?.summary ||
    "Muhammad Faheem Iqbal (Faheem Awan / faheem506pk) — Software Engineer & Frontend Developer from Islamabad, Pakistan. Expert in React.js, Next.js, TypeScript. Available for freelance & full-time.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Faheem506pk",
    },
    description: description,
    keywords: [
      profile?.name || "Muhammad Faheem Iqbal",
      "Faheem Iqbal",
      "Faheem Awan",
      "faheem506pk",
      "Faheem developer",
      "software engineer Pakistan",
      "frontend developer Pakistan",
      "web developer Pakistan",
      "React developer Pakistan",
      "Next.js developer Pakistan",
      "TypeScript developer",
      "developer Islamabad",
      "developer Chakwal",
      "software engineer Islamabad",
      "web developer Islamabad Pakistan",
      "frontend developer Islamabad",
      "dev in Pakistan",
      "best developer Pakistan",
      "affordable developer Pakistan",
      "cheap price developer",
      "freelance developer Pakistan",
      "hire developer Pakistan",
      "React.js developer",
      "Next.js developer",
      "JavaScript developer Pakistan",
      "WordPress developer Pakistan",
      "full stack developer Pakistan",
      "Faheem Iqbal portfolio",
      "faheem506pk portfolio",
      "Faheem software engineer",
      "Pakistani developer",
      "Pakistan web development",
      "Islamabad IT professional",
      "Chakwal developer",
      "Punjab developer",
      "Pakistan tech talent",
      "remote developer Pakistan",
      "freelancer Pakistan",
      "Faheem Iqbal Awan",
      "Muhammad Faheem",
      "Faheem developer portfolio",
    ],
    authors: [{ name: profile?.name || "Muhammad Faheem Iqbal", url: SITE_URL }],
    creator: profile?.name || "Muhammad Faheem Iqbal",
    publisher: profile?.name || "Muhammad Faheem Iqbal",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: "Faheem506pk — Developer Portfolio",
      title: title,
      description: description,
      images: [
        {
          url: profile?.image_url || PROFILE_IMAGE,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | faheem506pk`,
      description: description,
      images: [profile?.image_url || PROFILE_IMAGE],
      creator: "@faheem506pk",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.json",
    category: "technology",
    verification: {
      google: "qbMsQzOQKZKjywbEcIagz9r8ciijbgo3W4MuxJDI-uo",
    },
  };
}

export default async function RootLayout({ children }) {
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd profile={profile} />
      </head>
      <body className={`${outfit.variable} ${fraunces.variable} antialiased body min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
          <GAListener />
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-GEP8VCBFXE" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-GEP8VCBFXE');
              `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  );
}
