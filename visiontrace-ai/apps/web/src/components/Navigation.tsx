'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Studio', href: '/studio' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Settings', href: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-1.5 bg-white text-black border border-white font-mono font-bold text-xs uppercase tracking-wider">
              VT
            </div>
            <span className="text-base font-bold tracking-tight text-white font-mono uppercase">
              VisionTrace<span className="text-white/40 ml-1.5 text-xs font-normal">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-xs font-mono tracking-wide uppercase transition-colors ${
                    isActive ? 'text-white font-bold border-b border-white pb-0.5' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center space-x-4">
            <Link
              href="/studio"
              className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center space-x-1.5"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
