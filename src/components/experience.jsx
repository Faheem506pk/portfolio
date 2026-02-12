"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mydata } from "@/lib/data"

export function Experience() {
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

        <div className="relative max-w-3xl mx-auto pl-8 sm:pl-0">
            {/* Vertical Line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden sm:block"></div>
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border sm:hidden"></div>

            {Mydata.Experience.map((job, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative mb-12 flex flex-col sm:flex-row ${
                        index % 2 === 0 ? "sm:items-end sm:text-right" : "sm:items-start sm:text-left"
                    } gap-8 group`}
                >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 sm:left-1/2 w-4 h-4 rounded-full bg-sandy-brown border-4 border-background -translate-x-[calc(50%-1px)] mt-1.5 z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_0_4px_rgba(244,162,97,0.2)]"></div>

                    {/* Content Wrapper to push to correct side */}
                    <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? "sm:pr-12" : "sm:pl-12 sm:ml-auto"}`}>
                        <Card className="retro-card border-2 border-charcoal-blue/10 dark:border-verdigris/20 hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                                <div className={`flex flex-col ${index % 2 === 0 ? "sm:items-end" : "sm:items-start"}`}>
                                    <span className="text-sm font-mono text-burnt-peach mb-1">{job.Duration}</span>
                                    <CardTitle className="text-xl font-bold text-charcoal-blue dark:text-verdigris">{job.Position}</CardTitle>
                                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                        <Briefcase className="w-3 h-3" />
                                        {job.Company}
                                    </h4>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    {job.Description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            ))}
        </div>
    </section>
  )
}
