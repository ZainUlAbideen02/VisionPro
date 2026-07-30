import axios from "axios";
import { SearchResponse, VideoUploadResponse, AnalyticsResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadVideoApi = async (file: File, token?: string): Promise<VideoUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {
    "Content-Type": "multipart/form-data",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await apiClient.post<VideoUploadResponse>("/upload", formData, { headers });
  return response.data;
};

export const searchKeyframesApi = async (
  query: string, 
  videoId?: string, 
  token?: string
): Promise<SearchResponse> => {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await apiClient.post<SearchResponse>(
    "/search",
    { query, video_id: videoId, limit: 12 },
    { headers }
  );
  return response.data;
};

export const getAnalyticsApi = async (token?: string): Promise<AnalyticsResponse> => {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await apiClient.get<AnalyticsResponse>("/analytics", { headers });
  return response.data;
};
