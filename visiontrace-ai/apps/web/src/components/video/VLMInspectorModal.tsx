'use client';

import React, { useState } from 'react';
import { Eye, X, Sparkles, Code, Layers, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { KeyframeItem } from '@/types';

interface VLMInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyframe: KeyframeItem | null;
}

export const VLMInspectorModal: React.FC<VLMInspectorModalProps> = ({ isOpen, onClose, keyframe }) => {
  const [analysis, setAnalysis] = useState<any>({
    scene_narrative: "The keyframe depicts a dark-mode IDE next to an active Linux terminal window. The terminal exhibits a red error trace indicating a TCP connection refused socket error on localhost:8000.",
    spatial_elements: [
      { element: "Linux Terminal Container", relation: "Center Screen" },
      { element: "VS Code Editor (Python)", relation: "Foreground Left" },
      { element: "Red Connection Error Badge", relation: "Top Right" }
    ],
    code_analysis: {
      detected_error: "ConnectionRefusedError: [Errno 111] Could not connect to Qdrant vector database at localhost:6333",
      line_number: 42,
      suggested_fix: "Verify that Docker container 'qdrant_db' is running via 'docker ps' or execute 'docker compose up -d qdrant'."
    },
    confidence_score: 0.96
  });

  if (!isOpen || !keyframe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-card bg-surface-black border border-surface-border p-6 shadow-hero-mockup space-y-6 backdrop-blur-2xl text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-neon/20 text-brand-neon border border-brand-neon/40">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                VLM Visual Spatial Reasoning (Qwen2.5-VL)
              </h2>
              <p className="text-xs text-white/60">
                On-device multimodal deep-dive analysis over Keyframe #{keyframe.frame_index}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative & Visual Layout */}
        <div className="space-y-4">
          <div className="p-4 rounded-card bg-black/60 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-brand-neon uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Visual Scene Narrative
            </span>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              {analysis.scene_narrative}
            </p>
          </div>

          {/* Spatial Relations Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-blue" /> Identified Spatial Elements & Bounding Locations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {analysis.spatial_elements.map((elem: any, idx: number) => (
                <div key={idx} className="p-3 rounded-card bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-brand-blue">{elem.relation}</span>
                  <p className="text-xs font-semibold text-white">{elem.element}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Error Analysis */}
          <div className="p-4 rounded-card bg-red-950/30 border border-red-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Detected Code Syntax / Runtime Error
              </span>
              <span className="font-mono text-red-300">Line #{analysis.code_analysis.line_number}</span>
            </div>

            <code className="block p-3 rounded bg-black/80 font-mono text-xs text-red-300 border border-red-500/20 overflow-x-auto">
              {analysis.code_analysis.detected_error}
            </code>

            <div className="p-3 rounded bg-brand-neon/10 border border-brand-neon/30 text-xs text-white space-y-1">
              <span className="font-bold text-brand-neon flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Solution
              </span>
              <p className="text-white/80 font-mono text-[11px]">{analysis.code_analysis.suggested_fix}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-pill bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
