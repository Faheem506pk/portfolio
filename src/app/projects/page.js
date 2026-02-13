import { Projects } from "@/components/projects";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata = {
  title: "Projects & Portfolio | Muhammad Faheem Iqbal",
  description:
    "Check out the portfolio of Muhammad Faheem Iqbal. A showcase of web applications, frontend projects, and software solutions built with React, Next.js, and more.",
  alternates: {
    canonical: "https://faheem506pk.vercel.app/projects",
  },
};

export default function ProjectsPage() {
  return (
    <PageWrapper title="Featured Projects">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <p className="text-xl text-muted-foreground">A selection of projects that showcase my skills and problem-solving abilities.</p>
      </div>
      <Projects />
    </PageWrapper>
  );
}
