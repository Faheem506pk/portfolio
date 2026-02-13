"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Briefcase, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mydata } from "@/lib/data"

export function Experience() {
  const [experiences, setExperiences] = useState(Mydata.Experience.map((e, idx) => ({
    id: idx,
    company: e.Company,
    position: e.Position,
    location: e.Location,
    description: e.Description,
    duration: e.Duration,
    is_development: e.Company !== "BestMobile.pk", // Fallback logic
    skills: []
  })))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExperience() {
      try {
        const { data, error } = await supabase
          .from("experience")
          .select("*")
          .order("id", { ascending: true })

        if (data) setExperiences(data)
      } catch (err) {
        console.error("Error loading experience:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchExperience()
  }, [])

  if (loading && experiences.length === 0) {
    return (
      <div className="flex justify-center p-24">
        <Loader2 className="h-8 w-8 animate-spin text-tuscan-sun" />
      </div>
    )
  }

  const devRoles = experiences.filter(job => job.is_development !== false);
  const otherRoles = experiences.filter(job => job.is_development === false);

  return (
    <section id="experience" className="container py-12 md:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-4 text-center mb-16"
      >
        <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl border-b-4 border-tuscan-sun pb-2">
          Experience
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          My professional journey in the digital realm.
        </p>
      </motion.div>

      {/* Development Experience */}
      <div className="relative max-w-3xl mx-auto pl-8 sm:pl-0 mb-20">
        <h3 className="text-xl font-bold mb-10 text-tuscan-sun uppercase tracking-widest text-center sm:text-left">Software Development</h3>

        {/* Vertical Line */}
        <div className="absolute left-8 sm:left-1/2 top-16 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden sm:block"></div>
        <div className="absolute left-0 top-16 bottom-0 w-0.5 bg-border sm:hidden"></div>

        {devRoles.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative mb-12 flex flex-col sm:flex-row ${index % 2 === 0 ? "sm:items-end sm:text-right" : "sm:items-start sm:text-left"
              } gap-8 group`}
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 sm:left-1/2 w-4 h-4 rounded-full bg-sandy-brown border-4 border-background -translate-x-[calc(50%-1px)] mt-1.5 z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_0_4px_rgba(244,162,97,0.2)]"></div>

            {/* Content Wrapper to push to correct side */}
            <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? "sm:pr-12" : "sm:pl-12 sm:ml-auto"}`}>
              <Card className="retro-card border-2 border-charcoal-blue/10 dark:border-verdigris/20 hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className={`flex flex-col ${index % 2 === 0 ? "sm:items-end" : "sm:items-start"}`}>
                    <span className="text-sm font-mono text-burnt-peach mb-1">{job.duration}</span>
                    <CardTitle className="text-xl font-bold text-charcoal-blue dark:text-verdigris">{job.position}</CardTitle>
                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <Briefcase className="w-3 h-3" />
                      {job.company}
                    </h4>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    {job.description}
                  </p>
                  {job.skills && job.skills.length > 0 && (
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "sm:justify-end" : "sm:justify-start"}`}>
                      {job.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-tuscan-sun/20 text-tuscan-sun">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Other Experience */}
      {otherRoles.length > 0 && (
        <div className="max-w-3xl mx-auto border-t border-border pt-12">
          <h3 className="text-xl font-bold mb-8 text-muted-foreground uppercase tracking-widest text-center">Other Professional Experience</h3>
          <div className="relative border-l border-white/10 ml-3 md:ml-6 space-y-10 py-2">
            {otherRoles.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8 md:pl-12"
              >
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-tuscan-sun ring-4 ring-background" />

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-foreground hover:text-tuscan-sun transition-colors">
                      {job.position}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Briefcase className="w-3.5 h-3.5 text-tuscan-sun/70" />
                      {job.company}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-burnt-peach/80 bg-burnt-peach/5 px-2 py-0.5 rounded border border-burnt-peach/10 w-fit">
                    {job.duration}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">
                  {job.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {experiences.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          Stay tuned for updates...
        </div>
      )}
    </section>
  )
}
