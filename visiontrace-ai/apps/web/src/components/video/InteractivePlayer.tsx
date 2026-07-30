'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Film } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';
import { TimelineHeatmap } from './TimelineHeatmap';

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
  const [isHybridMode, setIsHybridMode] = useState<boolean>(true);

  const transcripts = [
    { start: 1.2, end: 4.5, text: "Starting server maintenance and checking system terminal status." },
    { start: 6.0, end: 9.8, text: "An error occurred on port 8000 during database connection pool initialization." },
    { start: 12.4, end: 16.1, text: "Restarting Docker container service and resolving network socket timeouts." },
    { start: 18.0, end: 22.5, text: "Server maintenance complete. All services reporting green health checks." }
  ];

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
    <div className="space-y-4">
      <div className="relative flex flex-col bg-surface-black border border-surface-border rounded-card overflow-hidden shadow-hero-mockup backdrop-blur-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-black/90 border-b border-surface-border">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-brand-blue/20 text-brand-blue">
              <Film className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-white truncate max-w-xs md:max-w-md">
              {activeVideoTitle}
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-brand-neon font-semibold bg-brand-neon/10 px-3 py-1 rounded-pill border border-brand-neon/30">
              <span className="w-2 h-2 rounded-full bg-brand-neon animate-ping" /> LIVE 1080p
            </span>
            <span className="text-white/70 bg-white/5 px-3 py-1 rounded-pill border border-white/10">
              {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
            </span>
          </div>
        </div>

        {/* Video Viewport Container */}
        <div className="relative aspect-video bg-neutral-950 flex items-center justify-center overflow-hidden group">
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
            <div className="flex flex-col items-center justify-center p-8 text-center text-white/50 space-y-3">
              <div className="p-5 rounded-full bg-surface-card border border-surface-border">
                <Film className="w-12 h-12 text-brand-blue animate-pulse" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">No active video loaded</p>
                <p className="text-xs text-white/50 mt-1">Upload an MP4 video to start visual scene search & keyframe jumping</p>
              </div>
            </div>
          )}

          {/* Video Overlay Play Button */}
          {activeVideoUrl && !isPlaying && (
            <button 
              onClick={togglePlay}
              className="absolute p-5 rounded-full bg-brand-blue/90 hover:bg-brand-blue text-white shadow-2xl transition-transform transform group-hover:scale-110 shadow-inset-glow"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          )}
        </div>

        {/* Interactive Controls & Timeline */}
        <div className="p-4 bg-black border-t border-surface-border space-y-3">
          {/* Timeline Slider with Keyframe Markers */}
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeekSlider}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-blue focus:outline-none"
            />
            {/* Keyframe Markers on Timeline */}
            {duration > 0 && keyframes.map((kf, i) => {
              const leftPercent = (kf.timestamp_seconds / duration) * 100;
              return (
                <div
                  key={i}
                  onClick={() => seekToTimestamp(kf.timestamp_seconds)}
                  title={`Keyframe at ${formatTimestamp(kf.timestamp_seconds)}`}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-3 bg-brand-neon rounded-full cursor-pointer hover:scale-150 transition-transform shadow-glow-cyan"
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
                className="p-2.5 rounded-pill bg-brand-blue text-white shadow-inset-glow hover:bg-brand-blue/80 transition-colors disabled:opacity-40"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => seekToTimestamp(Math.max(0, currentTime - 5))}
                disabled={!activeVideoUrl}
                className="p-2.5 rounded-pill bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 transition-colors disabled:opacity-40"
                title="-5 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => seekToTimestamp(Math.min(duration, currentTime + 5))}
                disabled={!activeVideoUrl}
                className="p-2.5 rounded-pill bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 transition-colors disabled:opacity-40"
                title="+5 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-white/60 pl-2">
                {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-pill bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleFullscreen}
                disabled={!activeVideoUrl}
                className="p-2.5 rounded-pill bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 transition-colors disabled:opacity-40"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Match Density Heatmap Bar */}
      <TimelineHeatmap />

      {/* SPEECH & VISION HYBRID SEARCH TOGGLE & AUDIO TRANSCRIPT PANEL */}
      <div className="p-5 rounded-card bg-surface-card border border-surface-border space-y-4 shadow-xl backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-neon animate-pulse" /> OpenAI Whisper Speech & Vision Hybrid Index
            </h3>
            <p className="text-xs text-white/60">
              Correlate visual keyframe actions with spoken audio speech transcripts in real-time.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-black/60 p-1 rounded-pill border border-white/10 w-fit">
            <button
              onClick={() => setIsHybridMode(false)}
              className={`px-3 py-1 rounded-pill text-xs font-semibold transition-all ${
                !isHybridMode ? 'bg-brand-blue text-white shadow-inset-glow' : 'text-white/60 hover:text-white'
              }`}
            >
              Visual Only
            </button>
            <button
              onClick={() => setIsHybridMode(true)}
              className={`px-3 py-1 rounded-pill text-xs font-semibold transition-all ${
                isHybridMode ? 'bg-brand-neon text-black font-bold shadow-glow-cyan' : 'text-white/60 hover:text-white'
              }`}
            >
              Speech & Vision Hybrid
            </button>
          </div>
        </div>

        {/* Timestamped Audio Transcript Stream */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-white/70 px-1">
            <span>Whisper Speech Transcript Segments</span>
            <span className="font-mono text-brand-neon">4 Audio Segments Indexed</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {transcripts.map((seg, idx) => {
              const isCurrent = currentTime >= seg.start && currentTime <= seg.end;
              return (
                <div
                  key={idx}
                  onClick={() => seekToTimestamp(seg.start)}
                  className={`p-3 rounded-card border cursor-pointer transition-all flex items-start justify-between space-x-3 ${
                    isCurrent
                      ? 'border-brand-neon bg-brand-neon/15 shadow-glow-cyan text-white'
                      : 'border-white/10 bg-black/40 hover:border-white/30 text-white/80'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-brand-blue bg-brand-blue/20 px-2 py-0.5 rounded-pill border border-brand-blue/30">
                      {formatTimestamp(seg.start)} - {formatTimestamp(seg.end)}
                    </span>
                    <p className="text-xs leading-relaxed font-medium">{seg.text}</p>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-brand-neon font-bold bg-brand-neon/20 px-2 py-0.5 rounded-pill border border-brand-neon/40 shrink-0">
                      Speaking
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
