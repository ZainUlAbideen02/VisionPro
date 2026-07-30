'use client';

import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, Layers, ShieldCheck, Zap, Activity, Eye } from 'lucide-react';

export const LiveStreamPlayer: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState<string>('webrtc://live.visiontrace.ai/stream/feed_01');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [liveTelemetry, setLiveTelemetry] = useState({
    fps: 29.8,
    latency_ms: 14,
    keyframes_indexed: 42,
    speaker: "Speaker 1"
  });

  const liveFeedLog = [
    { time: "13:42:01", tag: "Keyframe Vectorized", detail: "SigLIP 2 768-d point added to Qdrant", score: "0.96" },
    { time: "13:42:04", tag: "OCR Text Detected", detail: "'systemctl status docker' on terminal", score: "0.92" },
    { time: "13:42:08", tag: "YOLO11 Detection", detail: "Terminal Window [94%], Code Editor [88%]", score: "0.94" },
    { time: "13:42:12", tag: "Speaker Diarization", detail: "[Speaker 2]: Restarting service daemon", score: "0.98" }
  ];

  return (
    <div className="p-6 rounded-card bg-surface-card border border-surface-border space-y-6 shadow-2xl backdrop-blur-2xl">
      {/* Stream Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              WebRTC Live Stream Ingestion & Telemetry
            </h3>
            <p className="text-xs text-white/60">
              Real-time frame extraction, SigLIP 2 vector indexing, and YOLO11 telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-pill border border-red-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> LIVE STREAMING
          </span>
        </div>
      </div>

      {/* Live Video Viewport */}
      <div className="relative aspect-video bg-black rounded-card border border-white/15 overflow-hidden flex items-center justify-center group">
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-pill border border-white/15 text-[11px] font-mono">
          <Activity className="w-3.5 h-3.5 text-brand-neon animate-spin" />
          <span className="text-white">{liveTelemetry.fps} FPS</span>
          <span className="text-white/40">|</span>
          <span className="text-brand-neon">{liveTelemetry.latency_ms}ms Latency</span>
        </div>

        <div className="text-center space-y-3 p-8">
          <div className="p-4 rounded-full bg-white/5 border border-white/10 inline-block">
            <Eye className="w-10 h-10 text-brand-neon animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Live WebRTC Camera Stream Feed</p>
            <p className="text-xs text-white/50 font-mono mt-1">{streamUrl}</p>
          </div>
        </div>
      </div>

      {/* Real-Time Stream Telemetry Log Stream */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-semibold text-white/80">
          <span>Real-Time Indexing Telemetry Feed</span>
          <span className="font-mono text-brand-neon">{liveTelemetry.keyframes_indexed} Keyframes Vectorized</span>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {liveFeedLog.map((log, idx) => (
            <div key={idx} className="p-3 rounded-card bg-black/60 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-white/40 text-[10px]">{log.time}</span>
                <span className="font-bold text-brand-neon bg-brand-neon/15 px-2 py-0.5 rounded-pill border border-brand-neon/30 text-[10px]">
                  {log.tag}
                </span>
                <span className="text-white/80 font-medium">{log.detail}</span>
              </div>
              <span className="font-mono text-brand-blue font-bold text-[10px]">{log.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
