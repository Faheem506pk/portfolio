"use client"

import * as React from "react"
import { 
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, 
  SiNodedotjs, SiHtml5, SiCss3, SiPython, SiPhp, SiMysql, 
  SiFirebase, SiMongodb, SiGit, SiFigma, SiWordpress 
} from "react-icons/si"

const techs = [
  { name: "React", icon: SiReact, color: "text-cyan-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-foreground" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "JavaScript", icon: SiJavascript, color: "text-yellow-400" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-300" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
  { name: "HTML5", icon: SiHtml5, color: "text-orange-500" },
  { name: "CSS3", icon: SiCss3, color: "text-blue-400" },
  { name: "Python", icon: SiPython, color: "text-blue-300" },
  { name: "PHP", icon: SiPhp, color: "text-indigo-400" },
  { name: "MySQL", icon: SiMysql, color: "text-blue-600" },
  { name: "Firebase", icon: SiFirebase, color: "text-yellow-500" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-400" },
  { name: "Git", icon: SiGit, color: "text-orange-600" },
  { name: "Figma", icon: SiFigma, color: "text-pink-500" },
  { name: "WordPress", icon: SiWordpress, color: "text-blue-700" },
]

export function TechMarquee() {
  return (
    <section className="w-full py-12 bg-background/50 border-y border-border/40 overflow-hidden">
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex gap-12 sm:gap-24 items-center group-hover:[animation-play-state:paused]">
          {techs.map((tech, index) => (
            <div key={index} className="flex flex-col items-center gap-2 group/icon cursor-pointer">
              <tech.icon className={`w-8 h-8 sm:w-12 sm:h-12 ${tech.color} opacity-70 grayscale transition-all duration-300 group-hover/icon:grayscale-0 group-hover/icon:opacity-100 group-hover/icon:scale-110`} />
              <span className="text-xs sm:text-sm font-mono text-muted-foreground opacity-0 group-hover/icon:opacity-100 transition-opacity">{tech.name}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {techs.map((tech, index) => (
            <div key={`dup-${index}`} className="flex flex-col items-center gap-2 group/icon cursor-pointer">
              <tech.icon className={`w-8 h-8 sm:w-12 sm:h-12 ${tech.color} opacity-70 grayscale transition-all duration-300 group-hover/icon:grayscale-0 group-hover/icon:opacity-100 group-hover/icon:scale-110`} />
              <span className="text-xs sm:text-sm font-mono text-muted-foreground opacity-0 group-hover/icon:opacity-100 transition-opacity">{tech.name}</span>
            </div>
          ))}
        </div>

        <div className="absolute top-0 right-0 w-8 sm:w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-8 sm:w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  )
}
