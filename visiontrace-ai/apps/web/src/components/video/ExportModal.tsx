'use client';

import React, { useState } from 'react';
import { Download, FileCode, FileText, Table, X, Check } from 'lucide-react';
import { useVideoStore } from '@/lib/store';
import { KeyframeItem } from '@/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyframes: KeyframeItem[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, keyframes }) => {
  const { activeVideoTitle, activeVideoId } = useVideoStore();
  const [selectedFormat, setSelectedFormat] = useState<string>('xml');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExportSubmit = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/export/markers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_id: activeVideoId || 'vid_sample_01',
          video_title: activeVideoTitle || 'VisionTrace_Export',
          export_format: selectedFormat,
          keyframes: keyframes.map(kf => ({
            timestamp_seconds: kf.timestamp_seconds,
            frame_index: kf.frame_index,
            score: kf.score || 0.95,
            ocr_text: kf.ocr_text || ''
          }))
        })
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeVideoTitle || 'VisionTrace'}_markers.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      onClose();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export markers. Check backend connection.");
    } finally {
      setIsExporting(false);
    }
  };

  const formats = [
    {
      id: 'xml',
      title: 'Final Cut / Premiere Pro XML',
      desc: 'Standard NLE timeline marker tracks containing timestamp notes & confidence metadata.',
      icon: FileCode,
      tag: 'NLE Ready'
    },
    {
      id: 'md',
      title: 'Markdown Timestamp Transcript',
      desc: 'Downloadable Markdown table report with timestamps, match confidence, and OCR text.',
      icon: FileText,
      tag: 'Docs / Notion'
    },
    {
      id: 'csv',
      title: 'CSV Spreadsheet Summary',
      desc: 'Tabular CSV rows ideal for Excel, Google Sheets, or custom data pipelines.',
      icon: Table,
      tag: 'Excel / CSV'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-card p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-bold text-white">Export Video Markers</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector List */}
        <div className="space-y-3">
          {formats.map((fmt) => {
            const Icon = fmt.icon;
            const isSelected = selectedFormat === fmt.id;
            return (
              <div
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                className={`p-4 rounded-card border cursor-pointer transition-all flex items-start space-x-3 ${
                  isSelected
                    ? 'border-brand-blue bg-brand-blue/15 shadow-glow-cyan'
                    : 'border-white/10 bg-black/40 hover:border-white/30'
                }`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-brand-blue text-white' : 'bg-white/5 text-white/60'}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{fmt.title}</h4>
                    <span className="text-[10px] font-mono text-brand-neon bg-brand-neon/10 px-2 py-0.5 rounded-pill border border-brand-neon/20">
                      {fmt.tag}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{fmt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-pill border border-white/15 text-xs text-white/70 hover:text-white hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={handleExportSubmit}
            disabled={isExporting}
            className="px-6 py-2.5 btn-welcome-indigo text-white font-medium text-xs shadow-inset-glow flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating...' : `Export .${selectedFormat.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
