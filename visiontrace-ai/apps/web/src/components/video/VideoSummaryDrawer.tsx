'use client';

import React, { useState } from 'react';
import { Sparkles, Tag, CheckCircle2, Layers, Bookmark, CheckSquare, Play, User } from 'lucide-react';
import { useVideoStore } from '@/lib/store';

interface VideoSummaryDrawerProps {
  summaryData?: {
    executive_summary: string;
    key_takeaways: string[];
    automated_tags: string[];
    topic_clusters: { cluster_id: number; label: string; time_range: string; count: number }[];
  };
}

export const VideoSummaryDrawer: React.FC<VideoSummaryDrawerProps> = ({ summaryData }) => {
  const { setSearchQuery, executeSearch, seekToTimestamp } = useVideoStore();

  const [tasks, setTasks] = useState([
    { id: '1', text: 'Investigate PostgreSQL connection pool socket retry limit on port 8000.', owner: 'DevOps Engineer', time: '00:06', seconds: 6.0, done: false, priority: 'High' },
    { id: '2', text: 'Restart Redis & Qdrant vector database container stack.', owner: 'Infrastructure Team', time: '00:32', seconds: 32.0, done: true, priority: 'Medium' },
    { id: '3', text: 'Validate green 200 OK responses across all system microservices.', owner: 'QA Engineer', time: '00:55', seconds: 55.0, done: true, priority: 'Low' }
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const data = summaryData || {
    executive_summary: "This recording documents a live server maintenance session covering terminal diagnostics, database connection pool timeout debugging, and Docker container recovery.",
    key_takeaways: [
      "Terminal diagnostics identified database connection pool initialization failure on port 8000.",
      "Developer executed container service restart and socket timeout resolution commands.",
      "Post-fix health check verification confirmed green 200 OK responses across all microservices."
    ],
    automated_tags: ["Terminal", "Docker", "Database Error", "Health Check", "System Maintenance"],
    topic_clusters: [
      { cluster_id: 1, label: "Terminal Diagnostics", time_range: "00:00 - 00:15", count: 5 },
      { cluster_id: 2, label: "Database Debugging", time_range: "00:15 - 00:45", count: 8 },
      { cluster_id: 3, label: "Container Recovery", time_range: "00:45 - 01:30", count: 6 }
    ]
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    executeSearch(tag);
  };

  return (
    <div className="p-6 rounded-card bg-surface-card border border-surface-border space-y-6 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-brand-neon" />
          <h3 className="text-base font-bold text-white">AI Video Summary & Smart Topic Clusters</h3>
        </div>
        <span className="text-xs font-mono font-bold text-brand-neon bg-brand-neon/10 px-3 py-1 rounded-pill border border-brand-neon/30">
          Groq LPU Processing Active
        </span>
      </div>

      {/* Executive Summary Paragraph */}
      <div className="p-4 rounded-card bg-black/60 border border-white/10 space-y-1.5">
        <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Executive Overview</span>
        <p className="text-xs text-white/90 leading-relaxed font-medium">
          {data.executive_summary}
        </p>
      </div>

      {/* Key Takeaways List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-brand-neon" /> Key Takeaways
        </h4>
        <div className="space-y-2">
          {data.key_takeaways.map((point, idx) => (
            <div key={idx} className="p-3 rounded-card bg-black/40 border border-white/10 flex items-start space-x-2.5 text-xs text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-neon mt-1.5 shrink-0" />
              <p className="leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AUTOMATED ACTION ITEMS & TASK CHECKLIST */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-brand-neon" /> Extracted Action Items & Assigned Tasks
          </h4>
          <span className="text-[10px] font-mono text-brand-neon">
            {tasks.filter(t => t.done).length} / {tasks.length} Completed
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-card border transition-all flex items-start justify-between space-x-3 text-xs ${
                task.done ? 'border-white/10 bg-black/30 opacity-70' : 'border-brand-neon/30 bg-black/60'
              }`}
            >
              <div className="flex items-start space-x-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="mt-0.5 rounded text-brand-neon focus:ring-brand-neon bg-black border-white/30 cursor-pointer"
                />
                <div className="space-y-1">
                  <p className={`font-medium ${task.done ? 'line-through text-white/50' : 'text-white'}`}>
                    {task.text}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] text-white/50">
                    <span className="flex items-center gap-1 text-brand-blue">
                      <User className="w-3 h-3" /> {task.owner}
                    </span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded-pill bg-white/5 border border-white/10 font-mono">
                      {task.priority} Priority
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => seekToTimestamp(task.seconds)}
                className="px-2 py-1 rounded-pill bg-brand-neon/15 hover:bg-brand-neon/30 border border-brand-neon/40 text-brand-neon text-[10px] font-mono font-bold flex items-center space-x-1 shrink-0 transition-all"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>[{task.time}]</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Topic Clusters & Smart Tag Pills */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-brand-blue" /> Smart Topic Tags (Click to Search)
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.automated_tags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleTagClick(tag)}
              className="px-3.5 py-1.5 rounded-pill bg-brand-blue/15 hover:bg-brand-blue/30 border border-brand-blue/40 text-brand-blue text-xs font-semibold flex items-center space-x-1.5 transition-all transform hover:scale-105"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
