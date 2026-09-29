import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SendIcon, SparklesIcon } from './Icons';
import {
  generateResponse,
  getMemory,
  getInitialChips,
  getInitialGreeting,
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

    // H3 headings: ### text
    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={i} className="text-sm font-bold text-white mt-3 mb-1">
          {line.replace('### ', '')}
        </h3>
      );
      return;
    }

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

    // Links: [text](url)
    if (typeof processed === 'string' && /\[([^\]]+)\]\(([^)]+)\)/.test(processed)) {
      const parts = processed.split(/(\[[^\]]+\]\([^)]+\))/g);
      processed = (
        <span key={`link-${i}`}>
          {parts.map((part, j) => {
            const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
              return (
                <a key={j} href={linkMatch[2]} className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">
                  {linkMatch[1]}
                </a>
              );
            }
            return part;
          })}
        </span>
      );
    }

    // Bullet points
    if (typeof processed === 'string' && /^\s*[•●🔹✅⏱️🏆⭐🤖✨📧🌐💬📅📄🔗-]/.test(processed)) {
      nodes.push(
        <div key={i} className="pl-2 py-0.5 text-slate-300">
          {processed}
        </div>
      );
    } else if (typeof processed === 'string' && processed.trim() === '') {
      nodes.push(<div key={i} className="h-2" />);
    } else if (typeof processed === 'string' && processed.trim() === '---') {
      nodes.push(<hr key={i} className="border-white/5 my-2" />);
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

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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
    "Novee is thinking...",
    "Understanding your request...",
    "Preparing response...",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % thoughts.length);
    }, 900);
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

// ─── WELCOME PROMPT CARDS ────────────────────────────────────

