"use client"

import { useState, useCallback, useRef, useMemo } from "react"
import { BarChart3, ScatterChartIcon, OrbitIcon, LayoutDashboard, List, Download, Columns2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/StatsCards"
import { HazardAlert } from "@/components/HazardAlert"
import { DistanceScatterChart } from "@/components/DistanceScatterChart"
import { DiameterBarChart } from "@/components/DiameterBarChart"
import { OrbitVisualization } from "@/components/OrbitVisualization"
import { AsteroidTable } from "@/components/AsteroidTable"
import { HazardousFilter } from "@/components/HazardousFilter"
import { KeyInsights } from "@/components/KeyInsights"
import { LoadingState } from "@/components/LoadingState"
import { VelocityLineChart } from "@/components/VelocityLineChart"
import { BubbleComparisonChart } from "@/components/BubbleComparisonChart"
import { HazardDonutChart } from "@/components/HazardDonutChart"
import { StackedDiameterChart } from "@/components/StackedDiameterChart"
import { ChartControls, type ChartSettings, type ChartType } from "@/components/ChartControls"
import { ChartSummaryStats } from "@/components/ChartSummaryStats"
import { ActivityHeatmapChart } from "@/components/ActivityHeatmapChart"
import { DailyDiscoveryChart } from "@/components/DailyDiscoveryChart"
import { ExportChartButton } from "@/components/ExportChartButton"
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

const DEFAULT_CHART_SETTINGS: ChartSettings = {
  chartType: "velocity-line",
  logScale: false,
  showMovingAverage: false,
  showPercentage: false,
}

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

function renderChart(
  chartType: ChartType,
  asteroids: AsteroidSummary[],
  isLoading: boolean
) {
  if (isLoading) return <LoadingState variant="charts" />
  if (asteroids.length === 0) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">No data available</div>
  }

  switch (chartType) {
    case "velocity-line":
      return <VelocityLineChart asteroids={asteroids} />
    case "bubble-comparison":
      return <BubbleComparisonChart asteroids={asteroids} />
    case "hazard-donut":
      return <HazardDonutChart asteroids={asteroids} />
    case "stacked-diameter":
      return <StackedDiameterChart asteroids={asteroids} />
    case "daily-discovery":
      return <DailyDiscoveryChart asteroids={asteroids} />
    case "activity-heatmap":
      return <ActivityHeatmapChart asteroids={asteroids} />
    default:
      return <VelocityLineChart asteroids={asteroids} />
  }
}

function getChartMetric(chartType: ChartType): "miss_distance_km" | "estimated_diameter_max_km" | "relative_velocity_kph" {
  switch (chartType) {
    case "velocity-line":
      return "relative_velocity_kph"
    case "bubble-comparison":
      return "miss_distance_km"
    case "stacked-diameter":
      return "estimated_diameter_max_km"
    case "daily-discovery":
      return "miss_distance_km"
    default:
      return "miss_distance_km"
  }
}

function getChartLabel(chartType: ChartType): string {
  switch (chartType) {
    case "velocity-line":
      return "Velocity"
    case "bubble-comparison":
      return "Distance"
    case "stacked-diameter":
      return "Diameter"
    case "daily-discovery":
      return "Count"
    default:
      return "Value"
  }
}

