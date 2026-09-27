"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mydata } from "@/lib/data"

export function Skills() {
  const [skillCategories, setSkillCategories] = useState(
    Object.entries(Mydata.Skills).map(([category, items], id) => ({ id, category, items }))
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("id", { ascending: true })
        
        if (data) setSkillCategories(data)
      } catch (err) {
        console.error("Error loading skills:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  if (loading && skillCategories.length === 0) {
    return (
      <div className="flex justify-center p-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section id="skills" className="relative container py-12 md:py-24 lg:py-32">
      {/* Spotlight Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-end pointer-events-none mix-blend-screen">
        <div className="w-[800px] h-[800px] bg-primary/10 blur-[140px] rounded-full translate-x-1/3 -translate-y-1/3 text-transparent" />
      </div>
      
      <div className="relative flex flex-col items-center gap-4 text-center mb-16 z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           viewport={{ once: true }}
        >
            <h2 className="font-display text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl border-b-4 border-primary pb-2 inline-block">
                Technical Expertise
            </h2>
        </motion.div>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          A comprehensive overview of my technical skills and tools.
        </p>
      </div>

      <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3 z-10">
        {skillCategories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border border-border hover:shadow-[0_4px_20px_-4px_color-mix(in_oklch,var(--primary)_15%,transparent)] bg-card/80 backdrop-blur-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-display text-foreground">{cat.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cat.items && cat.items.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 bg-background hover:bg-muted transition-colors border border-border/50 text-sm font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {skillCategories.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Stay tuned for updates...
          </div>
        )}
      </div>
    </section>
  )
}
