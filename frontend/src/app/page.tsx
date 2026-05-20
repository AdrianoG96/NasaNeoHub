import { AsteroidDashboard } from "@/components/AsteroidDashboard"
import { HeroSection } from "@/components/HeroSection"

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8">
      <HeroSection />
      <AsteroidDashboard />
    </div>
  )
}