function getChartUnit(chartType: ChartType): string {
  switch (chartType) {
    case "velocity-line":
      return "km/h"
    case "bubble-comparison":
      return "km"
    case "stacked-diameter":
      return "km"
    default:
      return ""
  }
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
  const [splitView, setSplitView] = useState(false)
  const [leftSettings, setLeftSettings] = useState<ChartSettings>(DEFAULT_CHART_SETTINGS)
  const [rightSettings, setRightSettings] = useState<ChartSettings>({ ...DEFAULT_CHART_SETTINGS, chartType: "hazard-donut" })

  const leftChartRef = useRef<HTMLDivElement>(null)
  const rightChartRef = useRef<HTMLDivElement>(null)

  const dateRangeStr = useMemo(() => {
    if (!currentRange) return "unknown"
    return `${currentRange.start}-${currentRange.end}`
  }, [currentRange])

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
      <div className="transition-all duration-300 animate-fade-in-up">
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
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                  <ScatterChartIcon className="size-4 text-blue-400" />
                  Distance Over Time
                </h3>
                {isLoading ? (
                  <LoadingState variant="charts" />
                ) : (
                  <DistanceScatterChart asteroids={filteredAsteroids} />
                )}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                  <BarChart3 className="size-4 text-blue-400" />
                  Diameter Distribution
                </h3>
                {isLoading ? (
                  <LoadingState variant="charts" />
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
                  className="flex items-center gap-2 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <Download className="size-4" />
                  Export CSV
                </Button>
              )}
            </div>
            {isLoading ? (
              <LoadingState variant="table" message="Loading asteroid data..." />
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
            {/* Split View Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSplitView((prev) => !prev)}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  splitView
                    ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                }`}
                aria-label="Toggle split view"
              >
                <Columns2 className="size-3" />
                {splitView ? "Single View" : "Split View"}
              </button>
            </div>

            {splitView ? (
              /* Split View: Two charts side by side */
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Left Panel */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80">
                      <BarChart3 className="size-4 text-blue-400" />
                      Chart A
                    </h3>
                    <ExportChartButton
                      chartRef={leftChartRef}
                      chartType={leftSettings.chartType}
                      dateRange={dateRangeStr}
                    />
                  </div>
                  <ChartControls
                    settings={leftSettings}
                    onSettingsChange={setLeftSettings}
                    isLoading={isLoading}
                  />
                  <div className="mt-2">
                    <ChartSummaryStats
                      asteroids={filteredAsteroids}
                      metric={getChartMetric(leftSettings.chartType)}
                      label={getChartLabel(leftSettings.chartType)}
                      unit={getChartUnit(leftSettings.chartType)}
                    />
                  </div>
                  <div ref={leftChartRef} className="mt-3">
                    {renderChart(leftSettings.chartType, filteredAsteroids, isLoading)}
                  </div>
                </div>

                {/* Right Panel */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80">
                      <BarChart3 className="size-4 text-blue-400" />
                      Chart B
                    </h3>
                    <ExportChartButton
                      chartRef={rightChartRef}
                      chartType={rightSettings.chartType}
                      dateRange={dateRangeStr}
                    />
                  </div>
                  <ChartControls
                    settings={rightSettings}
                    onSettingsChange={setRightSettings}
                    isLoading={isLoading}
                  />
                  <div className="mt-2">
                    <ChartSummaryStats
                      asteroids={filteredAsteroids}
                      metric={getChartMetric(rightSettings.chartType)}
                      label={getChartLabel(rightSettings.chartType)}
                      unit={getChartUnit(rightSettings.chartType)}
                    />
                  </div>
                  <div ref={rightChartRef} className="mt-3">
                    {renderChart(rightSettings.chartType, filteredAsteroids, isLoading)}
                  </div>
                </div>
              </div>
            ) : (
              /* Single View: One chart with controls */
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white/80">
                    <BarChart3 className="size-4 text-blue-400" />
                    Chart View
                  </h3>
                  <ExportChartButton
                    chartRef={leftChartRef}
                    chartType={leftSettings.chartType}
                    dateRange={dateRangeStr}
                  />
                </div>
                <ChartControls
                  settings={leftSettings}
                  onSettingsChange={setLeftSettings}
                  isLoading={isLoading}
                />
                <div className="mt-2">
                  <ChartSummaryStats
                    asteroids={filteredAsteroids}
                    metric={getChartMetric(leftSettings.chartType)}
                    label={getChartLabel(leftSettings.chartType)}
                    unit={getChartUnit(leftSettings.chartType)}
                  />
                </div>
                <div ref={leftChartRef} className="mt-3">
                  {renderChart(leftSettings.chartType, filteredAsteroids, isLoading)}
                </div>
              </div>
            )}

            {/* Always show the Hazard Donut and Radar charts below */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                  <BarChart3 className="size-4 text-blue-400" />
                  Hazard Distribution
                </h3>
                {isLoading ? (
                  <LoadingState variant="charts" />
                ) : (
                  <HazardDonutChart asteroids={filteredAsteroids} />
                )}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                  <BarChart3 className="size-4 text-blue-400" />
                  Stacked Diameter Distribution
                </h3>
                {isLoading ? (
                  <LoadingState variant="charts" />
                ) : (
                  <StackedDiameterChart asteroids={filteredAsteroids} />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "3d" && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20">
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
                  className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
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
