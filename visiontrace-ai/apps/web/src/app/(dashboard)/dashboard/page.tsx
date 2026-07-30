'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VideoUploader } from '@/components/video/VideoUploader';
import { KeyframeSearchResult } from '@/components/video/KeyframeSearchResult';
import { Film, Sparkles, Search, Layers, Clock, ArrowRight, Globe, Loader2, PlayCircle } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { KeyframeItem } from '@/types';

const DashboardPage = () => {
  const { activeVideoTitle, activeVideoId, keyframes, executeSearch, isSearching } = useVideoStore();

  const [workspaceQuery, setWorkspaceQuery] = useState<string>('');
  const [globalResults, setGlobalResults] = useState<Record<string, KeyframeItem[]> | null>(null);

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

  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceQuery.trim()) return;

    // Simulate global multi-video search grouping or execute search without video_id
    await executeSearch(workspaceQuery);
    
    // Group sample matches by video title
    setGlobalResults({
      'Server Maintenance & Terminal Logs.mp4': [
        { frame_index: 45, timestamp_seconds: 42.0, thumbnail_url: '/keyframes/demo/frame_0001.jpg', score: 0.94 },
        { frame_index: 120, timestamp_seconds: 105.0, thumbnail_url: '/keyframes/demo/frame_0002.jpg', score: 0.88 },
      ],
      'Warehouse Robotics Surveillance Camera.mp4': [
        { frame_index: 90, timestamp_seconds: 78.5, thumbnail_url: '/keyframes/demo/frame_0003.jpg', score: 0.82 },
      ]
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Workspace Multi-Video Dashboard
          </h1>
          <p className="text-xs text-white/60">
            Multi-tenant video vector library powered by SigLIP 2 & Qdrant
          </p>
        </div>

        <Link
          href={`/videos/${activeVideoId || 'vid_sample_01'}`}
          className="px-5 py-2.5 btn-welcome-indigo text-white font-medium text-xs shadow-lg flex items-center space-x-2 w-fit"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Launch Search Studio</span>
        </Link>
      </div>

      {/* GLOBAL MULTI-VIDEO WORKSPACE SEARCH BAR */}
      <div className="p-6 rounded-card bg-surface-card border border-surface-border shadow-2xl backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-blue" /> Global Multi-Video Library Search
          </h3>
          <span className="text-xs font-mono text-brand-neon bg-brand-neon/10 px-3 py-1 rounded-pill border border-brand-neon/30">
            Query across all videos simultaneously
          </span>
        </div>

        <form onSubmit={handleGlobalSearch} className="relative flex items-center">
          <input
            type="text"
            value={workspaceQuery}
            onChange={(e) => setWorkspaceQuery(e.target.value)}
            placeholder="Search all workspace videos (e.g. 'Find all clips with terminal crash errors')"
            className="w-full pl-11 pr-32 py-3.5 rounded-pill bg-black/80 border border-white/20 text-white text-sm placeholder-white/40 focus:outline-none focus:border-brand-blue transition-all"
          />
          <Search className="w-5 h-5 text-white/40 absolute left-4" />

          <button
            type="submit"
            disabled={isSearching || !workspaceQuery.trim()}
            className="absolute right-2 px-5 py-2 btn-welcome-indigo text-white font-medium text-xs shadow-inset-glow transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Search All</span>
              </>
            )}
          </button>
        </form>

        {/* Global Search Results Grouped by Video */}
        {globalResults && (
          <div className="space-y-6 pt-4 border-t border-white/10">
            <h4 className="text-sm font-bold text-brand-neon flex items-center gap-2">
              <PlayCircle className="w-4 h-4" /> Grouped Workspace Matches for "{workspaceQuery}"
            </h4>

            {Object.entries(globalResults).map(([videoTitle, matches]) => (
              <div key={videoTitle} className="space-y-3 p-4 rounded-card bg-black/60 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-brand-blue" /> {videoTitle}
                  </span>
                  <Link
                    href={`/videos/demo?t=${matches[0].timestamp_seconds}`}
                    className="text-xs text-brand-blue hover:text-white font-semibold flex items-center gap-1"
                  >
                    Open Studio &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {matches.map((kf, i) => (
                    <KeyframeSearchResult key={i} keyframe={kf} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-card bg-surface-card border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs font-semibold">Indexed Videos</span>
            <Film className="w-4 h-4 text-brand-blue" />
          </div>
          <p className="text-3xl font-bold text-white">3</p>
          <p className="text-[11px] text-brand-neon">+1 uploaded this session</p>
        </div>

        <div className="p-5 rounded-card bg-surface-card border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs font-semibold">Vector Keyframes</span>
            <Layers className="w-4 h-4 text-cyanGlow" />
          </div>
          <p className="text-3xl font-bold text-white">134</p>
          <p className="text-[11px] text-white/50">768-dim SigLIP 2 vectors</p>
        </div>

        <div className="p-5 rounded-card bg-surface-card border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs font-semibold">Average Search Latency</span>
            <Clock className="w-4 h-4 text-accentViolet" />
          </div>
          <p className="text-3xl font-bold text-white">18ms</p>
          <p className="text-[11px] text-brand-neon">Payload filtered by tenant_id</p>
        </div>
      </div>

      {/* Upload Zone */}
      <VideoUploader />

      {/* Recent Videos Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Recent Tenant Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockRecentVideos.map((vid) => (
            <div
              key={vid.id}
              className="p-5 rounded-card bg-surface-card border border-surface-border hover:border-brand-blue/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="p-3 w-fit rounded-xl bg-white/5 text-brand-blue group-hover:scale-105 transition-transform">
                  <Film className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white truncate">{vid.title}</h4>
                <div className="flex items-center space-x-3 text-xs text-white/50">
                  <span>Duration: {vid.duration}</span>
                  <span>•</span>
                  <span>{vid.keyframesCount} keyframes</span>
                </div>
              </div>

              <Link
                href={`/videos/${vid.id}`}
                className="flex items-center justify-between pt-3 border-t border-surface-border text-xs font-semibold text-brand-blue group-hover:text-white transition-colors"
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
};

export default DashboardPage;
