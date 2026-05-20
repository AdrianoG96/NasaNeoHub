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
