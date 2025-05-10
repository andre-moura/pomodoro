"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/atoms/button"
import { Home, BarChart3, Settings, Clock, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useSettings } from "@/hooks/use-settings"

export function MainHeader() {
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = useState<string>("")
  const [timerInfo, setTimerInfo] = useState<string>("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { settings } = useSettings()

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}`)
    }

    // Initial update
    updateTime()

    // Set up interval
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Listen for timer info from localStorage and sync it with document title
  useEffect(() => {
    const checkTimerInfo = () => {
      const storedTimerInfo = localStorage.getItem("pomohelper-current-timer")
      if (storedTimerInfo) {
        try {
          const timerData = JSON.parse(storedTimerInfo)
          if (timerData.isRunning) {
            // Calculate remaining time based on endTime for accurate background tab display
            let minutes = timerData.minutes;
            let seconds = timerData.seconds;
            
            // If we have an endTime, calculate the actual remaining time
            if (timerData.endTime) {
              const now = Date.now();
              const remaining = Math.max(0, timerData.endTime - now);
              minutes = Math.floor(remaining / 1000 / 60);
              seconds = Math.floor((remaining / 1000) % 60);
            }
            
            const mode = timerData.mode === "focus" ? "Focus" : timerData.mode === "shortBreak" ? "Break" : "Long Break"
            const timerDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`
            const timerInfoText = `${mode}: ${timerDisplay}`
            
            // Update state for UI display
            setTimerInfo(timerInfoText)
            
            // Update document title to show timer
            document.title = `${timerDisplay} PomoHelper`
          } else {
            setTimerInfo("")
            document.title = "PomoHelper" // Reset title when timer is not running
          }
        } catch (e) {
          console.error("Error parsing timer info:", e)
          setTimerInfo("")
          document.title = "PomoHelper" // Reset title on error
        }
      } else {
        setTimerInfo("")
        document.title = "PomoHelper" // Reset title when no timer data
      }
    }

    // Initial check
    checkTimerInfo()

    // Set up interval to check regularly
    const interval = setInterval(checkTimerInfo, 1000)

    // Cleanup: reset title when component unmounts
    return () => {
      clearInterval(interval)
      document.title = "PomoHelper"
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="border-b border-border/20 backdrop-blur-md bg-background/60 sticky top-0 z-10">
      <div className="container flex flex-wrap h-auto min-h-16 items-center justify-between py-2">
        {/* Logo and title - always visible */}
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <img src="pomodoro.svg" width="30" alt="PomoHelper Logo" />
          <span>PomoHelper</span>
        </Link>

        {/* Mobile menu button - only visible on small screens */}
        <div className="block md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="rounded-full">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation and features */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {/* Navigation links for desktop */}
          <nav className="flex items-center gap-1">
            <Link href="/">
              <Button variant={pathname === "/" ? "default" : "ghost"} size="icon" className="rounded-full">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant={pathname === "/analytics" ? "default" : "ghost"} size="icon" className="rounded-full">
                <BarChart3 className="h-5 w-5" />
                <span className="sr-only">Analytics</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant={pathname === "/settings" ? "default" : "ghost"} size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>

        {/* Mobile navigation - only visible when menu is open */}
        {isMenuOpen && (
          <div className="flex flex-col w-full mt-4 md:hidden">
            <nav className="flex items-center gap-1 flex-wrap justify-end w-full">
              <Link href="/" onClick={closeMenu}>
                <Button variant={pathname === "/" ? "default" : "ghost"} size="icon" className="rounded-full">
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Home</span>
                </Button>
              </Link>
              <Link href="/analytics" onClick={closeMenu}>
                <Button variant={pathname === "/analytics" ? "default" : "ghost"} size="icon" className="rounded-full">
                  <BarChart3 className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </Button>
              </Link>
              <Link href="/settings" onClick={closeMenu}>
                <Button variant={pathname === "/settings" ? "default" : "ghost"} size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
              <ModeToggle />
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}