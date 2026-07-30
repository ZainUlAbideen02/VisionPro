'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileVideo, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { formatBytes } from '@/lib/utils';

export const VideoUploader: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { uploadVideoFile, isUploading, uploadStatusMessage } = useVideoStore();

  const handleFileChange = async (file: File) => {
    if (!file.type.includes('video')) {
      alert("Please upload a valid MP4, WebM, or MOV video file.");
      return;
    }
    setSelectedFile(file);
    await uploadVideoFile(file);
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
          <div className="flex flex-col items-center space-y-3 py-4 text-center">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
            <p className="text-sm font-medium text-slate-200">{uploadStatusMessage}</p>
            <div className="w-64 h-1.5 bg-surface-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-cyanGlow animate-pulse" style={{ width: '85%' }} />
            </div>
          </div>
        ) : selectedFile ? (
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-brand-500/20 text-brand-400">
              <FileVideo className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-400 ml-auto" />
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
