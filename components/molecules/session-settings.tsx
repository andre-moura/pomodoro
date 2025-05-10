"use client"

import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Clock, Coffee, Dumbbell } from "lucide-react"

interface SessionSettingsProps {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  onFocusChange: (duration: number) => void
  onShortBreakChange: (duration: number) => void
  onLongBreakChange: (duration: number) => void
}

export function SessionSettings({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  onFocusChange,
  onShortBreakChange,
  onLongBreakChange,
}: SessionSettingsProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <Label htmlFor="focus-duration" className="flex items-center gap-2 text-coral">
          <Clock className="h-4 w-4" />
          Focus Duration (minutes)
        </Label>
        <Input
          id="focus-duration"
          type="number"
          min="1"
          max="60"
          value={focusDuration}
          onChange={(e) => onFocusChange(Number.parseInt(e.target.value) || 25)}
          className="border-coral/20 focus-visible:ring-coral/30"
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="short-break-duration" className="flex items-center gap-2 text-sage">
          <Coffee className="h-4 w-4" />
          Short Break Duration (minutes)
        </Label>
        <Input
          id="short-break-duration"
          type="number"
          min="1"
          max="30"
          value={shortBreakDuration}
          onChange={(e) => onShortBreakChange(Number.parseInt(e.target.value) || 5)}
          className="border-sage/20 focus-visible:ring-sage/30"
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="long-break-duration" className="flex items-center gap-2 text-azure">
          <Dumbbell className="h-4 w-4" />
          Long Break Duration (minutes)
        </Label>
        <Input
          id="long-break-duration"
          type="number"
          min="1"
          max="60"
          value={longBreakDuration}
          onChange={(e) => onLongBreakChange(Number.parseInt(e.target.value) || 15)}
          className="border-azure/20 focus-visible:ring-azure/30"
        />
      </div>
    </div>
  )
}
