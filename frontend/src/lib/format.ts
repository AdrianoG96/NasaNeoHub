export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatDistance(km: number): string {
  return `${formatNumber(Math.round(km))} km`
}

export function formatDiameter(min: number, max: number): string {
  return `${formatNumber(min, 3)} – ${formatNumber(max, 3)}`
}

export function formatVelocity(kph: number): string {
  return `${formatNumber(Math.round(kph))} km/h`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDecimal(value: string | number | null, decimals = 4): string {
  if (value === null || value === undefined) return "—"
  const num = typeof value === "string" ? Number.parseFloat(value) : value
  if (Number.isNaN(num)) return "—"
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
