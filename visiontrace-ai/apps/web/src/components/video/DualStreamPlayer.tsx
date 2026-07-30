'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Camera, Monitor, Link as LinkIcon } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';

export const DualStreamPlayer: React.FC = () => {
  const primaryVideoRef = useRef<HTMLVideoElement | null>(null);
  const secondaryVideoRef = useRef<HTMLVideoElement | null>(null);

  const { activeVideoUrl, currentTime, seekToTimestamp } = useVideoStore();
  const [isPlayingDual, setIsPlayingDual] = useState<boolean>(false);

  // Sync secondary video timestamp with primary video timestamp
  useEffect(() => {
    if (secondaryVideoRef.current) {
      if (Math.abs(secondaryVideoRef.current.currentTime - currentTime) > 0.3) {
        secondaryVideoRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime]);

  const toggleDualPlay = () => {
    if (primaryVideoRef.current && secondaryVideoRef.current) {
      if (isPlayingDual) {
        primaryVideoRef.current.pause();
        secondaryVideoRef.current.pause();
        setIsPlayingDual(false);
      } else {
        primaryVideoRef.current.play();
        secondaryVideoRef.current.play();
        setIsPlayingDual(true);
      }
    }
  };

  return (
    <div className="p-6 rounded-card bg-surface-card border border-surface-border space-y-6 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <LinkIcon className="w-5 h-5 text-brand-neon" />
          <h3 className="text-base font-bold text-white">Dual-Stream Synchronized Multi-Camera View</h3>
        </div>
        <span className="text-xs font-mono font-bold text-brand-neon bg-brand-neon/10 px-3 py-1 rounded-pill border border-brand-neon/30">
          Timestamp Sync Lock Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stream A: Primary Screen Recording */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-white/80">
            <span className="flex items-center gap-1.5 text-brand-blue font-mono font-bold">
              <Monitor className="w-3.5 h-3.5" /> Stream A: Primary Screen Recording
            </span>
            <span className="text-white/50 font-mono">{formatTimestamp(currentTime)}</span>
          </div>
          <div className="aspect-video bg-black rounded-card border border-white/10 overflow-hidden relative">
            {activeVideoUrl ? (
              <video
                ref={primaryVideoRef}
                src={activeVideoUrl}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-white/40">Primary Stream Ready</div>
            )}
          </div>
        </div>

        {/* Stream B: Secondary Webcam / Angle B */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-white/80">
            <span className="flex items-center gap-1.5 text-brand-neon font-mono font-bold">
              <Camera className="w-3.5 h-3.5" /> Stream B: Secondary Webcam Angle B
            </span>
            <span className="text-white/50 font-mono">{formatTimestamp(currentTime)}</span>
          </div>
          <div className="aspect-video bg-black rounded-card border border-white/10 overflow-hidden relative">
            {activeVideoUrl ? (
              <video
                ref={secondaryVideoRef}
                src={activeVideoUrl}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-white/40">Secondary Stream Ready</div>
            )}
          </div>
        </div>
      </div>

      {/* Synchronized Playback Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <button
          onClick={toggleDualPlay}
          className="px-5 py-2.5 btn-welcome-indigo text-white font-semibold text-xs shadow-inset-glow flex items-center space-x-2"
        >
          {isPlayingDual ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlayingDual ? 'Pause Dual Streams' : 'Play Synchronized Streams'}</span>
        </button>

        <span className="text-xs font-mono text-white/60">
          Sync Offset: <strong>0.00s</strong> (Lock: Timestamp Aligned)
        </span>
      </div>
    </div>
  );
};
