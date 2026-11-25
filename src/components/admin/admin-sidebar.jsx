"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FolderGit2,
  GraduationCap,
  Gauge,
  MessageSquare,
  Newspaper,
  PenLine,
  Settings,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";

const menuGroups = [
  {
    items: [{ title: "Dashboard", href: "/mfiadmin", icon: Gauge }],
  },
  {
    label: "Content",
    items: [
      { title: "Content Studio", href: "/mfiadmin/stories", icon: Newspaper },
      { title: "Posts", href: "/mfiadmin/blog", icon: PenLine },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { title: "Projects", href: "/mfiadmin/projects", icon: FolderGit2 },
      { title: "Experience", href: "/mfiadmin/experience", icon: Briefcase },
      { title: "Education", href: "/mfiadmin/education", icon: GraduationCap },
      { title: "Skills", href: "/mfiadmin/skills", icon: Wrench },
      { title: "Achievements", href: "/mfiadmin/achievements", icon: Trophy },
    ],
  },
  {
    label: "Inbox",
    items: [{ title: "Messages", href: "/mfiadmin/messages", icon: MessageSquare }],
  },
  {
    label: "System",
    items: [
      { title: "Users", href: "/mfiadmin/users", icon: Users },
      { title: "Settings", href: "/mfiadmin/profile", icon: Settings },
    ],
  },
];

// Nested routes (for example /mfiadmin/blog/12) keep their parent highlighted; the dashboard matches exactly.
function isActive(pathname, href) {
  return href === "/mfiadmin" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

export function AdminSidebar({ open, onNavigate }) {
  const pathname = usePathname();

  return (
    <nav id="wp-admin-menu" className="wp-menu" data-open={open ? "true" : "false"} aria-label="Admin menu">
      {menuGroups.map((group, i) => (
        <ul key={i} className="wp-menu-group">
          {group.label && (
            <li className="wp-menu-label" aria-hidden="true">
              {group.label}
            </li>
          )}
          {group.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                <item.icon aria-hidden="true" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
}
