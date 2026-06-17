"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import NetraCarouselModal from "./NetraCarouselModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    id: "netra",
    title: "ICE MAKE NETRA VMS",
    description: "Federated Video Management System using .NET 10, C# 12, WPF, and a React web dashboard. Engineered an asynchronous FFmpeg decoding pipeline with hardware-accelerated Direct3D11 GPU rendering.",
    tech: ["C#", ".NET 10", "WPF", "REACT", "FFMPEG"],
    link: "#",
    placeholder: "N",
    align: "right",
    image: "/group-54.png",
    isLogo: true,
    glowClass: "",
    logoClass: "max-w-[460px] md:max-w-[540px] lg:max-w-[580px] aspect-[8/3]",
    imgClass: "filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] group-hover/logo:drop-shadow-[0_15px_30px_rgba(59,130,246,0.2)]"
  },
  {
    id: "yatna",
    title: "Yatna.fit",
    description: "Full-stack fitness platform, owning the end-to-end development lifecycle from initial database design to production deployment.",
    tech: ["REACT 19", "NODE.JS", "MONGODB", "TAILWIND"],
    link: "https://yatna.fit",
    placeholder: "Y",
    align: "left",
    image: "/yatnafit.png",
    isLogo: true,
    glowClass: "",
    logoClass: "max-w-[260px] sm:max-w-[300px] aspect-square",
    imgClass: "filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] group-hover/logo:drop-shadow-[0_15px_30px_rgba(239,68,68,0.2)]"
  }
];

function TiltMockup({ children, className = "border border-gray-200 bg-white shadow-xl" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out coordinate tracking using springs
  const springX = useSpring(x, { damping: 25, stiffness: 300 });
  const springY = useSpring(y, { damping: 25, stiffness: 300 });

  // Translate coordinates into degrees (-10 to 10 deg)
  const rotateX = useTransform(springY, [-180, 180], [10, -10]);
  const rotateY = useTransform(springX, [-320, 320], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className={`relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden flex items-center justify-center cursor-none z-30 transition-shadow ${className}`}
    >
      {/* Glare effect overlay */}
      <div 
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 80%)",
          transform: "translateZ(10px)",
        }}
        className="absolute inset-0 pointer-events-none z-20"
      />
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="w-full h-full flex flex-col justify-center items-center">
        {children}
      </div>
    </motion.div>
  );
}

