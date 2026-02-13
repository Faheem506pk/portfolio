import { Experience } from "@/components/experience";

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
    <div className="pt-20 min-h-screen">
      <Experience />
    </div>
  );
}
