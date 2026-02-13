"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

const navItems = [
  { name: "Home", href: "/#home" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#portfolio" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState("")

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => sections.forEach((section) => observer.unobserve(section))
  }, []) // Remove pathname dependency effectively by empty array, layout wrapper handles path change remount if needed? Actually path changes shouldn't unmount navbar if it's in layout.


  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="font-serif text-xl font-bold tracking-tight text-charcoal-blue dark:text-verdigris">
            Faheem506pk<span className="text-burnt-peach">.dev</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80 text-foreground/60 relative group",
                pathname === "/"
                  ? (activeSection === item.href.substring(item.href.indexOf('#')) || (item.name === "Home" && !activeSection) ? "text-foreground font-semibold" : "")
                  : (pathname === item.href ? "text-foreground font-semibold" : "")
              )}
            >
              {item.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-full h-[2px] bg-sandy-brown scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                pathname === "/"
                  ? (activeSection === item.href.substring(item.href.indexOf('#')) || (item.name === "Home" && !activeSection) ? "scale-x-100 bg-tuscan-sun" : "")
                  : (pathname === item.href ? "scale-x-100 bg-tuscan-sun" : "")
              )} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-transparent">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-2 border-charcoal-blue dark:border-verdigris">
              <SheetHeader>
                <SheetTitle className="font-serif text-left text-2xl font-bold text-charcoal-blue dark:text-verdigris">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-all hover:translate-x-2",
                      pathname === item.href
                        ? "text-burnt-peach font-bold translate-x-2"
                        : "text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
