"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ExternalLink, Github, Code2 } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mydata } from "@/lib/data"

export function Projects() {
  return (
    <section id="portfolio" className="container py-12 md:py-24 lg:py-32 bg-background/50">
      <div className="flex flex-col items-center gap-4 text-center mb-16">
         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
         >
            <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl border-b-4 border-verdigris pb-2 inline-block">
                Selected Works
            </h2>
         </motion.div>
         <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A collection of projects exploring web technologies and design.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {Mydata.Projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full flex flex-col overflow-hidden border-2 border-charcoal-blue/10 dark:border-verdigris/20 hover:border-burnt-peach dark:hover:border-tuscan-sun transition-colors duration-300 group bg-card">
              <div className="relative h-48 w-full overflow-hidden bg-muted flex items-center justify-center group-hover:bg-charcoal-blue/5 dark:group-hover:bg-verdigris/5 transition-colors">
                 {/* Placeholder for project image */}
                 <Code2 className="h-16 w-16 text-muted-foreground/30 group-hover:text-burnt-peach/50 transition-colors" />
                 <div className="absolute top-4 right-4 flex gap-2">
                    {project.Featured && (
                        <Badge variant="secondary" className="bg-tuscan-sun text-charcoal-blue font-bold">Featured</Badge>
                    )}
                 </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex justify-between items-start font-bold text-xl font-serif">
                    {project.Name}
                    <span className="text-sm font-mono font-normal text-muted-foreground mt-1">{project.Year}</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                    {project.Tech && project.Tech.map((t, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-background/50">{t}</Badge>
                    ))}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.Description}
                </p>
              </CardContent>
              
              <CardFooter className="gap-2 pt-0">
                <Button variant="outline" size="sm" className="w-full gap-2 border-charcoal-blue/20 dark:border-verdigris/30" asChild>
                    <a href={project.GitHub} target="_blank" rel="noreferrer">
                        <Github className="h-4 w-4" /> Code
                    </a>
                </Button>
                <Button size="sm" className="w-full gap-2 bg-charcoal-blue text-white hover:bg-charcoal-blue/90 dark:bg-verdigris dark:text-charcoal-blue dark:hover:bg-verdigris/90" asChild>
                    <a href={project.Live} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" /> Live Demo
                    </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
