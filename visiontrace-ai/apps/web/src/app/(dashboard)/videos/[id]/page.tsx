'use client';

import React, { useState } from 'react';
import { InteractivePlayer } from '@/components/video/InteractivePlayer';
import { KeyframeSearchResult } from '@/components/video/KeyframeSearchResult';
import { ExportModal } from '@/components/video/ExportModal';
import { Search, Sparkles, Loader2, Filter, Info, PlayCircle, Download } from 'lucide-react';
import { useVideoStore } from '@/lib/store';

export default function VideoStudioPage() {
  const { 
    searchQuery, 
    setSearchQuery, 
    executeSearch, 
    searchResults, 
    isSearching, 
    searchError,
    keyframes,
    activeVideoId
  } = useVideoStore();

  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const sampleSearchQueries = [
    "Show me when the server terminal turned red",
    "Find keyframe with blue dashboard lights",
    "Person opening the rack cabinet door",
    "Close up of code text on monitor"
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch(searchQuery);
    }
  };

  const handlePresetClick = (query: string) => {
    setSearchQuery(query);
    executeSearch(query);
  };

  const displayedResults = searchResults.length > 0 ? searchResults : keyframes;

  return (
    <div className="space-y-6">
      {/* Studio Header & Export Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-blue fill-current" /> Natural Language Video Search Studio
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Extract visual keyframes, OCR code text, embed with SigLIP 2, and jump directly to matching video timestamps.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 rounded-pill bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-xs flex items-center space-x-2 transition-all shadow-lg"
          >
            <Download className="w-4 h-4 text-brand-neon" />
            <span>Export Highlights</span>
          </button>

          <span className="text-xs font-semibold text-brand-neon bg-brand-neon/10 px-3.5 py-1 rounded-pill border border-brand-neon/30 font-mono">
            tenant_default_demo
          </span>
        </div>
      </div>

      {/* Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANE: Synchronized Interactive Video Player (7 Columns on LG) */}
        <div className="lg:col-span-7 space-y-4 sticky top-24">
          <InteractivePlayer />

          {/* Quick Info Callout */}
          <div className="p-4 rounded-card bg-surface-card border border-surface-border flex items-start space-x-3 text-xs text-white/70 backdrop-blur-xl">
            <Info className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <p>
              Click any keyframe preview card on the right pane to programmatically jump the HTML5 video player to that exact timestamp and trigger automatic playback.
            </p>
          </div>
        </div>

        {/* RIGHT PANE: Natural Language Search & Results Grid (5 Columns on LG) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pill-Shaped Natural Language Search Box */}
          <div className="p-6 rounded-card bg-surface-card border border-surface-border shadow-2xl backdrop-blur-2xl space-y-4">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-white/80 tracking-wider uppercase">
                Visual Scene Search Query
              </label>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 'Show me when the server terminal turned red'"
                  className="w-full pl-11 pr-28 py-3.5 rounded-pill bg-black/80 border border-white/20 text-white text-sm placeholder-white/40 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                />
                <Search className="w-5 h-5 text-white/40 absolute left-4" />

                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-2 px-5 py-2 btn-welcome-indigo text-white font-medium text-xs shadow-inset-glow transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-white/50 flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-brand-neon" /> Preset Visual Queries:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleSearchQueries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(query)}
                    className="px-3 py-1.5 rounded-pill bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/80 hover:text-white transition-all text-left"
                  >
                    "{query}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Error Alert */}
          {searchError && (
            <div className="p-4 rounded-card bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
              {searchError}
            </div>
          )}

          {/* Results List Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-brand-neon" /> Matching Scene Keyframes ({displayedResults.length})
            </h3>
            {searchQuery && (
              <span className="text-xs text-brand-blue font-mono">
                SigLIP 2 + OCR Hybrid Similarity
              </span>
            )}
          </div>

          {/* Keyframe Results Grid */}
          {displayedResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 max-h-[620px] overflow-y-auto pr-1">
              {displayedResults.map((kf, index) => (
                <KeyframeSearchResult key={kf.id || index} keyframe={kf} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-card bg-surface-card border border-surface-border text-center space-y-2 backdrop-blur-xl">
              <Search className="w-8 h-8 text-white/30 mx-auto animate-bounce" />
              <p className="text-sm font-medium text-white/80">No keyframe matches found</p>
              <p className="text-xs text-white/50">
                Try uploading a video or using different natural language query terms.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal Component */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        keyframes={displayedResults}
      />
    </div>
  );
}
