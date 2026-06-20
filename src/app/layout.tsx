import type { Metadata } from "next";
import { Manrope, Miriam_Libre, Rubik_Pixels, Playfair_Display } from "next/font/google";
import "./globals.css";
import GlobalCursor from "@/components/GlobalCursor";
import { SearchProvider } from "@/components/SearchContext";
import SearchOverlay from "@/components/SearchOverlay";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const miriamLibre = Miriam_Libre({
  variable: "--font-miriam",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const rubikPixels = Rubik_Pixels({
  variable: "--font-rubik-pixels",
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jayraj.site"),
  title: {
    default: "Jayraj Patel | Software Engineer & Freelancer",
    template: "%s | Jayraj Patel",
  },
  description: "Ambitious Software Engineer and Freelancer in Ahmedabad, Gujarat, India. View Jayraj Patel's CV and portfolio featuring ICE MAKE NETRA VMS, Yatna.fit, and other products.",
  keywords: [
    "Jayraj Patel",
    "Jayraj Patel CV",
    "Jayraj Patel Resume",
    "Ice Make Netra",
    "Ice Make",
    "Yatna",
    "Yatna.fit",
    "Software Developer in Ahmedabad",
    "Software Developer in Gujarat",
    "Software Developer India",
    "Freelancer in Ahmedabad",
    "Freelancer in Gujarat",
    "Freelancer India",
    "Full Stack Developer Ahmedabad",
    "React Developer Ahmedabad",
    ".NET Developer Ahmedabad",
    "WPF",
    "React",
    "Next.js",
    "C#",
    "TypeScript",
  ],
  authors: [{ name: "Jayraj Patel", url: "https://www.jayraj.site" }],
  creator: "Jayraj Patel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.jayraj.site",
    title: "Jayraj Patel | Software Engineer & Freelancer",
    description: "Ambitious Software Engineer and Freelancer in Ahmedabad, Gujarat, India. View Jayraj Patel's CV and portfolio featuring ICE MAKE NETRA VMS, Yatna.fit, and other products.",
    siteName: "Jayraj Patel Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayraj Patel | Software Engineer & Freelancer",
    description: "Ambitious Software Engineer and Freelancer in Ahmedabad, Gujarat, India. View Jayraj Patel's CV and portfolio featuring ICE MAKE NETRA VMS, Yatna.fit, and other products.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.jayraj.site/#person",
      "name": "Jayraj Patel",
      "jobTitle": "Software Engineer & Freelancer",
      "description": "Ambitious Software Engineer and Freelancer in Ahmedabad, Gujarat, India. Experience building VMS (Ice Make Netra) and fitness platforms (Yatna.fit).",
      "url": "https://www.jayraj.site",
      "sameAs": [
        "https://linkedin.com/in/jayraj--patel",
        "https://github.com/Jayraj2304"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ahmedabad",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "L.J. University"
      },
      "knowsAbout": [
        "Software Engineering",
        "Cross-platform Development",
        "Systems Architecture",
        "Large Language Models",
        "React",
        "Next.js",
        ".NET 10",
        "C#",
        "TypeScript",
        "PostgreSQL",
        "Docker",
        "Ice Make Netra VMS",
        "Yatna.fit"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.jayraj.site/#website",
      "url": "https://www.jayraj.site",
      "name": "Jayraj Patel Portfolio",
      "publisher": {
        "@id": "https://www.jayraj.site/#person"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${miriamLibre.variable} ${rubikPixels.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col relative overflow-x-hidden text-[#0f172a] cursor-none">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SearchProvider>
          <GlobalCursor />
          {/* The 6-column global grid background */}
          <div className="grid-overlay px-4 md:px-8">
            <div className="grid-line"></div>
            <div className="grid-line"></div>
            <div className="grid-line"></div>
            <div className="grid-line"></div>
            <div className="grid-line"></div>
            <div className="grid-line"></div>
            <div className="grid-line hidden lg:block"></div>
          </div>
          {children}
          <SearchOverlay />
        </SearchProvider>
      </body>
    </html>
  );
}
