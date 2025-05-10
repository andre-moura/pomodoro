"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Settings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  browserNotifications: boolean
  soundAlerts: boolean
  vibration: boolean
  autoStartNextSession: boolean
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  browserNotifications: true,
  soundAlerts: true,
  vibration: false,
  autoStartNextSession: false,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("pomohelper-settings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)
      } catch (error) {
        console.error("Error parsing settings:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    // Save settings to localStorage when they change
    if (isLoaded) {
      localStorage.setItem("pomohelper-settings", JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
