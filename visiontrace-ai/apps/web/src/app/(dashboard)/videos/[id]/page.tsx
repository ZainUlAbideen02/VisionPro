'use client';

import React, { useState } from 'react';
import { InteractivePlayer } from '@/components/video/InteractivePlayer';
import { KeyframeSearchResult } from '@/components/video/KeyframeSearchResult';
import { Search, Sparkles, Loader2, Filter, Info, PlayCircle } from 'lucide-react';
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

  const [presetQuery, setPresetQuery] = useState<string>('');

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
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" /> Natural Language Video Search Studio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Extract visual keyframes, embed with SigLIP 2, and jump directly to matching video timestamps.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">Tenant Scope:</span>
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
            tenant_default_demo
          </span>
        </div>
      </div>

      {/* Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANE: Synchronized Interactive Video Player (7 Columns on LG) */}
        <div className="lg:col-span-7 space-y-4 sticky top-20">
          <InteractivePlayer />

          {/* Quick Info Callout */}
          <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex items-start space-x-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <p>
              Click any keyframe preview card on the right pane to programmatically jump the HTML5 video player to that exact timestamp and trigger automatic playback.
            </p>
          </div>
        </div>

        {/* RIGHT PANE: Natural Language Search & Results Grid (5 Columns on LG) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Natural Language Search Input Box */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-xl space-y-4">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-slate-200 tracking-wide uppercase">
                Visual Scene Search Query
              </label>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 'Show me when the server terminal turned red'"
                  className="w-full pl-11 pr-24 py-3 rounded-xl bg-surface-dark border border-surface-border text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />

                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-2 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Filter className="w-3 h-3 text-cyanGlow" /> Preset Visual Queries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleSearchQueries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(query)}
                    className="px-2.5 py-1 rounded-lg bg-surface-dark hover:bg-surface-hover border border-surface-border text-[11px] text-slate-300 transition-colors text-left"
                  >
                    "{query}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Error Alert */}
          {searchError && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
              {searchError}
            </div>
          )}

          {/* Results List Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-cyanGlow" /> Matching Scene Keyframes ({displayedResults.length})
            </h3>
            {searchQuery && (
              <span className="text-xs text-brand-400 font-mono">
                SigLIP 2 similarity sorted
              </span>
            )}
          </div>

          {/* Keyframe Results Grid */}
          {displayedResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {displayedResults.map((kf, index) => (
                <KeyframeSearchResult key={kf.id || index} keyframe={kf} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-surface-card border border-surface-border text-center space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto animate-bounce" />
              <p className="text-sm font-medium text-slate-300">No keyframe matches found</p>
              <p className="text-xs text-slate-500">
                Try uploading a video or using different search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
