"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "./SearchContext";

export default function Navbar() {
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsSearchOpen } = useSearch();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateStr(`JUN/${now.getDate()}/${now.getFullYear()}`);
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const int = setInterval(updateTime, 60000);
    return () => clearInterval(int);
  }, []);

  // Lock page scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header 
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 bg-[#f8f9fa]/90 backdrop-blur-sm border-b border-black/5"
      >
        
        {/* Absolute Location & Weather Badge (Top Left) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          className="absolute top-[120px] left-8 hidden xl:flex flex-col gap-1.5 text-[9px] uppercase font-mono text-white/90 tracking-widest z-50 bg-[#1a233a]/80 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 shadow-xl"
        >
          <span>AHMEDABAD / {timeStr} / {dateStr}</span>
          <span className="text-white font-bold text-[10px] flex items-center gap-1">
            34°C <span className="text-yellow-400 text-[12px] ml-1">☀️</span>
          </span>
        </motion.div>

        {/* Main Navigation */}
        <nav className="container mx-auto max-w-[1400px] px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              <img src="/chess.png" alt="chess" className="w-6 h-6 object-contain" />
            </motion.div>
            <span className="font-bold text-[13px] tracking-[0.2em] text-[#1a233a]">JAYRAJ PATEL</span>
          </Link>

          {/* Links (Desktop) */}
          <div className="hidden md:flex items-center gap-12 font-[family-name:var(--font-miriam)] text-[11px] tracking-[0.15em] text-gray-500 ml-12">
            <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }} className="hover:text-black transition-colors cursor-pointer">
              <Link href="/projects">PROJECTS <sup className="text-[8px] font-bold text-blue-500">3</sup></Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }} className="hover:text-black transition-colors cursor-pointer">
              <Link href="/#about">EXPERIENCE <sup className="text-[8px] font-bold text-blue-500">3</sup></Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }} className="hover:text-black transition-colors cursor-pointer">
              <Link href="/contact">CONTACT</Link>
            </motion.div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Talk to my AI (Desktop Only) */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -1 }} 
              whileTap={{ scale: 0.95 }} 
              className="hidden md:flex items-center hover:text-black transition-colors cursor-pointer font-[family-name:var(--font-miriam)] text-[11px] tracking-[0.15em] text-[#3b82f6] font-bold mr-2"
            >
              <Link href="/#agent">TALK TO MY AI</Link>
            </motion.div>

            {/* Search Trigger Button (All Screen Sizes) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#1a233a] hover:text-blue-500 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={18} />
            </motion.button>

            {/* Mobile Hamburger Menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex md:hidden p-2 text-[#1a233a] hover:text-blue-500 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#f8f9fa]/95 backdrop-blur-md flex flex-col justify-between p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-20 px-2">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <img src="/chess.png" alt="chess" className="w-6 h-6 object-contain" />
                </div>
                <span className="font-bold text-[13px] tracking-[0.2em] text-[#1a233a]">JAYRAJ PATEL</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 text-gray-500 hover:text-black"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Links List with Staggered Animations */}
            <nav className="flex flex-col gap-6 text-3xl font-[family-name:var(--font-manrope)] font-light text-[#1a233a] px-4 my-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link 
                  href="/projects" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="hover:text-blue-500 transition-colors uppercase tracking-tight flex items-center justify-between"
                >
                  <span>Projects</span>
                  <span className="text-xs font-bold font-mono text-gray-300">/ 03</span>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Link 
                  href="/#about" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="hover:text-blue-500 transition-colors uppercase tracking-tight flex items-center justify-between"
                >
                  <span>Experience</span>
                  <span className="text-xs font-bold font-mono text-gray-300">/ 03</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="hover:text-blue-500 transition-colors uppercase tracking-tight flex items-center justify-between"
                >
                  <span>Contact</span>
                  <span className="text-xs font-bold font-mono text-gray-300">/ 01</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="pt-6 border-t border-black/5"
              >
                <Link 
                  href="/#agent" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="hover:text-blue-600 text-blue-500 font-bold transition-colors uppercase tracking-tight flex items-center justify-between"
                >
                  <span>Talk to my AI</span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-500 tracking-wider">LIVE</span>
                </Link>
              </motion.div>
            </nav>

            {/* Footer */}
            <div className="border-t border-black/5 pt-6 px-4 text-[10px] font-mono text-gray-400 flex flex-col gap-2">
              <span>LOCATION: AHMEDABAD, IN</span>
              <span>TIME: {timeStr} / {dateStr}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
