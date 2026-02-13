import { Skills } from "@/components/skills";
import { createClient } from "@supabase/supabase-js";

// SEO Metadata for Skills Page
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
    <div className="pt-20 min-h-screen">
      <Skills />
    </div>
  );
}
