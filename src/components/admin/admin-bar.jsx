"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ChevronDown, LogOut, Menu, Monitor, Moon, Plus, Sun, User } from "lucide-react"

import { supabase } from "@/lib/supabase"

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

// Close an open <details> menu when the user clicks away or picks something.
function useDismissDetails() {
  useEffect(() => {
    const close = (event) => {
      document.querySelectorAll(".wp-adminbar details[open]").forEach((d) => {
        if (!d.contains(event.target) || event.target.closest(".wp-dropdown a, .wp-dropdown button")) d.removeAttribute("open")
      })
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])
}

export function AdminBar({ onToggleMenu, menuOpen }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  // True after hydration, so the saved theme is only shown once it is known on the client.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  const [user, setUser] = useState(null)
  useDismissDetails()

  useEffect(() => {
    supabase?.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
  }, [])

  const name = user?.user_metadata?.username || user?.email?.split("@")[0] || "Admin"
  const active = THEMES.find((t) => t.value === (mounted ? theme : "system")) || THEMES[2]
  const ActiveIcon = active.icon

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/mfiadmin/login")
  }

  return (
    <header className="wp-adminbar" role="banner">
      <button
        type="button"
        className="wp-menu-toggle"
        onClick={onToggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="wp-admin-menu"
      >
        <Menu size={18} />
      </button>

      <Link href="/" target="_blank" rel="noreferrer" aria-label="Visit the public site" className="wp-brand">
        <span className="wp-brand-mark" aria-hidden="true">F</span>
        <span className="wp-hide-sm">Faheem506pk</span>
      </Link>

      <details>
        <summary className="wp-new" aria-label="Add new">
          <Plus size={16} />
          <span>New</span>
        </summary>
        <div className="wp-dropdown">
          <Link href="/mfiadmin/blog?new=1">Blog post</Link>
          <Link href="/mfiadmin/stories">Story from an idea</Link>
          <Link href="/mfiadmin/experience">Experience</Link>
          <Link href="/mfiadmin/skills">Skill</Link>
        </div>
      </details>

      <span className="wp-adminbar-spacer" />

      <details>
        <summary aria-label={`Theme: ${active.label}`}>
          <ActiveIcon size={16} />
          <span className="wp-hide-sm">{active.label}</span>
        </summary>
        <div className="wp-dropdown right">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button key={value} type="button" onClick={() => setTheme(value)} aria-pressed={mounted && theme === value}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </details>

      <details>
        <summary>
          <User size={16} />
          <span className="wp-hide-sm">{name}</span>
          <ChevronDown size={14} />
        </summary>
        <div className="wp-dropdown right">
          <Link href="/mfiadmin/profile">
            <User size={16} />
            Edit profile
          </Link>
          <button type="button" onClick={signOut}>
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </details>
    </header>
  )
}
