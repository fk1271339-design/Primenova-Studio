import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SendIcon, SparklesIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import {
  generateResponse,
  getMemory,
  getInitialGreeting,
  getInitialChips,
  clearMemory,
  type NovaMemory,
} from '../utils/novaEngine';

// ─── FRAMER MOTION IMPORTS ────────────────────────────────────
import { motion as m, AnimatePresence as AP } from 'framer-motion';

// ─── TYPES ───────────────────────────────────────────────────

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  displayText: string;
  timestamp: Date;
  isStreaming: boolean;
  liked?: boolean;
  disliked?: boolean;
}

// ─── MARKDOWN-LITE RENDERER ──────────────────────────────────

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    let processed: React.ReactNode = line;

    // Bold: **text**
    if (line.includes('**')) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      processed = (
        <span key={`line-${i}`}>
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="font-semibold text-white">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </span>
      );
    }

    // Emoji bullet points
    if (typeof processed === 'string' && /^\s*[🔹✅⏱️🏆⭐🤖✨📧🌐💬📅📄🔗•]/.test(processed)) {
      nodes.push(
        <div key={i} className="pl-2 py-0.5 text-slate-300">
          {processed}
        </div>
      );
    } else if (typeof processed === 'string' && processed.trim() === '') {
      nodes.push(<div key={i} className="h-2" />);
    } else {
      nodes.push(
        <div key={i} className="text-slate-300">
          {processed}
        </div>
      );
    }
  });

  return nodes;
}

// ─── ICONS ───────────────────────────────────────────────────

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckSmallIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ThumbsUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 10v12" /><path d="M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H4a2 2 0 01-2-2v-8a2 2 0 012-2h2.76a2 2 0 001.79-1.11L12 2a3.13 3.13 0 013 3.88z" />
  </svg>
);

const ThumbsDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 14V2" /><path d="M9 18.12L10 14H4.17a2 2 0 01-1.92-2.56l2.33-8A2 2 0 016.5 2H20a2 2 0 012 2v8a2 2 0 01-2 2h-2.76a2 2 0 00-1.79 1.11L12 22a3.13 3.13 0 01-3-3.88z" />
  </svg>
);

const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

// ─── UNIQUE ID GENERATOR ─────────────────────────────────────

let idCounter = 0;
function genId() {
  return `msg_${Date.now()}_${++idCounter}`;
}

// ─── BACKGROUND PARTICLES ────────────────────────────────────

const Particles = () => {
  const [particles, setParticles] = useState<{ id: number; x: string; y: string; size: number; delay: number; duration: number }[]>([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1.5,
        delay: Math.random() * 5,
        duration: Math.random() * 12 + 10,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <m.div
          key={p.id}
          className="absolute rounded-full bg-violet-400/20"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ['0px', '-180px'],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// ─── DYNAMIC THINKING INDICATOR ──────────────────────────────

const ThinkingIndicator = () => {
  const thoughts = [
    "Nova is thinking...",
    "Understanding your request...",
    "Searching portfolio...",
    "Preparing response..."
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % thoughts.length);
    }, 850);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
      </div>
      <span className="text-xs text-slate-400 font-medium transition-all duration-300">
        {thoughts[index]}
      </span>
    </div>
  );
};

// ─── QUICK ACTIONS DATA ──────────────────────────────────────

