"use client"

import { Button } from "@/components/atoms/button"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
  mode: "focus" | "shortBreak" | "longBreak"
}

export function TimerControls({ isRunning, onStart, onPause, onReset, onSkip, mode }: TimerControlsProps) {
  const modeClasses = {
    focus: "bg-coral/80 hover:bg-coral text-white",
    shortBreak: "bg-sage/80 hover:bg-sage text-white",
    longBreak: "bg-azure/80 hover:bg-azure text-white",
  }

  const secondaryClasses = {
    focus: "border-coral/20 hover:bg-coral/10 text-coral-foreground",
    shortBreak: "border-sage/20 hover:bg-sage/10 text-sage-foreground",
    longBreak: "border-azure/20 hover:bg-azure/10 text-azure-foreground",
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {isRunning ? (
        <Button onClick={onPause} size="lg" className={cn("rounded-full w-16 h-16 p-0 shadow-lg", modeClasses[mode])}>
          <Pause className="h-8 w-8" />
          <span className="sr-only">Pause</span>
        </Button>
      ) : (
        <Button onClick={onStart} size="lg" className={cn("rounded-full w-16 h-16 p-0 shadow-lg", modeClasses[mode])}>
          <Play className="h-8 w-8 ml-1" />
          <span className="sr-only">Start</span>
        </Button>
      )}

      <Button onClick={onReset} variant="outline" className={cn("rounded-full w-12 h-12 p-0", secondaryClasses[mode])}>
        <RotateCcw className="h-5 w-5" />
        <span className="sr-only">Reset</span>
      </Button>

      <Button onClick={onSkip} variant="outline" className={cn("rounded-full w-12 h-12 p-0", secondaryClasses[mode])}>
        <SkipForward className="h-5 w-5" />
        <span className="sr-only">Skip</span>
      </Button>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
