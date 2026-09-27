import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { TechMarquee } from "@/components/tech-marquee";
import { Achievements } from "@/components/achievements";

export default function Home() {
  return (
    <div className="flex flex-col gap-0 w-full">
      <Hero />
      <TechMarquee />
      <Skills />
      <Experience />
      <Projects />
      <Achievements />
      <Contact />
    </div>
  );
}
