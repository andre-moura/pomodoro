"use client"

import type { ReactNode } from "react"
import { SettingsProvider } from "@/hooks/use-settings"
import { AnalyticsProvider } from "@/hooks/use-analytics"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </SettingsProvider>
  )
}
