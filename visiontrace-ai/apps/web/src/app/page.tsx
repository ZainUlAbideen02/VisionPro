'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { 
  Play, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  BarChart3, 
  Video, 
  Layers, 
  Users, 
  Zap,
  Globe,
  Sliders,
  Radio,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const customerLogosCol1 = [
    { name: 'Adobe', text: 'ADOBE' },
    { name: 'Square', text: 'SQUARE' },
    { name: '1Password', text: '1PASSWORD' },
    { name: 'Motive', text: 'MOTIVE' },
    { name: 'Adobe', text: 'ADOBE' },
    { name: 'Square', text: 'SQUARE' },
  ];

  const customerLogosCol2 = [
    { name: 'Twilio', text: 'TWILIO' },
    { name: 'Broadcom', text: 'BROADCOM' },
    { name: 'Brex', text: 'BREX' },
    { name: 'Zendesk', text: 'ZENDESK' },
    { name: 'Twilio', text: 'TWILIO' },
    { name: 'Broadcom', text: 'BROADCOM' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-welcomeBlue selection:text-white">
      <Navigation />

      {/* 1. TOP ANNOUNCEMENT BANNER PILL */}
      <div className="w-full flex items-center justify-center pt-6 pb-2">
        <Link 
          href="/videos/demo" 
          className="welcome-pill-top px-5 py-1.5 border border-white/20 text-xs font-medium text-white/80 hover:text-white hover:border-white/50 transition-all inline-flex items-center space-x-2 shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-welcomeGreen animate-pulse" />
          <span>Signup for The Drip & VisionTrace 2.0</span>
          <ArrowRight className="w-3.5 h-3.5 text-white/60" />
        </Link>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-28 text-center">
        {/* Ambient Blur Aura Glow */}
        <div className="hero-glow-aura" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 space-y-8">
          {/* Main Display Heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-[103px] font-normal tracking-[-2px] leading-[1.05] text-white">
            Captivate & Convert
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-2xl text-white/70 max-w-2xl mx-auto font-normal leading-relaxed">
            A webinar & visual search platform designed for marketers to host jaw-dropping experiences that drive revenue.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/videos/demo"
              className="px-8 py-3.5 btn-welcome-indigo text-white font-medium text-base shadow-2xl inline-flex items-center space-x-2"
            >
              <span>Demo</span>
            </Link>

            <Link
              href="/videos/demo"
              className="px-6 py-3.5 btn-welcome-pill text-white font-medium text-base inline-flex items-center space-x-3 shadow-xl"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-3 h-3 fill-current text-white ml-0.5" />
              </div>
              <span>How it works</span>
            </Link>
          </div>

          {/* 3. HERO FLOATING PLAYER MOCKUP FRAME */}
          <div className="relative mt-16 max-w-5xl mx-auto welcome-hero-mockup-frame overflow-hidden p-2 backdrop-blur-2xl">
            {/* Top Bar Mockup */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/80 border-b border-white/10 rounded-t-xl text-xs font-mono text-white/60">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="pl-2 text-white/40">welcome-studio-live.stream</span>
              </div>
              <span className="text-welcomeGreen flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-welcomeGreen animate-ping" /> LIVE 1080p
              </span>
            </div>

            {/* Video Player Image Mockup */}
            <div className="relative aspect-video bg-neutral-900 rounded-b-xl overflow-hidden flex items-center justify-center group">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop"
                alt="Welcome Studio Live Stream Demo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />

              {/* Overlay Mockup UI Elements */}
              <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-black/60 border border-white/20 backdrop-blur-md flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-welcomeBlue to-accentViolet flex items-center justify-center text-white font-bold text-xs">
                  VS
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white">VisionTrace Studio</p>
                  <p className="text-[10px] text-white/60">Multimodal SigLIP 2 Vector Engine</p>
                </div>
              </div>

              {/* Central Play Button */}
              <Link 
                href="/videos/demo" 
                className="p-6 rounded-full bg-welcomeBlue/90 hover:bg-welcomeBlue text-white shadow-2xl backdrop-blur-md transform group-hover:scale-110 transition-all"
              >
                <Play className="w-10 h-10 fill-current ml-1" />
              </Link>

              {/* Floating Live Poll Pill Badge */}
              <div className="absolute bottom-6 right-6 px-5 py-3 rounded-2xl bg-black/80 border border-white/20 backdrop-blur-xl text-left space-y-1 max-w-xs shadow-2xl animate-float-slow">
                <span className="text-[10px] font-bold text-welcomeGreen tracking-wider uppercase">Live Audience Poll</span>
                <p className="text-xs font-medium text-white">Which search feature matters most to you?</p>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-welcomeGreen h-full w-4/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF & VERTICAL LOGO MARQUEE SECTION */}
      <section className="py-24 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Stat */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-normal tracking-[-2px] leading-tight text-white">
              World-class teams are upgrading to Welcome
            </h2>
            <p className="text-base text-white/65 font-normal max-w-lg leading-relaxed">
              Companies are ditching legacy platforms for the ability to deliver an engaging experience at every level.
            </p>

            {/* Attendance Rate Stat Callout */}
            <div className="pt-4 flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-welcomeGreen/10 border border-welcomeGreen/30 text-welcomeGreen">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-normal tracking-tight text-white">66% attendance rate</p>
                <p className="text-xs text-white/60">avg attendance for Welcome customers</p>
              </div>
            </div>
          </div>

          {/* Right Column: Dual Vertical Logo Ticker */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 h-[380px] overflow-hidden relative">
            {/* Top/Bottom Fade Overlays */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

            {/* Column 1: Upward Scroll */}
            <div className="flex flex-col space-y-4 animate-marquee-up">
              {customerLogosCol1.map((logo, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-mono font-bold text-slate-400 tracking-wider text-sm hover:border-welcomeBlue/50 hover:text-white transition-colors">
                  {logo.text}
                </div>
              ))}
            </div>

            {/* Column 2: Downward Scroll */}
            <div className="flex flex-col space-y-4 animate-marquee-down">
              {customerLogosCol2.map((logo, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-mono font-bold text-slate-400 tracking-wider text-sm hover:border-accentViolet/50 hover:text-white transition-colors">
                  {logo.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. HIGH-CONTRAST WHITE BENTO SECTION ("An unmatched attendee Experience") */}
      <section className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl sm:text-6xl font-normal tracking-[-2px] leading-tight text-black">
              An unmatched attendee Experience
            </h2>
            <p className="text-lg text-black/70">
              Host interactive webinars with live video overlays, polls, Q&A, and crystal clear HD video.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1: Interactive Overlays */}
            <div className="md:col-span-7 rounded-3xl bg-neutral-100 border border-neutral-200 p-8 flex flex-col justify-between space-y-8 overflow-hidden group hover:shadow-2xl transition-all">
              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-bold text-black tracking-tight">Interactive overlays</h3>
                <p className="text-sm text-black/70 leading-relaxed">
                  Add custom branded graphics that lay over your live video to intro speakers, emphasize key points, and display clickable CTAs.
                </p>
              </div>

              {/* Graphic Mockup inside card */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900 shadow-xl border border-neutral-300">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop" 
                  alt="Interactive Overlays Demo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-black/80 text-white text-xs font-semibold backdrop-blur-md border border-white/20">
                  ⚡ Speaker: Sarah Jenkins • Head of Product
                </div>
              </div>
            </div>

            {/* Bento Card 2: Interactive Polls */}
            <div className="md:col-span-5 rounded-3xl bg-neutral-900 text-white p-8 flex flex-col justify-between space-y-8 overflow-hidden hover:shadow-2xl transition-all">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">Interactive Polls</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Embed polls directly on stage and watch results populate in real-time.
                </p>
              </div>

              {/* Poll UI Box */}
              <div className="space-y-3 p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-bold text-welcomeGreen">
                  <span>LIVE POLL</span>
                  <span>142 Votes</span>
                </div>
                <p className="text-sm font-medium">Which video feature do you use most?</p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-welcomeBlue/30 border border-welcomeBlue/50 flex justify-between font-semibold">
                    <span>Scene Timestamp Search</span>
                    <span>72%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 flex justify-between text-white/70">
                    <span>HD Keyframe Extraction</span>
                    <span>28%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: HD Video Quality */}
            <div className="md:col-span-6 rounded-3xl bg-black text-white p-8 space-y-6 overflow-hidden hover:shadow-2xl transition-all">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">HD Video Quality</h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  Provide a better experience for your viewers with crystal clear 1080p HD video streaming.
                </p>
              </div>

              <div className="aspect-video rounded-2xl bg-neutral-900 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" 
                  alt="HD Video Stream" 
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-xs font-mono text-cyanGlow flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyanGlow animate-ping" /> 1080p 60fps Stream Active
                </div>
              </div>
            </div>

            {/* Bento Card 4: Q&A & Slack Chat */}
            <div className="md:col-span-6 rounded-3xl bg-neutral-100 border border-neutral-200 p-8 space-y-6 overflow-hidden hover:shadow-2xl transition-all">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-black tracking-tight">Q&A & Audience Chat</h3>
                <p className="text-sm text-black/70 leading-relaxed">
                  Moderate audience questions, allow upvoting, and let attendees express themselves with emojis and reactions.
                </p>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-white border border-neutral-300 shadow-md">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-black">John Doe <span className="text-[10px] text-neutral-400 font-normal">2m ago</span></p>
                    <p className="text-neutral-600">Can we query video keyframes by text search?</p>
                  </div>
                </div>
                <div className="pl-10 text-xs font-medium text-welcomeBlue flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Answered live on stream at 01:42
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIAL QUOTE BANNER */}
      <section className="py-32 bg-black border-y border-white/10">
        <div className="max-w-5xl mx-auto px-4 text-left space-y-8">
          <h2 className="text-4xl sm:text-6xl font-normal tracking-[-2px] leading-tight text-white">
            “Makes other platforms look like the 1990’s”
          </h2>
          <p className="text-xl text-white/65 font-normal">
            — Nate Skinner, CMO at Onfido
          </p>

          <div className="pt-4">
            <Link
              href="/videos/demo"
              className="px-8 py-3.5 btn-welcome-pill text-white font-medium text-base inline-flex items-center space-x-2"
            >
              <span>Read customer stories</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. GIANT BRAND BREAKDOWN SECTION ("Powered by Welcome Studio") */}
      <section className="py-28 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Giant Typography Stack */}
          <div className="space-y-2 text-left">
            <p className="text-3xl sm:text-5xl font-normal text-white tracking-tight">Powered by</p>
            <h2 className="text-6xl sm:text-9xl lg:text-[236px] font-normal tracking-[-10px] leading-[0.85] text-white">
              Welcome
            </h2>
            <h2 className="text-6xl sm:text-9xl lg:text-[233px] font-normal tracking-[-10px] leading-[0.85] text-right text-white">
              Studio
            </h2>
          </div>

          {/* Three Feature Cards below Giant Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {/* Sunset Gradient Card */}
            <div className="rounded-3xl sunset-gradient-card p-8 text-black space-y-4 shadow-2xl hover:scale-[1.02] transition-transform">
              <h3 className="text-xl font-bold tracking-tight">Drag-n-drop Agenda Builder</h3>
              <p className="text-sm font-medium text-black/80 leading-relaxed">
                Quickly rearrange your webinar’s sequence of actions and instantly generate an agenda that auto-updates.
              </p>
              <div className="aspect-[4/3] rounded-2xl bg-black/10 border border-black/10 overflow-hidden" />
            </div>

            {/* Card 2: Brand Customization */}
            <div className="rounded-3xl bg-white/10 border border-white/15 p-8 text-white space-y-4 backdrop-blur-xl hover:scale-[1.02] transition-transform">
              <h3 className="text-xl font-bold tracking-tight">Brand customization</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Brand the entire experience including registration pages, backdrops, logo placements, fonts, and overlays.
              </p>
              <div className="aspect-[4/3] rounded-2xl bg-black/40 border border-white/10 overflow-hidden" />
            </div>

            {/* Card 3: Green Room */}
            <div className="rounded-3xl bg-white/10 border border-white/15 p-8 text-white space-y-4 backdrop-blur-xl hover:scale-[1.02] transition-transform">
              <h3 className="text-xl font-bold tracking-tight">Green Room & Stage Kit</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Invite speakers to a private waiting room to meet and prep before going live on stage.
              </p>
              <div className="aspect-[4/3] rounded-2xl bg-black/40 border border-white/10 overflow-hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. STAT CALLOUT SECTION ("Drive Revenue") */}
      <section className="py-28 bg-[#F5F5F5] text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Title */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-5xl sm:text-8xl font-normal tracking-[-4px] leading-tight text-black flex flex-wrap items-center gap-4">
              <span>Drive</span>
              <span className="w-32 h-14 rounded-full bg-welcomeYellow overflow-hidden inline-flex items-center justify-center border border-black/20">
                <Video className="w-7 h-7 text-black" />
              </span>
              <span>Revenue</span>
            </h2>
          </div>

          {/* Right Stats Stack */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-1 pb-6 border-b border-black/10">
              <p className="text-5xl font-normal tracking-tight text-black">+87%</p>
              <p className="text-lg font-medium text-black/80">increased attendee engagement</p>
              <p className="text-xs text-black/50">at Bitwise</p>
            </div>

            <div className="space-y-1 pb-6 border-b border-black/10">
              <p className="text-5xl font-normal tracking-tight text-black">$1.7M</p>
              <p className="text-lg font-medium text-black/80">pipeline generated</p>
              <p className="text-xs text-black/50">at Everbridge</p>
            </div>

            <div className="space-y-1">
              <p className="text-5xl font-normal tracking-tight text-black">58%</p>
              <p className="text-lg font-medium text-black/80">attendee conversion rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. IRIDESCENT TESTIMONIAL CARDS & JOIN US BANNER */}
      <section className="py-28 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-left space-y-2">
            <h2 className="text-4xl sm:text-6xl font-normal tracking-[-2px] text-white">
              Loved & trusted
            </h2>
            <p className="text-base text-white/65">Hear from marketing leaders hosting on Welcome Studio</p>
          </div>

          {/* Iridescent Gradient Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl iridescent-mesh-1 border border-white/20 text-white space-y-6 shadow-2xl hover:scale-[1.01] transition-transform">
              <p className="text-lg font-normal leading-relaxed text-white/90">
                “Welcome has transformed our quarterly keynotes. The level of attendee interaction and real-time polling is unmatched.”
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-white/20">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  SJ
                </div>
                <div>
                  <p className="text-sm font-bold">Sarah Jenkins</p>
                  <p className="text-xs text-white/70">VP Marketing at Salesforce</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl iridescent-mesh-2 border border-white/20 text-white space-y-6 shadow-2xl hover:scale-[1.01] transition-transform">
              <p className="text-lg font-normal leading-relaxed text-white/90">
                “The visual quality, stage overlays, and seamless video timestamp search give our team a competitive edge.”
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-white/20">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  MK
                </div>
                <div>
                  <p className="text-sm font-bold">Marcus Chen</p>
                  <p className="text-xs text-white/70">CMO at Twilio</p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Us Banner */}
          <div className="p-12 rounded-3xl bg-gradient-to-r from-welcomeBlue via-accentViolet to-pink-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Join us for the next generation of video</h3>
              <p className="text-sm text-white/80">Experience Welcome Studio live and transform your audience engagement.</p>
            </div>

            <Link
              href="/videos/demo"
              className="px-8 py-4 bg-white text-black hover:bg-neutral-100 font-bold text-sm rounded-full shadow-2xl transition-all whitespace-nowrap"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* 10. SLEEK FOOTER */}
      <footer className="py-16 bg-black border-t border-white/10 text-xs text-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-welcomeBlue text-white font-bold">
              VS
            </div>
            <span className="text-sm font-bold text-white">Welcome Studio & VisionTrace AI</span>
          </div>

          <p className="text-center">
            &copy; {new Date().getFullYear()} Welcome Experience Inc. All rights reserved. Powered by SigLIP 2 & Qdrant.
          </p>

          <div className="flex space-x-6 text-white/70">
            <Link href="/" className="hover:text-white">Privacy</Link>
            <Link href="/" className="hover:text-white">Terms</Link>
            <Link href="/" className="hover:text-white">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
