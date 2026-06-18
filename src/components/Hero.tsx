"use client";

import { useState, useRef, useEffect } from "react";
import { MousePointer2, ArrowDown, MessageCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, animate, useAnimation } from "framer-motion";
import FigmaToolbar from "./FigmaToolbar";
import { useSearch } from "./SearchContext";
import { createPortal } from "react-dom";

const ABOUT_ME_SENTENCES = [
  "Built a federated Video Management System.",
  "50+ concurrent HD streams? No problem.",
  "Peer-to-peer mesh sync across distributed sites.",
  "RSA-OAEP-SHA256 encryption at rest.",
  "Air-gapped update distribution protocol.",
  "Created Yatna.fit — end-to-end fitness app.",
  "C#, TypeScript, Python — fluent in all.",
  "FFmpeg + Direct3D11 GPU rendering pipeline.",
  "CI/CD pipelines are my morning coffee."
];

const THEMES = [
  { bg: "bg-gradient-to-br from-pink-500/25 to-orange-500/25", border: "border-pink-500" },
  { bg: "bg-gradient-to-br from-purple-500/25 to-indigo-500/25", border: "border-purple-500" },
  { bg: "bg-gradient-to-br from-emerald-500/25 to-teal-500/25", border: "border-teal-500" },
  { bg: "bg-gradient-to-br from-amber-400/25 to-rose-500/25", border: "border-rose-500" },
  { bg: "bg-gradient-to-br from-blue-500/25 to-cyan-500/25", border: "border-cyan-500" },
];

