import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Engineering Works | Jayraj Patel - Software Engineer & Freelancer",
  description: "Explore the selected software engineering projects, products, and developer tools built by Jayraj Patel, including Ice Make Netra VMS, Yatna.fit, and devotee platforms.",
  keywords: ["Jayraj Patel Projects", "Ice Make Netra", "Ice Make", "Yatna", "Yatna.fit", "Software Portfolio", "Freelance Projects", "Ahmedabad", "React", ".NET"],
  openGraph: {
    title: "Projects & Engineering Works | Jayraj Patel",
    description: "Explore the selected software engineering projects, products, and developer tools built by Jayraj Patel, including Ice Make Netra VMS and Yatna.fit.",
    url: "https://www.jayraj.site/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Engineering Works | Jayraj Patel",
    description: "Explore the selected software engineering projects, products, and developer tools built by Jayraj Patel, including Ice Make Netra VMS and Yatna.fit.",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
