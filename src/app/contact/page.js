import { Contact } from "@/components/contact";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata = {
  title: "Contact | Muhammad Faheem Iqbal",
  description:
    "Get in touch with Muhammad Faheem Iqbal for web development projects, freelance opportunities, or collaboration. Available for hire in Islamabad, Pakistan.",
  alternates: {
    canonical: "https://faheem506pk.vercel.app/contact",
  },
};

export default function ContactPage() {
  return (
    <PageWrapper title="Get in Touch">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <p className="text-xl text-muted-foreground">Have a project in mind or want to discuss collaboration? I'd love to hear from you.</p>
      </div>
      <Contact />
    </PageWrapper>
  );
}
