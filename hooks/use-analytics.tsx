"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Session {
  date: string
  duration: number
  completed: boolean
}

interface AnalyticsContextType {
  sessions: Session[]
  addSession: (session: Session) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem("pomohelper-sessions")
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions)
        setSessions(parsedSessions)
      } catch (error) {
        console.error("Error parsing sessions:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    // Save sessions to localStorage when they change
    if (isLoaded) {
      localStorage.setItem("pomohelper-sessions", JSON.stringify(sessions))
    }
  }, [sessions, isLoaded])

  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session])
  }

  return <AnalyticsContext.Provider value={{ sessions, addSession }}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
