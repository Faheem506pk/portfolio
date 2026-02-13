import { Skills } from "@/components/skills";
import { createClient } from "@supabase/supabase-js";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata = {
  title: "Skills & Expertise | Muhammad Faheem Iqbal",
  description:
    "Explore the technical skills and expertise of Muhammad Faheem Iqbal. Proficient in React.js, Next.js, Node.js, TypeScript, and modern web development technologies.",
  alternates: {
    canonical: "https://faheem506pk.vercel.app/skills",
  },
};

export default function SkillsPage() {
  return (
    <PageWrapper title="Technical Expertise" className="bg-background/50">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <p className="text-xl text-muted-foreground">My technical toolkit and proficiency levels across various domains.</p>
      </div>
      <Skills isPage={true} />
    </PageWrapper>
  );
}
