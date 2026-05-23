"use client"

import { useState, useEffect } from "react"
import { Sparkles, Moon } from "lucide-react"

const COSMIC_FACTS = [
  "Did you know? The closest asteroid to Earth in the last year was just 2,900 km away!",
  "Did you know? There are over 35,000 known Near-Earth Objects (NEOs).",
  "Did you know? An asteroid the size of a car enters Earth's atmosphere about once a year.",
  "Did you know? The largest known NEO is 1036 Ganymed, about 35 km in diameter.",
  "Did you know? NASA's DART mission successfully changed an asteroid's orbit in 2022.",
  "Did you know? Most NEOs originate from the Main Asteroid Belt between Mars and Jupiter.",
  "Did you know? The term 'asteroid' means 'star-like' in ancient Greek.",
  "Did you know? Some asteroids have their own moons — they're called binary asteroids.",
  "Did you know? The Chelyabinsk event in 2013 injured over 1,500 people from a shock wave.",
  "Did you know? Asteroids can tell us about the early Solar System — they're time capsules!",
]

function getDailyFactIndex(): number {
  const today = new Date()
  return today.getDate() % COSMIC_FACTS.length
}

export function HeroSection() {
  const [fact, setFact] = useState(() => COSMIC_FACTS[getDailyFactIndex()])
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * COSMIC_FACTS.length)
    setFact(COSMIC_FACTS[randomIndex])
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  return (
    <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-blue-950/50 to-slate-900/80 p-6 backdrop-blur-sm sm:p-8">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        {/* Top row: title */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-yellow-400" />
              <h1 className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                Near-Earth Objects Explorer
              </h1>
            </div>
            <p className="text-sm text-blue-200/70 sm:text-base">
              Real-time NASA data on asteroids approaching Earth — explore, learn, discover.
            </p>
          </div>
        </div>

        {/* Bottom row: clock + fact */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Cosmic Clock */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Moon className="size-5 text-blue-300" />
            </div>
            <div>
              <p className="font-mono text-lg font-semibold text-white" suppressHydrationWarning>{formatTime(time)}</p>
              <p className="text-xs text-blue-200/60" suppressHydrationWarning>{formatDate(time)} UTC</p>
            </div>
          </div>

          {/* Did you know? */}
          <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 transition-all duration-300 hover:border-yellow-500/30 hover:bg-yellow-500/10">
            <span className="mt-0.5 shrink-0 text-sm">💡</span>
            <p className="text-xs leading-relaxed text-yellow-200/80 sm:text-sm">{fact}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
