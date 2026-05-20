import type { FeedResponse, AsteroidDetail } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Errore sconosciuto" }))
    // Prepend the HTTP status code so ErrorAlert can map it to a user-friendly message
    throw new Error(`[${response.status}] ${error.detail || "Errore sconosciuto"}`)
  }

  return response.json()
}

export async function fetchAsteroidFeed(
  startDate: string,
  endDate: string
): Promise<FeedResponse> {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
  const response = await fetch(`${API_BASE_URL}/api/neo/feed?${params}`)

  return handleResponse<FeedResponse>(response)
}

export async function fetchAsteroidDetail(id: string): Promise<AsteroidDetail> {
  const response = await fetch(`${API_BASE_URL}/api/neo/${id}`)

  return handleResponse<AsteroidDetail>(response)
}
