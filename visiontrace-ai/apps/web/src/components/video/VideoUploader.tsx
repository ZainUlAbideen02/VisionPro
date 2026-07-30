'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileVideo, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { formatBytes } from '@/lib/utils';

export const VideoUploader: React.FC = () => {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [wsProgress, setWsProgress] = useState<number>(0);
  const [wsStepMessage, setWsStepMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { uploadVideoFile, isUploading, uploadStatusMessage, setActiveVideo } = useVideoStore();

  const connectWebSocket = (videoId: string, localFileUrl: string) => {
    const wsUrl = `ws://localhost:8000/api/v1/ws/video-status/${videoId}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
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
          router.push(`/videos/${videoId}`);
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
    const isVideoExt = /\.(mp4|mov|avi|mkv|webm)$/i.test(file.name);
    if (!file.type.includes('video') && !isVideoExt) {
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
      setTimeout(() => {
        router.push(`/videos/${response.video_id}`);
      }, 1500);
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
    <div className="w-full bg-black border border-white/20 p-6 space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-white" /> Video File Upload Zone
        </h3>
        <span className="text-[10px] text-white/50 border border-white/20 px-2 py-0.5">MP4 / WEBM / MOV</span>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed cursor-pointer transition-colors ${
          isDragOver 
            ? 'border-white bg-white/10' 
            : 'border-white/20 bg-black hover:border-white/50'
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
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-white uppercase">
                {wsStepMessage || uploadStatusMessage || "Processing video..."}
              </p>
              <p className="text-[11px] text-white/70">
                Processing Progress: {wsProgress}%
              </p>
            </div>

            {/* Sharp Progress Bar */}
            <div className="w-full h-2 bg-white/10 border border-white/20">
              <div 
                className="h-full bg-white transition-all duration-300" 
                style={{ width: `${Math.max(wsProgress, 10)}%` }} 
              />
            </div>
          </div>
        ) : selectedFile ? (
          <div className="flex items-center space-x-4 w-full max-w-md p-3 bg-black border border-white/30">
            <div className="p-2 border border-white/20 text-white">
              <FileVideo className="w-5 h-5" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
              <p className="text-[10px] text-white/50">{formatBytes(selectedFile.size)}</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 border border-white/20 text-white mb-1">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider">
              Drag & drop video here, or <span className="underline">click to browse</span>
            </p>
            <p className="text-[10px] text-white/40">Supported Formats: MP4, WebM, MOV (Max 500MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};
