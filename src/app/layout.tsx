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
  title: "Jayraj Patel | Software Engineer",
  description: "Portfolio of Jayraj Patel.",
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
