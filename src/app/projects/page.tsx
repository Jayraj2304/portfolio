"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetraCarouselModal from "@/components/NetraCarouselModal";

const ALL_PROJECTS = [
  {
    id: "netra",
    title: "ICE MAKE NETRA VMS",
    description: "Federated Video Management System using .NET 10, C# 12, WPF, and a React web dashboard. Engineered an asynchronous FFmpeg decoding pipeline with hardware-accelerated Direct3D11 GPU rendering.",
    tech: ["C#", ".NET 10", "WPF", "React", "FFmpeg", "GPU", "Direct3D11"],
    link: "#",
    placeholder: "N",
    image: "/group-53.png"
  },
  {
    id: "yatna",
    title: "Yatna.fit",
    description: "Full-stack fitness platform, owning the end-to-end development lifecycle from initial database design to production deployment.",
    tech: ["React 19", "Node.js", "MongoDB", "Tailwind CSS"],
    link: "https://yatna.fit",
    placeholder: "Y",
    image: "/yatnafit.png"
  },
  {
    id: "bhaktisetu",
    title: "SSYV BhaktiSetu",
    description: "An end-to-end devotee management and networking platform engineered specifically for religious organizations. Developed as a pro-bono (Seva) initiative by a core team of four to centralize devotee data, automate mass communication, and dynamically match community resources. Entirely self-hosted via Docker to ensure absolute data privacy and sovereignty for over 3,000 active community members.",
    tech: ["Next.js 15", "React 19", "Docker", "Tailwind CSS 4", "TypeScript"],
    link: "#",
    placeholder: "B",
    image: "/SSYV_BHAKTISETU.png"
  }
];

export default function ProjectsPage() {
  const [isNetraModalOpen, setIsNetraModalOpen] = useState(false);

  return (
    <main className="flex flex-col min-h-screen pt-24 font-sans bg-[#f8f9fa]">
      <Navbar />

      <div className="flex-1 container mx-auto max-w-[1400px] px-6 py-16">
        
        {/* Header navigation back */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#1a233a] leading-none mb-4">
            ALL PROJECTS
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light max-w-xl">
            A listing of my engineering works, products, and open-source packages.
          </p>
        </div>

        {/* Projects Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-150 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  {project.image ? (
                    <div className="w-10 h-10 rounded-lg border border-gray-150 bg-gray-50 flex items-center justify-center transition-colors group-hover:border-blue-100 p-1">
                      <img src={project.image} alt={project.title} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {project.placeholder}
                    </div>
                  )}
                  <span className="text-[9px] font-[family-name:var(--font-miriam)] font-bold tracking-widest text-gray-400 uppercase">
                    Project
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1a233a] tracking-tight group-hover:text-blue-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[#5f6368] text-[13px] leading-relaxed font-light line-clamp-4">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div className="flex flex-wrap gap-1.5 font-[family-name:var(--font-miriam)]">
                  {project.tech.map((t) => (
                    <span 
                      key={t} 
                      className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 text-gray-500 rounded-[4px] bg-[#f0f1f3]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                
                {project.id === "netra" ? (
                  <button 
                    onClick={() => setIsNetraModalOpen(true)}
                    className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 hover:border-[#1a233a] hover:bg-[#1a233a] hover:text-white transition-all group/btn cursor-none bg-transparent"
                  >
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-miriam)]">
                      Explore Interface
                    </span>
                    <ArrowUpRight size={12} className="text-gray-400 group-hover/btn:text-white transition-colors" />
                  </button>
                ) : (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 hover:border-[#1a233a] hover:bg-[#1a233a] hover:text-white transition-all group/btn cursor-none"
                  >
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-miriam)]">
                      {project.id === "yatna" ? "Visit Website" : "View Project"}
                    </span>
                    <ArrowUpRight size={12} className="text-gray-400 group-hover/btn:text-white transition-colors" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      <Footer />
      <NetraCarouselModal isOpen={isNetraModalOpen} onClose={() => setIsNetraModalOpen(false)} />
    </main>
  );
}
