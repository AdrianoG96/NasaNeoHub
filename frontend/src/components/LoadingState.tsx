"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  variant?: "cards" | "table" | "charts" | "detail" | "full"
  message?: string
}

function CardSkeleton() {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardContent className="flex items-start gap-3 p-4">
        <Skeleton className="size-5 rounded" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-white/5 px-4 py-3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="flex h-48 items-end justify-center gap-2 px-4 pb-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="w-6 rounded-t"
          style={{ height: `${Math.random() * 60 + 20}%` }}
        />
      ))}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

export function LoadingState({ variant = "full", message }: LoadingStateProps) {
  if (variant === "cards") {
    return (
      <div className="space-y-3">
        {message && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="size-3.5 animate-spin" />
            {message}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className="space-y-3">
        {message && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="size-3.5 animate-spin" />
            {message}
          </div>
        )}
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="border-b border-white/5 bg-white/5 px-4 py-3">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (variant === "charts") {
    return (
      <div className="space-y-4">
        {message && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="size-3.5 animate-spin" />
            {message}
          </div>
        )}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <Skeleton className="mb-4 h-4 w-40" />
          <ChartSkeleton />
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <Skeleton className="mb-4 h-4 w-44" />
          <ChartSkeleton />
        </div>
      </div>
    )
  }

  if (variant === "detail") {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <DetailSkeleton />
      </div>
    )
  }

  // Full page loading
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Loader2 className="size-8 animate-spin text-blue-400" />
      <p className="text-sm text-white/50">{message || "Loading data..."}</p>
    </div>
  )
}
