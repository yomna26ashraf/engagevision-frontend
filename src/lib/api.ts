/**
 * Central client for the EngageVision AI backend (FastAPI service in
 * ../backend). Configure the backend URL via VITE_API_BASE_URL in a
 * .env file; defaults to localhost:8000 for local development.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type LevelProbability = { label: string; p: number };

export type PredictionResponse = {
  engagement_score: number;
  engagement_level: string;
  confidence: number;
  level_probabilities: LevelProbability[];
  num_frames_used: number;
  model_status: "trained" | "untrained_demo";
};

export type EpochMetric = {
  epoch: number;
  train_mse?: number | null;
  val_mse?: number | null;
  val_mae?: number | null;
  val_acc?: number | null;
};

export type PerformanceResponse = {
  model_status: string;
  epochs: EpochMetric[];
  confusion_matrix: number[][] | null;
  class_labels: string[];
  per_class_metrics: { name: string; precision: number; recall: number; f1: number; support: number }[] | null;
  final_test: { mse: number; mae: number; accuracy: number } | null;
  paper_reference_accuracy: number;
};

export type HistoryItem = {
  id: string;
  filename: string;
  label: string;
  confidence: number;
  score: number;
  timestamp: string;
};

export type DashboardResponse = {
  model_status: string;
  total_predictions: number;
  avg_engagement_score: number | null;
  distribution: { label: string; count: number }[];
  history: HistoryItem[];
};

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new ApiError(
      `Could not reach the EngageVision backend at ${API_BASE_URL}. Is it running? (uvicorn app:app --reload --port 8000 inside backend/)`,
    );
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new ApiError(`Request to ${path} failed (${res.status}): ${detail}`, res.status);
  }
  return res.json() as Promise<T>;
}

export async function checkHealth() {
  return request<{ status: string; model_status: string; device: string }>("/api/health");
}

export async function predictEngagement(file: File): Promise<PredictionResponse> {
  const form = new FormData();
  form.append("file", file);
  return request<PredictionResponse>("/api/predict", { method: "POST", body: form });
}

export async function fetchPerformance(): Promise<PerformanceResponse> {
  return request<PerformanceResponse>("/api/performance");
}

export async function fetchDashboard(limit = 50): Promise<DashboardResponse> {
  return request<DashboardResponse>(`/api/dashboard?limit=${limit}`);
}

export { ApiError };
