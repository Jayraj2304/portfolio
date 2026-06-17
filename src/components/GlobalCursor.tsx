"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { MousePointer2, MoveDiagonal, MoveDiagonal2 } from "lucide-react";

export default function GlobalCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [inHero, setInHero] = useState(true);
  const [isMouseInScreen, setIsMouseInScreen] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [isBotBusy, setIsBotBusy] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(isTouch);
    if (isTouch) {
      document.body.classList.remove("cursor-none");
    } else {
      document.body.classList.add("cursor-none");
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isMouseInScreen) setIsMouseInScreen(true);
    };
    const handleScroll = () => {
      setInHero(window.scrollY < window.innerHeight - 50);
    };
    const handleMouseEnter = () => setIsMouseInScreen(true);
    const handleMouseLeave = () => setIsMouseInScreen(false);

    const handleSetCursor = (e: any) => setCursorStyle(e.detail);
    const handleBotBusy = (e: any) => setIsBotBusy(e.detail);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') !== null || 
        target.closest('button') !== null ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsHoveringClickable(!!isClickable);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("set-cursor", handleSetCursor);
    window.addEventListener("bot-busy", handleBotBusy);
    window.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("set-cursor", handleSetCursor);
      window.removeEventListener("bot-busy", handleBotBusy);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isMouseInScreen]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{ opacity: isMouseInScreen ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      {inHero ? (
        <>
          {cursorStyle === "default" && (
            <MousePointer2 className="text-[#3b82f6] fill-[#3b82f6] w-5 h-5 origin-top-left rotate-[-10deg] drop-shadow-md" />
          )}
          {cursorStyle === "resize-nwse" && (
            <div className="w-5 h-5 -translate-x-1/2 -translate-y-1/2 text-black bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center">
              <MoveDiagonal className="w-3 h-3" />
            </div>
          )}
          {cursorStyle === "resize-nesw" && (
            <div className="w-5 h-5 -translate-x-1/2 -translate-y-1/2 text-black bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center">
              <MoveDiagonal2 className="w-3 h-3" />
            </div>
          )}

          <AnimatePresence>
            {isBotBusy && cursorStyle === "default" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-[#3b82f6] text-white text-[9px] font-bold px-1.5 py-[1px] rounded-[3px] absolute top-4 left-4 shadow-sm whitespace-nowrap"
              >
                You
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          animate={{
            scale: isHoveringClickable ? 1.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="w-8 h-8 rounded-full border border-black/15 dark:border-white/25 bg-white/10 dark:bg-white/5 backdrop-blur-[6px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            animate={{
              scale: isHoveringClickable ? 1.3 : 1,
              backgroundColor: isHoveringClickable ? "#3b82f6" : "#0f172a",
            }}
            className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)] dark:bg-white"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
