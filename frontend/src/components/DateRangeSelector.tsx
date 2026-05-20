"use client"

import { useState, useCallback } from "react"
import { format, differenceInDays, isAfter, isBefore, startOfDay, isFuture } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const MAX_RANGE_DAYS = 30

interface DateRangeSelectorProps {
  onSearch: (startDate: string, endDate: string) => void
  isLoading: boolean
}

export function DateRangeSelector({ onSearch, isLoading }: DateRangeSelectorProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = useCallback((start: Date | undefined, end: Date | undefined): string | null => {
    if (!start || !end) return null

    if (isFuture(start) || isFuture(end)) return "Le date non possono essere future"

    if (isAfter(start, end)) return "La data di inizio deve essere precedente alla data di fine"

    const days = differenceInDays(end, start)
    if (days > MAX_RANGE_DAYS) return `Il range massimo è di ${MAX_RANGE_DAYS} giorni`

    return null
  }, [])

  const handleStartSelect = (date: Date | undefined) => {
    setStartDate(date)
    setError(validate(date, endDate))
    if (date) setStartOpen(false)
  }

  const handleEndSelect = (date: Date | undefined) => {
    setEndDate(date)
    setError(validate(startDate, date))
    if (date) setEndOpen(false)
  }

  const handleSearch = () => {
    if (!startDate || !endDate) return

    const validationError = validate(startDate, endDate)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onSearch(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"))
  }

  const isSearchDisabled = !startDate || !endDate || isLoading || error !== null

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
      <div className="flex flex-col gap-1.5 sm:flex-1">
        <label className="text-sm font-medium text-white/70">Start Date</label>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger render={<Button variant="outline" className={cn("w-full justify-start text-left font-normal border-white/10 bg-white/5 text-white sm:w-44", !startDate && "text-white/40")} />}>
            <CalendarIcon className="size-4 shrink-0 text-white/50" />
            <span className="truncate">{startDate ? format(startDate, "PPP") : <span>Pick a date</span>}</span>
          </PopoverTrigger>
          <PopoverContent className="w-auto border-white/10 bg-slate-800 p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartSelect}
              disabled={(date) => isFuture(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-1.5 sm:flex-1">
        <label className="text-sm font-medium text-white/70">End Date</label>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger render={<Button variant="outline" className={cn("w-full justify-start text-left font-normal border-white/10 bg-white/5 text-white sm:w-44", !endDate && "text-white/40")} />}>
            <CalendarIcon className="size-4 shrink-0 text-white/50" />
            <span className="truncate">{endDate ? format(endDate, "PPP") : <span>Pick a date</span>}</span>
          </PopoverTrigger>
          <PopoverContent className="w-auto border-white/10 bg-slate-800 p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndSelect}
              disabled={(date) => isFuture(date) || (startDate ? isBefore(date, startDate) : false)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleSearch} disabled={isSearchDisabled} className="w-full bg-blue-600 text-white hover:bg-blue-500 sm:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Search"
        )}
      </Button>

      {error && (
        <p className="w-full text-sm text-red-400">{error}</p>
      )}
    </div>
  )

}
