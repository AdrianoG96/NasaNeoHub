"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Telescope } from "lucide-react"

interface EmptyStateProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
}

export function EmptyState({
  title = "Nessun asteroide trovato",
  subtitle = "Prova con un range di date diverso.",
  icon,
}: EmptyStateProps) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardContent className="flex flex-col items-center gap-3 py-16">
        {icon ?? <Telescope className="size-12 text-white/20" />}
        <div className="space-y-1 text-center">
          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="text-sm text-white/50">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )

}
