import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { Toaster } from "@/components/ui/sonner"
import Script from "next/script"
import GAListener from "@/components/ga-listener"

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

const SITE_URL = "https://faheem506pk.vercel.app"
const PROFILE_IMAGE = `${SITE_URL}/assets/images/faheem506pk.jpeg`

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Muhammad Faheem Iqbal — Software Engineer & Frontend Developer | Pakistan",
    template: "%s | Faheem506pk"
  },
  description: "Muhammad Faheem Iqbal (Faheem Awan / faheem506pk) — Software Engineer & Frontend Developer from Islamabad, Pakistan. Expert in React.js, Next.js, TypeScript. Available for freelance & full-time. Based in Chakwal / Islamabad. Affordable web development services in Pakistan.",
  keywords: [
    "Muhammad Faheem Iqbal", "Faheem Iqbal", "Faheem Awan", "faheem506pk", "Faheem developer",
    "software engineer Pakistan", "frontend developer Pakistan", "web developer Pakistan",
    "React developer Pakistan", "Next.js developer Pakistan", "TypeScript developer",
    "developer Islamabad", "developer Chakwal", "software engineer Islamabad",
    "web developer Islamabad Pakistan", "frontend developer Islamabad",
    "dev in Pakistan", "best developer Pakistan", "affordable developer Pakistan",
    "cheap price developer", "freelance developer Pakistan", "hire developer Pakistan",
    "React.js developer", "Next.js developer", "JavaScript developer Pakistan",
    "WordPress developer Pakistan", "full stack developer Pakistan",
    "Faheem Iqbal portfolio", "faheem506pk portfolio", "Faheem software engineer",
    "Pakistani developer", "Pakistan web development", "Islamabad IT professional",
    "Chakwal developer", "Punjab developer", "Pakistan tech talent",
    "remote developer Pakistan", "freelancer Pakistan", "Faheem Iqbal Awan",
    "Muhammad Faheem", "Faheem developer portfolio"
  ],
  authors: [{ name: "Muhammad Faheem Iqbal", url: SITE_URL }],
  creator: "Muhammad Faheem Iqbal",
  publisher: "Muhammad Faheem Iqbal",
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
    title: "Muhammad Faheem Iqbal — Software Engineer & Frontend Developer",
    description: "Software Engineer from Islamabad, Pakistan. Expert in React.js, Next.js, TypeScript. Building modern web applications. Available for freelance & hire.",
    images: [
      {
        url: PROFILE_IMAGE,
        width: 800,
        height: 800,
        alt: "Muhammad Faheem Iqbal — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Faheem Iqbal — Software Engineer | faheem506pk",
    description: "Frontend Developer from Islamabad, Pakistan. React.js, Next.js, TypeScript expert. Open for opportunities.",
    images: [PROFILE_IMAGE],
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
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  category: "technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${outfit.variable} ${fraunces.variable} antialiased body min-h-screen flex flex-col`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-1 w-full flex flex-col items-center">
              {children}
            </main>
            <Toaster />
            <GAListener />
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-GEP8VCBFXE"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-GEP8VCBFXE');
              `}
            </Script>
            <Footer />
          </ThemeProvider>
      </body>
    </html>
  );
}