const QUICK_ACTIONS = [
  { title: "Estimate Website Cost", desc: "Calculate pricing & timeline", icon: "💰", gradient: "from-violet-600/10 to-indigo-600/10" },
  { title: "AI Consultation", desc: "Explore AI automations", icon: "🤖", gradient: "from-amber-600/10 to-rose-600/10" },
  { title: "Portfolio Projects", desc: "Browse our case studies", icon: "📂", gradient: "from-blue-600/10 to-cyan-600/10" },
  { title: "UI/UX Design", desc: "Figma wireframing", icon: "🎨", gradient: "from-pink-600/10 to-rose-600/10" },
  { title: "Mobile Apps", desc: "iOS & Android solutions", icon: "📱", gradient: "from-emerald-600/10 to-teal-600/10" },
  { title: "Automation", desc: "Workflow tools & webhooks", icon: "⚡", gradient: "from-purple-600/10 to-violet-600/10" },
  { title: "Brand Identity", desc: "Logos & guidelines", icon: "✨", gradient: "from-orange-600/10 to-amber-600/10" },
  { title: "SEO Optimization", desc: "Drive search traffic", icon: "📈", gradient: "from-cyan-600/10 to-blue-600/10" },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [memory, setLocalMemory] = useState<NovaMemory>(getMemory);

  const initialMsg: Message = {
    id: genId(),
    sender: 'ai',
    text: getInitialGreeting(memory, user?.fullName),
    displayText: getInitialGreeting(memory, user?.fullName),
    timestamp: new Date(),
    isStreaming: false,
  };

  const [messages, setMessages] = useState<Message[]>([initialMsg]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [suggestionChips, setSuggestionChips] = useState<string[]>(getInitialChips(memory));
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  // ── Streaming text effect ──
  const streamText = useCallback((fullText: string, msgId: string) => {
    let charIndex = 0;
    const speed = 10; // ms per character

    const interval = setInterval(() => {
      charIndex += 3; // 3 chars at a time for fast premium streaming
      if (charIndex >= fullText.length) {
        charIndex = fullText.length;
        clearInterval(interval);
        setMessages(prev =>
          prev.map(m =>
            m.id === msgId ? { ...m, displayText: fullText, isStreaming: false } : m
          )
        );
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.id === msgId ? { ...m, displayText: fullText.substring(0, charIndex) } : m
          )
        );
      }
    }, speed);

    return () => clearInterval(interval);
  }, []);

  // ── Send message handler ──
  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: Message = {
      id: genId(),
      sender: 'user',
      text,
      displayText: text,
      timestamp: new Date(),
      isStreaming: false,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    // Simulate thinking delay (1500ms to cycle thoughts)
    const thinkTime = 1600;

    setTimeout(() => {
      const currentMemory = getMemory();

      if (currentMemory.askedForName && !currentMemory.userName && text.trim().length <= 20) {
        currentMemory.askedForName = true;
      }

      const response = generateResponse(text, currentMemory);
      setLocalMemory(getMemory());

      const aiMsgId = genId();
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: response.text,
        displayText: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
      setSuggestionChips(response.suggestionChips);

      // Start streaming
      streamText(response.text, aiMsgId);
    }, thinkTime);
  }, [isThinking, streamText]);

  // ── Copy message ──
  const handleCopy = useCallback((msgId: string, text: string) => {
    navigator.clipboard.writeText(text.replace(/\*\*/g, ''));
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // ── Like/Dislike ──
  const handleFeedback = useCallback((msgId: string, type: 'like' | 'dislike') => {
    setMessages(prev =>
      prev.map(m =>
        m.id === msgId
          ? { ...m, liked: type === 'like', disliked: type === 'dislike' }
          : m
      )
    );
  }, []);

  // ── Regenerate last response ──
  const handleRegenerate = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMsg) {
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].sender === 'ai') {
          newMsgs.pop();
        }
        return newMsgs;
      });
      setTimeout(() => handleSendMessage(lastUserMsg.text), 100);
    }
  }, [messages, handleSendMessage]);

  // ── Clear chat ──
  const handleClearChat = useCallback(() => {
    clearMemory();
    const freshMemory = getMemory();
    setLocalMemory(freshMemory);
    setMessages([{
      id: genId(),
      sender: 'ai',
      text: getInitialGreeting(freshMemory),
      displayText: getInitialGreeting(freshMemory),
      timestamp: new Date(),
      isStreaming: false,
    }]);
    setSuggestionChips(getInitialChips(freshMemory));
  }, []);

  return (
    <section className="relative w-full min-h-screen py-0 px-4 md:px-8 flex flex-col items-center select-none pt-[110px]">
      {/* ── Premium Background Layer ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#070709]">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] opacity-75" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[380px] bg-gradient-to-b from-violet-900/10 via-purple-900/3 to-transparent blur-[120px] rounded-full pointer-events-none animate-pulse duration-10000" />
        <div className="absolute bottom-10 right-10 w-[280px] h-[280px] bg-amber-500/[0.02] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[220px] h-[220px] bg-indigo-500/[0.02] blur-[90px] rounded-full pointer-events-none" />
        
        {/* SVG Noise Filter Overlay */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
        
        {/* Floating Particles */}
        <Particles />
      </div>

      {/* ── Spacing Target Spacers & Hero ── */}
      <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        {/* AI Powered Badge */}
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-semibold text-violet-400 mb-5 backdrop-blur-md"
        >
          <SparklesIcon className="w-3 h-3 text-amber-400 animate-pulse" />
          AI-POWERED CONSULTANT
        </m.div>

        {/* Main Heading */}
        <m.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl sm:text-5xl font-extrabold font-display leading-tight text-white mb-5 tracking-tight"
        >
          Meet <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Nova</span>
          <span className="block text-lg sm:text-xl font-normal text-slate-300 mt-2">
            Your Intelligent AI Design & Development Consultant
          </span>
        </m.h2>

        {/* Description */}
        <m.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-400 font-light text-xs sm:text-sm max-w-[650px] mb-6 leading-relaxed"
        >
          Helping businesses build modern websites, AI solutions, branding, automation, and scalable digital products.
        </m.p>

        {/* CTA Buttons */}
        <m.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex items-center gap-3 mb-[35px]"
        >
          <button 
            onClick={() => inputRef.current?.focus()} 
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs hover:shadow-[0_0_15px_rgba(109,40,217,0.35)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            ✨ Try Nova
          </button>
          <a 
            href="/portfolio" 
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.04] border border-white/10 text-white font-semibold text-xs hover:bg-white/[0.08] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            📂 View Portfolio
          </a>
        </m.div>
      </div>

      {/* ── Chat Container (ChatGPT/Claude styled glass box) ── */}
      <m.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl rounded-[28px] overflow-hidden flex flex-col shadow-2xl p-[1px] bg-gradient-to-b from-white/10 to-white/5 mb-24"
      >
        <div 
          className="w-full rounded-[27px] overflow-hidden flex flex-col"
          style={{
            background: 'rgba(10, 10, 12, 0.82)',
            backdropFilter: 'blur(12px)',
            height: 'min(640px, 70vh)',
          }}
        >
          {/* AI Header */}
          <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              {/* Redesigned Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold font-display shadow-md shadow-violet-500/20">
                  N
                </div>
                {/* Glowing ring while generating */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 blur-md transition-opacity duration-300 ${isThinking ? 'opacity-80 animate-pulse' : 'opacity-25'}`} />
                {/* Animated Online indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a0a0c] animate-pulse" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                  Nova
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-bold border border-violet-500/20">
                    V2
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>AI Consultant</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-emerald-400 font-medium">Online</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>Avg. response &lt;2s</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                title="Clear chat"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scroll-smooth">
            <AP initial={false}>
              {messages.map((msg) => (
                <m.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Bot Avatar */}
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow-md shadow-violet-500/25">
                      N
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl rounded-tr-md font-medium'
                          : 'bg-white/[0.03] border border-white/5 text-white rounded-2xl rounded-tl-md shadow-lg'
                      }`}
                    >
                      {msg.sender === 'ai' ? (
                        <div className="space-y-0.5">
                          {renderMarkdown(msg.displayText)}
                          {msg.isStreaming && (
                            <span className="inline-block w-0.5 h-4 bg-violet-500 animate-pulse ml-0.5 align-middle" />
                          )}
                        </div>
                      ) : (
                        msg.displayText
                      )}
                    </div>

                    {/* Timestamp + Actions */}
                    <div className="flex items-center gap-2 mt-1.5 px-1">
                      <span className="text-[10px] text-slate-500">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {msg.sender === 'ai' && !msg.isStreaming && (
                        <div className="flex items-center gap-0.5">
                          {/* Copy */}
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="p-1 rounded hover:bg-white/5 transition-colors text-slate-500 hover:text-slate-300"
                            title="Copy"
                          >
                            {copiedId === msg.id ? (
                              <CheckSmallIcon className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <CopyIcon className="w-3 h-3" />
                            )}
                          </button>

                          {/* Like */}
                          <button
                            onClick={() => handleFeedback(msg.id, 'like')}
                            className={`p-1 rounded hover:bg-white/5 transition-colors ${
                              msg.liked ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUpIcon className="w-3 h-3" />
                          </button>

                          {/* Dislike */}
                          <button
                            onClick={() => handleFeedback(msg.id, 'dislike')}
                            className={`p-1 rounded hover:bg-white/5 transition-colors ${
                              msg.disliked ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDownIcon className="w-3 h-3" />
                          </button>

                          {/* Regenerate (only last AI message) */}
                          {msg.id === messages[messages.length - 1]?.id && (
                            <button
                              onClick={handleRegenerate}
                              className="p-1 rounded hover:bg-white/5 transition-colors text-slate-500 hover:text-slate-300"
                              title="Regenerate"
                            >
                              <RefreshIcon className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User avatar */}
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                      {memory.userName ? memory.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </m.div>
              ))}
            </AP>

            {/* Dynamic Thinking Status */}
            {isThinking && (
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow-md">
                  N
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.03] border border-white/5">
                  <ThinkingIndicator />
                </div>
              </m.div>
            )}
          </div>

          {/* ── Quick Actions (Redesigned as Gradient Cards) ── */}
          {messages.length <= 1 && !isThinking && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 px-5 py-4 border-t border-white/5 bg-white/[0.01] overflow-x-auto shrink-0 select-none">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.title}
                  onClick={() => handleSendMessage(action.title)}
                  disabled={isThinking}
                  className={`p-3 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all duration-300 text-left bg-gradient-to-br ${action.gradient} hover:scale-[1.02] active:scale-95 group shrink-0`}
                >
                  <div className="text-lg mb-1">{action.icon}</div>
                  <div className="text-[11px] font-bold text-white group-hover:text-violet-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">{action.title}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 leading-tight line-clamp-1">{action.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Standard Suggestion Chips (Used mid-conversation instead of huge cards) */}
          {(messages.length > 1 || isThinking) && (
            <div className="px-5 py-2.5 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
              <AP mode="popLayout">
                {suggestionChips.slice(0, 5).map((chip) => (
                  <m.button
                    key={chip}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleSendMessage(chip)}
                    disabled={isThinking}
                    className="text-[11px] font-semibold px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-400 hover:text-white transition-all duration-200 whitespace-nowrap shrink-0 disabled:opacity-50 active:scale-95"
                  >
                    {chip}
                  </m.button>
                ))}
              </AP>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-4 border-t border-white/5 bg-white/[0.01] flex flex-col gap-2 shrink-0"
          >
            <div className="relative flex items-center bg-white/[0.02] border border-white/5 focus-within:border-violet-500/40 focus-within:ring-1 focus-within:ring-violet-500/20 rounded-2xl p-1.5 transition-all duration-300 shadow-inner">
              {/* Attachment icon */}
              <button type="button" className="p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors" title="Add attachment">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              
              {/* Voice icon */}
              <button type="button" className="p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors" title="Voice input">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isThinking ? 'Thinking...' : 'Ask Nova anything...'}
                disabled={isThinking}
                className="flex-1 px-3 bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none disabled:opacity-60"
              />
              
              {/* Emoji icon */}
              <button type="button" className="p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors mr-1" title="Emojis">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={isThinking || !inputValue.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300 active:scale-95 disabled:opacity-40 shrink-0"
              >
                <SendIcon className="w-4.5 h-4.5" />
              </button>
            </div>
          </form>
        </div>
      </m.div>

      {/* Bottom tagline */}
      <m.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 text-[11px] text-slate-600 mt-4 text-center pb-8"
      >
        Nova is an AI consultant and may occasionally produce inaccurate information. • Powered by PrimeNova Studio
      </m.p>
    </section>
  );
};

export default AIAssistant;
