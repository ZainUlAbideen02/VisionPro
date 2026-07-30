'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Features', href: '/videos/demo' },
    { label: 'Pricing', href: '/dashboard' },
    { label: 'Events', href: '/videos/demo' },
    { label: 'About', href: '/settings' },
    { label: 'Blog', href: '/' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-welcomeBlue text-white shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Welcome <span className="text-welcomeBlue text-xs font-mono px-2 py-0.5 rounded-full border border-welcomeBlue/40 bg-welcomeBlue/10">Studio</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Pill Buttons */}
          <div className="flex items-center space-x-6">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-white/80 hover:text-white hidden sm:block transition-colors"
            >
              Support
            </Link>

            <Link
              href="/sign-in"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Login
            </Link>

            <Link
              href="/videos/demo"
              className="px-6 py-2.5 btn-welcome-indigo text-white font-medium text-sm inline-flex items-center space-x-2 shadow-lg"
            >
              <span>Demo</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
