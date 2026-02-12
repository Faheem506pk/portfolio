import { ClerkProvider } from "@clerk/nextjs";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portfolio",
  description: "My Retro Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
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
              <Footer />
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
