import { Projects } from "@/components/projects";

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
    <div className="pt-20 min-h-screen">
      <Projects />
    </div>
  );
}
