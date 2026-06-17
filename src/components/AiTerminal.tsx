"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, Send } from "lucide-react";
import { motion } from "framer-motion";

type Message = {
  role: "user" | "ai";
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: "ai",
    text: "welcome.\n\ntrained on my experiences, resumes, and projects. i'll try to answer your questions honestly.\n\n⚠️ this feature uses AI. responses may be inaccurate — always verify."
  }
];

function TypingText({ text, speed = 8 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    if (text.length === 0) return;
    
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <>{displayedText}</>;
}

export default function AiTerminal() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > INITIAL_MESSAGES.length || isLoading) {
      if (terminalBodyRef.current) {
        terminalBodyRef.current.scrollTo({
          top: terminalBodyRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", text: messageText } as Message];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: messageText,
          history: messages 
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages([...newMessages, { role: "ai", text: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "ai", text: `[error] ${data.error}` }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "ai", text: "[error] failed to connect to agent backend." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "what's your stack?",
    "tell me about Netra",
    "are you available?",
    "summarize your experience"
  ];

  return (
    <section id="agent" className="bg-[#121826] border-y border-black/5 relative z-20">
      {/* Small dark header to act as a separator before terminal */}
      <div className="w-full bg-[#121826] h-12 flex items-center justify-center border-b border-[#1f2937]">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
          JAYRAJ.SITE — TALK-TO-MY-AGENT
        </span>
      </div>

      <div className="w-full bg-[#121826] min-h-[60vh] flex items-center justify-center py-24 px-6 relative z-10">
        
        {/* Terminal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="w-full max-w-4xl border border-[#2a3861] rounded bg-[#0f172a] shadow-2xl overflow-hidden flex flex-col font-mono relative"
        >
          
          {/* CRT scanline overlay */}
          <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] opacity-35"></div>
          
          {/* Terminal Header */}
          <div className="border-b border-[#2a3861] flex justify-between items-center px-4 py-2 bg-[#1a233a]">
             <span className="text-[10px] text-gray-400">talk-to-my-agent - v1.0.0 - build dev - ahmedabad</span>
             <span className="text-[10px] text-[#3b82f6]">- jayraj.site -</span>
          </div>

          {/* Terminal Body */}
          <div ref={terminalBodyRef} className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[500px] text-[13px] md:text-sm leading-relaxed space-y-6 no-scrollbar">
            
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1;
              const shouldType = isLast && msg.role === "ai" && idx > 0;

              return (
                <div key={idx} className={msg.role === "ai" ? "text-blue-400 whitespace-pre-wrap z-10 relative" : "text-gray-300 z-10 relative"}>
                  {msg.role === "user" && <span className="text-green-400 mr-2">guest@jayraj ~ %</span>}
                  {shouldType ? <TypingText text={msg.text} /> : msg.text}
                </div>
              );
            })}

            {isLoading && (
              <div className="text-yellow-400 animate-pulse">
                 agent is typing...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Actions (only show if AI just spoke and not loading) */}
          {!isLoading && messages[messages.length - 1].role === "ai" && (
            <div className="px-6 md:px-8 pb-4">
              <div className="text-green-400 mb-2 text-xs">$ try one {'>'}</div>
              <div className="flex flex-wrap gap-3">
                {quickActions.map(action => (
                  <button 
                    key={action}
                    onClick={() => handleSend(action)}
                    className="text-[11px] text-[#eab308] border border-[#2a3861] px-3 py-1.5 hover:bg-[#1a233a] hover:border-[#3b82f6] transition-colors"
                  >
                    [ {action} ]
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-[#2a3861] bg-[#1a233a] p-4 px-6 md:px-8 flex items-center gap-3">
            <span className="text-green-400 text-xs md:text-sm whitespace-nowrap">client@jayraj ~ %</span>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent outline-none text-gray-300 text-xs md:text-sm"
              disabled={isLoading}
            />
            <span className="text-[10px] text-gray-500 border border-gray-600 px-1.5 rounded hidden md:block">
              ENTER to send
            </span>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
