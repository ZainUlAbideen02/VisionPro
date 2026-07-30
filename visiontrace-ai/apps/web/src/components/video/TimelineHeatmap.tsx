'use client';

import React from 'react';
import { Sparkles, BarChart2 } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';

export const TimelineHeatmap: React.FC = () => {
  const { seekToTimestamp, activeDuration } = useVideoStore();

  // 20-interval waveform density simulation or API density map
  const defaultIntervals = Array.from({ length: 20 }, (_, i) => {
    const start = roundVal((i * (activeDuration || 120)) / 20);
    const end = roundVal(((i + 1) * (activeDuration || 120)) / 20);
    // Generate organic visual match waveform pattern
    const density = [0.15, 0.2, 0.45, 0.9, 0.85, 0.3, 0.1, 0.25, 0.6, 0.95, 0.7, 0.4, 0.2, 0.8, 0.6, 0.3, 0.15, 0.4, 0.75, 0.35][i];
    return { interval_start: start, interval_end: end, density };
  });

  function roundVal(val: number) {
    return Math.round(val * 10) / 10;
  }

  const getBarColor = (density: number) => {
    if (density >= 0.8) return 'bg-brand-neon shadow-glow-cyan';
    if (density >= 0.5) return 'bg-brand-blue';
    if (density >= 0.3) return 'bg-brand-blue/60';
    return 'bg-brand-blue/20';
  };

  return (
    <div className="w-full p-4 rounded-card bg-surface-card border border-surface-border backdrop-blur-2xl space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-white/80 flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-brand-neon" /> Interactive Visual Match Density Heatmap
        </span>
        <span className="text-[11px] text-brand-blue font-mono">
          20 Time Buckets • Click bar to seek
        </span>
      </div>

      {/* Heatmap Bar Waveform */}
      <div className="grid grid-cols-20 gap-1 h-12 items-end pt-2">
        {defaultIntervals.map((item, idx) => (
          <div
            key={idx}
            onClick={() => seekToTimestamp(item.interval_start)}
            title={`Match Density: ${Math.round(item.density * 100)}% (${formatTimestamp(item.interval_start)} - ${formatTimestamp(item.interval_end)})`}
            className="group relative flex flex-col items-center h-full justify-end cursor-pointer"
          >
            {/* Density Column Bar */}
            <div
              className={`w-full rounded-t-sm transition-all duration-300 group-hover:scale-y-110 ${getBarColor(item.density)}`}
              style={{ height: `${Math.max(item.density * 100, 15)}%` }}
            />

            {/* Hover Tooltip */}
            <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-white text-[10px] font-mono px-2 py-0.5 rounded-pill pointer-events-none whitespace-nowrap z-20 shadow-xl">
              {formatTimestamp(item.interval_start)} ({Math.round(item.density * 100)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
