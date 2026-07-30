'use client';

import React, { useState } from 'react';
import { VideoUploader } from '@/components/video/VideoUploader';
import { InteractivePlayer } from '@/components/video/InteractivePlayer';
import { KeyframeSearchResult } from '@/components/video/KeyframeSearchResult';
import { VideoChatSidebar } from '@/components/video/VideoChatSidebar';
import { ExportModal } from '@/components/video/ExportModal';
import { Search, Sparkles, Loader2, Download, Video, Bot, Filter, FileText } from 'lucide-react';
import { useVideoStore } from '@/lib/store';

export default function StudioPage() {
  const {
    searchQuery,
    setSearchQuery,
    executeSearch,
    searchResults,
    isSearching,
    keyframes,
    activeVideoId,
    activeVideoTitle
  } = useVideoStore();

  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'studio' | 'chat'>('studio');

  const displayedResults = searchResults.length > 0 ? searchResults : keyframes;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch(searchQuery);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-black text-white selection:bg-white selection:text-black">
      {/* STUDIO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/20">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-white text-black font-mono font-bold text-[10px] uppercase">
              STUDIO
            </span>
            <h1 className="text-xl font-bold font-mono uppercase tracking-tight text-white">
              Multimodal Search & AI Workspace
            </h1>
          </div>
          <p className="text-xs text-white/60 font-mono">
            Active Video: <span className="text-white font-semibold">{activeVideoTitle || 'vid_sample_01.mp4'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Tab Switch */}
          <div className="flex items-center p-1 bg-black border border-white/20 text-xs font-mono">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1 font-bold uppercase transition-colors ${
                activeTab === 'studio' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Player & Search
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 font-bold uppercase transition-colors ${
                activeTab === 'chat' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Groq AI Chat
            </button>
          </div>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-semibold text-xs uppercase tracking-wider transition-colors flex items-center space-x-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* VIDEO UPLOAD ZONE */}
      <VideoUploader />

      {/* UNIFIED WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: PLAYER OR CHAT SIDEBAR (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'studio' ? (
            <InteractivePlayer />
          ) : (
            <VideoChatSidebar />
          )}
        </div>

        {/* RIGHT COLUMN: NATURAL LANGUAGE SEARCH & KEYFRAME MATCHES (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* SEARCH INPUT BOX */}
          <div className="p-5 bg-black border border-white/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4" /> Natural Language Search
              </span>
              <span className="text-[10px] font-mono text-white/50">SigLIP 2 + OCR</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query scenes, terminal text, or speech clips..."
                className="w-full pl-3 pr-24 py-2.5 bg-black border border-white/30 text-white text-xs font-mono placeholder-white/40 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-1 px-3 py-1.5 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-white/90 disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Search'}
              </button>
            </form>
          </div>

          {/* KEYFRAME SEARCH MATCHES FEED */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-white uppercase">Keyframe Results ({displayedResults.length})</span>
              <span className="text-white/40">Click card to seek</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {displayedResults.map((kf, idx) => (
                <KeyframeSearchResult key={kf.id || idx} keyframe={kf} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        keyframes={displayedResults}
      />
    </div>
  );
}
