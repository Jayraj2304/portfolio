"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface NetraCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NETRA_IMAGES = [
  {
    src: "/netra/login_client.png",
    title: "VMS Client Login Portal",
    subtitle: "Security & Authentication",
    description: "Administrative gateway for the Netra VMS Client, featuring secure session handshake, user credential verification, and server socket binding."
  },
  {
    src: "/netra/dashboard.png",
    title: "Client Controls Dashboard",
    subtitle: "Central Command",
    description: "Centralized management console displaying system-wide health diagnostic matrices, camera connection trees, active alarms, and system-wide GPU/CPU utilization curves."
  },
  {
    src: "/netra/live_watch_page.png",
    title: "Live Video Streaming Grid",
    subtitle: "Concurrent Feeds Monitoring",
    description: "High-throughput live stream grid rendering concurrent video feeds with sub-150ms latency, leveraging Direct3D11 GPU-accelerated texture composition."
  },
  {
    src: "/netra/ptz_live.png",
    title: "PTZ Stream Control & Relays",
    subtitle: "Interactive Camera Manipulation",
    description: "Interactive Pan-Tilt-Zoom (PTZ) controller mapping mouse drag and click coordinates directly to IP cameras with dynamic speed scaling and preset tour trigger panels."
  },
  {
    src: "/netra/playback_single.png",
    title: "Single Feed Archive Playback",
    subtitle: "Historical Investigation",
    description: "Dedicated single-stream historical replay engine equipped with an interactive, scrollable scrub timeline, precision speed controls, and segment extraction tools."
  },
  {
    src: "/netra/playback_multi.png",
    title: "Multi-Feed Time-Synced Playback",
    subtitle: "Multi-Coordinate Reconstruction",
    description: "Synchronous timeline playback of up to 4 camera feeds, enabling precise incident investigation and timeline reconstruction across multiple locations."
  },
  {
    src: "/netra/tour_create.png",
    title: "Automated Camera Patrol Sequencer",
    subtitle: "Patrol Sequencing & Automation",
    description: "Visual sequencer to program automated camera patrol paths (Tours), scheduling dwell times, pan angles, and zoom ratios per waypoint."
  },
  {
    src: "/netra/nvr_vault.png",
    title: "Storage Tier & Drive Array Controller",
    subtitle: "NVR Storage Management",
    description: "Low-level archive management system tracking recording drive status, storage allocations, retention policies, and disk write performance metrics."
  },
  {
    src: "/netra/server_dashboard.png",
    title: "Socket Relays & Hardware Relays",
    subtitle: "Active Server Management",
    description: "Active system manager displaying socket relays, real-time client traffic, active frame processing rates, and system temperature indicators."
  },
  {
    src: "/netra/status_of_camera.png",
    title: "Camera Diagnostics Matrix",
    subtitle: "Quality & Stream Integrity",
    description: "Diagnostic panel displaying real-time stream parameters: frame rate (FPS), incoming bitrate, active video codec, and network packets lost."
  },
  {
    src: "/netra/role_base_user_creation.png",
    title: "RBAC Access Control Editor",
    subtitle: "User Permissions & Roles",
    description: "Fine-grained administrative portal managing user access profiles, camera-specific viewing permissions, and active audit logs."
  },
  {
    src: "/netra/web_dashboard_2.png",
    title: "Web Administration Console",
    subtitle: "Remote Web Portal",
    description: "Responsive React Web dashboard designed for administrators to audit device health, stream status, and system alerts remotely."
  }
];

