"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Telescope, Search, Filter } from "lucide-react"

interface EmptyStateProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  variant?: "search" | "filter" | "default"
}

const VARIANT_ICONS = {
  search: <Search className="size-12 text-white/20" />,
  filter: <Filter className="size-12 text-white/20" />,
  default: <Telescope className="size-12 text-white/20" />,
}

export function EmptyState({
  title = "No asteroids found",
  subtitle = "Try a different date range.",
  icon,
  variant = "default",
}: EmptyStateProps) {
  const displayIcon = icon ?? VARIANT_ICONS[variant]

  return (
    <Card className="border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20">
      <CardContent className="flex flex-col items-center gap-4 py-16">
        <div className="animate-float opacity-60">
          {displayIcon}
        </div>
        <div className="space-y-1 text-center">
          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="text-sm text-white/50">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )

}
