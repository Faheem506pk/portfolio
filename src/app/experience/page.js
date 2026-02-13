import { Experience } from "@/components/experience";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata = {
  title: "Professional Experience | Muhammad Faheem Iqbal",
  description:
    "View the professional career journey of Muhammad Faheem Iqbal. Experience in building scalable web applications, frontend development, and software engineering roles.",
  alternates: {
    canonical: "https://faheem506pk.vercel.app/experience",
  },
};

export default function ExperiencePage() {
  return (
    <PageWrapper title="Professional Journey">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <p className="text-xl text-muted-foreground">A timeline of my professional career and key roles in the industry.</p>
      </div>
      <Experience />
    </PageWrapper>
  );
}
