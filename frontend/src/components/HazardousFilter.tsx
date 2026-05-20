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
      <div className="flex rounded-lg border bg-muted p-0.5" role="tablist" aria-label="Filtro asteroidi pericolosi">
        {options.map((option) => (
          <button
            key={option.value}
            role="tab"
            aria-selected={value === option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              value === option.value
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} asteroids
      </p>
    </div>
  )
}