function TiltLogo({ children, className = "max-w-[280px] sm:max-w-[320px] aspect-square" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out coordinate tracking using springs
  const springX = useSpring(x, { damping: 25, stiffness: 300 });
  const springY = useSpring(y, { damping: 25, stiffness: 300 });

  // Translate coordinates into degrees (-12 to 12 deg)
  const rotateX = useTransform(springY, [-180, 180], [12, -12]);
  const rotateY = useTransform(springX, [-180, 180], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className={`relative group/logo w-full flex items-center justify-center transition-all duration-500 cursor-none z-30 ${className}`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="w-full h-full flex flex-col justify-center items-center">
        {children}
      </div>
    </motion.div>
  );
}

export default function SelectedProjects() {
  const containerRef = useRef<HTMLElement>(null);
  const [isNetraModalOpen, setIsNetraModalOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const projectBlocks = containerRef.current.querySelectorAll('.project-block');
    
    projectBlocks.forEach((block) => {
      gsap.fromTo(block,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} id="work" className="bg-white relative z-20 flex flex-col border-y border-black/5 pt-12">
      
      {/* Title Header */}
      <div className="container mx-auto max-w-[1400px] px-6 py-24 border-b border-black/5">
        <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-manrope)] font-light text-[#1a233a] tracking-tight">
          SELECTED <br/> PROJECTS
        </h2>
      </div>

      {/* Projects Stack */}
      <div className="w-full flex flex-col">
        {projects.map((project, idx) => (
          <div key={project.id} className="project-block border-b border-black/5 w-full">
            <div className={`container mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-6 min-h-[70vh]`}>
              
              {/* Content Side */}
              <div className={`p-8 lg:p-16 xl:p-24 flex flex-col justify-between ${
                project.align === 'right' 
                  ? 'lg:col-span-2 border-r border-black/5 order-2 lg:order-1' 
                  : 'lg:col-span-2 lg:col-start-5 border-l border-black/5 order-2 lg:order-2'
              }`}>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-[family-name:var(--font-miriam)] tracking-[0.2em] text-gray-400 uppercase mb-4">Project</p>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a233a] leading-[1.1] tracking-tight">
                      {project.title}
                    </h3>
                  </div>

                  <div>
                    <p className="text-[10px] font-[family-name:var(--font-miriam)] tracking-[0.2em] text-gray-400 uppercase mb-3">Technologies Used</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="font-[family-name:var(--font-miriam)] text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 text-gray-500 rounded-[4px] bg-[#f0f1f3]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[10px] font-[family-name:var(--font-miriam)] tracking-[0.2em] text-gray-400 uppercase mb-3">Description</p>
                    <p className="text-[#5f6368] text-sm lg:text-[15px] font-[family-name:var(--font-manrope)] leading-relaxed font-light">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="mt-16">
                  {project.id === "netra" ? (
                    <button
                      onClick={() => setIsNetraModalOpen(true)}
                      className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-[#1a233a] transition-colors group cursor-none bg-transparent"
                    >
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-miriam)] text-[#1a233a]">Explore Interface</span>
                      <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#1a233a] transition-colors" />
                    </button>
                  ) : (
                    <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-[#1a233a] transition-colors group">
                       <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-miriam)] text-[#1a233a]">
                         {project.id === "yatna" ? "Visit Website" : "View Project"}
                       </span>
                       <ArrowUpRight size={14} className="text-gray-400 group-hover:text-[#1a233a] transition-colors" />
                    </a>
                  )}
                </div>
              </div>

              {/* Image Side */}
              <div className={`bg-[#f3f4f6] relative overflow-hidden flex items-center justify-center p-8 lg:p-24 lg:col-span-4 ${
                project.align === 'right'
                  ? 'order-1 lg:order-2'
                  : 'order-1 lg:order-1'
              }`}>
                {/* Abstract pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1a233a_1px,transparent_1px)] [background-size:20px_20px]"></div>

                {!project.isLogo && (
                  <div className="text-[15rem] lg:text-[25rem] font-black text-gray-300 opacity-20 absolute select-none font-[family-name:var(--font-manrope)]">
                    {project.placeholder}
                  </div>
                )}
                
                {project.image && project.isLogo ? (
                  <div className="relative w-full h-full flex items-center justify-center p-6">
                    <TiltLogo className={project.logoClass}>
                      {/* Crystal Glass Background Card */}
                      <div className="absolute inset-0 bg-white/30 backdrop-blur-[20px] border border-white/60 shadow-[0_25px_50px_rgba(0,0,0,0.06)] pointer-events-none overflow-hidden rounded-3xl">
                        {/* Glowing Liquid Blobs behind the glass content */}
                        <div className="absolute inset-0 -z-10 overflow-hidden">
                          {/* Pulsing glow blob 1 */}
                          <div className={`absolute -top-12 -left-12 w-44 h-44 rounded-full blur-[40px] opacity-[0.22] animate-pulse duration-[4000ms] ${project.id === 'netra' ? 'bg-blue-300' : 'bg-red-300'}`}></div>
                          {/* Pulsing glow blob 2 */}
                          <div className={`absolute -bottom-12 -right-12 w-44 h-44 rounded-full blur-[40px] opacity-[0.22] animate-pulse duration-[6000ms] ${project.id === 'netra' ? 'bg-cyan-300' : 'bg-orange-300'}`}></div>
                        </div>
                        {/* Glossy Reflection overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-white/10" />
                        {/* Inner highlight border */}
                        <div className="absolute inset-3.5 border border-white/50 rounded-[20px]" />
                      </div>

                      {/* Logo Image in the foreground */}
                      <div style={{ transform: "translateZ(30px)" }} className={`relative z-10 w-full h-full flex items-center justify-center ${project.id === 'netra' ? 'p-4 sm:p-6' : 'p-8 sm:p-12'}`}>
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className={`w-full h-full object-contain select-none transition-all duration-500 group-hover/logo:scale-[1.05] ${project.imgClass || ''}`} 
                        />
                      </div>
                    </TiltLogo>
                  </div>
                ) : (
                  <TiltMockup>
                    <div className="absolute inset-x-0 top-0 h-6 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-gray-400 font-[family-name:var(--font-miriam)] text-[10px] tracking-widest uppercase">Mockup Image</span>
                  </TiltMockup>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
      <NetraCarouselModal isOpen={isNetraModalOpen} onClose={() => setIsNetraModalOpen(false)} />
    </section>
  );
}
