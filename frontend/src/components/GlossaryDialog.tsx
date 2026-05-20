"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const GLOSSARY_TERMS = [
  {
    term: "Near-Earth Object (NEO)",
    definition: "An asteroid or comet whose orbit brings it within 1.3 astronomical units (AU) of the Sun — roughly 195 million km — and therefore close to Earth's orbit.",
    learnMore: "https://science.nasa.gov/planetary-science/planets/near-earth-objects/",
  },
  {
    term: "Potentially Hazardous Asteroid (PHA)",
    definition: "An asteroid with an orbit that brings it within 0.05 AU (about 7.5 million km) of Earth's orbit, and with a diameter of at least 140 meters. These are closely monitored by NASA.",
    learnMore: "https://cneos.jpl.nasa.gov/about/neo_groups.html",
  },
  {
    term: "Miss Distance",
    definition: "The closest distance an asteroid will pass by Earth during its flyby. Measured in kilometers or astronomical units (AU).",
    comparison: "🌙 The Moon is about 384,400 km away — if an asteroid has a miss distance smaller than that, it's passing inside the Moon's orbit!",
  },
  {
    term: "Absolute Magnitude (H)",
    definition: "A measure of an asteroid's intrinsic brightness. The lower the number, the larger the asteroid. Each step of 1 in magnitude corresponds to about 2.5 times difference in brightness.",
    comparison: "🔭 An asteroid with H=18 is about 1 km in diameter, while H=22 is about 100 meters.",
  },
  {
    term: "Astronomical Unit (AU)",
    definition: "The average distance between Earth and the Sun — about 149.6 million km (93 million miles). Used as a standard measuring stick for distances in our Solar System.",
    comparison: "☀️ 1 AU = distance from Earth to Sun (about 8 light-minutes)",
  },
  {
    term: "Eccentricity",
    definition: "A measure of how elliptical (stretched out) an orbit is. 0 = perfect circle, 1 = extremely elongated parabola. Most asteroids have eccentricities between 0 and 0.5.",
    comparison: "🌍 Earth's eccentricity is 0.0167 (nearly circular). A typical NEO has eccentricity around 0.3-0.5.",
  },
  {
    term: "Semi-Major Axis",
    definition: "Half the longest diameter of an elliptical orbit. It determines the orbital period — how long it takes to go around the Sun once.",
    comparison: "📐 Earth's semi-major axis = 1 AU (one year orbit). An asteroid with semi-major axis of 2 AU takes about 2.8 years to orbit the Sun.",
  },
  {
    term: "Inclination",
    definition: "The tilt of an asteroid's orbit relative to Earth's orbital plane (the ecliptic). Measured in degrees.",
    comparison: "📏 Most asteroids in the Main Belt have low inclinations (<20°), but some NEOs can have highly inclined orbits up to 90°!",
  },
  {
    term: "Close Approach",
    definition: "When an asteroid passes near Earth. NASA tracks these events to predict future approaches and assess any potential impact risk.",
    comparison: "🔄 Some asteroids make close approaches every few years, others once in a century.",
  },
  {
    term: "Orbital Period",
    definition: "The time it takes for an asteroid to complete one full orbit around the Sun. Measured in Earth days or years.",
    comparison: "⏱️ Earth's orbital period = 365.25 days. A typical NEO has an orbital period of 1-5 years.",
  },
]

export function GlossaryDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <BookOpen className="mr-1.5 size-3.5" />
        Learn
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto border-white/10 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="size-5 text-blue-400" />
              Astronomy Glossary
            </DialogTitle>
            <DialogDescription className="text-blue-200/60">
              Learn the terminology used by NASA astronomers to describe near-Earth objects.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {GLOSSARY_TERMS.map((item) => (
              <div
                key={item.term}
                className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20"
              >
                <h3 className="mb-1 font-semibold text-blue-300">{item.term}</h3>
                <p className="text-sm leading-relaxed text-white/70">{item.definition}</p>
                {item.comparison && (
                  <p className="mt-1.5 text-xs font-medium text-yellow-300/80">{item.comparison}</p>
                )}
                {item.learnMore && (
                  <a
                    href={item.learnMore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 underline-offset-2 hover:underline"
                  >
                    Learn more on NASA →
                  </a>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
