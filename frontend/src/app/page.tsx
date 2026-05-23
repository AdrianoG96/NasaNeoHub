import Image from "next/image"
import { AsteroidDashboard } from "@/components/AsteroidDashboard"
import { HeroSection } from "@/components/HeroSection"
import { AppFooter } from "@/components/AppFooter"

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8">
      {/* NASA Logo in alto al centro */}
      <div className="flex justify-center">
        <Image
          src="/NASA_logo.png"
          alt="NASA Logo"
          width={320}
          height={120}
          className="w-48 sm:w-72 md:w-80 h-auto"
          priority
        />
      </div>
      <HeroSection />
      <AsteroidDashboard />
      <AppFooter />
    </div>
  )
}
