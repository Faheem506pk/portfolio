import { Achievements } from "@/components/achievements";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata = {
  title: "Achievements & Certifications | Muhammad Faheem Iqbal",
  description: "Honors, awards, and certifications earned by Muhammad Faheem Iqbal in the field of Software Engineering and Web Development.",
  alternates: {
    canonical: "https://faheem506pk.vercel.app/achievements",
  },
};

export default function AchievementsPage() {
  return (
    <PageWrapper title="Awards & Recognitions">
      <Achievements />
    </PageWrapper>
  );
}
