'use client';

import React from 'react';
import { Settings, ShieldCheck, Database, Cpu, Key, Check } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="pb-4 border-b border-surface-border">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-500" /> SaaS Engine & Multi-Tenant Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage vector store connections, Clerk authentication JWT security, and SigLIP 2 model parameters.
        </p>
      </div>

      {/* Tenant Identity */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Active Tenant Isolation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-dark border border-surface-border space-y-1">
            <span className="text-slate-400 font-medium">Tenant ID</span>
            <p className="font-mono text-cyan-400 font-bold">tenant_default_demo</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-dark border border-surface-border space-y-1">
            <span className="text-slate-400 font-medium">Authentication Protocol</span>
            <p className="font-mono text-emerald-400 font-bold">Clerk JWT Validation (RS256)</p>
          </div>
        </div>
      </div>

      {/* Model & Vector Config */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-500" /> Multimodal Embedding Engine
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-dark border border-surface-border">
            <span className="text-slate-300 font-medium">SigLIP Model Identifier</span>
            <code className="text-cyan-400 font-mono">google/siglip2-base-patch16-224</code>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-dark border border-surface-border">
            <span className="text-slate-300 font-medium">Vector Projection Dimensionality</span>
            <code className="text-cyan-400 font-mono">768 Float32</code>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-dark border border-surface-border">
            <span className="text-slate-300 font-medium">Scene Change Threshold</span>
            <code className="text-cyan-400 font-mono">gt(scene, 0.15)</code>
          </div>
        </div>
      </div>

      {/* Qdrant DB Config */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-accentViolet" /> Qdrant Vector Collection
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-dark border border-surface-border">
            <span className="text-slate-300 font-medium">Collection Name</span>
            <code className="text-purple-400 font-mono">visiontrace_keyframes</code>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-dark border border-surface-border">
            <span className="text-slate-300 font-medium">Distance Metric</span>
            <code className="text-purple-400 font-mono">Cosine</code>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-dark border border-surface-border">
            <span className="text-slate-300 font-medium">Payload Index Filter Key</span>
            <code className="text-emerald-400 font-mono">tenant_id (Keyword)</code>
          </div>
        </div>
      </div>
    </div>
  );
}
