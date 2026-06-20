"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";

export default function Footer() {
  const circleRef = useRef<HTMLAnchorElement>(null);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Magnetic Hover for the "Get in Touch" circle
    const circle = circleRef.current;
    if (!circle) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = circle.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(circle, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(circle, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1.1, 0.4)"
      });
    };

    circle.addEventListener("mousemove", handleMouseMove);
    circle.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      circle.removeEventListener("mousemove", handleMouseMove);
      circle.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <footer className="bg-[#0f172a] text-white py-12 md:py-24 px-5 md:px-12 border-t border-white/5 relative z-20 font-sans">
      <div className="container mx-auto max-w-[1400px]">
        
        {/* Top Segment: Large Typography Header and Magnetic Circle */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center gap-6 md:gap-12 pb-8 md:pb-20 border-b border-white/10">
          
          <div className="space-y-4 md:space-y-6 max-w-2xl text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white select-none">
              LET'S WORK <br /> TOGETHER
            </h2>
            <div className="pt-3 md:pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 border border-white/20 rounded-full px-6 py-3 hover:bg-white hover:text-[#0f172a] hover:border-white transition-all text-xs uppercase tracking-widest font-bold font-[family-name:var(--font-miriam)] group"
              >
                <span>Schedule a chat</span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#0f172a] transition-colors" />
              </Link>
            </div>
          </div>

          {/* Magnetic "SAY HELLO" circle */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end lg:pr-24 pr-0 pt-2 lg:pt-0">
            <Link
              ref={circleRef}
              href="/contact"
              className="w-40 h-40 md:w-60 md:h-60 bg-white rounded-full flex flex-col items-center justify-center text-[#0f172a] hover:bg-white transition-all duration-300 shadow-2xl relative cursor-pointer group select-none text-center"
            >
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] font-mono leading-tight group-hover:scale-105 transition-transform">
                SAY <br /> HELLO
              </span>
              <div className="absolute inset-2 border border-[#0f172a]/10 rounded-full pointer-events-none group-hover:inset-3 transition-all duration-300"></div>
            </Link>
          </div>

        </div>

        {/* Middle Segment: Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 py-8 md:py-16 text-sm text-gray-400 text-center md:text-left">
          
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 font-mono block mb-3">
              LOCATION
            </span>
            <p className="text-white font-medium text-lg">Ahmedabad, India</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 font-mono block mb-3">
              LOCAL TIME
            </span>
            <p className="text-white font-medium text-lg font-mono">
              {localTime || "10:19 AM"} (IST)
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 font-mono block mb-3">
              SOCIALS
            </span>
            <div className="flex gap-6 mt-1 text-[15px] font-semibold justify-center md:justify-start">
              <a 
                href="https://linkedin.com/in/jayraj--patel" 
                target="_blank" 
                rel="noreferrer" 
                className="text-white hover:text-yellow-400 transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/Jayraj2304" 
                target="_blank" 
                rel="noreferrer" 
                className="text-white hover:text-yellow-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Segment: Copyright & Utility links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 pt-6 md:pt-8 border-t border-white/10 text-xs text-gray-500 font-medium font-mono text-center">
          <div>
            &copy; {new Date().getFullYear()} JAYRAJ PATEL. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 text-[10px] uppercase tracking-wider">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
