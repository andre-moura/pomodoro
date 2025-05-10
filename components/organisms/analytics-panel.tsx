"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { useAnalytics } from "@/hooks/use-analytics"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/molecules/tabs"
import { format, subDays, isWithinInterval, startOfWeek, endOfWeek } from "date-fns"
import { Clock, BarChart2, TrendingUp } from "lucide-react"

export function AnalyticsPanel() {
  const { sessions } = useAnalytics()
  const [timeRange, setTimeRange] = useState<"daily" | "weekly">("daily")
  const [chartData, setChartData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  // Calculate stats
  const totalSessions = sessions.length
  const completedSessions = sessions.filter((session) => session.completed).length
  const totalFocusTime = sessions.reduce((total, session) => total + session.duration, 0)
  const averageSessionLength = totalSessions > 0 ? totalFocusTime / totalSessions : 0

  // Prepare data for charts
  const getDailyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i)
      const dayStr = format(date, "EEE")

      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)

      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const daySessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date)
        return isWithinInterval(sessionDate, { start: dayStart, end: dayEnd })
      })

      const completed = daySessions.filter((s) => s.completed).length
      const skipped = daySessions.filter((s) => !s.completed).length
      const totalMinutes = daySessions.reduce((total, s) => total + s.duration, 0)

      return {
        day: dayStr,
        completed,
        skipped,
        totalMinutes,
      }
    }).reverse()

    return last7Days
  }

  const getWeeklyData = () => {
    const weeks = []
    for (let i = 0; i < 4; i++) {
      const date = subDays(new Date(), i * 7)
      const weekStart = startOfWeek(date)
      const weekEnd = endOfWeek(date)
      const weekStr = `${format(weekStart, "MMM d")}-${format(weekEnd, "MMM d")}`

      const weekSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date)
        return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd })
      })

      const completed = weekSessions.filter((s) => s.completed).length
      const skipped = weekSessions.filter((s) => !s.completed).length
      const totalMinutes = weekSessions.reduce((total, s) => total + s.duration, 0)

      weeks.push({
        week: weekStr,
        completed,
        skipped,
        totalMinutes,
      })
    }

    return weeks.reverse()
  }

  // Update chart data when timeRange or sessions change
  useEffect(() => {
    // Memoize the data calculation to improve performance
    const calculateData = () => {
      return timeRange === "daily" ? getDailyData() : getWeeklyData()
    }

    // Only update chart data when component is mounted
    if (mounted) {
      setChartData(calculateData())
    }
  }, [timeRange, sessions, mounted])

  // Set mounted state to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // If not mounted yet, show a loading state
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="glass-card overflow-hidden animate-pulse">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] bg-muted/30 rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Generate sample data if no sessions exist
  const sampleData = [
    { day: "Mon", week: "May 1-7", completed: 4, skipped: 1, totalMinutes: 100 },
    { day: "Tue", week: "May 8-14", completed: 5, skipped: 0, totalMinutes: 125 },
    { day: "Wed", week: "May 15-21", completed: 3, skipped: 2, totalMinutes: 75 },
    { day: "Thu", week: "May 22-28", completed: 6, skipped: 1, totalMinutes: 150 },
    { day: "Fri", week: "May 29-Jun 4", completed: 4, skipped: 0, totalMinutes: 100 },
    { day: "Sat", week: "Jun 5-11", completed: 2, skipped: 1, totalMinutes: 50 },
    { day: "Sun", week: "Jun 12-18", completed: 3, skipped: 0, totalMinutes: 75 },
  ]

  // Use sample data if no real data exists
  const displayData = chartData.length > 0 ? chartData : sampleData

  // Define colors with better contrast
  const completedColor = "hsl(var(--primary))"
  const skippedColor = "hsl(var(--destructive))" // Using destructive color for better contrast

  return (
    <div className="space-y-6">
      <style jsx global>{`
        .recharts-default-tooltip {
          background-color: var(--background) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius) !important;
          padding: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        
        .recharts-tooltip-item-name,
        .recharts-tooltip-item-value {
          color: var(--foreground) !important;
        }
        
        .recharts-tooltip-cursor {
          opacity: 0.2 !important;
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" />
              <span>Total Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {completedSessions || 0} completed, {totalSessions - completedSessions || 0} skipped
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Total Focus Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalFocusTime || 0} min</div>
            <p className="text-xs text-muted-foreground">
              {Math.floor(totalFocusTime / 60) || 0} hours, {totalFocusTime % 60 || 0} minutes
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Avg. Session Length</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{averageSessionLength.toFixed(1) || "0.0"} min</div>
            <p className="text-xs text-muted-foreground">Per completed session</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary">Session Analytics</CardTitle>
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "daily" | "weekly")}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey={timeRange === "daily" ? "day" : "week"}
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => label}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />
                <Bar name="Completed" dataKey="completed" stackId="a" fill={completedColor} radius={[4, 4, 0, 0]} />
                <Bar
                  name="Skipped"
                  dataKey="skipped"
                  stackId="a"
                  fill={skippedColor}
                  radius={[4, 4, 0, 0]}
                  opacity={0.7}
                />
                <Legend
                  formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>}
                  iconType="circle"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-primary">Focus Time Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey={timeRange === "daily" ? "day" : "week"}
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} min`}
                />
                <Tooltip
                  formatter={(value) => [`${value} min`, "Focus Time"]}
                  labelFormatter={(label) => label}
                  cursor={{ stroke: "rgba(0, 0, 0, 0.2)", strokeWidth: 1 }}
                />
                <Line
                  name="Focus Time"
                  type="monotone"
                  dataKey="totalMinutes"
                  stroke={completedColor}
                  strokeWidth={2}
                  dot={{ r: 4, fill: completedColor }}
                  activeDot={{ r: 6, fill: completedColor, stroke: "white", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
