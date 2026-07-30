'use client';

import React from 'react';
import { Play, Clock, Sparkles } from 'lucide-react';
import { KeyframeItem } from '@/types';
import { useVideoStore } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';

interface KeyframeSearchResultProps {
  keyframe: KeyframeItem;
}

export const KeyframeSearchResult: React.FC<KeyframeSearchResultProps> = ({ keyframe }) => {
  const { seekToTimestamp, currentTime } = useVideoStore();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Construct thumbnail image URL
  const thumbnailUrl = keyframe.thumbnail_url.startsWith('http') 
    ? keyframe.thumbnail_url 
    : `${apiBaseUrl}${keyframe.thumbnail_url}`;

  const isActive = Math.abs(currentTime - keyframe.timestamp_seconds) < 2.5;

  const confidencePercent = keyframe.score 
    ? Math.round(keyframe.score * 100) 
    : null;

  return (
    <div
      onClick={() => seekToTimestamp(keyframe.timestamp_seconds)}
      className={`group relative flex flex-col bg-surface-card border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isActive 
          ? 'border-cyanGlow ring-2 ring-cyanGlow/40 shadow-glow-cyan' 
          : 'border-surface-border hover:border-slate-500'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-surface-dark overflow-hidden">
        {keyframe.thumbnail_url ? (
          <img
            src={thumbnailUrl}
            alt={`Keyframe at ${formatTimestamp(keyframe.timestamp_seconds)}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback placeholder if image load fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
            <Clock className="w-8 h-8" />
          </div>
        )}

        {/* Hover Play Icon Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="p-3 rounded-full bg-brand-600 text-white shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Timestamp Badge */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-1 px-2.5 py-1 rounded-md bg-black/80 text-cyan-400 text-xs font-mono font-medium backdrop-blur-sm border border-cyan-500/20">
          <Clock className="w-3 h-3" />
          <span>{formatTimestamp(keyframe.timestamp_seconds)}</span>
        </div>

        {/* Confidence Score Badge */}
        {confidencePercent !== null && (
          <div className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-accentViolet/80 text-white text-[10px] font-bold backdrop-blur-sm shadow-md">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{confidencePercent}% match</span>
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="p-3 flex items-center justify-between bg-surface-dark/90">
        <span className="text-xs font-medium text-slate-300">
          Frame #{keyframe.frame_index}
        </span>
        <span className="text-[11px] text-slate-400 group-hover:text-brand-400 font-semibold transition-colors">
          Jump to timestamp &rarr;
        </span>
      </div>
    </div>
  );
};
