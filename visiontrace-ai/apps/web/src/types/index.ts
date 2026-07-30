export interface KeyframeItem {
  id?: string;
  frame_index: number;
  timestamp_seconds: number;
  thumbnail_url: string;
  ocr_text?: string;
  score?: number;
}

export interface VideoUploadResponse {
  video_id: string;
  filename: string;
  file_size_bytes: number;
  duration_seconds: number;
  keyframe_count: number;
  tenant_id: string;
  status: string;
  keyframes: KeyframeItem[];
}

export interface VideoItem {
  video_id: string;
  title: string;
  filename: string;
  duration_seconds: number;
  keyframe_count: number;
  created_at: string;
  thumbnail_url?: string;
  video_url?: string;
}

export interface SearchRequest {
  query: string;
  video_id?: string;
  limit?: number;
}

export interface SearchResponse {
  query: string;
  tenant_id: string;
  video_id?: string;
  results_count: number;
  results: KeyframeItem[];
}

export interface AnalyticsResponse {
  status: string;
  tenant_id: string;
  embedding_engine: {
    model_id: string;
    vector_dimension: number;
    device: string;
  };
  vector_store: {
    collection_name: string;
    distance_metric: string;
    host: string;
  };
}
