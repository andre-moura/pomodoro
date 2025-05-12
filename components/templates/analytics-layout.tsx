"use client"

import { AnalyticsPanel } from "@/components/organisms/analytics-panel"
import { MainHeader } from "@/components/layout/main-header"
import { useState, useEffect } from "react"
import { Card } from "@/components/molecules/card"
import { Footer } from "@/components/layout/footer"

export default function AnalyticsLayout() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate a loading state to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <MainHeader />

      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-primary">Analytics Dashboard</h1>

          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="glass-card animate-pulse h-32">
                    <div className="p-4">
                      <div className="h-5 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </Card>
                ))}
              </div>
              <Card className="glass-card overflow-hidden animate-pulse">
                <div className="p-4 border-b border-border/10 bg-primary/5">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </div>
                <div className="p-6">
                  <div className="h-[300px] bg-muted/30 rounded"></div>
                </div>
              </Card>
            </div>
          ) : (
            <AnalyticsPanel />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
