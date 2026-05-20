import type { FeedResponse, AsteroidDetail } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function fetchAsteroidFeed(
  startDate: string,
  endDate: string
): Promise<FeedResponse> {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
  const response = await fetch(`${API_BASE_URL}/api/neo/feed?${params}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Errore sconosciuto" }))
    throw new Error(error.detail || `Errore ${response.status}`)
  }

  return response.json()
}

export async function fetchAsteroidDetail(id: string): Promise<AsteroidDetail> {
  const response = await fetch(`${API_BASE_URL}/api/neo/${id}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Errore sconosciuto" }))
    throw new Error(error.detail || `Errore ${response.status}`)
  }

  return response.json()
}
