"use client"

import { useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import type { HazardousFilterValue } from "@/lib/types"

interface HazardAlertProps {
  hazardousCount: number
  totalCount: number
  onSetFilter: (filter: HazardousFilterValue) => void
  onDismiss: () => void
}

export function HazardAlert({ hazardousCount, totalCount, onSetFilter, onDismiss }: HazardAlertProps) {
  const [dismissed, setDismissed] = useState(false)
  const isVisible = !dismissed && hazardousCount > 0

  if (!isVisible) return null

  const handleShowHazardous = () => {
    onSetFilter("hazardous")
  }

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss()
  }

  return (
    <div className="animate-fade-in-up">
      <Alert variant="destructive" className="relative border-red-500/50 bg-red-500/10 pr-12 shadow-lg shadow-red-500/5">
        <AlertTriangle className="size-5 text-red-500 animate-pulse" />
        <AlertTitle className="text-red-400">
          ⚠️ Attention: {hazardousCount} Potentially Hazardous Asteroid{hazardousCount > 1 ? "s" : ""} Detected
        </AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-3 text-red-400/80">
          <p>
            {hazardousCount} of {totalCount} asteroid{hazardousCount > 1 ? "s" : ""} in this period {" "}
            {hazardousCount > 1 ? "are" : "is"} classified as potentially hazardous.
          </p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleShowHazardous}
              className="w-fit"
            >
              Show Hazardous Only
            </Button>
          </div>
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 size-6 text-red-500/70 hover:text-red-500"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <X className="size-4" />
        </Button>
      </Alert>
    </div>
  )
}
