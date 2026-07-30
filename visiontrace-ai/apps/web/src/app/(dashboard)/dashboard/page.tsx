'use client';

import React from 'react';
import Link from 'next/link';
import { VideoUploader } from '@/components/video/VideoUploader';
import { Film, Sparkles, Search, Layers, Clock, ArrowRight } from 'lucide-react';
import { useVideoStore } from '@/lib/store';

export default function DashboardPage() {
  const { activeVideoTitle, activeVideoId, keyframes } = useVideoStore();

  const mockRecentVideos = [
    {
      id: activeVideoId || 'vid_sample_01',
      title: activeVideoTitle || 'Server Maintenance & Terminal Logs.mp4',
      duration: '02:45',
      keyframesCount: keyframes.length || 18,
      date: 'Just now',
    },
    {
      id: 'vid_demo_02',
      title: 'Warehouse Robotics Surveillance Camera.mp4',
      duration: '05:12',
      keyframesCount: 34,
      date: '2 hours ago',
    },
    {
      id: 'vid_demo_03',
      title: 'Product Keynote & UI Demo Recording.mp4',
      duration: '12:30',
      keyframesCount: 82,
      date: 'Yesterday',
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Tenant Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Multi-tenant video vector library powered by SigLIP 2 & Qdrant
          </p>
        </div>

        <Link
          href="/videos/demo"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accentViolet hover:from-brand-500 text-white font-semibold text-xs shadow-lg flex items-center space-x-2 w-fit"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Search Studio</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Indexed Videos</span>
            <Film className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">3</p>
          <p className="text-[11px] text-emerald-400">+1 uploaded this session</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Vector Keyframes</span>
            <Layers className="w-4 h-4 text-cyanGlow" />
          </div>
          <p className="text-3xl font-extrabold text-white">134</p>
          <p className="text-[11px] text-slate-400">768-dim SigLIP 2 vectors</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Average Search Latency</span>
            <Clock className="w-4 h-4 text-accentViolet" />
          </div>
          <p className="text-3xl font-extrabold text-white">18ms</p>
          <p className="text-[11px] text-cyan-400">Payload filtered by tenant_id</p>
        </div>
      </div>

      {/* Upload Zone */}
      <VideoUploader />

      {/* Recent Videos Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-200">Recent Tenant Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockRecentVideos.map((vid) => (
            <div
              key={vid.id}
              className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-brand-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="p-3 w-fit rounded-xl bg-surface-hover text-brand-400 group-hover:scale-105 transition-transform">
                  <Film className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-100 truncate">{vid.title}</h4>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span>Duration: {vid.duration}</span>
                  <span>•</span>
                  <span>{vid.keyframesCount} keyframes</span>
                </div>
              </div>

              <Link
                href="/videos/demo"
                className="flex items-center justify-between pt-3 border-t border-surface-border text-xs font-semibold text-cyanGlow group-hover:text-white transition-colors"
              >
                <span>Open in Search Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
