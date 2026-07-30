'use client';

import React, { useState } from 'react';
import { Play, Clock, Sparkles, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { KeyframeItem } from '@/types';
import { useVideoStore } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';

interface KeyframeSearchResultProps {
  keyframe: KeyframeItem;
}

export const KeyframeSearchResult: React.FC<KeyframeSearchResultProps> = ({ keyframe }) => {
  const { seekToTimestamp, currentTime } = useVideoStore();
  const [showOcrText, setShowOcrText] = useState<boolean>(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
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
      className={`group relative flex flex-col bg-surface-card border rounded-card overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${
        isActive 
          ? 'border-brand-blue ring-2 ring-brand-blue/50 shadow-glow-cyan' 
          : 'border-surface-border hover:border-white/40'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-neutral-950 overflow-hidden">
        {keyframe.thumbnail_url ? (
          <img
            src={thumbnailUrl}
            alt={`Keyframe at ${formatTimestamp(keyframe.timestamp_seconds)}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-white/30">
            <Clock className="w-8 h-8" />
          </div>
        )}

        {/* Hover Play Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="p-3 rounded-full bg-brand-blue text-white shadow-inset-glow transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Timestamp Pill Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5 px-3 py-1 rounded-pill bg-black/80 text-white text-xs font-mono font-medium backdrop-blur-md border border-white/20">
          <Clock className="w-3 h-3 text-brand-neon" />
          <span>{formatTimestamp(keyframe.timestamp_seconds)}</span>
        </div>

        {/* Confidence Score Pill Badge */}
        {confidencePercent !== null && (
          <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2.5 py-0.5 rounded-pill bg-brand-lime text-black text-[10px] font-bold shadow-md">
            <Sparkles className="w-2.5 h-2.5 fill-current" />
            <span>{confidencePercent}% match</span>
          </div>
        )}
      </div>

      {/* Footer Info Bar & OCR Text Snippet */}
      <div className="p-3 bg-black/90 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white/70">
            Frame #{keyframe.frame_index}
          </span>
          <span className="text-[11px] font-semibold text-brand-blue group-hover:text-white transition-colors">
            Jump to timestamp &rarr;
          </span>
        </div>

        {/* OCR Text Badge & Snippet */}
        {keyframe.ocr_text && (
          <div className="pt-1 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowOcrText(!showOcrText)}
              className="flex items-center justify-between w-full text-[10px] text-brand-neon font-mono hover:underline"
            >
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" /> [OCR Text Parsed]
              </span>
              {showOcrText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showOcrText && (
              <p className="mt-1 p-2 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-white/80 leading-relaxed truncate">
                {keyframe.ocr_text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
