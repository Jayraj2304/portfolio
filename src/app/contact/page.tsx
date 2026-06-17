"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Check, Loader2, Sparkles, MapPin, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [captchaState, setCaptchaState] = useState<"idle" | "loading" | "verified">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleCaptchaVerify = () => {
    if (captchaState !== "idle") return;
    setCaptchaState("loading");
    setTimeout(() => {
      setCaptchaState("verified");
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaState !== "verified" || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: "", email: "", message: "" });
      setCaptchaState("idle");
    }, 2000);
  };

  return (
    <main className="flex flex-col min-h-screen pt-24 font-sans bg-[#f8f9fa] cursor-none">
      <Navbar />

      <div className="flex-1 container mx-auto max-w-[1400px] px-6 py-16 relative">
        
        {/* Navigation back */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-8 group cursor-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Title */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#1a233a] leading-none mb-4">
            SAY HELLO
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light max-w-xl">
            Have a question, a project, or a learning opportunity you'd like to discuss? Drop me a message or book a time directly in my calendar.
          </p>
        </div>

        {/* Main Grid: Info + Form + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context Stats */}
          <div className="lg:col-span-5">
            
            {/* Context Stats Card (Clean Element Theme) */}
            <div className="bg-white border border-gray-150 rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-miriam)] text-[#1a233a] border-b border-gray-100 pb-4 mb-6">
                Availability & Info
              </h3>

              <div className="space-y-5 pb-6 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-green-50 text-green-500 mt-0.5 animate-pulse">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block font-[family-name:var(--font-miriam)]">AVAILABILITY</span>
                    <p className="text-gray-800 text-sm font-semibold mt-0.5">Open to select entry opportunities & projects</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-500">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block font-[family-name:var(--font-miriam)]">RESPONSE TIME</span>
                    <p className="text-gray-800 text-sm font-semibold mt-0.5">Usually under 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-yellow-50 text-yellow-500">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block font-[family-name:var(--font-miriam)]">LOCATION</span>
                    <p className="text-gray-800 text-sm font-semibold mt-0.5">Ahmedabad, India (GMT+5:30)</p>
                  </div>
                </div>
              </div>

              {/* Direct Channels block */}
              <div className="space-y-4 pt-2">
                <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block font-[family-name:var(--font-miriam)]">DIRECT CHANNELS</span>
                <div className="flex flex-col gap-3 text-sm font-semibold">
                  <a href="mailto:jayrajpatel.ce@gmail.com" className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-none">
                    jayrajpatel.ce@gmail.com
                  </a>
                  <a href="https://linkedin.com/in/jayraj--patel" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-none">
                    LinkedIn Profile
                  </a>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 cursor-none">
                    GitHub Profile
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Contact Form (Clean Element Theme Card) */}
          <div className="lg:col-span-7 bg-white border border-gray-150 rounded-2xl p-8 shadow-sm">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase font-[family-name:var(--font-miriam)] text-[#1a233a] border-b border-gray-100 pb-4 mb-8">
              Send a Message
            </h3>

            <AnimatePresence mode="wait">
              {isSent ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-16 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-gray-800">Thank you!</h4>
                    <p className="text-gray-400 text-sm font-light max-w-sm mx-auto">
                      Your message has been sent successfully. I will get back to you as soon as possible.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSent(false)}
                    className="mt-6 text-xs font-bold tracking-wider text-blue-500 hover:underline uppercase font-[family-name:var(--font-miriam)] cursor-none"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-gray-400 font-[family-name:var(--font-miriam)]">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-lg p-4 text-[14px] text-gray-800 outline-none transition-colors placeholder-gray-400 font-medium cursor-none"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-gray-400 font-[family-name:var(--font-miriam)]">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-lg p-4 text-[14px] text-gray-800 outline-none transition-colors placeholder-gray-400 font-medium cursor-none"
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-wider text-gray-400 font-[family-name:var(--font-miriam)]">Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Hi Jayraj, let's connect about..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-lg p-4 text-[14px] text-gray-800 outline-none transition-colors placeholder-gray-400 font-medium resize-none cursor-none"
                    />
                  </div>

                  {/* CAPTCHA Validation Checkbox */}
                  <div className="flex items-center gap-4 border border-gray-150 rounded-lg p-4 bg-gray-50/50">
                    <button
                      type="button"
                      onClick={handleCaptchaVerify}
                      className={`w-6 h-6 rounded border flex items-center justify-center transition-all cursor-none ${
                        captchaState === "verified"
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 hover:border-gray-400"
                      }`}
                      disabled={captchaState !== "idle"}
                    >
                      {captchaState === "loading" && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                      )}
                      {captchaState === "verified" && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <div>
                      <p className="text-[12px] font-bold text-gray-700 leading-none select-none">I'm not a robot</p>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider font-[family-name:var(--font-miriam)] select-none">
                        {captchaState === "idle" && "Click to verify"}
                        {captchaState === "loading" && "Verifying security..."}
                        {captchaState === "verified" && "Security verified!"}
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={captchaState !== "verified" || isSubmitting}
                    className={`w-full font-[family-name:var(--font-miriam)] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 rounded-lg p-4 transition-all duration-300 shadow-md cursor-none ${
                      captchaState === "verified"
                        ? "bg-[#1a233a] hover:bg-black text-white"
                        : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
