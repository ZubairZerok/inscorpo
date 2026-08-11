"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, RefreshCw, GripVertical } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

const starterPrompts = [
  "🎯 How do I prepare for Bank MTO SHL tests?",
  "📊 Write an XLOOKUP formula with IFERROR",
  "💼 Give me a STAR technique interview tip",
  "🏆 What is the career roadmap for Business Analytics?",
];

export function FloatingChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "👋 Hello! I'm your INSYT AI Career Assistant. Ask me anything about MTO prep, Excel formulas, or STAR interviews!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, context: "general" }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "I'm here to help with your corporate career journey!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "I experienced a temporary connection delay. Please try asking again!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-20 md:bottom-5 right-4 md:right-5 z-40 opacity-80 hover:opacity-100 transition-opacity text-xs font-mono px-3.5 py-2 rounded-full bg-[#2563eb] text-white border-2 border-blue-400 shadow-lg flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 outline-none min-h-[44px] min-w-[44px]"
        title="Show AI Helper"
        aria-label="Re-enable Floating AI Assistant"
      >
        <Sparkles size={14} className="text-amber-300" />
        <span className="font-extrabold">AI Assistant</span>
      </button>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setTimeout(() => setIsDragging(false), 200);
      }}
      className="fixed bottom-20 right-5 z-40 touch-none select-none font-sans"
    >
      {/* ── EXPANDED CHAT DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-[330px] max-w-[88vw] h-[470px] rounded-xl shadow-2xl flex flex-col overflow-hidden border-2 border-[#2563eb] mb-2 select-text bg-white text-slate-900"
            style={{
              boxShadow: "6px 6px 0px 0px #1e3a8a",
            }}
          >
            {/* Header (Drag Handle) */}
            <div className="p-3 border-b-2 border-corp-border flex items-center justify-between bg-[#2563eb] text-white cursor-grab active:cursor-grabbing font-mono">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-blue-200 opacity-90" />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-400 text-amber-950 font-bold border border-amber-500 shadow-sm flex-shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-white flex items-center gap-1.5 leading-tight">
                    INSYT AI Assistant
                  </h3>
                  <p className="text-[10px] text-blue-100 font-bold">
                    Drag anywhere to move
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-xs border border-white/30 focus-visible:ring-2 focus-visible:ring-white outline-none"
                  aria-label="Minimize Chat Assistant"
                  title="Minimize"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold ${msg.sender === "user"
                      ? "bg-[#2563eb] text-white"
                      : "bg-amber-400 text-amber-950 border border-amber-500"
                      }`}
                  >
                    {msg.sender === "user" ? <User size={13} /> : <Bot size={13} />}
                  </div>

                  <div className={`max-w-[85%] space-y-0.5 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`p-2.5 rounded-lg text-xs leading-relaxed ${msg.sender === "user"
                        ? "bg-[#2563eb] text-white rounded-tr-none font-sans font-medium"
                        : "bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-none font-sans font-medium"
                        }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2563eb] p-1.5">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>AI Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Suggestion Chips */}
            {messages.length <= 2 && (
              <div className="px-2 py-2 border-t border-slate-200 bg-slate-50 flex flex-wrap gap-1 font-mono">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-left truncate max-w-full focus-visible:ring-2 focus-visible:ring-[#2563eb] outline-none"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-2.5 border-t border-slate-200 bg-slate-50 font-mono">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  placeholder="Ask MTO, Excel, STAR Qs..."
                  value={input}
                  aria-label="Type message for AI Assistant"
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-mono outline-none bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-400 text-amber-950 font-extrabold hover:bg-amber-300 border border-amber-500 shadow-sm disabled:opacity-40 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[#2563eb] outline-none min-h-[36px]"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SLEEK COMPACT LAUNCHER BUTTON (DRAGGABLE) ── */}
      {!isOpen && (
        <div
          onClick={() => {
            if (!isDragging) {
              setIsOpen(true);
            }
          }}
          className="relative group flex items-center gap-1.5 cursor-grab active:cursor-grabbing font-mono min-w-[50px] min-h-[50px]"
        >
          <div className="relative">
            {/* Hide / Dismiss Cross Button (44px WCAG hit area) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-slate-900 border border-white/30 text-white hover:text-amber-400 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10 focus-visible:ring-2 focus-visible:ring-[#2563eb] outline-none"
              aria-label="Hide AI Helper Completely"
              title="Hide AI Helper Completely"
            >
              <X size={12} />
            </button>

            <button
              type="button"
              aria-label="Open AI Assistant Chat"
              className="w-13 h-13 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 border-2 border-amber-500 flex items-center justify-center text-amber-950 font-mono relative overflow-hidden bg-amber-400 shadow-[3px_3px_0px_0px_#78350f] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 outline-none"
              style={{
                width: "52px",
                height: "52px",
              }}
              title="AI — Drag anywhere"
            >
              <div className="relative flex items-center justify-center">
                <Bot size={24} />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#2563eb] ring-2 ring-amber-400 animate-pulse" />
              </div>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
