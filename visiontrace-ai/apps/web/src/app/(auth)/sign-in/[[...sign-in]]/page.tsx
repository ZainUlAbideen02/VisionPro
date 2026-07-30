import React from 'react';
import Link from 'next/link';
import { Sparkles, Key, ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-dark px-4">
      <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/20 text-brand-400 mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Sign in to VisionTrace AI</h2>
          <p className="text-xs text-slate-400">Access multi-tenant video search studio</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tenant Work email</label>
            <input
              type="email"
              placeholder="user@organization.com"
              defaultValue="admin@visiontrace.ai"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              defaultValue="password123"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-surface-border text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
            />
          </div>

          <Link
            href="/videos/demo"
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg"
          >
            <Key className="w-4 h-4" />
            <span>Continue to Studio</span>
          </Link>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
