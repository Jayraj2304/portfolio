"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const experiences = [
  {
    id: "icemake",
    title: "Software Engineering Intern",
    company: "Ice Make Refrigeration Limited",
    period: "Feb 2026 – Present",
    points: [
      "Developed key modules of ICE MAKE NETRA VMS, a federated Video Management System using .NET 10, C# 12, WPF, and a React web dashboard.",
      "Built an asynchronous FFmpeg decoding pipeline with hardware-accelerated Direct3D11 GPU rendering, optimizing CPU load while handling multiple high-definition streams.",
      "Helped build a peer-to-peer mesh synchronization service and integrated WAN-optimized Secure Reliable Transport (SRT) routing for low-latency video relays across distributed sites.",
      "Set up a granular Role-Based Access Control (RBAC) matrix and secured sensitive data at rest using RSA-OAEP-SHA256 and Windows DPAPI encryption.",
      "Created a local-first, staged push protocol to distribute software updates chunk-by-chunk across air-gapped networks."
    ]
  },
  {
    id: "freelance",
    title: "Web Developer",
    company: "Freelance",
    period: "May 2025 – May 2026",
    points: [
      "Designed and deployed responsive business websites (khodiyarmovers.com, devnandan.co.in), helping small businesses build a reliable online presence.",
      "Built responsive pages and configured custom domain routing to improve search visibility and streamline visitor inquiries.",
      "Worked directly with clients to gather requirements, construct UI layouts, and provide post-launch technical support."
    ]
  }
];

const skills = [
  "C#", "JavaScript", "TypeScript", "Python", "Java",
  ".NET 10", "Node.js", "Express.js", "React.js", "WPF",
  "PostgreSQL", "MongoDB", "Redis", "SQLite",
  "Docker", "CI/CD Pipelines", "FFmpeg", "Direct3D", "RTSP", "SRT"
];

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(".anim-slide-up", 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(".anim-skill",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".skills-wrapper",
          start: "top 85%",
        }
      }
    );

    gsap.to(".timeline-line", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".experience-list",
        start: "top 75%",
        end: "bottom 65%",
        scrub: true
      }
    });

    const dots = containerRef.current.querySelectorAll('.timeline-dot');
    dots.forEach((dot) => {
      gsap.to(dot, {
        scale: 1,
        ease: "back.out(1.7)",
        duration: 0.5,
        scrollTrigger: {
          trigger: dot,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} id="about" className="py-24 relative z-20 bg-[#f8f9fa] border-b border-black/5 overflow-hidden">
      <div className="container mx-auto max-w-[1400px] px-6 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24">
        
        {/* Experience Column */}
        <div>
          <h2 className="anim-slide-up text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-12 font-bold font-mono">
            Professional Experience
          </h2>
          <div className="relative space-y-16 experience-list">
            {/* Standard timeline track */}
            <div className="absolute left-[4px] top-2 bottom-0 w-[1px] bg-gray-200"></div>
            
            {/* Animating timeline track progress */}
            <div className="timeline-line absolute left-[4px] top-2 bottom-0 w-[1px] bg-blue-500 origin-top scale-y-0"></div>

            {experiences.map((exp) => (
              <div key={exp.id} className="anim-slide-up relative pl-8 pb-4">
                {/* Timeline Dot */}
                <div className="timeline-dot absolute left-[4px] top-2 w-2.5 h-2.5 bg-blue-500 rounded-full scale-0 origin-center -translate-x-1/2"></div>
                
                <h3 className="text-2xl font-bold text-[#1a233a] leading-tight mb-2">{exp.title}</h3>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 mb-6 gap-2">
                  <span className="text-[#3b82f6] font-bold text-sm tracking-wide">{exp.company}</span>
                  <span className="text-gray-400 text-[11px] font-mono tracking-widest uppercase">{exp.period}</span>
                </div>
                <ul className="space-y-3 text-[#5f6368] text-[15px] font-[family-name:var(--font-manrope)] font-light leading-relaxed">
                  {exp.points.map((point, i) => (
                    <li key={i} className="relative before:content-[''] before:absolute before:left-[-1rem] before:top-[10px] before:w-1.5 before:h-[1px] before:bg-gray-300">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Education Column */}
        <div className="lg:pl-12 lg:border-l lg:border-black/5">
          
          <div className="mb-20 skills-wrapper">
            <h2 className="anim-slide-up text-[10px] font-[family-name:var(--font-miriam)] tracking-[0.2em] text-gray-400 uppercase mb-8">
              Technical Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="anim-skill font-[family-name:var(--font-miriam)] text-[11px] tracking-wider px-4 py-2 border border-gray-200 text-gray-600 bg-white hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
            
          <div>
            <h2 className="anim-slide-up text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-8 font-bold font-mono">
              Education & Certifications
            </h2>
            
            <div className="space-y-8">
              <div className="anim-slide-up">
                <h4 className="font-bold text-lg text-[#1a233a]">B.Tech in Computer Engineering</h4>
                <p className="text-[#5f6368] font-light mt-1">L.J. University <span className="text-gray-300 mx-2">|</span> <span className="font-mono text-[11px] uppercase tracking-wider">May 2025</span></p>
              </div>
              <div className="anim-slide-up">
                <h4 className="font-bold text-lg text-[#1a233a]">Higher Secondary</h4>
                <p className="text-[#5f6368] font-light mt-1">HB Kapadia New High School <span className="text-gray-300 mx-2">|</span> <span className="font-mono text-[11px] uppercase tracking-wider">Mar 2021</span></p>
              </div>
              <div className="pt-4 mt-8 border-t border-gray-200 anim-slide-up">
                <p className="text-[10px] font-[family-name:var(--font-miriam)] tracking-[0.2em] text-gray-400 uppercase mb-4">Certifications</p>
                <ul className="space-y-2 text-[#5f6368] text-[13px] font-[family-name:var(--font-manrope)] font-light leading-relaxed">
                  <li>&rarr; Exploratory Data Analysis for Machine Learning (IBM)</li>
                  <li>&rarr; Building Generative AI-Powered Applications (IBM)</li>
                  <li>&rarr; Algorithmic Thinking Parts 1 & 2 (Rice University)</li>
                  <li>&rarr; Ethical Hacking Essentials (EC-Council)</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
        
      </div>
    </section>
  );
}
