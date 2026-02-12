"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Send, ExternalLink, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mydata } from "@/lib/data"

const RECIPIENT_EMAIL = "faheemiqbalm@gmail.com"

export function Contact() {
  const formRef = React.useRef(null)
  const [feedback, setFeedback] = React.useState(null)

  const sendMessage = async (e) => {
    e.preventDefault()
    setFeedback(null)

    const formData = new FormData(formRef.current)
    const name = formData.get("from_name")
    const email = formData.get("from_email")
    const message = formData.get("message")

    // Build Gmail compose URL
    const subject = encodeURIComponent(`Portfolio Inquiry — ${name}`)
    const body = encodeURIComponent(
`Hello Faheem,

A new message has been received from your portfolio contact form.

Name: ${name}
Email: ${email}

Message:
${message}

--
This message was sent via faheem506pk.dev contact form.`
    )

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${subject}&body=${body}`

    // Save to Supabase (optional backup)
    try {
      await supabase.from("messages").insert([{ name, email, message }])
    } catch (dbErr) {
      console.warn("Supabase save skipped:", dbErr)
    }

    // Open Gmail compose in new tab
    window.open(gmailUrl, "_blank")
    setFeedback({ type: "success", message: "Gmail opened! Please click Send in the new tab." })
    formRef.current.reset()
  }

  return (
    <section id="contact" className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center gap-4 text-center mb-16">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           viewport={{ once: true }}
        >
            <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl border-b-4 border-burnt-peach pb-2 inline-block">
                Get In Touch
            </h2>
        </motion.div>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Ready to start your next project? Drop me a message.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
           viewport={{ once: true }}
           className="space-y-8"
        >
           <div className="space-y-6">
              <h3 className="text-2xl font-bold font-serif text-charcoal-blue dark:text-verdigris">Contact Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                 I&apos;m always interested in new opportunities, collaborations, or just a chat about technology. 
                 Feel free to reach out via the form or my social channels.
              </p>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50">
                    <div className="h-10 w-10 rounded-full bg-verdigris/10 flex items-center justify-center text-verdigris">
                       <Mail className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-muted-foreground">Email</p>
                       <a href={`mailto:${Mydata.Email}`} className="text-foreground font-semibold hover:text-verdigris transition-colors">{Mydata.Email}</a>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                       <Phone className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-muted-foreground">Phone</p>
                       <a href="tel:+923325194976" className="text-foreground font-semibold hover:text-blue-500 transition-colors">+92 332 5194976</a>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                       <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                       <a href="https://wa.me/923325194976" target="_blank" rel="noreferrer" className="text-foreground font-semibold hover:text-green-500 transition-colors">Start a Chat</a>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50">
                    <div className="h-10 w-10 rounded-full bg-tuscan-sun/10 flex items-center justify-center text-tuscan-sun">
                       <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                       <p className="text-foreground font-semibold">Usually within 24 hours</p>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           viewport={{ once: true }}
        >
           <Card className="border-2 border-charcoal-blue/10 dark:border-verdigris/20 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle>Send a Message</CardTitle>
                 <CardDescription>
                    Fill out the form below — Gmail will open with your message ready to send.
                 </CardDescription>
              </CardHeader>
              <CardContent>
                 <form ref={formRef} onSubmit={sendMessage} className="space-y-4">
                    <div className="grid gap-2">
                       <Label htmlFor="from_name">Name</Label>
                       <Input id="from_name" name="from_name" placeholder="Your name" required className="bg-background/50" />
                    </div>
                    <div className="grid gap-2">
                       <Label htmlFor="from_email">Email</Label>
                       <Input id="from_email" name="from_email" type="email" placeholder="your@email.com" required className="bg-background/50" />
                    </div>
                    <div className="grid gap-2">
                       <Label htmlFor="message">Message</Label>
                       <Textarea id="message" name="message" placeholder="Tell me about your project..." className="min-h-[120px] bg-background/50" required />
                    </div>
                    
                    {feedback && (
                        <div className={`p-3 rounded-md text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {feedback.message}
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-burnt-peach hover:bg-burnt-peach/90 text-white font-bold">
                       <Send className="mr-2 h-4 w-4" /> Send Message 
                    </Button>
                 </form>
              </CardContent>
           </Card>
        </motion.div>
      </div>
    </section>
  )
}
