"use client";

import { useState } from "react";
import { MousePointer2, Frame, Type, Square, Hand, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

interface FigmaToolbarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  isVisible?: boolean;
}

export default function FigmaToolbar({ activeTool, setActiveTool, isVisible = true }: FigmaToolbarProps) {
  const tools = [
    { id: "cursor", icon: MousePointer2 },
    { id: "frame", icon: Frame },
    { id: "type", icon: Type },
    { id: "shape", icon: Square },
    { id: "hand", icon: Hand },
    { id: "comment", icon: MessageCircle },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed bottom-4 md:bottom-auto left-1/2 md:left-8 top-auto md:top-1/2 -translate-x-1/2 md:translate-x-0 -translate-y-0 md:-translate-y-1/2 z-[100] bg-[#1a233a]/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 p-1.5 flex flex-row md:flex-col items-center gap-1 cursor-none transition-all duration-300",
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        
        return (
          <motion.button
            id={`tool-${tool.id}`}
            key={tool.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTool(tool.id);
            }}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-none",
              isActive 
                ? "bg-[#3b82f6] text-white shadow-inner" 
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon size={18} className={cn(isActive ? "fill-none" : "")} />
          </motion.button>
        );
      })}
    </motion.div>
  );
}
