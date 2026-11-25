"use client";

import "./admin.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SessionGuard } from "@/components/admin/session-guard";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/mfiadmin/login";
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div className="wp-admin min-h-screen">
      {!isLoginPage && <SessionGuard />}
      {!isLoginPage && <AdminBar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />}
      {!isLoginPage && <AdminSidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />}
      {menuOpen && !isLoginPage && <div className="wp-menu-scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <main className={`wp-content ${isLoginPage ? "wp-login" : ""}`}>
        <div className="wp-wrap">{children}</div>
      </main>
    </div>
  );
}
