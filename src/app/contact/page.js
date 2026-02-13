import { Contact } from "@/components/contact";

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
    <div className="pt-20 min-h-screen">
      <Contact />
    </div>
  );
}
