'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, FileText, MessageSquare, Search, Sparkles, Shield, Cpu, Layers } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 space-y-8 text-center border-b border-white/10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/20 text-xs font-mono uppercase tracking-widest text-white/80">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal AI Video Ingestion & Instant Search</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight uppercase font-mono leading-tight max-w-4xl mx-auto">
          Natural Language <br />
          <span className="text-white bg-white/10 px-3 py-0.5 border border-white/30">Video Search Engine</span>
        </h1>

        <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed font-sans">
          Extract visual keyframes, embed with SigLIP 2 vectors, parse on-screen OCR code text, and ask conversational video queries powered by Groq LPU speed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/studio"
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-mono font-bold text-sm uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center justify-center space-x-2 border border-white"
          >
            <span>Open Search Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/pricing"
            className="w-full sm:w-auto px-8 py-4 bg-black text-white font-mono font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors border border-white/20"
          >
            <span>View Pricing & Quotas</span>
          </Link>
        </div>
      </section>

      {/* 3-BOX FEATURE SUMMARY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-b border-white/10">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Core Infrastructure</span>
          <h2 className="text-xl font-bold font-mono uppercase tracking-tight">3-Layer Multimodal Retrieval Pipeline</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1: Visual Vector Search */}
          <div className="p-6 bg-black border border-white/20 space-y-4 hover:border-white transition-colors">
            <div className="p-3 bg-white/10 text-white w-fit border border-white/20">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-mono uppercase">1. Visual Vector Search</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Extracts keyframes on scene transitions and computes 768-dimensional SigLIP 2 vision embeddings for sub-20ms Qdrant vector retrieval.
            </p>
          </div>

          {/* Box 2: On-Screen Text OCR */}
          <div className="p-6 bg-black border border-white/20 space-y-4 hover:border-white transition-colors">
            <div className="p-3 bg-white/10 text-white w-fit border border-white/20">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-mono uppercase">2. On-Screen OCR Parsing</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Parses code lines, terminal error logs, and IDE syntax using Tesseract OCR, boosting exact match keyword relevance.
            </p>
          </div>

          {/* Box 3: Groq Audio & RAG Chat */}
          <div className="p-6 bg-black border border-white/20 space-y-4 hover:border-white transition-colors">
            <div className="p-3 bg-white/10 text-white w-fit border border-white/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-mono uppercase">3. Groq LPU Video RAG</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Transcribes audio with Groq Whisper and answers video queries via Llama 3.3 70B with interactive timestamp citations.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER CALLOUT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <h3 className="text-lg font-bold font-mono uppercase">Ready to Search Your Video Libraries?</h3>
        <Link
          href="/studio"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-black font-mono font-bold text-sm uppercase tracking-wider hover:bg-white/90 transition-colors border border-white"
        >
          <span>Launch Search Studio Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
