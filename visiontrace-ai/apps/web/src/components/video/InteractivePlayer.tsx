'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Film } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';

export const InteractivePlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { 
    activeVideoUrl, 
    activeVideoTitle, 
    currentTime, 
    isPlaying, 
    seekToTimestamp, 
    setCurrentTime, 
    setIsPlaying,
    keyframes
  } = useVideoStore();

  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);

  // Sync video element time when global Zustand currentTime changes (e.g. keyframe card clicked)
  useEffect(() => {
    if (videoRef.current) {
      if (Math.abs(videoRef.current.currentTime - currentTime) > 0.3) {
        videoRef.current.currentTime = currentTime;
      }
      if (isPlaying && videoRef.current.paused) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTime, isPlaying, setIsPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeekSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    seekToTimestamp(targetTime);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative flex flex-col bg-surface-card border border-surface-border rounded-2xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-surface-dark/80 border-b border-surface-border backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Film className="w-5 h-5 text-brand-500" />
          <h2 className="text-sm font-semibold text-slate-100 truncate max-w-xs md:max-w-md">
            {activeVideoTitle}
          </h2>
        </div>
        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
          Timestamp: {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
        {activeVideoUrl ? (
          <video
            ref={videoRef}
            src={activeVideoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Film className="w-16 h-16 text-slate-600 mb-4 animate-pulse-subtle" />
            <p className="text-base font-medium text-slate-300">No active video loaded</p>
            <p className="text-xs text-slate-500 mt-1">Upload an MP4 video or select a sample to start visual search</p>
          </div>
        )}

        {/* Video Overlay Play Button */}
        {activeVideoUrl && !isPlaying && (
          <button 
            onClick={togglePlay}
            className="absolute p-5 rounded-full bg-brand-600/90 hover:bg-brand-500 text-white shadow-2xl transition-transform transform hover:scale-110"
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </button>
        )}
      </div>

      {/* Interactive Controls & Timeline */}
      <div className="p-4 bg-surface-dark border-t border-surface-border space-y-3">
        {/* Timeline Slider with Keyframe Markers */}
        <div className="relative w-full flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeekSlider}
            className="w-full h-2 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none"
          />
          {/* Keyframe Markers on Timeline */}
          {duration > 0 && keyframes.map((kf, i) => {
            const leftPercent = (kf.timestamp_seconds / duration) * 100;
            return (
              <div
                key={i}
                onClick={() => seekToTimestamp(kf.timestamp_seconds)}
                title={`Keyframe at ${formatTimestamp(kf.timestamp_seconds)}`}
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-cyanGlow rounded-full cursor-pointer hover:scale-150 transition-transform shadow-glow-cyan"
                style={{ left: `${leftPercent}%` }}
              />
            );
          })}
        </div>

        {/* Playback Button Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlay}
              disabled={!activeVideoUrl}
              className="p-2 rounded-lg bg-surface-hover hover:bg-brand-600 text-slate-200 hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={() => seekToTimestamp(Math.max(0, currentTime - 5))}
              disabled={!activeVideoUrl}
              className="p-2 rounded-lg bg-surface-hover hover:bg-surface-border text-slate-300 transition-colors"
              title="-5 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => seekToTimestamp(Math.min(duration, currentTime + 5))}
              disabled={!activeVideoUrl}
              className="p-2 rounded-lg bg-surface-hover hover:bg-surface-border text-slate-300 transition-colors"
              title="+5 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-slate-400 pl-2">
              {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-surface-hover hover:bg-surface-border text-slate-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              disabled={!activeVideoUrl}
              className="p-2 rounded-lg bg-surface-hover hover:bg-surface-border text-slate-300 transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
