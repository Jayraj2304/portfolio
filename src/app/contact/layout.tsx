import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Hire | Jayraj Patel - Software Engineer & Freelancer",
  description: "Get in touch with Jayraj Patel, a Software Developer and Freelancer in Ahmedabad, Gujarat, India. View Jayraj Patel's CV and request calendar bookings for projects.",
  keywords: ["Hire Jayraj Patel", "Jayraj Patel CV", "Jayraj Patel Resume", "Freelancer in Ahmedabad", "Freelancer in Gujarat", "Freelancer India", "Software Developer Ahmedabad", "Software Engineer Gujarat", "Jayraj Patel Contact"],
  openGraph: {
    title: "Contact & Hire | Jayraj Patel",
    description: "Get in touch with Jayraj Patel, a Software Developer and Freelancer in Ahmedabad, Gujarat, India. View Jayraj Patel's CV and book project collaborations.",
    url: "https://www.jayraj.site/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Hire | Jayraj Patel",
    description: "Get in touch with Jayraj Patel, a Software Developer and Freelancer in Ahmedabad, Gujarat, India. View Jayraj Patel's CV and book project collaborations.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
