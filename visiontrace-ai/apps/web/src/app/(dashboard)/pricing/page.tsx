'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, CreditCard, ArrowRight, Loader2 } from 'lucide-react';

export default function PricingPage() {
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleSubscribePro = async () => {
    setIsRedirecting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/billing/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: "tenant_default_demo",
          plan_id: "pro"
        })
      });

      const data = await response.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      console.error("Failed to trigger checkout:", err);
      alert("Redirecting to Stripe Checkout session...");
    } finally {
      setTimeout(() => setIsRedirecting(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-pill bg-brand-neon/10 border border-brand-neon/30 text-brand-neon text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible Commercial WebSaaS Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Unlock Supercharged Multimodal Video Search
        </h1>
        <p className="text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
          Scale your video analysis with Whisper speech search, YOLOv8 object overlays, fine-tuned LoRA domain adapters, and NLE timeline exports.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* FREE TIER CARD */}
        <div className="p-8 rounded-card bg-surface-card border border-surface-border space-y-6 flex flex-col justify-between backdrop-blur-2xl shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Free Starter</span>
              <span className="text-xs font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded-pill border border-white/10">Free Forever</span>
            </div>

            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-white/60">/ month</span>
              </div>
              <p className="text-xs text-white/60 mt-1">Perfect for evaluating basic scene search capabilities.</p>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-white/80">
                <Check className="w-4 h-4 text-brand-blue shrink-0" />
                <span>3 Video Uploads / month</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Check className="w-4 h-4 text-brand-blue shrink-0" />
                <span>Standard SigLIP 2 Visual Embeddings</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Check className="w-4 h-4 text-brand-blue shrink-0" />
                <span>30 Video Processing Minutes / mo</span>
              </div>
              <div className="flex items-center space-x-2 text-white/40 line-through">
                <span>Whisper Speech Audio Transcript Search</span>
              </div>
              <div className="flex items-center space-x-2 text-white/40 line-through">
                <span>YOLOv8 Real-Time Bounding Box Overlays</span>
              </div>
              <div className="flex items-center space-x-2 text-white/40 line-through">
                <span>Final Cut & Premiere Pro NLE Exports</span>
              </div>
            </div>
          </div>

          <button
            disabled
            className="w-full py-3 rounded-pill bg-white/5 border border-white/15 text-white/50 text-xs font-semibold cursor-not-allowed"
          >
            Current Default Plan
          </button>
        </div>

        {/* PRO TIER CARD ($29/mo) */}
        <div className="p-8 rounded-card bg-gradient-to-b from-brand-blue/20 via-surface-card to-black border-2 border-brand-neon space-y-6 flex flex-col justify-between shadow-glow-cyan relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-mono font-bold text-black bg-brand-neon px-3 py-1 rounded-pill shadow-lg uppercase tracking-wider">
              Most Popular
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-neon uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-current" /> Pro Commercial Tier
              </span>
            </div>

            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold text-white">$29</span>
                <span className="text-xs text-white/60">/ month</span>
              </div>
              <p className="text-xs text-brand-neon/80 mt-1">Full multimodal AI search suite for power users and teams.</p>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-white font-medium">
                <Check className="w-4 h-4 text-brand-neon shrink-0" />
                <span>Unlimited Video Processing & Uploads</span>
              </div>
              <div className="flex items-center space-x-2 text-white font-medium">
                <Check className="w-4 h-4 text-brand-neon shrink-0" />
                <span>600 Video Processing Minutes / mo</span>
              </div>
              <div className="flex items-center space-x-2 text-white font-medium">
                <Check className="w-4 h-4 text-brand-neon shrink-0" />
                <span>Whisper Audio Speech Hybrid Search</span>
              </div>
              <div className="flex items-center space-x-2 text-white font-medium">
                <Check className="w-4 h-4 text-brand-neon shrink-0" />
                <span>YOLOv8 Bounding Box Canvas Overlays</span>
              </div>
              <div className="flex items-center space-x-2 text-white font-medium">
                <Check className="w-4 h-4 text-brand-neon shrink-0" />
                <span>Final Cut, Premiere Pro & MP4 Exports</span>
              </div>
              <div className="flex items-center space-x-2 text-white font-medium">
                <Check className="w-4 h-4 text-brand-neon shrink-0" />
                <span>Dynamic PEFT LoRA Domain Adapter Hot-Swapping</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubscribePro}
            disabled={isRedirecting}
            className="w-full py-3.5 btn-welcome-indigo text-white font-bold text-xs shadow-inset-glow flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] disabled:opacity-50"
          >
            {isRedirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            <span>{isRedirecting ? 'Redirecting to Stripe...' : 'Upgrade to Pro ($29/mo)'}</span>
            {!isRedirecting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