const WELCOME_PROMPTS = [
  { text: 'Help me build a website', icon: '🌐', gradient: 'from-violet-600/10 to-indigo-600/10' },
  { text: 'Estimate my project cost', icon: '💰', gradient: 'from-amber-600/10 to-orange-600/10' },
  { text: 'Show PrimeNova services', icon: '⚡', gradient: 'from-blue-600/10 to-cyan-600/10' },
  { text: 'Recommend features for my business', icon: '🎯', gradient: 'from-emerald-600/10 to-teal-600/10' },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────

const AIAssistant: React.FC = () => {
  const [memory, setLocalMemory] = useState<NovaMemory>(getMemory);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [suggestionChips, setSuggestionChips] = useState<string[]>(getInitialChips(memory));
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isWelcomeState = messages.length === 0;

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

  // ── Auto-resize textarea ──
  const resizeTextarea = useCallback(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [inputValue, resizeTextarea]);

  // ── Streaming text effect (faster) ──
  const streamText = useCallback((fullText: string, msgId: string, onComplete?: () => void) => {
    let charIndex = 0;
    const charDelay = 12; // faster streaming

    const interval = setInterval(() => {
      charIndex += 2; // 2 chars at a time for natural speed
      if (charIndex >= fullText.length) {
        charIndex = fullText.length;
        clearInterval(interval);
        setMessages(prev =>
          prev.map(m =>
            m.id === msgId ? { ...m, displayText: fullText, isStreaming: false } : m
          )
        );
        if (onComplete) onComplete();
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.id === msgId ? { ...m, displayText: fullText.substring(0, charIndex) } : m
          )
        );
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, []);

  // ── Send message handler ──
  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: Message = {
      id: genId(),
      sender: 'user',
      text: text.trim(),
      displayText: text.trim(),
      timestamp: new Date(),
      isStreaming: false,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const thinkTime = 800 + Math.random() * 600; // 0.8–1.4s

    setTimeout(() => {
      const currentMemory = getMemory();
      const simpleHistory = [...messages, userMsg].map((m) => ({ sender: m.sender, text: m.text }));

      let response;
      try {
        response = generateResponse(text, currentMemory, simpleHistory);
      } catch {
        response = {
          text: "Sorry, I couldn't process that right now. Please try again.",
          followUpQuestions: [],
          suggestionChips: getInitialChips(currentMemory),
          intent: 'error',
        };
      }

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

      streamText(response.text, aiMsgId);
    }, thinkTime);
  }, [isThinking, messages, streamText]);

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

  // ── New Chat ──
  const handleNewChat = useCallback(() => {
    clearMemory();
    const freshMemory = getMemory();
    setLocalMemory(freshMemory);
    setMessages([]);
    setSuggestionChips(getInitialChips(freshMemory));
    setInputValue('');
    setIsThinking(false);
  }, []);

  // ── Keyboard: Shift+Enter → newline, Enter → send ──
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  }, [inputValue, handleSendMessage]);

  return (
    <section className="relative w-full min-h-screen py-0 px-4 md:px-8 flex flex-col items-center select-none pt-[110px]">
      {/* ── Premium Background Layer ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#070709]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] opacity-75" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[380px] bg-gradient-to-b from-violet-900/10 via-purple-900/3 to-transparent blur-[120px] rounded-full pointer-events-none animate-pulse duration-10000" />
        <div className="absolute bottom-10 right-10 w-[280px] h-[280px] bg-amber-500/[0.02] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[220px] h-[220px] bg-indigo-500/[0.02] blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
        <Particles />
      </div>

      {/* ── Hero Header ── */}
      <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-semibold text-violet-400 mb-5 backdrop-blur-md"
        >
          <SparklesIcon className="w-3 h-3 text-amber-400 animate-pulse" />
          AI-POWERED CONSULTANT
        </m.div>

        <m.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl sm:text-5xl font-extrabold font-display leading-tight text-white mb-5 tracking-tight"
        >
          Meet your <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">always-on</span> digital assistant.
        </m.h2>

        <m.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-400 font-light text-xs sm:text-sm max-w-[650px] mb-6 leading-relaxed"
        >
          Helping businesses build modern websites, AI solutions, branding, automation, and scalable digital products.
        </m.p>

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
            ✨ Try Novee
          </button>
          <a
            href="/portfolio"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.04] border border-white/10 text-white font-semibold text-xs hover:bg-white/[0.08] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            📂 View Portfolio
          </a>
        </m.div>
      </div>

      {/* ── Chat Container ── */}
      <m.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl rounded-[28px] overflow-hidden flex flex-col shadow-2xl p-[1px] bg-gradient-to-b from-white/10 to-white/5 mb-24"
      >
        <div
          className="w-full rounded-[27px] overflow-hidden flex flex-col"
          style={{
            background: 'rgba(10, 10, 12, 0.82)',
            backdropFilter: 'blur(12px)',
            height: 'min(740px, 78vh)',
          }}
        >
          {/* ── Header ── */}
          <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold font-display shadow-md shadow-violet-500/20">
                  N
                </div>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 blur-md transition-opacity duration-300 ${isThinking ? 'opacity-80 animate-pulse' : 'opacity-25'}`} />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a0a0c] animate-pulse" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                  Novee
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-bold border border-violet-500/20">
                    V2
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>PrimeNova AI Assistant</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-emerald-400 font-medium">Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white text-[11px] font-medium border border-white/5 hover:border-white/10"
                title="New Chat"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </div>
          </div>

          {/* ── Messages Body ── */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5 scroll-smooth">

            {/* Welcome State */}
            {isWelcomeState && !isThinking && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center flex-1 min-h-[300px] gap-6"
              >
                {/* Welcome avatar */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold font-display shadow-xl shadow-violet-500/25">
                    N
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 blur-xl opacity-30" />
                </div>

                {/* Welcome text */}
                <div className="text-center max-w-md">
                  <h3 className="text-lg font-bold text-white mb-2">Hey! I'm Novee 👋</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Your PrimeNova Studio AI assistant. I can help you plan websites, estimate costs, explore services, and guide your project from idea to launch.
                  </p>
                </div>

                {/* Prompt Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
                  {WELCOME_PROMPTS.map((prompt) => (
                    <m.button
                      key={prompt.text}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSendMessage(prompt.text)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 hover:border-violet-500/30 transition-all duration-300 text-left bg-gradient-to-br ${prompt.gradient} group`}
                    >
                      <span className="text-lg">{prompt.icon}</span>
                      <span className="text-[12px] font-medium text-slate-300 group-hover:text-white transition-colors leading-tight">
                        {prompt.text}
                      </span>
                    </m.button>
                  ))}
                </div>
              </m.div>
            )}

            {/* Chat Messages */}
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

                  <div className={`flex flex-col max-w-[82%] sm:max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 text-sm sm:text-[14.5px] leading-relaxed shadow-sm break-words ${msg.sender === 'user'
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
                        <div className="whitespace-pre-wrap">{msg.displayText}</div>
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
                            className={`p-1 rounded hover:bg-white/5 transition-colors ${msg.liked ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'
                              }`}
                            title="Helpful"
                          >
                            <ThumbsUpIcon className="w-3 h-3" />
                          </button>

                          {/* Dislike */}
                          <button
                            onClick={() => handleFeedback(msg.id, 'dislike')}
                            className={`p-1 rounded hover:bg-white/5 transition-colors ${msg.disliked ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'
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

            {/* Thinking */}
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

          {/* ── Contextual Suggestion Chips ── */}
          {!isWelcomeState && !isThinking && suggestionChips.length > 0 && (
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

          {/* ── Input Footer ── */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-4 border-t border-white/5 bg-white/[0.01] flex flex-col gap-2 shrink-0"
          >
            <div className="relative flex items-end bg-white/[0.02] border border-white/5 focus-within:border-violet-500/40 focus-within:ring-1 focus-within:ring-violet-500/20 rounded-2xl p-1.5 transition-all duration-300 shadow-inner">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isThinking ? 'Novee is thinking...' : 'Ask Novee anything...'}
                disabled={isThinking}
                rows={1}
                className="flex-1 px-3 py-2 bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none disabled:opacity-60 resize-none max-h-[120px] leading-relaxed"
              />

              {/* Send button */}
              <button
                type="submit"
                disabled={isThinking || !inputValue.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300 active:scale-95 disabled:opacity-40 shrink-0 self-end"
              >
                <SendIcon className="w-4.5 h-4.5" />
              </button>
            </div>

            <p className="text-[10px] text-slate-600 text-center">
              Novee is an AI consultant and may occasionally produce inaccurate information. • Powered by PrimeNova Studio
            </p>
          </form>
        </div>
      </m.div>
    </section>
  );
};

export default AIAssistant;
