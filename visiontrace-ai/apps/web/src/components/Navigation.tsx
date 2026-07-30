'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Video, Sparkles, LayoutDashboard, Settings, User } from 'lucide-react';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Video Studio', href: '/videos/demo', icon: Video },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-dark/90 border-b border-surface-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-accentViolet text-white shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              VisionTrace <span className="text-brand-500 font-mono text-xs px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/30">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-surface-hover text-white border border-surface-border shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyanGlow' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Engine Status & User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-surface-card border border-surface-border text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-mono">SigLIP 2 Engine</span>
            </div>

            <Link
              href="/sign-in"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-surface-card hover:bg-surface-hover border border-surface-border text-xs font-semibold text-slate-200 transition-colors"
            >
              <User className="w-4 h-4 text-brand-400" />
              <span>Tenant Login</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
