"use client"

import type { HazardousFilterValue } from "@/lib/types"

interface HazardousFilterProps {
  value: HazardousFilterValue
  onChange: (value: HazardousFilterValue) => void
  totalCount: number
  filteredCount: number
}

const options: { value: HazardousFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hazardous", label: "Hazardous Only" },
  { value: "non-hazardous", label: "Non-Hazardous Only" },
]

export function HazardousFilter({ value, onChange, totalCount, filteredCount }: HazardousFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5" role="tablist" aria-label="Filtro asteroidi pericolosi">
        {options.map((option) => (
          <button
            key={option.value}
            role="tab"
            aria-selected={value === option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              value === option.value
                ? "bg-white/10 text-white shadow-xs"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-white/50">
        Showing {filteredCount} of {totalCount} asteroids
      </p>
    </div>
  )

}
