"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/mfiadmin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={`flex-1 w-full flex flex-col items-center min-h-screen overflow-hidden`}>
        {children}
      </main>
    </>
  );
}
