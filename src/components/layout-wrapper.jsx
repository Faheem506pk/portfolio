"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/mfiadmin");

  // The admin has its own shell (top bar and menu). It needs the full width and normal scrolling, so sticky
  // headers inside it work; the public layout centers content and clips overflow.
  if (isAdmin) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className={`flex-1 w-full flex flex-col items-center min-h-screen overflow-hidden`}>
        {children}
      </main>
    </>
  );
}
