'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileVideo, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { formatBytes } from '@/lib/utils';

export const VideoUploader: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [wsProgress, setWsProgress] = useState<number>(0);
  const [wsStepMessage, setWsStepMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { uploadVideoFile, isUploading, uploadStatusMessage, setActiveVideo } = useVideoStore();

  const connectWebSocket = (videoId: string, localFileUrl: string) => {
    const wsUrl = `ws://localhost:8000/api/v1/ws/video-status/${videoId}`;
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket status update:", data);

        if (data.progress !== undefined) {
          setWsProgress(data.progress);
        }
        if (data.step) {
          setWsStepMessage(data.step);
        }

        if (data.status === 'completed' && data.keyframes) {
          setActiveVideo({
            video_id: videoId,
            filename: selectedFile?.name || 'uploaded_video.mp4',
            file_size_bytes: selectedFile?.size || 0,
            duration_seconds: 120,
            keyframe_count: data.keyframes.length,
            tenant_id: data.tenant_id || 'tenant_default_demo',
            status: 'completed',
            keyframes: data.keyframes
          }, localFileUrl);
          ws.close();
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (err) => {
      console.warn("WebSocket stream notice:", err);
    };
  };

  const handleFileChange = async (file: File) => {
    if (!file.type.includes('video')) {
      alert("Please upload a valid MP4, WebM, or MOV video file.");
      return;
    }
    setSelectedFile(file);
    setWsProgress(10);
    setWsStepMessage("Uploading file to VisionTrace Engine...");

    const localFileUrl = URL.createObjectURL(file);
    const response = await uploadVideoFile(file);
    
    if (response && response.video_id) {
      connectWebSocket(response.video_id, localFileUrl);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-brand-500" /> Upload Video for Scene Search
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Supports MP4, WebM, MOV. Visual scene detection keyframes will be embedded into SigLIP 2 vectors automatically.
      </p>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragOver 
            ? 'border-brand-500 bg-brand-500/10' 
            : 'border-surface-border bg-surface-dark/50 hover:border-slate-500 hover:bg-surface-dark'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-4 py-4 text-center w-full max-w-md">
            <Loader2 className="w-10 h-10 text-cyanGlow animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-100">
                {wsStepMessage || uploadStatusMessage || "Processing video..."}
              </p>
              <p className="text-xs text-cyan-400 font-mono font-medium">
                Live WebSocket Progress: {wsProgress}%
              </p>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 via-cyanGlow to-accentViolet transition-all duration-300 shadow-glow-cyan" 
                style={{ width: `${Math.max(wsProgress, 10)}%` }} 
              />
            </div>
          </div>
        ) : selectedFile ? (
          <div className="flex items-center space-x-4 w-full max-w-md p-3 bg-surface-dark rounded-xl border border-surface-border">
            <div className="p-3 rounded-lg bg-brand-500/20 text-brand-400">
              <FileVideo className="w-8 h-8" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-slate-100 truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-surface-hover text-brand-400 mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-slate-200">
              Drag and drop your video here, or <span className="text-brand-400 underline">browse</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Maximum file size: 500MB</p>
          </div>
        )}
      </div>
    </div>
  );
};
