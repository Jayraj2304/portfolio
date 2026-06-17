"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Quote() {
  const textRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const wordElements = textRef.current.querySelectorAll(".quote-word");

    // Set initial opacity
    gsap.set(wordElements, { opacity: 0.15 });

    gsap.to(wordElements, {
      opacity: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 85%",
        end: "bottom 60%",
        scrub: 1,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="relative bg-[#0f172a] z-20 border-y border-white/5 overflow-hidden py-32 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
      {/* Figma-like Vertical Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-8 pointer-events-none opacity-[0.05] z-0">
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="h-full" />
      </div>

      {/* Content Container */}
      <div
        ref={containerRef}
        className="container mx-auto max-w-[1200px] px-6 relative z-10 flex flex-col gap-12"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16">

          {/* Avatar Area (Left) */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border border-white/10 overflow-hidden bg-gray-800 shadow-xl shrink-0 select-none">
            <img
              src="/profile.png"
              alt="Jayraj Patel"
              className="w-full h-full object-cover grayscale contrast-125"
            />
            

          </div>

          {/* Quote Block (Right) */}
          <div className="flex-1 flex flex-col justify-center relative pl-2 md:pl-8">
            <h2
              ref={textRef}
              className="text-[6.5vw] md:text-[5.5vw] lg:text-[4.5rem] font-[900] tracking-tighter text-white leading-[1.05] uppercase font-[family-name:var(--font-manrope)] select-none"
            >
              <span className="text-[#3b82f6] mr-4 select-none">“</span>
              <span className="quote-word transition-opacity duration-300 inline-block">SIMPLICITY</span>{" "}
              <span className="quote-word transition-opacity duration-300 inline-block">MEETS</span>
              <br />
              <span className="block text-right pr-6 md:pr-12 mt-2">
                <span className="quote-word transition-opacity duration-300 inline-block">SOPHISTICATION</span>
                <span className="text-[#3b82f6] ml-4 select-none">”</span>
              </span>
            </h2>
          </div>

        </div>

        {/* Divider Line */}
        <div className="w-full border-t border-white/10 mt-8" />

        {/* Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono">
          <span className="text-gray-300 font-bold uppercase tracking-wider text-[11px] md:text-xs">
            Jayraj Patel
          </span>

          <div className="flex gap-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
            <a
              href="https://linkedin.com/in/jayraj--patel"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 cursor-none"
            >
              LINKEDIN ↗
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 cursor-none"
            >
              GITHUB ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
