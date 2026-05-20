"use client"

import { useState, useRef, useEffect } from "react"
import { HelpCircle } from "lucide-react"

interface EducationalTooltipProps {
  term: string
  explanation: string
  comparison?: string
}

export function EducationalTooltip({ term, explanation, comparison }: EducationalTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <span className="relative inline-flex items-center gap-1">
      <span className="border-b border-dotted border-blue-400/50 font-medium text-blue-300">
        {term}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex text-blue-400/60 hover:text-blue-300"
        aria-label={`Learn more about ${term}`}
      >
        <HelpCircle className="size-3.5" />
      </button>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-slate-800 p-3 shadow-xl backdrop-blur-sm"
        >
          <p className="text-xs leading-relaxed text-blue-100">{explanation}</p>
          {comparison && (
            <p className="mt-1.5 text-xs font-medium text-yellow-300">{comparison}</p>
          )}
          <div className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-slate-800" />
        </div>
      )}
    </span>
  )
}
