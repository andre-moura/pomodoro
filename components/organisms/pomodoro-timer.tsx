"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { TimerDisplay } from "@/components/atoms/timer-display"
import { TimerControls } from "@/components/molecules/timer-controls"
import { Card } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { useSettings } from "@/hooks/use-settings"
import { useAnalytics } from "@/hooks/use-analytics"
import { Clock, Coffee, Dumbbell } from "lucide-react"

type TimerMode = "focus" | "shortBreak" | "longBreak"

export function PomodoroTimer() {
  const { settings } = useSettings()
  const { addSession } = useAnalytics()
  const [mode, setMode] = useState<TimerMode>("focus")
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  
  // Replace timerRef with end time tracking for reliable timing
  const endTimeRef = useRef<number | null>(null)
  const requestAnimationFrameRef = useRef<number | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioLoaded, setAudioLoaded] = useState(false)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/notification.mp3")

      // Add event listeners to track loading state
      audio.addEventListener("canplaythrough", () => {
        setAudioLoaded(true)
      })

      audio.addEventListener("error", (e) => {
        console.warn("Audio failed to load:", e)
        setAudioLoaded(false)
      })

      // Load the audio file
      audio.load()

      audioRef.current = audio

      // Cleanup
      return () => {
        audio.removeEventListener("canplaythrough", () => setAudioLoaded(true))
        audio.removeEventListener("error", () => setAudioLoaded(false))
      }
    }
  }, [])

  // Reset timer when mode changes
  useEffect(() => {
    let duration = 0
    switch (mode) {
      case "focus":
        duration = settings.focusDuration * 60
        break
      case "shortBreak":
        duration = settings.shortBreakDuration * 60
        break
      case "longBreak":
        duration = settings.longBreakDuration * 60
        break
    }
    setTimeLeft(duration)
    // Reset endTimeRef when mode changes
    if (isRunning) {
      endTimeRef.current = Date.now() + duration * 1000
    } else {
      endTimeRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration])

  // Improved timer logic using date-based calculations
  useEffect(() => {
    const updateTimer = () => {
      if (!isRunning || !endTimeRef.current) return
      
      const now = Date.now()
      const remaining = Math.max(0, endTimeRef.current - now)
      const newTimeLeft = Math.ceil(remaining / 1000)
      
      if (newTimeLeft <= 0) {
        setTimeLeft(0)
        handleTimerComplete()
        return
      }
      
      if (newTimeLeft !== timeLeft) {
        setTimeLeft(newTimeLeft)
      }
      
      // Continue the animation loop
      requestAnimationFrameRef.current = requestAnimationFrame(updateTimer)
    }
    
    if (isRunning) {
      // Set end time if not already set
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000
      }
      
      // Start animation frame loop
      requestAnimationFrameRef.current = requestAnimationFrame(updateTimer)
    } else {
      // Stop animation frame loop
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current)
        requestAnimationFrameRef.current = null
      }
    }
    
    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && endTimeRef.current) {
        // Immediately update the time when tab becomes visible again
        const now = Date.now()
        const remaining = Math.max(0, endTimeRef.current - now)
        const newTimeLeft = Math.ceil(remaining / 1000)
        
        if (newTimeLeft <= 0) {
          setTimeLeft(0)
          handleTimerComplete()
        } else {
          setTimeLeft(newTimeLeft)
        }
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft])

  // Update timer info in localStorage for header display
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    const timerInfo = {
      mode,
      minutes,
      seconds,
      isRunning,
      endTime: endTimeRef.current
    }

    localStorage.setItem("pomohelper-current-timer", JSON.stringify(timerInfo))

    return () => {
      // Clear timer info when component unmounts
      localStorage.removeItem("pomohelper-current-timer")
    }
  }, [timeLeft, mode, isRunning])

  // Fallback sound using Web Audio API
  const playFallbackSound = useCallback(() => {
    try {
      if (typeof window !== "undefined" && window.AudioContext) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)
      }
    } catch (error) {
      console.warn("Fallback sound failed:", error)
    }
  }, [])

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false)
    endTimeRef.current = null

    if (requestAnimationFrameRef.current) {
      cancelAnimationFrame(requestAnimationFrameRef.current)
      requestAnimationFrameRef.current = null
    }

    // Send notifications
    if (settings.browserNotifications) {
      sendNotification()
    }

    // Play sound alert
    if (settings.soundAlerts) {
      if (audioLoaded && audioRef.current) {
        // Try to play the audio file
        audioRef.current.play().catch((error) => {
          console.warn("Error playing sound, using fallback:", error)
          playFallbackSound()
        })
      } else {
        // Use fallback sound if audio file isn't loaded
        playFallbackSound()
      }
    }

    if (settings.vibration && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200])
    }

    // Track completed session
    if (mode === "focus") {
      const sessionDuration = settings.focusDuration

      // Use setTimeout to move the state update out of the render cycle
      const sessionData = {
        date: new Date().toISOString(),
        duration: sessionDuration,
        completed: true,
      }

      setTimeout(() => {
        addSession(sessionData)
      }, 0)

      setPomodorosCompleted((prev) => {
        const newCount = prev + 1
        // After 4 pomodoros, take a long break
        if (newCount % 4 === 0 && settings.autoStartNextSession) {
          setMode("longBreak")
        } else if (settings.autoStartNextSession) {
          setMode("shortBreak")
        }
        return newCount
      })
    } else {
      // After break, go back to focus mode
      if (settings.autoStartNextSession) {
        setMode("focus")
      }
    }

    // Auto start next session if enabled
    if (settings.autoStartNextSession) {
      setTimeout(() => {
        setIsRunning(true)
        // New mode's endTime will be set in the isRunning effect
      }, 0)
    }
  }, [mode, settings, addSession, audioLoaded, playFallbackSound])

  const sendNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      const title = mode === "focus" ? "Focus session completed!" : "Break time is over!"

      const body = mode === "focus" ? "Time for a break!" : "Ready to focus again?"

      new Notification(title, { body })
    }
  }

  const handleStart = () => {
    setIsRunning(true)
    // endTimeRef will be set in the isRunning effect
  }

  const handlePause = () => {
    setIsRunning(false)
    // Store remaining time when paused
    endTimeRef.current = null
  }

  const handleReset = () => {
    setIsRunning(false)
    endTimeRef.current = null

    let duration = 0
    switch (mode) {
      case "focus":
        duration = settings.focusDuration * 60
        break
      case "shortBreak":
        duration = settings.shortBreakDuration * 60
        break
      case "longBreak":
        duration = settings.longBreakDuration * 60
        break
    }
    setTimeLeft(duration)
  }

  const handleSkip = useCallback(() => {
    setIsRunning(false)
    endTimeRef.current = null

    if (requestAnimationFrameRef.current) {
      cancelAnimationFrame(requestAnimationFrameRef.current)
      requestAnimationFrameRef.current = null
    }

    if (mode === "focus") {
      const newCount = pomodorosCompleted + 1
      setPomodorosCompleted(newCount)

      // Track skipped session - moved to useEffect to avoid state updates during render
      const sessionData = {
        date: new Date().toISOString(),
        duration: settings.focusDuration,
        completed: false,
      }

      // Use setTimeout to move the state update out of the render cycle
      setTimeout(() => {
        addSession(sessionData)
      }, 0)

      if (newCount % 4 === 0) {
        setMode("longBreak")
      } else {
        setMode("shortBreak")
      }
    } else {
      setMode("focus")
    }
  }, [mode, pomodorosCompleted, settings.focusDuration, addSession])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const modeClasses = {
    focus: "border-coral/20",
    shortBreak: "border-sage/20",
    longBreak: "border-azure/20",
  }

  const modeBgClasses = {
    focus: "bg-coral/5",
    shortBreak: "bg-sage/5",
    longBreak: "bg-azure/5",
  }

  const modeTextClasses = {
    focus: "text-coral",
    shortBreak: "text-sage",
    longBreak: "text-azure",
  }

  const modeBadgeClasses = {
    focus: "bg-coral/80 text-white pointer-events-none",
    shortBreak: "bg-sage/80 text-white pointer-events-none",
    longBreak: "bg-azure/80 text-white pointer-events-none",
  }

  const modeIcons = {
    focus: <Clock className="h-5 w-5" />,
    shortBreak: <Coffee className="h-5 w-5" />,
    longBreak: <Dumbbell className="h-5 w-5" />,
  }

  return (
    <Card className={`glass-card w-full max-w-md mx-auto overflow-hidden ${modeClasses[mode]}`}>
      <div className={`p-6 ${modeBgClasses[mode]}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${modeTextClasses[mode]}`}>PomoHelper</h2>
          <Badge className={modeBadgeClasses[mode]}>
            <div className="flex items-center gap-1.5">
              {modeIcons[mode]}
              <span>{mode === "focus" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break"}</span>
            </div>
          </Badge>
        </div>

        <div className="flex flex-col items-center">
          <TimerDisplay minutes={minutes} seconds={seconds} mode={mode} />

          <div className="mt-2 text-sm text-muted-foreground">Pomodoros completed: {pomodorosCompleted}</div>

          <TimerControls
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onSkip={handleSkip}
            mode={mode}
          />

          <div className="flex gap-2 mt-8">
            <Badge
              variant={mode === "focus" ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1.5 ${
                mode === "focus"
                  ? "bg-coral/80 text-white hover:bg-coral"
                  : "hover:bg-coral/10 text-coral-foreground border-coral/20"
              }`}
              onClick={() => {
                setMode("focus")
                setIsRunning(false)
                endTimeRef.current = null
              }}
            >
              <Clock className="h-4 w-4 mr-1.5" />
              Focus
            </Badge>
            <Badge
              variant={mode === "shortBreak" ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1.5 ${
                mode === "shortBreak"
                  ? "bg-sage/80 text-white hover:bg-sage"
                  : "hover:bg-sage/10 text-sage-foreground border-sage/20"
              }`}
              onClick={() => {
                setMode("shortBreak")
                setIsRunning(false)
                endTimeRef.current = null
              }}
            >
              <Coffee className="h-4 w-4 mr-1.5" />
              Short Break
            </Badge>
            <Badge
              variant={mode === "longBreak" ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1.5 ${
                mode === "longBreak"
                  ? "bg-azure/80 text-white hover:bg-azure"
                  : "hover:bg-azure/10 text-azure-foreground border-azure/20"
              }`}
              onClick={() => {
                setMode("longBreak")
                setIsRunning(false)
                endTimeRef.current = null
              }}
            >
              <Dumbbell className="h-4 w-4 mr-1.5" />
              Long Break
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}