// Custom hook to handle 4-corner resizing logic for any box
function useFigmaResize(
  boxId: string, 
  x: any, 
  y: any, 
  setActiveBoxId: (id: string) => void,
  onResizeEnd?: (id: string, corner: string) => void,
  initialWidth: number | undefined = undefined,
  initialHeight: number | undefined = undefined
) {
  const width = useMotionValue<number | undefined>(initialWidth);
  const height = useMotionValue<number | undefined>(initialHeight);
  const ref = useRef<HTMLDivElement>(null);

  const startResize = (e: React.PointerEvent, corner: string) => {
    e.stopPropagation();
    setActiveBoxId(boxId);
    if (!ref.current) return;

    const startX = e.clientX;
    const startY = e.clientY;
    
    const rect = ref.current.getBoundingClientRect();
    const startW = rect.width;
    const startH = rect.height;
    const startBoxX = typeof x.get() === 'number' ? x.get() : 0;
    const startBoxY = typeof y.get() === 'number' ? y.get() : 0;

    // Lock dimensions to pixels
    width.set(startW);
    height.set(startH);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (corner === 'br') {
        width.set(Math.max(50, startW + deltaX));
        height.set(Math.max(50, startH + deltaY));
      } else if (corner === 'tr') {
        width.set(Math.max(50, startW + deltaX));
        const newH = Math.max(50, startH - deltaY);
        height.set(newH);
        y.set(startBoxY + (startH - newH));
      } else if (corner === 'bl') {
        const newW = Math.max(50, startW - deltaX);
        width.set(newW);
        x.set(startBoxX + (startW - newW));
        height.set(Math.max(50, startH + deltaY));
      } else if (corner === 'tl') {
        const newW = Math.max(50, startW - deltaX);
        const newH = Math.max(50, startH - deltaY);
        width.set(newW);
        height.set(newH);
        x.set(startBoxX + (startW - newW));
        y.set(startBoxY + (startH - newH));
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (onResizeEnd) onResizeEnd(boxId, corner);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return { ref, width, height, startResize };
}


// Dynamic Elements Wrapper
function DynamicDraggableBox({ 
  el, 
  activeBoxId, 
  setActiveBoxId, 
  handleDynamicDragEnd, 
  activeTool, 
  handleTrashClick,
  handleDrag,
  handleDragEndComplete,
  isTouchDevice,
  setDynamicElements
}: any) {
  const isSelected = activeBoxId === el.id;
  
  // Create local motion values since it's dynamic
  const localX = useMotionValue(el.x);
  const localY = useMotionValue(el.y);
  
  const { ref, width, height, startResize } = useFigmaResize(el.id, localX, localY, setActiveBoxId);

  useEffect(() => {
    localX.set(el.x);
    localY.set(el.y);
    if (el.width !== undefined) width.set(el.width);
    if (el.height !== undefined) height.set(el.height);
  }, [el.x, el.y, el.width, el.height, localX, localY, width, height]);

  return (
    <motion.div
      ref={ref}
      id={el.id}
      drag={!isTouchDevice && activeTool === "cursor"}
      dragMomentum={false}
      onDragStart={() => setActiveBoxId(el.id)}
      onDrag={() => handleDrag(el.id)}
      onDragEnd={() => { handleDynamicDragEnd(el.id, localX.get(), localY.get()); handleDragEndComplete(); }}
      onClick={(e) => { e.stopPropagation(); setActiveBoxId(el.id); }}
      className="dynamic-box absolute cursor-none inline-block z-40 group pointer-events-auto"
      style={{ left: 0, top: 0, x: localX, y: localY, width, height }}
    >
      {isSelected && (
        <div className="absolute -top-[19px] left-[-1.5px] bg-[#3b82f6] text-white text-[9px] font-bold px-1 py-[1px] z-10 rounded-sm tracking-wide pointer-events-none capitalize">
          {el.type}
        </div>
      )}

      {isSelected && (
        <button
          id={`trash-${el.id}`}
          onClick={(e) => handleTrashClick(el.id, e, true)}
          className="absolute -top-[24px] right-0 bg-red-500 text-white p-[3px] rounded-sm shadow-md pointer-events-auto hover:bg-red-600 transition-colors z-[60] cursor-none"
        >
          <Trash2 size={12} />
        </button>
      )}

      <div 
        className={cn(
          "relative flex pointer-events-auto transition-colors duration-300 w-full h-full",
          isSelected ? "figma-box border-[#3b82f6]" : ""
        )}
      >
        {isSelected && (
          <>
            <div 
              className="figma-handle figma-handle-tl z-50 pointer-events-auto" 
              onPointerDownCapture={(e) => { e.stopPropagation(); startResize(e, 'tl'); }}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'resize-nwse' }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'default' }))}
            ></div>
            <div 
              className="figma-handle figma-handle-tr z-50 pointer-events-auto" 
              onPointerDownCapture={(e) => { e.stopPropagation(); startResize(e, 'tr'); }}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'resize-nesw' }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'default' }))}
            ></div>
            <div 
              className="figma-handle figma-handle-bl z-50 pointer-events-auto" 
              onPointerDownCapture={(e) => { e.stopPropagation(); startResize(e, 'bl'); }}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'resize-nesw' }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'default' }))}
            ></div>
            <div 
              className="figma-handle figma-handle-br z-50 pointer-events-auto" 
              onPointerDownCapture={(e) => { e.stopPropagation(); startResize(e, 'br'); }}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'resize-nwse' }))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'default' }))}
            ></div>
          </>
        )}
        <div className="w-full h-full overflow-hidden">
          {el.type === 'shape' && (
            <div className={cn("w-full h-full border-2 rounded-lg backdrop-blur-sm cursor-none min-w-[80px] min-h-[80px]", el.theme?.bg ?? "bg-blue-500/20", el.theme?.border ?? "border-blue-500")}></div>
          )}
          {el.type === 'type' && (
            <textarea
              value={el.text ?? ""}
              onChange={(e) => {
                const newText = e.target.value;
                setDynamicElements((prev: any[]) =>
                  prev.map(item => item.id === el.id ? { ...item, text: newText } : item)
                );
              }}
              onPointerDownCapture={(e) => e.stopPropagation()}
              placeholder="Type here..."
              className={cn(
                "w-full h-full min-w-[100px] min-h-[40px] text-xl font-bold text-[#1a233a] outline-none cursor-none p-2 bg-white/60 backdrop-blur-sm rounded-md border resize-none",
                el.theme?.border ?? "border-gray-200"
              )}
            />
          )}
          {el.type === 'comment' && (
            <div className="w-full h-full flex items-center justify-center bg-white p-3 rounded-full shadow-lg border border-gray-200 cursor-none min-w-[50px] min-h-[50px]">
              <MessageCircle className="text-yellow-500 fill-yellow-100" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


export default function Hero() {
  const [isPixelFont, setIsPixelFont] = useState(true);
  const { isFancyFont, setIsFancyFont } = useSearch();
  const [activeBoxId, setActiveBoxId] = useState("title");
  const previousActiveBoxId = useRef("title");
  const [isScrollInHero, setIsScrollInHero] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobileSize, setIsMobileSize] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    
    const checkMobileSize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    checkMobileSize();

    const handleScroll = () => {
      setIsScrollInHero(window.scrollY < window.innerHeight - 80);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobileSize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobileSize);
    };
  }, []);
  
  // Tool state
  const [activeTool, setActiveTool] = useState("cursor");
  const [dynamicElements, setDynamicElements] = useState<any[]>([]);

  // Lock page scroll when a non-cursor Figma tool is active (prevents scrolling while operating the canvas)
  useEffect(() => {
    if (activeTool !== "cursor") {
      document.body.style.overflow = "hidden";
      const preventTouch = (e: TouchEvent) => {
        // Allow touches inside the toolbar itself
        const target = e.target as HTMLElement;
        if (target.closest('[id^="tool-"]')) return;
        e.preventDefault();
      };
      document.addEventListener("touchmove", preventTouch, { passive: false });
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("touchmove", preventTouch);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [activeTool]);

  // Click ripples and drag alignment guides state/handlers
  interface Ripple { id: number; x: number; y: number; color: string; }
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const triggerRipple = (x: number, y: number, color = "#3b82f6") => {
    const id = Date.now() + Math.random();
    setRipples(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 800);
  };

  const [dragCenter, setDragCenter] = useState<{ x: number; y: number } | null>(null);
  const handleDrag = (boxId: string) => {
    const el = document.getElementById(boxId);
    const canvas = document.getElementById("inner-canvas");
    if (el && canvas) {
      const rect = el.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      setDragCenter({
        x: rect.left + rect.width / 2 - canvasRect.left,
        y: rect.top + rect.height / 2 - canvasRect.top
      });
    }
  };
  const handleDragEndComplete = () => {
    setDragCenter(null);
  };

  const handleHeroClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerRipple(x, y, "#3b82f6");
  };

  const botControls = useAnimation();
  const isBotBusy = useRef(false);
  const sentenceIndex = useRef(0);

  const setBotBusy = (busy: boolean) => {
    isBotBusy.current = busy;
    window.dispatchEvent(new CustomEvent('bot-busy', { detail: busy }));
  };

  // Trash & Visibility State
  const [visibleBoxes, setVisibleBoxes] = useState({
    title: true,
    summary: true,
    surname: true
  });

  useEffect(() => {
    if (activeBoxId && !activeBoxId.startsWith("bot-") && visibleBoxes[activeBoxId as keyof typeof visibleBoxes] !== false) {
      previousActiveBoxId.current = activeBoxId;
    }
  }, [activeBoxId, visibleBoxes]);

  // Motion values for static elements
  const titleX = useMotionValue(0); const titleY = useMotionValue(0);
  const summaryX = useMotionValue(0); const summaryY = useMotionValue(0);
  const surnameX = useMotionValue(0); const surnameY = useMotionValue(0);

  // Handle Trash Icon Click (Instant Deletion)
  const handleTrashClick = (boxId: string, e: React.MouseEvent, isDynamic: boolean) => {
    e.stopPropagation();
    lastInteractionTime.current = Date.now();

    if (isDynamic) {
      setDynamicElements(prev => prev.filter(el => el.id !== boxId));
    } else {
      setVisibleBoxes(prev => ({ ...prev, [boxId]: false }));
    }
    setActiveBoxId("");
  };

  // Handle Box Resizing (Preserve User Resizing)
  const handleResizeFix = async (boxId: string, corner: string) => {
    lastInteractionTime.current = Date.now();
    setActiveBoxId(boxId);
  };

  // Initialize custom resize logic for the static boxes
  const titleResize = useFigmaResize("title", titleX, titleY, setActiveBoxId, handleResizeFix, undefined, undefined);
  const surnameResize = useFigmaResize("surname", surnameX, surnameY, setActiveBoxId, handleResizeFix, undefined, undefined);
  const summaryResize = useFigmaResize("summary", summaryX, summaryY, setActiveBoxId, handleResizeFix, undefined, undefined);

  const boxes: Record<string, any> = {
    title: { x: titleX, y: titleY, width: titleResize.width, height: titleResize.height, ref: titleResize.ref, startResize: titleResize.startResize },
    summary: { x: summaryX, y: summaryY, width: summaryResize.width, height: summaryResize.height, ref: summaryResize.ref, startResize: summaryResize.startResize },
    surname: { x: surnameX, y: surnameY, width: surnameResize.width, height: surnameResize.height, ref: surnameResize.ref, startResize: surnameResize.startResize }
  };

  const lastInteractionTime = useRef(Date.now() - 3000);
  const sectionRef = useRef<HTMLDivElement>(null);
  const initialSizes = useRef<Record<string, { width: number; height: number }>>({});

  // Caching initial layout sizes of Name, Surname, and Summary
  useEffect(() => {
    const measureInitialSizes = () => {
      // Temporarily clear overrides to measure native sizes
      titleResize.width.set(undefined); titleResize.height.set(undefined);
      surnameResize.width.set(undefined); surnameResize.height.set(undefined);
      summaryResize.width.set(undefined); summaryResize.height.set(undefined);

      setTimeout(() => {
        const titleEl = document.getElementById("title");
        const surnameEl = document.getElementById("surname");
        const summaryEl = document.getElementById("summary");
        if (titleEl) {
          const r = titleEl.getBoundingClientRect();
          initialSizes.current.title = { width: r.width, height: r.height };
        }
        if (surnameEl) {
          const r = surnameEl.getBoundingClientRect();
          initialSizes.current.surname = { width: r.width, height: r.height };
        }
        if (summaryEl) {
          const r = summaryEl.getBoundingClientRect();
          initialSizes.current.summary = { width: r.width, height: r.height };
        }
      }, 100);
    };

    measureInitialSizes();
    window.addEventListener("resize", measureInitialSizes);
    return () => window.removeEventListener("resize", measureInitialSizes);
  }, []);

  // Track user mouse move relative to section canvas for radial gradient glow
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      section.style.setProperty("--user-x", `${x}px`);
      section.style.setProperty("--user-y", `${y}px`);
      section.style.setProperty("--user-active", "1");
    };

    const handleMouseLeave = () => {
      section.style.setProperty("--user-active", "0");
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Track bot cursor coordinates for dynamic bot glow effect
  useEffect(() => {
    let frameId: number;
    const updateBotGlow = () => {
      const section = sectionRef.current;
      const botEl = document.getElementById("bot-cursor");
      if (section && botEl) {
        const rect = botEl.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const x = rect.left - sectionRect.left + 12;
        const y = rect.top - sectionRect.top + 12;
        section.style.setProperty("--bot-x", `${x}px`);
        section.style.setProperty("--bot-y", `${y}px`);
      }
      frameId = requestAnimationFrame(updateBotGlow);
    };
    frameId = requestAnimationFrame(updateBotGlow);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const dynamicElementsRef = useRef(dynamicElements);
  useEffect(() => {
    dynamicElementsRef.current = dynamicElements;
  }, [dynamicElements]);

  const visibleBoxesRef = useRef(visibleBoxes);
  useEffect(() => {
    visibleBoxesRef.current = visibleBoxes;
  }, [visibleBoxes]);

  const activeBoxIdRef = useRef(activeBoxId);
  useEffect(() => {
    activeBoxIdRef.current = activeBoxId;
  }, [activeBoxId]);

  const isFancyFontRef = useRef(isFancyFont);
  useEffect(() => {
    isFancyFontRef.current = isFancyFont;
  }, [isFancyFont]);

  const isPixelFontRef = useRef(isPixelFont);
  useEffect(() => {
    isPixelFontRef.current = isPixelFont;
  }, [isPixelFont]);

  useEffect(() => {
    // Force scroll to top on load and prevent browser scroll restoration from messing with landing
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    }

    const resetIdle = () => { lastInteractionTime.current = Date.now(); };
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("click", resetIdle);
    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("click", resetIdle);
    };
  }, []);

  // ====== AUTONOMOUS BOT ACTION ENGINE ======
  useEffect(() => {
    console.log("Bot action loop useEffect initialized");
    const idleTimer = setInterval(() => {
      const idleTime = Date.now() - lastInteractionTime.current;
      if (idleTime > 2000 && !isBotBusy.current) {
        console.log("Idle threshold exceeded. Starting bot action...", { idleTime, isBusy: isBotBusy.current });
        setBotBusy(true);

        const checkAbort = () => {
          if (Date.now() - lastInteractionTime.current < 2000) {
            throw "abort";
          }
        };

        // Helper: smooth human-like cursor fly along a Bezier curve path
        const flyTo = async (targetX: number, targetY: number, duration = 0.3) => {
          checkAbort();
          
          let currentX = 400;
          let currentY = 200;
          const botEl = document.getElementById("bot-cursor");
          if (botEl) {
            const rect = botEl.getBoundingClientRect();
            currentX = rect.left;
            currentY = rect.top;
          }

          const dx = targetX - currentX;
          const dy = targetY - currentY;
          const distance = Math.hypot(dx, dy);

          if (distance < 15) {
            await botControls.start({ x: targetX, y: targetY, opacity: 1, scale: 1, transition: { duration: 0.1 } });
            return;
          }

          // Perpendicular offset for curved motion
          const perpX = -dy / distance;
          const perpY = dx / distance;
          const curvature = (Math.random() - 0.5) * 0.16 * distance; // curvature height scales with distance
          const midX = currentX + dx / 2 + perpX * curvature;
          const midY = currentY + dy / 2 + perpY * curvature;

          // Build Bezier curve coordinates list (12 interpolation points)
          const steps = 12;
          const pathX = [];
          const pathY = [];
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const px = (1 - t) * (1 - t) * currentX + 2 * (1 - t) * t * midX + t * t * targetX;
            const py = (1 - t) * (1 - t) * currentY + 2 * (1 - t) * t * midY + t * t * targetY;
            pathX.push(px);
            pathY.push(py);
          }

          // Realistic movement speed: noticeably slower travel
          const finalDuration = Math.max(0.5, Math.min(1.2, distance / 400));

          await botControls.start({
            x: pathX,
            y: pathY,
            opacity: 1,
            scale: 1,
            transition: { duration: finalDuration, ease: "easeOut" }
          });
        };

        // Helper: click animation with click coordinates for ripples
        const click = async (cx?: number, cy?: number) => {
          checkAbort();
          if (cx !== undefined && cy !== undefined) {
            triggerRipple(cx, cy, "#ff4e40");
          }
          await botControls.start({ scale: 0.8, transition: { duration: 0.08 } });
          checkAbort();
          await botControls.start({ scale: 1, transition: { duration: 0.08 } });
        };

        // Helper: fly away
        const flyAway = async (fromX: number, fromY: number) => {
          checkAbort();
          const targetX = fromX + (Math.random() - 0.5) * 160;
          const targetY = fromY + (Math.random() - 0.5) * 120;
          await flyTo(targetX, targetY, 0.3);
        };

        // Helper: typing vibration (removed vibration for cursor stability)
        const typeVibrate = (baseX: number, baseY: number) => Promise.resolve();

        // ===== ACTION: Type a sentence =====
        const actionType = async () => {
          checkAbort();
          const isMobile = window.innerWidth < 768;

          // Try to find a completely randomized, non-overlapping spawn point for typing
          let canvasX = 50;
          let canvasY = 320;
          let attempts = 0;
          
          while (attempts < 30) {
            if (isMobile) {
              canvasX = 20 + Math.random() * 120;
              canvasY = 320 + Math.random() * 120;
            } else {
              canvasX = 50 + Math.random() * 950;
              canvasY = 50 + Math.random() * 450;
            }
            
            // Bounding box overlaps check helper
            const overlaps = (x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) => {
              return !(x1 + w1 < x2 || x1 > x2 + w2 || y1 + h1 < y2 || y1 > y2 + h2);
            };

            const overlapsTitle = !isMobile && overlaps(canvasX, canvasY, 320, 90, 360, 48, 400, 160);
            const overlapsSurname = !isMobile && overlaps(canvasX, canvasY, 320, 90, 760, 80, 350, 140);
            const overlapsSummary = !isMobile && overlaps(canvasX, canvasY, 320, 90, 360, 240, 680, 120);
            
            // Also check overlap with existing dynamic elements
            let overlapsDynamic = false;
            for (const el of dynamicElementsRef.current) {
              if (overlaps(canvasX, canvasY, 320, 90, el.x, el.y, el.width ?? 320, el.height ?? 90)) {
                overlapsDynamic = true;
                break;
              }
            }
            
            if (!overlapsTitle && !overlapsSurname && !overlapsSummary && !overlapsDynamic) {
              break;
            }
            attempts++;
          }

          let bx = canvasX, by = canvasY;
          const ic = document.getElementById("inner-canvas");
          if (ic) { 
            const r = ic.getBoundingClientRect(); 
            bx = r.left + canvasX; 
            by = r.top + canvasY; 
          }

          // Fly directly to canvas spawn coordinates
          await flyTo(bx, by, 0.25);
          checkAbort();
          await click(bx, by);

          const boxId = `bot-${Date.now()}`;
          const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
          
          // Spawn with full width and height immediately to save time!
          setDynamicElements(prev => [...prev, { 
            id: boxId, 
            type: 'type', 
            x: canvasX, 
            y: canvasY, 
            width: 320, 
            height: 90, 
            text: "", 
            theme: randomTheme 
          }]);

          // Fly inside the box to select it
          await flyTo(bx + 40, by + 25, 0.2);
          checkAbort();
          await click(bx + 40, by + 25);
          setActiveBoxId(boxId);
          await new Promise(r => setTimeout(r, 100));
          checkAbort();

          const msg = ABOUT_ME_SENTENCES[sentenceIndex.current % ABOUT_ME_SENTENCES.length];
          sentenceIndex.current++;
          
          let text = "";
          for (let i = 0; i < msg.length; i++) {
            checkAbort();
            text += msg[i];
            setDynamicElements(prev => prev.map(el => el.id === boxId ? { ...el, text } : el));
            await new Promise(r => setTimeout(r, 45 + Math.random() * 20)); // slowed down by ~70% (like a natural typed stream)
          }
          
          // Wait 4.5s for user to read it (70% slower read delay before deletion)
          for (let i = 0; i < 45; i++) {
            await new Promise(r => setTimeout(r, 100));
            checkAbort();
          }

          // Fly to trash icon of this box and click it
          let trashX = bx + 320 - 10;
          let trashY = by - 24;
          
          const trashBtn = document.getElementById(`trash-${boxId}`);
          if (trashBtn) {
            const trashRect = trashBtn.getBoundingClientRect();
            trashX = trashRect.left + trashRect.width / 2;
            trashY = trashRect.top + trashRect.height / 2;
          }

          await flyTo(trashX, trashY, 0.2);
          checkAbort();
          await click(trashX, trashY);

          // Delete from state
          setDynamicElements(prev => prev.filter(el => el.id !== boxId));
          setActiveBoxId(previousActiveBoxId.current);
          
          await new Promise(r => setTimeout(r, 100));
          checkAbort();
          await flyAway(trashX, trashY);
        };

        // ===== ACTION: Rearrange a static box =====
        const actionRearrange = async () => {
          const ids = Object.keys(boxes).filter(id => visibleBoxesRef.current[id as keyof typeof visibleBoxes]);
          if (ids.length === 0) { setBotBusy(false); return; }
          const boxId = ids[Math.floor(Math.random() * ids.length)];
          const box = boxes[boxId];
          if (!box.ref.current) { setBotBusy(false); return; }

          const rect = box.ref.current.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          await flyTo(cx, cy, 0.3);
          await flyTo(cx, cy, 0.4);
          await click(cx, cy);
          setActiveBoxId(boxId); // Activate border on rearranged element

          // Capture current position before drag starts
          const startX = box.x.get();
          const startY = box.y.get();
          
          // Drag it a small amount (slower travel)
          const dx = (Math.random() - 0.5) * 120;
          const dy = (Math.random() - 0.5) * 80;
          await Promise.all([
            animate(box.x, startX + dx, { duration: 1.0, ease: "easeInOut" }),
            animate(box.y, startY + dy, { duration: 1.0, ease: "easeInOut" }),
            botControls.start({ x: cx + dx, y: cy + dy, transition: { duration: 1.0, ease: "easeInOut" } })
          ]);

          // Pause, then drag it back to start position
          await new Promise(r => setTimeout(r, 200));
          await Promise.all([
            animate(box.x, startX, { duration: 1.0, ease: "easeInOut" }),
            animate(box.y, startY, { duration: 1.0, ease: "easeInOut" }),
            botControls.start({ x: cx, y: cy, transition: { duration: 1.0, ease: "easeInOut" } })
          ]);

          await flyAway(cx, cy);
          setActiveBoxId(previousActiveBoxId.current);
        };

        // ===== ACTION: Delete a dynamic element =====
        const actionDelete = async () => {
          // Only delete bot-spawned dynamic elements
          const deletable = dynamicElementsRef.current.filter((el: any) => el.id.startsWith('bot-'));
          if (deletable.length === 0) { setBotBusy(false); return; }
          const target = deletable[Math.floor(Math.random() * deletable.length)];

          // 1. Find the element on screen and fly to its center to select it
          let bx = target.x, by = target.y;
          const ic = document.getElementById("inner-canvas");
          if (ic) { 
            const r = ic.getBoundingClientRect(); 
            bx = r.left + target.x; 
            by = r.top + target.y; 
          }

          const btn = document.getElementById(target.id);
          if (btn) {
            const rect = btn.getBoundingClientRect();
            bx = rect.left + rect.width / 2;
            by = rect.top + rect.height / 2;
          } else {
            bx = bx + 40;
            by = by + 20;
          }

          // Fly to roughly the center of the box to select it
          await flyTo(bx, by, 0.4);
          await click(bx, by);
          
          // Select it in state
          setActiveBoxId(target.id);
          await new Promise(r => setTimeout(r, 100)); // wait for trash button to render in DOM

          // 2. Find the trash button coordinate
          let trashX = bx + 80; // fallback default
          let trashY = by - 12; // fallback default
          
          // Try to get exact trash button element in DOM
          const trashBtn = document.getElementById(`trash-${target.id}`);
          if (trashBtn) {
            const trashRect = trashBtn.getBoundingClientRect();
            trashX = trashRect.left + trashRect.width / 2;
            trashY = trashRect.top + trashRect.height / 2;
          }

          // 3. Fly to the trash button and click it
          await flyTo(trashX, trashY, 0.3);
          await click(trashX, trashY);

          // 4. Delete the element from state
          setDynamicElements(prev => prev.filter(el => el.id !== target.id));
          setActiveBoxId(previousActiveBoxId.current);
          
          await new Promise(r => setTimeout(r, 100));
          await flyAway(trashX, trashY);
        };

        // ===== ACTION: Resize a static element briefly =====
        const actionResize = async () => {
          setActiveTool("cursor");
          await new Promise(r => setTimeout(r, 100));

          // Resize static box
          const ids = Object.keys(boxes).filter(id => visibleBoxesRef.current[id as keyof typeof visibleBoxes]);
          if (ids.length === 0) { setBotBusy(false); return; }
          const boxId = ids[Math.floor(Math.random() * ids.length)];
          const box = boxes[boxId];
          if (!box.ref.current) { setBotBusy(false); return; }

          const origW = box.width.get();
          const origH = box.height.get();

          const rect = box.ref.current.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          // Select static box first
          await flyTo(cx, cy, 0.4);
          await click(cx, cy);
          setActiveBoxId(boxId);
          await new Promise(r => setTimeout(r, 100));

          // Corner coordinates
          const updatedRect = box.ref.current.getBoundingClientRect();
          const cornerX = updatedRect.right;
          const cornerY = updatedRect.bottom;

          await flyTo(cornerX, cornerY, 0.4);
          await click(cornerX, cornerY);

          // Lock dimensions
          box.width.set(updatedRect.width);
          box.height.set(updatedRect.height);
          
          // "Drag" the corner out (slower stretch)
          const stretchW = updatedRect.width + 40 + Math.random() * 30;
          const stretchH = updatedRect.height + 20 + Math.random() * 20;
          await Promise.all([
            animate(box.width, stretchW, { duration: 1.0, ease: "easeInOut" }),
            animate(box.height, stretchH, { duration: 1.0, ease: "easeInOut" }),
            botControls.start({ x: cornerX + (stretchW - updatedRect.width), y: cornerY + (stretchH - updatedRect.height), transition: { duration: 1.0, ease: "easeInOut" } })
          ]);

          // Pause and "think"
          await new Promise(r => setTimeout(r, 200));

          // "Drag" it back to original pixel dimension or original value
          const targetW = typeof origW === "number" ? origW : updatedRect.width;
          const targetH = typeof origH === "number" ? origH : updatedRect.height;

          await Promise.all([
            animate(box.width, targetW, { duration: 1.0, ease: "easeInOut" }),
            animate(box.height, targetH, { duration: 1.0, ease: "easeInOut" }),
            botControls.start({ x: cornerX, y: cornerY, transition: { duration: 1.0, ease: "easeInOut" } })
          ]);

          box.width.set(origW);
          box.height.set(origH);
          setActiveBoxId(previousActiveBoxId.current);
          await flyAway(cornerX, cornerY);
        };

        // ===== ACTION: Correct main elements' position/size sequentially =====
        const actionCorrectSequentially = async (targetIds: string[]) => {
          setActiveTool("cursor");
          await new Promise(r => setTimeout(r, 100));

          for (let index = 0; index < targetIds.length; index++) {
            const boxId = targetIds[index];
            const box = boxes[boxId];
            if (!box.ref.current) continue;

            let rect = box.ref.current.getBoundingClientRect();
            const isMoved = Math.abs(box.x.get()) > 2 || Math.abs(box.y.get()) > 2;
            const isResized = box.width.get() !== undefined || box.height.get() !== undefined;

            // 1. Correct position if moved
            if (isMoved) {
              rect = box.ref.current.getBoundingClientRect();
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;

              // Fly to current center and grab
              await flyTo(cx, cy, 0.4);
              await click(cx, cy);
              setActiveBoxId(boxId);
              await new Promise(r => setTimeout(r, 100));

              // Start guides tracking
              const trackInterval = setInterval(() => {
                if (box.ref.current) {
                  const r = box.ref.current.getBoundingClientRect();
                  const canvas = document.getElementById("inner-canvas");
                  if (canvas) {
                    const canvasRect = canvas.getBoundingClientRect();
                    setDragCenter({
                      x: r.left + r.width / 2 - canvasRect.left,
                      y: r.top + r.height / 2 - canvasRect.top
                    });
                  }
                }
              }, 16);

              const origCx = cx - box.x.get();
              const origCy = cy - box.y.get();

              // Drag back to base layout position (slower correction - 0.9s)
              await Promise.all([
                animate(box.x, 0, { duration: 0.9, ease: "easeInOut" }),
                animate(box.y, 0, { duration: 0.9, ease: "easeInOut" }),
                botControls.start({
                  x: origCx,
                  y: origCy,
                  transition: { duration: 0.9, ease: "easeInOut" }
                })
              ]);

              clearInterval(trackInterval);
              setDragCenter(null);
              await new Promise(r => setTimeout(r, 100));
            }

            // 2. Correct size if resized
            if (isResized) {
              const el = box.ref.current;
              const currentW = box.width.get();
              const currentH = box.height.get();
              
              // Get the cached initial sizes!
              const targetW = initialSizes.current[boxId]?.width ?? rect.width;
              const targetH = initialSizes.current[boxId]?.height ?? rect.height;

              if (typeof currentW !== "number") box.width.set(rect.width);
              if (typeof currentH !== "number") box.height.set(rect.height);

              // Fly to the bottom-right handle and click/grab it
              rect = box.ref.current.getBoundingClientRect();
              const cornerX = rect.right;
              const cornerY = rect.bottom;

              setActiveBoxId(boxId);
              await flyTo(cornerX, cornerY, 0.4);
              await click(cornerX, cornerY);
              await new Promise(r => setTimeout(r, 100));

              // Animate resizing back to original size bounds, with bot cursor moving along (slower correction - 0.9s)
              const targetCornerX = rect.left + targetW;
              const targetCornerY = rect.top + targetH;

              await Promise.all([
                animate(box.width, targetW, { duration: 0.9, ease: "easeInOut" }),
                animate(box.height, targetH, { duration: 0.9, ease: "easeInOut" }),
                botControls.start({
                  x: targetCornerX,
                  y: targetCornerY,
                  transition: { duration: 0.9, ease: "easeInOut" }
                })
              ]);

              // Restore responsive auto bounds
              box.width.set(undefined);
              box.height.set(undefined);
              await new Promise(r => setTimeout(r, 100));
            }

            // Deselect/restore element
            setActiveBoxId(previousActiveBoxId.current); 
            await new Promise(r => setTimeout(r, 100));

            // If last target, fly away
            if (index === targetIds.length - 1) {
              rect = box.ref.current.getBoundingClientRect();
              await flyAway(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
          }
        };

        // ===== ACTION: Toggle Fancy Font on JAYRAJ =====
        const actionToggleFancy = async () => {
          checkAbort();
          
          // 1. If JAYRAJ is not active, select it
          if (activeBoxIdRef.current !== "title") {
            const titleBox = boxes["title"];
            if (!titleBox.ref.current) return;
            const rect = titleBox.ref.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            await flyTo(cx, cy, 0.25);
            checkAbort();
            await click(cx, cy);
            setActiveBoxId("title");
            await new Promise(r => setTimeout(r, 200)); // wait for transitions/render
          }
          
          checkAbort();
          
          const titleBox = boxes["title"];
          if (!titleBox.ref.current) return;
          const rect = titleBox.ref.current.getBoundingClientRect();
          
          let toggleX = rect.right - 40;
          let toggleY = rect.bottom + 10;
          
          const fancyBtn = document.getElementById("toggle-fancy");
          if (fancyBtn) {
            const btnRect = fancyBtn.getBoundingClientRect();
            toggleX = btnRect.left + btnRect.width / 2;
            toggleY = btnRect.top + btnRect.height / 2;
          }
          
          await flyTo(toggleX, toggleY, 0.2);
          checkAbort();
          await click(toggleX, toggleY);
          
          setIsFancyFont(!isFancyFontRef.current);
          
          await new Promise(r => setTimeout(r, 250));
          checkAbort();
          await flyAway(toggleX, toggleY);
          setActiveBoxId(previousActiveBoxId.current);
        };

        // ===== ACTION: Toggle Pixel Font on Surname =====
        const actionTogglePixel = async () => {
          checkAbort();
          
          // 1. If Surname is not active, select it
          if (activeBoxIdRef.current !== "surname") {
            const surnameBox = boxes["surname"];
            if (!surnameBox.ref.current) return;
            const rect = surnameBox.ref.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            await flyTo(cx, cy, 0.25);
            checkAbort();
            await click(cx, cy);
            setActiveBoxId("surname");
            await new Promise(r => setTimeout(r, 200)); // wait for transitions/render
          }
          
          checkAbort();
          
          const surnameBox = boxes["surname"];
          if (!surnameBox.ref.current) return;
          const rect = surnameBox.ref.current.getBoundingClientRect();
          
          let toggleX = rect.right - 40;
          let toggleY = rect.bottom + 10;
          
          const pixelBtn = document.getElementById("toggle-pixel");
          if (pixelBtn) {
            const btnRect = pixelBtn.getBoundingClientRect();
            toggleX = btnRect.left + btnRect.width / 2;
            toggleY = btnRect.top + btnRect.height / 2;
          }
          
          await flyTo(toggleX, toggleY, 0.2);
          checkAbort();
          await click(toggleX, toggleY);
          
          setIsPixelFont(!isPixelFontRef.current);
          
          await new Promise(r => setTimeout(r, 250));
          checkAbort();
          await flyAway(toggleX, toggleY);
          setActiveBoxId(previousActiveBoxId.current);
        };

        // ===== ACTION: Slowly drift in the canvas plane =====
        const actionDrift = async () => {
          const canvas = document.getElementById("inner-canvas");
          if (!canvas) { setBotBusy(false); return; }
          const rect = canvas.getBoundingClientRect();
          const targetX = rect.left + Math.random() * (rect.width - 200) + 100;
          const targetY = rect.top + Math.random() * (rect.height - 200) + 100;
          
          await botControls.start({
            x: targetX,
            y: targetY,
            opacity: 1,
            scale: 1,
            transition: { duration: 6 + Math.random() * 4, ease: "linear" }
          });
        };

        // Check if there are any main elements that need correction
        const correctionTargets = Object.keys(boxes).filter(id => {
          const isVisible = visibleBoxesRef.current[id as keyof typeof visibleBoxes];
          if (!isVisible) return false;
          const box = boxes[id];
          const isMoved = Math.abs(box.x.get()) > 2 || Math.abs(box.y.get()) > 2;
          const isResized = box.width.get() !== undefined || box.height.get() !== undefined;
          return isMoved || isResized;
        });

        let chosenAction = actionType;
        let isCorrection = false;
        let isDrift = false;
        
        if (correctionTargets.length > 0) {
          isCorrection = true;
          chosenAction = () => actionCorrectSequentially(correctionTargets);
        } else {
          // Pick a random action with weighted probabilities
          const botSpawnedCount = dynamicElementsRef.current.filter((el: any) => el.id.startsWith('bot-')).length;
          const actions = [
            { fn: actionType, weight: botSpawnedCount >= 1 ? 0 : 40 },
            { fn: actionRearrange, weight: 15 },
            { fn: actionDelete, weight: botSpawnedCount > 0 ? 15 : 0 },
            { fn: actionResize, weight: 10 },
            { fn: actionToggleFancy, weight: 20 },
            { fn: actionTogglePixel, weight: 20 },
            { fn: actionDrift, weight: 30 },
          ];

          const totalWeight = actions.reduce((sum, a) => sum + a.weight, 0);
          let roll = Math.random() * totalWeight;
          chosenAction = actions[0].fn;
          for (const action of actions) {
            roll -= action.weight;
            if (roll <= 0) { 
              chosenAction = action.fn; 
              if (action.fn === actionDrift) isDrift = true;
              break; 
            }
          }
        }

        const runAction = async () => {
          const actionName = isCorrection ? "actionCorrectSequentially" : isDrift ? "actionDrift" : chosenAction.name;
          console.log("Chosen bot action:", actionName);
          try {
            await chosenAction();
            console.log("Bot action completed successfully:", actionName);
          } catch (e: any) {
            if (e !== "abort" && e?.message !== "abort") {
              console.error("Bot action error:", e);
            }
          }

          // Check if there are other elements needing correction
          const remainingCorrections = Object.keys(boxes).filter(id => {
            const isVisible = visibleBoxesRef.current[id as keyof typeof visibleBoxes];
            if (!isVisible) return false;
            const b = boxes[id];
            const isMoved = Math.abs(b.x.get()) > 2 || Math.abs(b.y.get()) > 2;
            const isResized = b.width.get() !== undefined || b.height.get() !== undefined;
            return isMoved || isResized;
          });

          if (remainingCorrections.length > 0) {
            // Keep idle timer active (over the 3.5s threshold) so the bot corrects the next element immediately
            lastInteractionTime.current = Date.now() - 4000;
          } else {
            // No corrections left, let the bot rest
            lastInteractionTime.current = Date.now();
          }

          setBotBusy(false);
          console.log("Bot busy state reset to false");
        };

        runAction();
      }
    }, 1000);

    return () => clearInterval(idleTimer);
  }, [botControls]);

  // Handle Dynamic Element Drop
  const handleDynamicDragEnd = (id: string, newX: number, newY: number) => {
    lastInteractionTime.current = Date.now();
    setActiveBoxId(id);
    setDynamicElements(prev => prev.map(el => el.id === id ? { ...el, x: newX, y: newY } : el));
  };

  // Handle Drop and Fix for static elements
  const handleDragEnd = (boxId: string, info: any) => {
    lastInteractionTime.current = Date.now();
    setActiveBoxId(boxId);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === "cursor" || activeTool === "hand" || activeTool === "frame") return;

    const innerCanvas = document.getElementById("inner-canvas");
    if (!innerCanvas) return;
    
    const rect = innerCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;

    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const defaultWidth = activeTool === "type" ? 180 : activeTool === "shape" ? 100 : 50;
    const defaultHeight = activeTool === "type" ? 80 : activeTool === "shape" ? 100 : 50;

    const newElement = {
      id: `dynamic-${Date.now()}`,
      type: activeTool,
      x: x - defaultWidth / 2, // Center the spawned element on click coordinates
      y: y - defaultHeight / 2,
      width: defaultWidth,
      height: defaultHeight,
      text: activeTool === "type" ? "" : undefined,
      theme: randomTheme
    };

    setDynamicElements((prev) => [...prev, newElement]);
    setActiveBoxId(newElement.id); // Auto-select the newly drawn element
    setActiveTool("cursor"); 
  };

  // Reusable Box Renderer for static elements
  const renderDraggableBox = (id: string, label: string, children: React.ReactNode, extraClasses: string = "") => {
    const isSelected = activeBoxId === id;
    const box = boxes[id];
    const isVisible = visibleBoxes[id as keyof typeof visibleBoxes];

    return (
      <motion.div
        id={id}
        ref={box.ref}
        style={{ x: box.x, y: box.y, width: box.width, height: box.height }}
        drag={!isTouchDevice && activeTool === "cursor"} 
        dragMomentum={false}
        onDragStart={() => setActiveBoxId(id)}
        onDrag={() => handleDrag(id)}
        onDragEnd={(_, info) => { handleDragEnd(id, info); handleDragEndComplete(); }}
        onClick={(e) => { e.stopPropagation(); setActiveBoxId(id); }}
        className={cn(
          "absolute cursor-none flex z-40 group transition-opacity duration-500", 
          extraClasses,
          isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {isSelected && (
          <div className="absolute -top-[19px] left-[-1.5px] bg-[#3b82f6] text-white text-[9px] font-bold px-1 py-[1px] z-10 rounded-sm tracking-wide pointer-events-none">
            {label}
          </div>
        )}

        {isSelected && (
          <button
            id={`trash-${id}`}
            onClick={(e) => handleTrashClick(id, e, false)}
            className="absolute -top-[24px] right-0 bg-red-500 text-white p-[3px] rounded-sm shadow-md pointer-events-auto hover:bg-red-600 transition-colors z-[60] cursor-none"
          >
            <Trash2 size={12} />
          </button>
        )}

        <div 
          className={cn(
            "relative flex transition-all duration-300 h-full w-full rounded-lg",
            isSelected ? "figma-box border-[#3b82f6] shadow-lg shadow-blue-500/5" : ""
          )}
        >
          {isSelected && (
            <>
              <div 
                className="figma-handle figma-handle-tl z-50 pointer-events-auto" 
                onPointerDownCapture={(e) => { e.stopPropagation(); box.startResize(e, 'tl'); }}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'resize-nwse' }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'default' }))}
              ></div>
              <div 
                className="figma-handle figma-handle-tr z-50 pointer-events-auto" 
                onPointerDownCapture={(e) => { e.stopPropagation(); box.startResize(e, 'tr'); }}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'resize-nesw' }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'default' }))}
              ></div>
              <div 
                className="figma-handle figma-handle-bl z-50 pointer-events-auto" 
                onPointerDownCapture={(e) => { e.stopPropagation(); box.startResize(e, 'bl'); }}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'resize-nesw' }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'default' }))}
              ></div>
              <div 
                className="figma-handle figma-handle-br z-50 pointer-events-auto" 
                onPointerDownCapture={(e) => { e.stopPropagation(); box.startResize(e, 'br'); }}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'resize-nwse' }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent('set-cursor', { detail: 'default' }))}
              ></div>
            </>
          )}
          <div className={cn("w-full h-full", (id === "surname" || id === "title") ? "overflow-visible" : "overflow-hidden")}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: id === 'title' ? 0.2 : id === 'surname' ? 0.4 : 0.6 }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      className="h-screen sticky top-0 overflow-hidden cursor-none z-0 figma-canvas"
      onClick={handleHeroClick}
    >
      {ripples.map(r => (
        <motion.div
          key={r.id}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute w-8 h-8 rounded-full border-2 pointer-events-none z-[120]"
          style={{ left: r.x - 16, top: r.y - 16, borderColor: r.color }}
        />
      ))}
      {/* The Global Jayraj Bot Cursor */}
      <motion.div 
        id="bot-cursor"
        animate={botControls}
        initial={{ opacity: 1, x: 400, y: 200 }}
        className={cn(
          "fixed z-[110] pointer-events-none top-0 left-0 transition-opacity duration-300",
          isScrollInHero ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <MousePointer2 className="text-[#ff4e40] fill-[#ff4e40] w-6 h-6 origin-top-left rotate-[-20deg] drop-shadow-md" />
        <div className="bg-[#ff4e40] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] absolute top-5 left-4 shadow-md whitespace-nowrap">
          Jayraj
        </div>
      </motion.div>

      {/* The Pannable Canvas Workspace Wrapper */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* The Pannable Canvas Workspace */}
        <motion.div 
          drag={!isTouchDevice && activeTool === "hand"}
          dragMomentum={false}
          onClick={isTouchDevice ? undefined : handleCanvasClick}
          className={cn(
            "absolute top-0 left-0 w-[200vw] h-[200vh] -translate-x-1/4 -translate-y-1/4",
            isTouchDevice ? "pointer-events-none" : "pointer-events-auto",
            activeTool === "hand" && !isTouchDevice ? "cursor-grab active:cursor-grabbing" : "cursor-none"
          )}
        >
          {/* Inner Canvas Area where elements spawn */}
          <div id="inner-canvas" className="absolute top-1/2 left-1/2 w-screen md:w-full max-w-[1400px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            
            {/* Title (Left) */}
            {renderDraggableBox("title", "Title", (
              <div className="relative w-full h-full flex items-end">
                <h1 className="w-full text-[8vw] md:text-[6vw] lg:text-[7rem] tracking-[-0.02em] text-[#1a233a] leading-none font-bold select-none px-2 md:px-8 pb-2 md:pb-3 cursor-none">
                  JAYRAJ
                </h1>
                {activeBoxId === "title" && (
                  <div className="absolute -bottom-5 right-2 md:right-8 md:-bottom-6 z-[60] flex items-center gap-1 md:gap-2 pointer-events-auto select-none scale-75 md:scale-100 origin-right">
                    <span className="text-[7px] font-bold uppercase tracking-wider text-gray-400">Fancy</span>
                    <button 
                      id="toggle-fancy"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFancyFont(!isFancyFont);
                      }}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      className={cn(
                        "w-7 h-3.5 rounded-full transition-colors relative shadow-sm cursor-none",
                        isFancyFont ? "bg-yellow-500" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full bg-white absolute top-[2px] shadow-sm transition-all",
                        isFancyFont ? "left-3.5" : "left-[2px]"
                      )}></div>
                    </button>
                  </div>
                )}
              </div>
            ), "left-4 md:left-[calc(50%-340px)] w-[calc(50%-20px)] md:w-[400px] top-4 md:top-12 h-[64px] md:h-[160px]")}

            {/* Surname (Right) */}
            {renderDraggableBox("surname", "Surname", (
              <div className="relative w-full h-full flex items-end">
                <h2 className={cn(
                  "w-full text-[8vw] md:text-[6vw] lg:text-[6.5rem] tracking-[-0.02em] text-[#1a233a] leading-none pb-2 md:pb-3 px-2 md:px-8 select-none pointer-events-none cursor-none no-fancy",
                  isPixelFont ? "font-[family-name:var(--font-rubik-pixels)] text-[#3b82f6] opacity-80" : "font-bold"
                )}>
                  PATEL
                </h2>
                {activeBoxId === "surname" && (
                  <div className="absolute -bottom-5 right-2 md:right-8 md:-bottom-6 z-[60] flex items-center gap-1 md:gap-2 pointer-events-auto select-none scale-75 md:scale-100 origin-right">
                    <span className="text-[7px] font-bold uppercase tracking-wider text-gray-400">Pixel</span>
                    <button 
                      id="toggle-pixel"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPixelFont(!isPixelFont);
                      }}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      className={cn(
                        "w-7 h-3.5 rounded-full transition-colors relative shadow-sm cursor-none",
                        isPixelFont ? "bg-blue-500" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full bg-white absolute top-[2px] shadow-sm transition-all",
                        isPixelFont ? "left-3.5" : "left-[2px]"
                      )}></div>
                    </button>
                  </div>
                )}
              </div>
            ), "left-[calc(50%+4px)] md:left-[calc(50%+60px)] w-[calc(50%-20px)] md:w-[350px] top-4 md:top-[80px] h-[64px] md:h-[140px]")}

            {/* Summary (Centered Below) */}
            {renderDraggableBox("summary", "Summary", (
              <p className="w-full h-full text-[#5f6368] text-xs sm:text-sm md:text-base font-[family-name:var(--font-manrope)] leading-relaxed font-light px-4 md:px-6 py-4 md:py-5 select-none cursor-none bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                Aspiring software engineer with hands-on experience in cross-platform development and integrating Large Language Models. Eager to learn, build simple solutions for complex challenges, and contribute to great teams.
              </p>
            ), "left-4 md:left-[calc(50%-340px)] w-[calc(100%-32px)] md:w-[680px] top-[110px] md:top-[240px] h-[170px] md:h-[120px]")}

            {/* Dynamic Elements */}
            {dynamicElements.map(el => (
              <DynamicDraggableBox 
                key={el.id} 
                el={el} 
                activeTool={activeTool}
                activeBoxId={activeBoxId} 
                setActiveBoxId={setActiveBoxId}
                handleDynamicDragEnd={handleDynamicDragEnd}
                handleTrashClick={handleTrashClick}
                handleDrag={handleDrag}
                handleDragEndComplete={handleDragEndComplete}
                isTouchDevice={isTouchDevice}
                setDynamicElements={setDynamicElements}
              />
            ))}

            {/* Visual alignment guides */}
            {dragCenter && (
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {/* Horizontal guide */}
                <div 
                  className="absolute left-0 right-0 border-t border-dashed border-[#3b82f6]/40"
                  style={{ top: dragCenter.y }}
                />
                {/* Vertical guide */}
                <div 
                  className="absolute top-0 bottom-0 border-l border-dashed border-[#3b82f6]/40"
                  style={{ left: dragCenter.x }}
                />
              </div>
            )}

          </div>
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="w-full h-screen relative max-w-[1400px] mx-auto pointer-events-none pt-32 pb-12">
        {/* Discover Me Button */}
        <div className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#1a233a] text-white px-6 py-3 rounded-full text-[9px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-black transition-colors z-20 cursor-none"
          >
            Discover Me <ArrowDown size={12} />
          </button>
          <span className="text-[8px] uppercase tracking-widest text-gray-400 font-mono cursor-none">Or Scroll Down</span>
        </div>
      </div>

      {mounted && typeof document !== "undefined" && isMobileSize && createPortal(
        <FigmaToolbar activeTool={activeTool} setActiveTool={setActiveTool} isVisible={isScrollInHero} />,
        document.body
      )}

    </section>
  );
}
