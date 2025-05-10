"use client"

import { useEffect, useState } from "react"
import Head from "next/head"

export function FaviconTimer() {
  const [timerInfo, setTimerInfo] = useState<{
    minutes: number
    seconds: number
    isRunning: boolean
    mode: string
  } | null>(null)

  useEffect(() => {
    // Check for timer info in localStorage
    const checkTimerInfo = () => {
      const storedTimerInfo = localStorage.getItem("pomohelper-current-timer")
      if (storedTimerInfo) {
        try {
          const timerData = JSON.parse(storedTimerInfo)
          if (timerData.isRunning) {
            setTimerInfo({
              minutes: timerData.minutes,
              seconds: timerData.seconds,
              isRunning: timerData.isRunning,
              mode: timerData.mode,
            })
          } else {
            setTimerInfo(null)
          }
        } catch (e) {
          console.error("Error parsing timer info:", e)
          setTimerInfo(null)
        }
      } else {
        setTimerInfo(null)
      }
    }

    // Initial check
    checkTimerInfo()

    // Set up interval to check regularly
    const interval = setInterval(checkTimerInfo, 1000)

    return () => clearInterval(interval)
  }, [])

  // Generate dynamic favicon
  const generateFavicon = () => {
    if (!timerInfo || !timerInfo.isRunning) {
      return "/favicon.ico" // Default favicon
    }

    // Create a canvas to draw the favicon
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext("2d")

    if (!ctx) return "/favicon.ico"

    // Clear canvas
    ctx.clearRect(0, 0, 64, 64)

    // Set background color based on mode
    let bgColor = "#f87171" // coral for focus
    if (timerInfo.mode === "shortBreak") bgColor = "#84cc16" // sage for short break
    if (timerInfo.mode === "longBreak") bgColor = "#38bdf8" // azure for long break

    // Draw background
    ctx.fillStyle = bgColor
    ctx.beginPath()
    ctx.arc(32, 32, 32, 0, Math.PI * 2)
    ctx.fill()

    // Draw time text
    ctx.fillStyle = "white"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Format time as MM:SS or M:SS if minutes < 10
    const timeText = `${timerInfo.minutes}:${timerInfo.seconds.toString().padStart(2, "0")}`
    ctx.fillText(timeText, 32, 32)

    // Convert canvas to data URL
    return canvas.toDataURL("image/png")
  }

  const faviconUrl = generateFavicon()

  return (
    <Head>
      <link rel="icon" href={faviconUrl} />
    </Head>
  )
}
