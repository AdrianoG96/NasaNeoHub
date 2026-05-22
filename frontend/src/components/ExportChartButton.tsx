"use client"

import { useCallback, useRef, useState } from "react"
import { Camera } from "lucide-react"
import { toPng } from "html-to-image"

interface ExportChartButtonProps {
  chartRef: React.RefObject<HTMLDivElement | null>
  chartType: string
  dateRange: string
}

export function ExportChartButton({ chartRef, chartType, dateRange }: ExportChartButtonProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = useCallback(async () => {
    if (!chartRef.current) return

    setExporting(true)
    try {
      const dataUrl = await toPng(chartRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "oklch(0.145 0 0)",
      })

      const link = document.createElement("a")
      link.download = `nasa-neo-${chartType}-${dateRange}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to export chart:", err)
    } finally {
      setExporting(false)
    }
  }, [chartRef, chartType, dateRange])

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-white/50 transition-all duration-200 hover:bg-white/10 hover:text-white/70 disabled:opacity-50"
      aria-label="Export chart as PNG"
    >
      <Camera className="size-3" />
      {exporting ? "..." : "Export PNG"}
    </button>
  )
}
