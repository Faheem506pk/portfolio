"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Trophy, Video, Newspaper, ExternalLink, Award, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const getIcon = (type) => {
  switch (type) {
    case "youtube": return <Video className="h-4 w-4" />
    case "article": return <Newspaper className="h-4 w-4" />
    case "news": return <Newspaper className="h-4 w-4" />
    case "award": return <Award className="h-4 w-4" />
    default: return <Trophy className="h-4 w-4" />
  }
}

const getTypeColor = (type) => {
  switch (type) {
    case "youtube": return "bg-red-500/10 text-red-400 border-red-500/20"
    case "article": return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "news": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    case "award": return "bg-tuscan-sun/10 text-tuscan-sun border-tuscan-sun/20"
    default: return "bg-verdigris/10 text-verdigris border-verdigris/20"
  }
}

export function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const { data, error } = await supabase
          .from("achievements")
          .select("*")
          .order("date", { ascending: false })

        if (data && data.length > 0) setAchievements(data)
      } catch (err) {
        console.error("Error loading achievements:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAchievements()
  }, [])

  // Don't render the section at all if there are no achievements
  if (!loading && achievements.length === 0) return null

  if (loading) {
    return (
      <div className="flex justify-center p-24">
        <Loader2 className="h-8 w-8 animate-spin text-tuscan-sun" />
      </div>
    )
  }

  return (
    <section id="achievements" className="container py-12 md:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-4 text-center mb-16"
      >
        <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl border-b-4 border-tuscan-sun pb-2">
          Achievements & Media
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Featured in interviews, news, and articles across the web.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {achievements.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="block group h-full"
            >
              <Card className="h-full py-0 border-2 border-charcoal-blue/10 dark:border-verdigris/20 hover:border-tuscan-sun/40 hover:shadow-xl hover:shadow-tuscan-sun/5 transition-all duration-500 bg-card/50 backdrop-blur-sm overflow-hidden">
                {/* Thumbnail */}
                {item.thumbnail_url && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />

                    {/* Play button overlay for YouTube */}
                    {item.type === "youtube" && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-red-600/30 group-hover:scale-110 transition-transform">
                          <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <CardContent className="p-6 space-y-4">
                  {/* Type Badge & Date */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${getTypeColor(item.type)}`}>
                      {getIcon(item.type)}
                      <span>{item.type}</span>
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
                      {item.date && new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-tuscan-sun transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Link indicator */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-verdigris opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{item.type === "youtube" ? "Watch Now" : "Read More"}</span>
                  </div>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
