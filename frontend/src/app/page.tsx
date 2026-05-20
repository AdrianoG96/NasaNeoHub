import { AsteroidDashboard } from "@/components/AsteroidDashboard"

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Near-Earth Objects</h1>
        <p className="text-muted-foreground">
          Explore asteroids approaching Earth using real NASA data
        </p>
      </header>
      <AsteroidDashboard />
    </div>
  )
}
