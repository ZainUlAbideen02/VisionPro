import { create } from 'zustand';
import { KeyframeItem, VideoUploadResponse } from '@/types';
import { searchKeyframesApi, uploadVideoApi } from './api-client';

interface VideoStoreState {
  // Active Video State
  activeVideoId: string | null;
  activeVideoUrl: string | null;
  activeVideoTitle: string;
  activeDuration: number;
  keyframes: KeyframeItem[];
  
  // Interactive Player State
  currentTime: number;
  isPlaying: boolean;

  // Search Engine State
  searchQuery: string;
  searchResults: KeyframeItem[];
  isSearching: boolean;
  searchError: string | null;

  // Upload State
  isUploading: boolean;
  uploadStatusMessage: string;

  // Actions
  setActiveVideo: (video: VideoUploadResponse, videoObjectUrl?: string) => void;
  seekToTimestamp: (timestampSeconds: number) => void;
  setCurrentTime: (timeSeconds: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setSearchQuery: (query: string) => void;
  executeSearch: (queryStr: string, videoId?: string) => Promise<void>;
  uploadVideoFile: (file: File) => Promise<VideoUploadResponse | null>;
}

export const useVideoStore = create<VideoStoreState>((set, get) => ({
  activeVideoId: null,
  activeVideoUrl: null,
  activeVideoTitle: "Demo Video Sample",
  activeDuration: 120,
  keyframes: [],

  currentTime: 0,
  isPlaying: false,

  searchQuery: "",
  searchResults: [],
  isSearching: false,
  searchError: null,

  isUploading: false,
  uploadStatusMessage: "",

  setActiveVideo: (video: VideoUploadResponse, videoObjectUrl?: string) => {
    set({
      activeVideoId: video.video_id,
      activeVideoTitle: video.filename,
      activeDuration: video.duration_seconds,
      keyframes: video.keyframes,
      activeVideoUrl: videoObjectUrl || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/uploads/${video.video_id}_${video.filename}`,
      searchResults: video.keyframes,
      currentTime: 0
    });
  },

  seekToTimestamp: (timestampSeconds: number) => {
    set({
      currentTime: timestampSeconds,
      isPlaying: true
    });
  },

  setCurrentTime: (timeSeconds: number) => {
    set({ currentTime: timeSeconds });
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  executeSearch: async (queryStr: string, videoId?: string) => {
    if (!queryStr.trim()) return;
    set({ isSearching: true, searchError: null });

    try {
      const response = await searchKeyframesApi(queryStr, videoId || get().activeVideoId || undefined);
      set({
        searchResults: response.results,
        isSearching: false
      });
    } catch (err: any) {
      console.error("Search failed:", err);
      set({
        isSearching: false,
        searchError: err.response?.data?.detail || "Search request failed. Please check backend connection."
      });
    }
  },

  uploadVideoFile: async (file: File) => {
    set({ isUploading: true, uploadStatusMessage: "Extracting keyframes & computing SigLIP 2 embeddings..." });
    const localVideoUrl = URL.createObjectURL(file);

    try {
      const response = await uploadVideoApi(file);
      get().setActiveVideo(response, localVideoUrl);
      set({ isUploading: false, uploadStatusMessage: "Processing complete!" });
      return response;
    } catch (err: any) {
      console.error("Upload failed:", err);
      set({
        isUploading: false,
        uploadStatusMessage: "Upload failed: " + (err.response?.data?.detail || err.message)
      });
      return null;
    }
  }
}));
