import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Quote from "@/components/Quote";
import SelectedProjects from "@/components/SelectedProjects";
import AiTerminal from "@/components/AiTerminal";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Quote />
      <SelectedProjects />
      <AiTerminal />
      <Experience />
      <Footer />
    </main>
  );
}
