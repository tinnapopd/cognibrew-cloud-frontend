import type { CreateFacesRequest, DeleteFacesRequest, DeleteFacesResponse, GetFacesResponse } from "@/client";
import { ENV } from "@/lib/env";

const API_URL = ENV.API_URL;
const EMBED_URL = ENV.EMBED_URL;

// ── Gateway API ────────────────────────────────────────────────────────────

async function gatewayPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail?.[0]?.msg ?? `Gateway error ${res.status}`);
  }
  return res.json();
}

export async function getFaces(username?: string, device_id?: string): Promise<GetFacesResponse> {
  return gatewayPost<GetFacesResponse>("/api/v1/gateway/get_faces", {
    ...(username ? { username } : {}),
    ...(device_id ? { device_id } : {}),
  });
}

export async function createFace(body: CreateFacesRequest) {
  return gatewayPost("/api/v1/gateway/create_faces", body);
}

export async function deleteFace(body: DeleteFacesRequest): Promise<DeleteFacesResponse> {
  return gatewayPost<DeleteFacesResponse>("/api/v1/gateway/delete_faces", body);
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/v1/utils/health-check/`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Embed Service ──────────────────────────────────────────────────────────

export interface EmbedResponse {
  faces: { embedding: number[]; bbox: number[] }[];
}

export async function embedImage(file: File): Promise<number[]> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${EMBED_URL}/api/embed`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Embed error ${res.status}`);
  }

  const data: EmbedResponse = await res.json();
  const embedding = data.faces?.[0]?.embedding;
  if (!embedding || embedding.length === 0) {
    throw new Error("No face detected in the image");
  }
  return embedding;
}
