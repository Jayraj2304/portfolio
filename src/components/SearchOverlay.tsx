"use client";

import { useEffect, useState, useRef } from "react";
import { useSearch } from "./SearchContext";
import { Search, X, FolderKanban, Briefcase, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type SearchItem = {
  type: "project" | "experience" | "skill";
  title: string;
  subtitle: string;
  description: string;
  tags?: string[];
  link: string;
};

const SEARCH_DATABASE: SearchItem[] = [
  {
    type: "project",
    title: "ICE MAKE NETRA VMS",
    subtitle: "Federated Video Management System",
    description: "Federated Video Management System using .NET 10, C# 12, WPF, and React. Asynchronous FFmpeg decoding pipeline with hardware-accelerated Direct3D11 GPU rendering.",
    tags: ["C#", ".NET 10", "WPF", "React", "FFmpeg", "GPU", "Direct3D11"],
    link: "/#work"
  },
  {
    type: "project",
    title: "Yatna.fit",
    subtitle: "Full-Stack Fitness Platform",
    description: "Full-stack fitness platform, owning the end-to-end development lifecycle from initial database design to production deployment.",
    tags: ["React 19", "Node.js", "MongoDB", "Tailwind CSS"],
    link: "/#work"
  },
  {
    type: "experience",
    title: "Software Engineering Intern",
    subtitle: "Ice Make Refrigeration Limited (Feb 2026 – Present)",
    description: "Architected ICE MAKE NETRA VMS, engineered asynchronous FFmpeg pipelines, developed peer-to-peer mesh sync, secured DPAPI encryption.",
    tags: ["C#", ".NET 10", "WPF", "FFmpeg", "DPAPI"],
    link: "/#about"
  },
  {
    type: "experience",
    title: "Web Developer",
    subtitle: "Freelance (May 2025 – May 2026)",
    description: "Developed and deployed high-performance, SEO-optimized business websites (khodiyarmovers.com, devnandan.co.in).",
    tags: ["UI/UX", "SEO", "Responsive Dev", "Domain Routing"],
    link: "/#about"
  },
  {
    type: "skill",
    title: "C# & .NET 10 Development",
    subtitle: "Backend Languages & Systems",
    description: "Fluent in backend engineering, WPF, thread-safe asynchronous coding, and memory management.",
    tags: ["C#", ".NET 10", "WPF"],
    link: "/#about"
  },
  {
    type: "skill",
    title: "Web Stack Expertise",
    subtitle: "JavaScript, TypeScript, React.js, Node.js",
    description: "Full-stack engineering capabilities using Tailwind CSS, Next.js, Express, PostgreSQL, MongoDB, and Redis.",
    tags: ["React.js", "Node.js", "TypeScript", "PostgreSQL", "Redis"],
    link: "/#about"
  },
  {
    type: "skill",
    title: "GPU Pipelines & Streaming",
    subtitle: "FFmpeg & Direct3D11 GPU Rendering",
    description: "Deep knowledge in high-performance hardware-accelerated video scaling, low-latency streams, SRT, and RTSP protocols.",
    tags: ["FFmpeg", "Direct3D", "SRT", "RTSP"],
    link: "/#about"
  }
];

export default function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "project" | "experience" | "skill">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Hotkeys (Ctrl + K) & Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setQuery("");
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Search filter algorithm
  const filteredItems = SEARCH_DATABASE.filter((item) => {
    const matchQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchTab = activeTab === "all" || item.type === activeTab;
    return matchQuery && matchTab;
  });

  // Highlight matches
  const renderHighlightedText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      regex.test(part) ? <mark key={idx}>{part}</mark> : part
    );
  };

  const handleItemClick = (link: string) => {
    setIsSearchOpen(false);
    
    // Support hash navigation on current page or route navigation
    if (link.startsWith("/#")) {
      const targetId = link.substring(2);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(link);
      }
    } else {
      router.push(link);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 md:px-0">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="w-full max-w-2xl bg-white border border-black/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10 font-sans"
        >
          {/* Header Input bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search projects, skills, experience..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 outline-none text-[15px] text-gray-800 placeholder-gray-400 bg-transparent font-medium"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Categories Tabs */}
          <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50/50 border-b border-gray-100">
            {(["all", "project", "experience", "skill"] as const).map((tab) => {
              const count = tab === "all" 
                ? SEARCH_DATABASE.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase())).length
                : SEARCH_DATABASE.filter(i => i.type === tab && (i.title.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()))).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg border transition-all ${
                    activeTab === tab
                      ? "bg-[#1a233a] border-[#1a233a] text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {tab === "all" ? "All" : tab + "s"}
                  {count > 0 && <span className="ml-1.5 opacity-60 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Search Results */}
          <div className="max-h-[350px] overflow-y-auto p-3 space-y-1.5">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const Icon = item.type === "project" ? FolderKanban : item.type === "experience" ? Briefcase : Award;
                return (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item.link)}
                    className="w-full text-left p-3.5 rounded-xl hover:bg-gray-50 flex items-start gap-4 transition-colors group cursor-pointer"
                  >
                    <div className="p-2.5 rounded-lg bg-gray-100/80 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-[14px] text-gray-800 leading-tight">
                          {renderHighlightedText(item.title, query)}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                        {renderHighlightedText(item.subtitle, query)}
                      </p>
                      <p className="text-[12px] text-gray-500 leading-relaxed font-light mt-1.5 truncate">
                        {renderHighlightedText(item.description, query)}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5"
                            >
                              {renderHighlightedText(t, query)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm font-light">
                No matches found for <span className="font-semibold text-gray-600">"{query}"</span>
              </div>
            )}
          </div>

          {/* Quick Shortcuts Footer */}
          <div className="px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
            <div className="flex items-center gap-1.5">
              <span>Quick Actions:</span>
              <button onClick={() => handleItemClick("/#work")} className="text-gray-500 hover:text-black font-semibold underline">Projects</button>
              <span>·</span>
              <button onClick={() => handleItemClick("/#about")} className="text-gray-500 hover:text-black font-semibold underline">Experience</button>
              <span>·</span>
              <button onClick={() => handleItemClick("/contact")} className="text-gray-500 hover:text-black font-semibold underline">Contact</button>
            </div>
            <div>
              <span className="bg-white border border-gray-200 px-1 rounded shadow-sm text-[10px] mr-1">ESC</span>
              to close
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
