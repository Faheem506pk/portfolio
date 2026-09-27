"use client"

import { motion } from "framer-motion"
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siNodedotjs,
  siPython,
  siTailwindcss,
  siPostgresql,
  siSupabase,
  siFirebase,
  siGit,
  siFigma,
} from "simple-icons"

// Official brand marks and colours from simple-icons. Next.js and Git are near-black
// in their brand specs, so they carry an explicit light value for the dark theme.
const TECHS = [
  { icon: siReact, name: "React" },
  { icon: siNextdotjs, name: "Next.js", darkHex: "FFFFFF" },
  { icon: siTypescript, name: "TypeScript" },
  { icon: siJavascript, name: "JavaScript" },
  { icon: siNodedotjs, name: "Node.js" },
  { icon: siPython, name: "Python" },
  { icon: siTailwindcss, name: "Tailwind" },
  { icon: siPostgresql, name: "PostgreSQL" },
  { icon: siSupabase, name: "Supabase" },
  { icon: siFirebase, name: "Firebase" },
  { icon: siGit, name: "Git" },
  { icon: siFigma, name: "Figma" },
]

function TechLogo({ tech }) {
  return (
    <div className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 depth-rest hover:depth-lift">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-9 w-9 shrink-0 fill-[color:var(--logo)] dark:fill-[color:var(--logo-dark)]"
        style={{
          "--logo": `#${tech.icon.hex}`,
          "--logo-dark": `#${tech.darkHex || tech.icon.hex}`,
        }}
      >
        <path d={tech.icon.path} />
      </svg>
      <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        {tech.name}
      </span>
    </div>
  )
}

export function TechStack() {
  return (
    <section className="container py-20 md:py-28">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Stack</p>
        <h2 className="sign mt-3 text-3xl md:text-4xl">Technologies I build with</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          The tools I reach for in production, across the front end, the back end and
          everything that ships them.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {TECHS.map((tech) => (
          <TechLogo key={tech.name} tech={tech} />
        ))}
      </motion.div>
    </section>
  )
}

export default TechStack
