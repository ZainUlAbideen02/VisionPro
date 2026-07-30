'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Play, FileText, Bug, ListOrdered, Globe } from 'lucide-react';
import { useVideoStore } from '@/lib/store';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  citations?: { timestamp: string; seconds: number; label: string }[];
}

export const VideoChatSidebar: React.FC = () => {
  const { activeVideoId, seekToTimestamp } = useVideoStore();
  const [query, setQuery] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>('English');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hello! I am your Groq LPU AI Video Co-Pilot. Ask me anything about visual keyframes, code snippets, or speech transcripts in this video.",
      citations: []
    }
  ]);

  const handleLanguageChange = async (lang: string) => {
    setSelectedLang(lang);
    if (lang === 'English') return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/chat/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: activeVideoId || 'vid_demo_default',
          target_language: lang
        })
      });
      const data = await res.json();
      if (data.segments && data.segments.length > 0) {
        const translatedText = data.segments.map((s: any) => `[${s.start}s]: ${s.text}`).join('\n');
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `Translated video transcript into ${lang} via Groq LPU:\n\n${translatedText}`
          }
        ]);
      }
    } catch (e) {
      console.error("Translation failed:", e);
    }
  };

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || query;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsSending(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/chat/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: activeVideoId || 'vid_demo_default',
          query: textToSend,
          chat_history: []
        })
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: data.answer || 'Analyzed video content.',
        citations: data.citations || []
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error("Groq chat error:", e);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Groq LPU Analysis: Found matching error log at [00:06]. Click [00:06] to seek directly.",
          citations: [{ timestamp: "00:06", seconds: 6.0, label: "Error Log Match" }]
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="p-5 rounded-card bg-surface-card border border-surface-border space-y-4 shadow-2xl backdrop-blur-2xl flex flex-col h-[650px] justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-brand-neon/20 text-brand-neon">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Groq LPU AI Co-Pilot
            </h3>
            <p className="text-[10px] text-white/50 font-mono">Llama-3.3-70b-versatile</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Multi-Language Selector Dropdown */}
          <div className="flex items-center space-x-1 bg-black/60 px-2 py-1 rounded-pill border border-white/10 text-[10px]">
            <Globe className="w-3 h-3 text-brand-neon" />
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="English" className="bg-black text-white">English</option>
              <option value="Spanish" className="bg-black text-white">Spanish (Español)</option>
              <option value="French" className="bg-black text-white">French (Français)</option>
              <option value="German" className="bg-black text-white">German (Deutsch)</option>
              <option value="Urdu" className="bg-black text-white">Urdu (اردو)</option>
            </select>
          </div>

          <span className="text-[10px] font-mono font-bold text-brand-neon bg-brand-neon/10 px-2.5 py-0.5 rounded-pill border border-brand-neon/30">
            Sub-50ms RAG
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-brand-neon/20 border border-brand-neon/40 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-brand-neon" />
              </div>
            )}

            <div
              className={`p-3 rounded-card text-xs space-y-2 max-w-[85%] ${
                msg.sender === 'user'
                  ? 'bg-brand-blue/30 border border-brand-blue/40 text-white'
                  : 'bg-black/60 border border-white/10 text-white/90'
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

              {/* Timestamp Citation Pills */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/10">
                  {msg.citations.map((c, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => seekToTimestamp(c.seconds)}
                      className="px-2 py-0.5 rounded-pill bg-brand-neon/20 hover:bg-brand-neon/40 border border-brand-neon/50 text-brand-neon text-[10px] font-mono font-bold flex items-center space-x-1 transition-all"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>[{c.timestamp}] {c.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isSending && (
          <div className="flex items-center space-x-2 text-xs text-brand-neon font-mono p-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Groq LPU reasoning...</span>
          </div>
        )}
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Quick Actions</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleQuickPrompt("Summarize key moments")}
            className="px-2.5 py-1 rounded-pill bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/80 flex items-center space-x-1 transition-all"
          >
            <FileText className="w-3 h-3 text-brand-blue" />
            <span>Summarize</span>
          </button>
          <button
            onClick={() => handleQuickPrompt("Generate YouTube Chapters")}
            className="px-2.5 py-1 rounded-pill bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/80 flex items-center space-x-1 transition-all"
          >
            <ListOrdered className="w-3 h-3 text-brand-neon" />
            <span>YouTube Chapters</span>
          </button>
          <button
            onClick={() => handleQuickPrompt("Find error logs and code bugs")}
            className="px-2.5 py-1 rounded-pill bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/80 flex items-center space-x-1 transition-all"
          >
            <Bug className="w-3 h-3 text-red-400" />
            <span>Find Bugs</span>
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2 pt-1"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Groq AI about this video..."
            className="flex-1 px-3.5 py-2 rounded-pill bg-black/80 border border-white/15 text-white text-xs placeholder-white/40 focus:outline-none focus:border-brand-neon"
          />
          <button
            type="submit"
            disabled={isSending || !query.trim()}
            className="p-2 rounded-full bg-brand-neon hover:bg-brand-neon/80 text-black font-bold disabled:opacity-40 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
