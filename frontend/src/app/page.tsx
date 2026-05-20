import { AsteroidDashboard } from "@/components/AsteroidDashboard"

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Near-Earth Objects</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Explore asteroids approaching Earth using real NASA data
        </p>
      </header>
      <AsteroidDashboard />
    </div>
  )
}
