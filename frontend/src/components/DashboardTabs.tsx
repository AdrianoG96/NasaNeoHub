"use client"

import { useState, useCallback } from "react"
import { BarChart3, ScatterChartIcon, OrbitIcon, LayoutDashboard, List, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/StatsCards"
import { HazardAlert } from "@/components/HazardAlert"
import { DistanceScatterChart } from "@/components/DistanceScatterChart"
import { DiameterBarChart } from "@/components/DiameterBarChart"
import { OrbitVisualization } from "@/components/OrbitVisualization"
import { AsteroidTable } from "@/components/AsteroidTable"
import { HazardousFilter } from "@/components/HazardousFilter"
import { TableSkeleton } from "@/components/TableSkeleton"
import { KeyInsights } from "@/components/KeyInsights"
import { generateCsv } from "@/lib/csv"
import type { AsteroidSummary, HazardousFilterValue, SortField, SortDirection } from "@/lib/types"

type TabId = "overview" | "list" | "charts" | "3d"

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

const TABS: Tab[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { id: "list", label: "List", icon: <List className="size-4" /> },
  { id: "charts", label: "Charts", icon: <BarChart3 className="size-4" /> },
  { id: "3d", label: "3D View", icon: <OrbitIcon className="size-4" /> },
]

interface DashboardTabsProps {
  asteroids: AsteroidSummary[]
  filteredAsteroids: AsteroidSummary[]
  total: number
  isLoading: boolean
  hazardousCount: number
  hazardousFilter: HazardousFilterValue
  sortField: SortField | null
  sortDirection: SortDirection
  currentRange: { start: string; end: string } | null
  onSetHazardousFilter: (filter: HazardousFilterValue) => void
  onSort: (field: SortField) => void
  onAsteroidClick: (id: string) => void
}

export function DashboardTabs({
  asteroids,
  filteredAsteroids,
  total,
  isLoading,
  hazardousCount,
  hazardousFilter,
  sortField,
  sortDirection,
  currentRange,
  onSetHazardousFilter,
  onSort,
  onAsteroidClick,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview")
  const [show3D, setShow3D] = useState(false)

  const handleExportCsv = useCallback(() => {
    if (currentRange && filteredAsteroids.length > 0) {
      generateCsv(filteredAsteroids, currentRange.start, currentRange.end)
    }
  }, [filteredAsteroids, currentRange])

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              if (tab.id === "3d") setShow3D(true)
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/50 hover:bg-white/5 hover:text-white/80"
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <KeyInsights asteroids={filteredAsteroids} />
            <StatsCards asteroids={asteroids} />
            <HazardAlert
              hazardousCount={hazardousCount}
              totalCount={total}
              onSetFilter={onSetHazardousFilter}
              onDismiss={() => {}}
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                  <ScatterChartIcon className="size-4 text-blue-400" />
                  Distance Over Time
                </h3>
                {isLoading ? (
                  <div className="flex h-48 items-center justify-center text-sm text-white/40">Loading chart...</div>
                ) : (
                  <DistanceScatterChart asteroids={filteredAsteroids} />
                )}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                  <BarChart3 className="size-4 text-blue-400" />
                  Diameter Distribution
                </h3>
                {isLoading ? (
                  <div className="flex h-48 items-center justify-center text-sm text-white/40">Loading chart...</div>
                ) : (
                  <DiameterBarChart asteroids={filteredAsteroids} />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <HazardousFilter
                value={hazardousFilter}
                onChange={onSetHazardousFilter}
                totalCount={total}
                filteredCount={filteredAsteroids.length}
              />
              {filteredAsteroids.length > 0 && currentRange && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  className="flex items-center gap-2 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <Download className="size-4" />
                  Export CSV
                </Button>
              )}
            </div>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <AsteroidTable
                asteroids={filteredAsteroids}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                onAsteroidClick={onAsteroidClick}
              />
            )}
          </div>
        )}

        {activeTab === "charts" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                <ScatterChartIcon className="size-4 text-blue-400" />
                Distance Over Time
              </h3>
              {isLoading ? (
                <div className="flex h-64 items-center justify-center text-sm text-white/40">Loading chart...</div>
              ) : (
                <DistanceScatterChart asteroids={filteredAsteroids} />
              )}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                <BarChart3 className="size-4 text-blue-400" />
                Diameter Distribution
              </h3>
              {isLoading ? (
                <div className="flex h-64 items-center justify-center text-sm text-white/40">Loading chart...</div>
              ) : (
                <DiameterBarChart asteroids={filteredAsteroids} />
              )}
            </div>
          </div>
        )}

        {activeTab === "3d" && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
              <OrbitIcon className="size-4 text-blue-400" />
              3D Orbit Visualization
            </h3>
            {show3D ? (
              <OrbitVisualization
                asteroids={filteredAsteroids}
                onAsteroidClick={onAsteroidClick}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 py-8">
                <OrbitIcon className="size-12 text-white/20" />
                <p className="text-sm text-white/50">
                  Explore asteroid orbits in 3D space
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShow3D(true)}
                  className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Load 3D Visualization
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
