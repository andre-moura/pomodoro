import { cn } from "@/lib/utils"

interface TimerDisplayProps {
  minutes: number
  seconds: number
  className?: string
  mode: "focus" | "shortBreak" | "longBreak"
}

export function TimerDisplay({ minutes, seconds, mode, className }: TimerDisplayProps) {
  const formattedMinutes = String(minutes).padStart(2, "0")
  const formattedSeconds = String(seconds).padStart(2, "0")

  const modeClasses = {
    focus: "text-coral",
    shortBreak: "text-sage",
    longBreak: "text-azure",
  }

  return (
    <div
      className={cn("text-8xl font-bold tabular-nums tracking-tight animate-pulse-scale", modeClasses[mode], className)}
    >
      {formattedMinutes}:{formattedSeconds}
    </div>
  )
}
