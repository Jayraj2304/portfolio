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
          "figma-box relative flex pointer-events-auto border transition-colors duration-300 w-full h-full",
          isSelected ? "border-[#3b82f6]" : "border-transparent group-hover:border-black/10"
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

  const lastInteractionTime = useRef(Date.now());

  const dynamicElementsRef = useRef(dynamicElements);
  useEffect(() => {
    dynamicElementsRef.current = dynamicElements;
  }, [dynamicElements]);

  const visibleBoxesRef = useRef(visibleBoxes);
  useEffect(() => {
    visibleBoxesRef.current = visibleBoxes;
  }, [visibleBoxes]);

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
      if (idleTime > 3500 && !isBotBusy.current) {
        console.log("Idle threshold exceeded. Starting bot action...", { idleTime, isBusy: isBotBusy.current });
        setBotBusy(true);

        // Helper: smooth human-like cursor fly
        const flyTo = (x: number, y: number, duration = 0.5) =>
          botControls.start({ x, y, opacity: 1, scale: 1, transition: { duration, ease: [0.16, 1, 0.3, 1] } });

        // Helper: click animation with click coordinates for ripples
        const click = async (cx?: number, cy?: number) => {
          if (cx !== undefined && cy !== undefined) {
            triggerRipple(cx, cy, "#ff4e40");
          }
          await botControls.start({ scale: 0.8, transition: { duration: 0.08 } });
          await botControls.start({ scale: 1, transition: { duration: 0.08 } });
        };

        // Helper: fly away
        const flyAway = async (fromX: number, fromY: number) => {
          await botControls.start({
            x: fromX + (Math.random() - 0.5) * 160,
            y: fromY + (Math.random() - 0.5) * 120,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
          });
        };

        // Helper: typing vibration (removed vibration for cursor stability)
        const typeVibrate = (baseX: number, baseY: number) => Promise.resolve();

        // ===== ACTION: Type a sentence =====
        const actionType = async () => {
          const isMobile = window.innerWidth < 768;
          const existingBox = isMobile 
            ? dynamicElementsRef.current.find((el: any) => el.type === 'type' && el.id.startsWith('bot-'))
            : null;

          if (existingBox) {
            let bx = existingBox.x;
            let by = existingBox.y;
            const ic = document.getElementById("inner-canvas");
            if (ic) { 
              const r = ic.getBoundingClientRect(); 
              bx = r.left + existingBox.x; 
              by = r.top + existingBox.y; 
            }
            const elDom = document.getElementById(existingBox.id);
            if (elDom) {
              const rect = elDom.getBoundingClientRect();
              bx = rect.left + rect.width / 2;
              by = rect.top + rect.height / 2;
            }

            await flyTo(bx, by, 0.4);
            await click(bx, by);
            setActiveBoxId(existingBox.id);
            await new Promise(r => setTimeout(r, 150));

            // Erase the text one by one
            let text = existingBox.text || "";
            while (text.length > 0) {
              text = text.substring(0, text.length - 1);
              setDynamicElements(prev => prev.map(el => el.id === existingBox.id ? { ...el, text } : el));
              await new Promise(r => setTimeout(r, 10 + Math.random() * 10));
            }

            // Write the new sentence
            const msg = ABOUT_ME_SENTENCES[sentenceIndex.current % ABOUT_ME_SENTENCES.length];
            sentenceIndex.current++;
            for (let i = 0; i < msg.length; i++) {
              text += msg[i];
              setDynamicElements(prev => prev.map(el => el.id === existingBox.id ? { ...el, text } : el));
              await new Promise(r => setTimeout(r, 15 + Math.random() * 10));
            }
            await new Promise(r => setTimeout(r, 300));
            
            // Deselect
            setActiveBoxId("");
            await new Promise(r => setTimeout(r, 200));
            await flyAway(bx, by);
            return;
          }

          const btn = document.getElementById("tool-type");
          let tx = 40, ty = window.innerHeight / 2 - 20;
          if (btn) {
            const rect = btn.getBoundingClientRect();
            tx = rect.left + rect.width / 2;
            ty = rect.top + rect.height / 2;
          }
          await flyTo(tx, ty, 0.4);
          await click(tx, ty);
          setActiveTool("type"); // Select the tool visually!
          await new Promise(r => setTimeout(r, 150));

          // Try to find a non-overlapping spawn point for typing
          const existingCount = document.querySelectorAll('.dynamic-box').length;
          let canvasX = 50 + Math.random() * 150;
          let canvasY = 420 + (existingCount * 60);

          let attempts = 0;
          while (attempts < 15) {
            let overlaps = false;
            for (const el of dynamicElementsRef.current) {
              const dx = Math.abs(el.x - canvasX);
              const dy = Math.abs(el.y - canvasY);
              if (dx < 120 && dy < 50) {
                overlaps = true;
                break;
              }
            }
            if (!overlaps) break;
            canvasX = 50 + Math.random() * 150;
            canvasY = 420 + (existingCount * 60) + (Math.random() - 0.5) * 20;
            attempts++;
          }

          let bx = canvasX, by = canvasY;
          const ic = document.getElementById("inner-canvas");
          if (ic) { const r = ic.getBoundingClientRect(); bx = r.left + canvasX; by = r.top + canvasY; }

          await flyTo(bx, by, 0.4);
          await click(bx, by);

          const boxId = `bot-${Date.now()}`;
          const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
          setDynamicElements(prev => [...prev, { id: boxId, type: 'type', x: canvasX, y: canvasY, width: 20, height: 20, text: "", theme: randomTheme }]);

          // Drag outward to draw the box size visually
          const finalW = 160 + Math.floor(Math.random() * 40);
          const finalH = 50;
          
          await Promise.all([
            botControls.start({
              x: bx + finalW,
              y: by + finalH,
              transition: { duration: 0.5, ease: "easeOut" }
            }),
            (async () => {
              const steps = 15;
              for (let i = 1; i <= steps; i++) {
                const ratio = i / steps;
                const w = 20 + (finalW - 20) * ratio;
                const h = 20 + (finalH - 20) * ratio;
                setDynamicElements(prev => prev.map(el => el.id === boxId ? { ...el, width: w, height: h } : el));
                await new Promise(r => setTimeout(r, 20));
              }
            })()
          ]);

          // Select cursor tool back
          setActiveTool("cursor");
          await new Promise(r => setTimeout(r, 100));
          
          // Click to focus and select the box
          await flyTo(bx + 40, by + 20, 0.3);
          await click(bx + 40, by + 20);
          setActiveBoxId(boxId);
          await new Promise(r => setTimeout(r, 150));

          const msg = ABOUT_ME_SENTENCES[sentenceIndex.current % ABOUT_ME_SENTENCES.length];
          sentenceIndex.current++;
          let text = "";
          for (let i = 0; i < msg.length; i++) {
            text += msg[i];
            setDynamicElements(prev => prev.map(el => el.id === boxId ? { ...el, text } : el));
            await new Promise(r => setTimeout(r, 15 + Math.random() * 10));
          }
          await new Promise(r => setTimeout(r, 300));

          // Drag the bottom-right corner handle to resize the box to fit the long text
          let cornerX = bx + finalW;
          let cornerY = by + finalH;

          const el = document.getElementById(boxId);
          if (el) {
            const brHandle = el.querySelector(".figma-handle-br");
            if (brHandle) {
              const handleRect = brHandle.getBoundingClientRect();
              cornerX = handleRect.left + handleRect.width / 2;
              cornerY = handleRect.top + handleRect.height / 2;
            }
          }

          // Fly to the bottom-right corner handle
          await flyTo(cornerX, cornerY, 0.4);
          await click(cornerX, cornerY);
          await new Promise(r => setTimeout(r, 150));

          // Drag the corner out to make the text box wider and taller so the text is fully visible
          const stretchW = finalW + 150;
          const stretchH = finalH + 35;
          await Promise.all([
            botControls.start({
              x: cornerX + 150,
              y: cornerY + 35,
              transition: { duration: 0.6, ease: "easeInOut" }
            }),
            (async () => {
              const steps = 15;
              for (let i = 1; i <= steps; i++) {
                const ratio = i / steps;
                const w = finalW + 150 * ratio;
                const h = finalH + 35 * ratio;
                setDynamicElements(prev => prev.map(item => item.id === boxId ? { ...item, width: w, height: h } : item));
                await new Promise(r => setTimeout(r, 25));
              }
            })()
          ]);

          // Deselect the box
          setActiveBoxId("");
          await new Promise(r => setTimeout(r, 200));
          await flyAway(cornerX + 150, cornerY + 35);
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

          await flyTo(cx, cy, 0.5);
          await click(cx, cy);

          // Capture current position before drag starts
          const startX = box.x.get();
          const startY = box.y.get();

          // Drag it a small amount
          const dx = (Math.random() - 0.5) * 120;
          const dy = (Math.random() - 0.5) * 80;
          await Promise.all([
            animate(box.x, startX + dx, { duration: 0.6, ease: "easeInOut" }),
            animate(box.y, startY + dy, { duration: 0.6, ease: "easeInOut" }),
            botControls.start({ x: cx + dx, y: cy + dy, transition: { duration: 0.6, ease: "easeInOut" } })
          ]);

          // Pause, then drag it back to start position
          await new Promise(r => setTimeout(r, 200));
          await Promise.all([
            animate(box.x, startX, { duration: 0.6, ease: "easeInOut" }),
            animate(box.y, startY, { duration: 0.6, ease: "easeInOut" }),
            botControls.start({ x: cx, y: cy, transition: { duration: 0.6, ease: "easeInOut" } })
          ]);

          await flyAway(cx, cy);
        };

        // ===== ACTION: Spawn a shape =====
        const actionShape = async () => {
          const isMobile = window.innerWidth < 768;
          const existingShape = isMobile 
            ? dynamicElementsRef.current.find((el: any) => el.type === 'shape' && el.id.startsWith('bot-'))
            : null;

          if (existingShape) {
            let bx = existingShape.x;
            let by = existingShape.y;
            const ic = document.getElementById("inner-canvas");
            if (ic) { 
              const r = ic.getBoundingClientRect(); 
              bx = r.left + existingShape.x; 
              by = r.top + existingShape.y; 
            }
            const elDom = document.getElementById(existingShape.id);
            if (elDom) {
              const rect = elDom.getBoundingClientRect();
              bx = rect.left + rect.width / 2;
              by = rect.top + rect.height / 2;
            }

            await flyTo(bx, by, 0.4);
            await click(bx, by);
            setActiveBoxId(existingShape.id);
            await new Promise(r => setTimeout(r, 150));

            // Select a new theme/color
            const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
            setDynamicElements(prev => prev.map(el => el.id === existingShape.id ? { ...el, theme: randomTheme } : el));
            
            // Resize it slightly
            const origW = existingShape.width || 100;
            const origH = existingShape.height || 100;
            const newW = origW === 100 ? 140 : 100;
            const newH = origH === 100 ? 140 : 100;

            const steps = 15;
            for (let i = 1; i <= steps; i++) {
              const ratio = i / steps;
              const w = origW + (newW - origW) * ratio;
              const h = origH + (newH - origH) * ratio;
              setDynamicElements(prev => prev.map(el => el.id === existingShape.id ? { ...el, width: w, height: h } : el));
              await new Promise(r => setTimeout(r, 20));
            }

            // Deselect
            setActiveBoxId("");
            await new Promise(r => setTimeout(r, 200));
            await flyAway(bx, by);
            return;
          }

          const btn = document.getElementById("tool-shape");
          let tx = 40, ty = window.innerHeight / 2 + 30;
          if (btn) {
            const rect = btn.getBoundingClientRect();
            tx = rect.left + rect.width / 2;
            ty = rect.top + rect.height / 2;
          }
          await flyTo(tx, ty, 0.4);
          await click(tx, ty);
          setActiveTool("shape"); // Select the tool visually!
          await new Promise(r => setTimeout(r, 150));

          // Try to find a non-overlapping spawn point for shape
          let canvasX = 600 + Math.random() * 200;
          let canvasY = 420 + Math.random() * 100;

          let attempts = 0;
          while (attempts < 15) {
            let overlaps = false;
            for (const el of dynamicElementsRef.current) {
              const dx = Math.abs(el.x - canvasX);
              const dy = Math.abs(el.y - canvasY);
              if (dx < 100 && dy < 100) {
                overlaps = true;
                break;
              }
            }
            if (!overlaps) break;
            canvasX = 600 + Math.random() * 200;
            canvasY = 420 + Math.random() * 100;
            attempts++;
          }

          let bx = canvasX, by = canvasY;
          const ic = document.getElementById("inner-canvas");
          if (ic) { const r = ic.getBoundingClientRect(); bx = r.left + canvasX; by = r.top + canvasY; }

          await flyTo(bx, by, 0.4);
          await click(bx, by);

          const boxId = `bot-shape-${Date.now()}`;
          const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
          setDynamicElements(prev => [...prev, { id: boxId, type: 'shape', x: canvasX, y: canvasY, width: 20, height: 20, theme: randomTheme }]);

          // Drag outward to draw the shape size visually
          const finalW = 100 + Math.floor(Math.random() * 60);
          const finalH = 100 + Math.floor(Math.random() * 60);
          
          await Promise.all([
            botControls.start({
              x: bx + finalW,
              y: by + finalH,
              transition: { duration: 0.5, ease: "easeOut" }
            }),
            (async () => {
              const steps = 15;
              for (let i = 1; i <= steps; i++) {
                const ratio = i / steps;
                const w = 20 + (finalW - 20) * ratio;
                const h = 20 + (finalH - 20) * ratio;
                setDynamicElements(prev => prev.map(el => el.id === boxId ? { ...el, width: w, height: h } : el));
                await new Promise(r => setTimeout(r, 20));
              }
            })()
          ]);

          // Select cursor tool back
          setActiveTool("cursor");
          await new Promise(r => setTimeout(r, 100));
          await flyAway(bx + finalW, by + finalH);
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
          await flyTo(bx, by, 0.5);
          await click(bx, by);
          
          // Select it in state
          setActiveBoxId(target.id);
          await new Promise(r => setTimeout(r, 150)); // wait for trash button to render in DOM

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
          await flyTo(trashX, trashY, 0.4);
          await click(trashX, trashY);

          // 4. Delete the element from state
          setDynamicElements(prev => prev.filter(el => el.id !== target.id));
          setActiveBoxId("");
          
          await new Promise(r => setTimeout(r, 100));
          await flyAway(trashX, trashY);
        };

        // ===== ACTION: Resize a static element briefly =====
        const actionResize = async () => {
          setActiveTool("cursor");
          await new Promise(r => setTimeout(r, 100));

          // Randomly choose to resize a static box or a bot dynamic shape
          const botShapes = dynamicElementsRef.current.filter((el: any) => el.id.startsWith('bot-'));
          const useDynamic = botShapes.length > 0 && Math.random() > 0.5;

          if (useDynamic) {
            const target = botShapes[Math.floor(Math.random() * botShapes.length)];
            const el = document.getElementById(target.id);
            if (!el) { setBotBusy(false); return; }

            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            // Click the dynamic shape to select it and show handles
            await flyTo(cx, cy, 0.4);
            await click(cx, cy);
            setActiveBoxId(target.id);
            await new Promise(r => setTimeout(r, 150));

            // Get bottom-right corner position
            const updatedRect = el.getBoundingClientRect();
            const cornerX = updatedRect.right;
            const cornerY = updatedRect.bottom;

            await flyTo(cornerX, cornerY, 0.4);
            await click(cornerX, cornerY);

            // Drag the corner out
            const stretchW = updatedRect.width + 40 + Math.random() * 40;
            const stretchH = updatedRect.height + 20 + Math.random() * 20;

            await Promise.all([
              botControls.start({
                x: cornerX + (stretchW - updatedRect.width),
                y: cornerY + (stretchH - updatedRect.height),
                transition: { duration: 0.6, ease: "easeInOut" }
              }),
              (async () => {
                const steps = 15;
                for (let i = 1; i <= steps; i++) {
                  const ratio = i / steps;
                  const w = updatedRect.width + (stretchW - updatedRect.width) * ratio;
                  const h = updatedRect.height + (stretchH - updatedRect.height) * ratio;
                  setDynamicElements(prev => prev.map(el => el.id === target.id ? { ...el, width: w, height: h } : el));
                  await new Promise(r => setTimeout(r, 25));
                }
              })()
            ]);

            // Drag it back
            await new Promise(r => setTimeout(r, 200));

            await Promise.all([
              botControls.start({
                x: cornerX,
                y: cornerY,
                transition: { duration: 0.6, ease: "easeInOut" }
              }),
              (async () => {
                const steps = 15;
                for (let i = 1; i <= steps; i++) {
                  const ratio = i / steps;
                  const w = stretchW - (stretchW - updatedRect.width) * ratio;
                  const h = stretchH - (stretchH - updatedRect.height) * ratio;
                  setDynamicElements(prev => prev.map(el => el.id === target.id ? { ...el, width: w, height: h } : el));
                  await new Promise(r => setTimeout(r, 25));
                }
              })()
            ]);

            await flyAway(cornerX, cornerY);
          } else {
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
            await new Promise(r => setTimeout(r, 150));

            // Corner coordinates
            const updatedRect = box.ref.current.getBoundingClientRect();
            const cornerX = updatedRect.right;
            const cornerY = updatedRect.bottom;

            await flyTo(cornerX, cornerY, 0.4);
            await click(cornerX, cornerY);

            // Lock dimensions
            box.width.set(updatedRect.width);
            box.height.set(updatedRect.height);

            // "Drag" the corner out
            const stretchW = updatedRect.width + 40 + Math.random() * 30;
            const stretchH = updatedRect.height + 20 + Math.random() * 20;
            await Promise.all([
              animate(box.width, stretchW, { duration: 0.6, ease: "easeInOut" }),
              animate(box.height, stretchH, { duration: 0.6, ease: "easeInOut" }),
              botControls.start({ x: cornerX + (stretchW - updatedRect.width), y: cornerY + (stretchH - updatedRect.height), transition: { duration: 0.6, ease: "easeInOut" } })
            ]);

            // Pause and "think"
            await new Promise(r => setTimeout(r, 200));

            // "Drag" it back to original pixel dimension or original value
            const targetW = typeof origW === "number" ? origW : updatedRect.width;
            const targetH = typeof origH === "number" ? origH : updatedRect.height;

            await Promise.all([
              animate(box.width, targetW, { duration: 0.6, ease: "easeInOut" }),
              animate(box.height, targetH, { duration: 0.6, ease: "easeInOut" }),
              botControls.start({ x: cornerX, y: cornerY, transition: { duration: 0.6, ease: "easeInOut" } })
            ]);

            box.width.set(origW);
            box.height.set(origH);
            await flyAway(cornerX, cornerY);
          }
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
              await new Promise(r => setTimeout(r, 150));

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

              // Drag back to base layout position
              await Promise.all([
                animate(box.x, 0, { duration: 0.6, ease: "easeInOut" }),
                animate(box.y, 0, { duration: 0.6, ease: "easeInOut" }),
                botControls.start({
                  x: origCx,
                  y: origCy,
                  transition: { duration: 0.6, ease: "easeInOut" }
                })
              ]);

              clearInterval(trackInterval);
              setDragCenter(null);
              await new Promise(r => setTimeout(r, 150));
            }

            // 2. Correct size if resized
            if (isResized) {
              const el = box.ref.current;
              const currentW = box.width.get();
              const currentH = box.height.get();
              
              // Measure auto bounds
              const origStyleW = el.style.width;
              const origStyleH = el.style.height;
              el.style.width = "auto";
              el.style.height = "auto";
              const autoRect = el.getBoundingClientRect();
              const autoW = autoRect.width;
              const autoH = autoRect.height;
              el.style.width = origStyleW;
              el.style.height = origStyleH;

              if (typeof currentW !== "number") box.width.set(rect.width);
              if (typeof currentH !== "number") box.height.set(rect.height);

              // Fly to the bottom-right handle and click/grab it
              rect = box.ref.current.getBoundingClientRect();
              const cornerX = rect.right;
              const cornerY = rect.bottom;

              setActiveBoxId(boxId);
              await flyTo(cornerX, cornerY, 0.4);
              await click(cornerX, cornerY);
              await new Promise(r => setTimeout(r, 150));

              // Animate resizing to auto bounds, with bot cursor moving along
              const targetCornerX = rect.left + autoW;
              const targetCornerY = rect.top + autoH;

              await Promise.all([
                animate(box.width, autoW, { duration: 0.6, ease: "easeInOut" }),
                animate(box.height, autoH, { duration: 0.6, ease: "easeInOut" }),
                botControls.start({
                  x: targetCornerX,
                  y: targetCornerY,
                  transition: { duration: 0.6, ease: "easeInOut" }
                })
              ]);

              // Restore responsive auto bounds
              box.width.set(undefined);
              box.height.set(undefined);
              await new Promise(r => setTimeout(r, 150));
            }

            // Deselect element
            setActiveBoxId(""); 
            await new Promise(r => setTimeout(r, 200));

            // If last target, fly away
            if (index === targetIds.length - 1) {
              rect = box.ref.current.getBoundingClientRect();
              await flyAway(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
          }
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
            { fn: actionType, weight: botSpawnedCount >= 2 ? 0 : 20 },
            { fn: actionRearrange, weight: 15 },
            { fn: actionShape, weight: botSpawnedCount >= 2 ? 0 : 10 },
            { fn: actionDelete, weight: botSpawnedCount > 0 ? 15 : 0 },
            { fn: actionResize, weight: 10 },
            { fn: actionDrift, weight: 50 },
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
          } catch (e) {
            console.error("Bot action error:", e);
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
    setActiveBoxId(""); 

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
            "figma-box relative flex border transition-colors duration-300 h-full w-full",
            isSelected ? "border-[#3b82f6]" : "border-gray-200/50 group-hover:border-gray-300"
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
          <div className={cn("w-full h-full", id === "surname" ? "overflow-visible" : "overflow-hidden")}>
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
      className="h-screen sticky top-0 overflow-hidden cursor-none z-0 bg-[#f8f9fa]"
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
              <div className="w-full h-full flex items-end">
                <h1 className="w-full text-[8vw] md:text-[6vw] lg:text-[7rem] tracking-[-0.02em] text-[#1a233a] leading-none font-bold select-none px-2 md:px-8 pb-2 md:pb-3 cursor-none">
                  JAYRAJ
                </h1>
              </div>
            ), "left-4 md:left-[calc(50%-340px)] w-[calc(50%-20px)] md:w-[400px] top-4 md:top-12 h-[64px] md:h-[160px]")}

            {/* Surname (Right) */}
            {renderDraggableBox("surname", "Surname", (
              <div className="relative w-full h-full flex items-end">
                <h2 className={cn(
                  "w-full text-[8vw] md:text-[6vw] lg:text-[5rem] tracking-[-0.02em] text-[#1a233a] leading-none pb-2 md:pb-3 px-2 md:px-8 select-none pointer-events-none cursor-none",
                  isPixelFont ? "font-[family-name:var(--font-rubik-pixels)] text-[#3b82f6] opacity-80 no-fancy" : "font-bold"
                )}>
                  PATEL
                </h2>
                <div className="absolute -bottom-5 right-2 md:right-0 md:-bottom-6 z-10 flex items-center gap-2 md:gap-4 cursor-none scale-75 md:scale-100 origin-right">
                  <div className="flex items-center gap-1 md:gap-2 pointer-events-auto select-none">
                    <span className="text-[7px] font-bold uppercase tracking-wider text-gray-400">Pixel</span>
                    <button 
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
                  
                  <div className="flex items-center gap-1 md:gap-2 pointer-events-auto select-none">
                    <span className="text-[7px] font-bold uppercase tracking-wider text-gray-400">Fancy</span>
                    <button 
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
                </div>
              </div>
            ), "left-[calc(50%+4px)] md:left-[calc(50%+60px)] w-[calc(50%-20px)] md:w-[280px] top-4 md:top-[98px] h-[64px] md:h-[110px]")}

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
