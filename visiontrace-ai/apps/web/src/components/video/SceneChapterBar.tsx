'use client';

import React from 'react';
import { Layers, Bookmark, ArrowRight } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';

export interface ChapterItem {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  badge?: string;
}

export const SceneChapterBar: React.FC = () => {
  const { currentTime, seekToTimestamp } = useVideoStore();

  const chapters: ChapterItem[] = [
    {
      id: 'ch_1',
      title: 'System Terminal Diagnostics & Log Scan',
      startTime: 0.0,
      endTime: 15.0,
      badge: 'Scene 1'
    },
    {
      id: 'ch_2',
      title: 'Database Connection Pool Error Debugging',
      startTime: 15.0,
      endTime: 45.0,
      badge: 'Scene 2'
    },
    {
      id: 'ch_3',
      title: 'Docker Service Restart & Green Health Checks',
      startTime: 45.0,
      endTime: 90.0,
      badge: 'Scene 3'
    }
  ];

  return (
    <div className="p-4 rounded-card bg-surface-card border border-surface-border space-y-3 shadow-xl backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-brand-blue" /> Semantic Scene Chapters & Transitions
        </h4>
        <span className="text-[10px] font-mono text-brand-neon bg-brand-neon/10 px-2.5 py-0.5 rounded-pill border border-brand-neon/30">
          3 Scene Transitions
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {chapters.map((ch) => {
          const isActive = currentTime >= ch.startTime && currentTime <= ch.endTime;
          return (
            <div
              key={ch.id}
              onClick={() => seekToTimestamp(ch.startTime)}
              className={`p-3 rounded-card border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'border-brand-neon bg-brand-neon/15 shadow-glow-cyan ring-1 ring-brand-neon/40'
                  : 'border-white/10 bg-black/40 hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/20 px-2 py-0.5 rounded-pill border border-brand-blue/30">
                  {ch.badge}
                </span>
                <span className="text-[10px] font-mono text-white/60">
                  {formatTimestamp(ch.startTime)} - {formatTimestamp(ch.endTime)}
                </span>
              </div>

              <h5 className="text-xs font-semibold text-white leading-snug line-clamp-2">{ch.title}</h5>

              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                <span className={isActive ? 'text-brand-neon font-bold' : 'text-white/40'}>
                  {isActive ? 'Current Scene' : 'Jump to Scene'}
                </span>
                <ArrowRight className={`w-3 h-3 ${isActive ? 'text-brand-neon' : 'text-white/40'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