export default function NetraCarouselModal({ isOpen, onClose }: NetraCarouselModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Prevent scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Autoplay Slideshow
  useEffect(() => {
    if (isPlaying && isOpen) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % NETRA_IMAGES.length);
      }, 5000);
    } else {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPlaying, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeElement = thumbnailContainerRef.current.children[currentIndex] as HTMLElement;
      if (activeElement) {
        const containerWidth = thumbnailContainerRef.current.offsetWidth;
        const elementOffset = activeElement.offsetLeft;
        const elementWidth = activeElement.offsetWidth;
        
        thumbnailContainerRef.current.scrollTo({
          left: elementOffset - containerWidth / 2 + elementWidth / 2,
          behavior: "smooth"
        });
      }
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? NETRA_IMAGES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === NETRA_IMAGES.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col justify-between bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 text-white overflow-hidden"
      >
        {/* Glow Blobs behind content */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] animate-pulse duration-[8000ms]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse duration-[12000ms]"></div>
        </div>

        {/* Modal Header */}
        <div className="flex justify-between items-center w-full border-b border-white/10 pb-4">
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase font-[family-name:var(--font-miriam)]">
              ICE MAKE NETRA VMS
            </h4>
            <p className="text-lg font-light text-slate-200 font-[family-name:var(--font-manrope)]">
              Interactive Systems Showcase
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-cyan-400 hover:text-cyan-400 bg-white/5 transition-all text-xs font-semibold tracking-wider uppercase font-[family-name:var(--font-miriam)]"
            >
              {isPlaying ? (
                <>
                  <Pause size={12} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={12} />
                  <span>Autoplay</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 hover:border-red-400 hover:text-red-400 bg-white/5 transition-all"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-6 overflow-hidden">
          {/* Left/Middle: Large Image Viewport */}
          <div className="col-span-1 lg:col-span-8 flex flex-col justify-center items-center relative h-full max-h-[55vh] lg:max-h-[65vh] w-full">
            {/* Viewport Control Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-2 z-25 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-cyan-400 transition-all text-white/70 hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="relative w-full max-w-[800px] flex flex-col items-center p-4">
              {/* Laptop Screen Body */}
              <div className="relative w-full aspect-[16/9] bg-slate-950 border-[10px] sm:border-[14px] border-slate-800 rounded-t-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col border-b-0">
                {/* Top Bezel Camera Dot */}
                <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-700/60 flex items-center justify-center z-20">
                  <div className="w-0.5 h-0.5 rounded-full bg-blue-500/80"></div>
                </div>
                
                {/* Screen Content */}
                <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      src={NETRA_IMAGES[currentIndex].src}
                      alt={NETRA_IMAGES[currentIndex].title}
                      className="w-full h-full object-contain select-none"
                    />
                  </AnimatePresence>
                  {/* Screen glare/reflection overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10 z-10" />
                </div>
              </div>

              {/* Laptop Hinge & Base */}
              <div className="relative w-[108%] h-2.5 sm:h-3.5 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 rounded-b-2xl shadow-2xl flex items-center justify-center border-t border-slate-600/50">
                {/* Trackpad Indentation */}
                <div className="w-16 sm:w-24 h-1 bg-slate-600/30 rounded-t border-t border-white/10" />
              </div>
            </div>

            <button
              onClick={handleNext}
              className="absolute right-2 z-25 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-cyan-400 transition-all text-white/70 hover:text-white"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Right Panel: Descriptions */}
          <div className="col-span-1 lg:col-span-4 flex flex-col justify-center h-full lg:max-h-[65vh] pr-2">
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-md flex flex-col justify-between h-auto min-h-[300px]">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase font-[family-name:var(--font-miriam)]">
                    System Component {currentIndex + 1} / {NETRA_IMAGES.length}
                  </span>
                  <span className="text-[10px] px-2.5 py-1 font-semibold text-slate-300 bg-white/5 rounded border border-white/10 uppercase tracking-widest font-[family-name:var(--font-miriam)]">
                    {NETRA_IMAGES[currentIndex].subtitle}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-white font-[family-name:var(--font-manrope)]">
                    {NETRA_IMAGES[currentIndex].title}
                  </h3>
                  <p className="text-sm lg:text-[15px] font-light text-slate-300 leading-relaxed font-[family-name:var(--font-manrope)]">
                    {NETRA_IMAGES[currentIndex].description}
                  </p>
                </div>
              </div>

              {/* Progress bar indication */}
              <div className="mt-8">
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-cyan-400 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / NETRA_IMAGES.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer: Thumbnail Strip */}
        <div className="w-full border-t border-white/10 pt-4 flex flex-col gap-3">
          <div className="text-xs font-bold tracking-[0.15em] text-slate-400 uppercase font-[family-name:var(--font-miriam)] flex justify-between">
            <span>Visual Index / Storyboard</span>
            <span className="text-cyan-400">{currentIndex + 1} of {NETRA_IMAGES.length}</span>
          </div>

          <div
            ref={thumbnailContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700 select-none cursor-pointer"
          >
            {NETRA_IMAGES.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`relative flex-shrink-0 w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden border transition-all duration-300 group ${
                  idx === currentIndex
                    ? "border-cyan-400 scale-[1.05] ring-2 ring-cyan-400/20"
                    : "border-white/10 opacity-50 hover:opacity-100 hover:scale-[1.02]"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay index */}
                <span className="absolute bottom-1 right-1 bg-black/70 px-1 text-[8px] font-bold text-white rounded font-[family-name:var(--font-miriam)]">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
