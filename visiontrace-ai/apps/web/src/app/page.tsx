import React from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Sparkles, Video, Search, ShieldCheck, Zap, ArrowRight, Layers, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-dark">
      <Navigation />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by SigLIP 2 & Qdrant Multi-Tenant Vectors</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Search Inside Videos with <br />
            <span className="bg-gradient-to-r from-brand-400 via-cyanGlow to-accentViolet bg-clip-text text-transparent">
              Natural Language Queries
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            VisionTrace AI automatically extracts keyframes using visual scene change detection, embeds video frames with SigLIP 2, and lets you jump directly to exact video timestamps.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/videos/demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-accentViolet hover:from-brand-500 hover:to-accentViolet text-white font-semibold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 group transition-all"
            >
              <span>Open Studio Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-200 font-semibold text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-3">
            <div className="p-3 w-fit rounded-xl bg-brand-500/10 text-brand-400">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Scene Keyframe Extractor</h3>
            <p className="text-sm text-slate-400">
              Uses OpenCV/FFmpeg histogram correlation scene change detection (`gt(scene, 0.15)`) to capture distinct keyframes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-3">
            <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">SigLIP 2 Embeddings</h3>
            <p className="text-sm text-slate-400">
              Projects image keyframes and text queries into a shared cosine vector space for high-precision semantic matching.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-3">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Multi-Tenant Qdrant DB</h3>
            <p className="text-sm text-slate-400">
              Strict vector payload condition filtering on <code className="text-cyan-400">tenant_id</code> ensures multi-tenant security and zero data leakage.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-surface-border text-center text-xs text-slate-500">
        VisionTrace AI Engine &copy; {new Date().getFullYear()} — Multi-Tenant SaaS Video Search Architecture
      </footer>
    </div>
  );
}
