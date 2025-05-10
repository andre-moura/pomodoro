"use client"

import { Switch } from "@/components/atoms/switch"
import { Label } from "@/components/atoms/label"
import { useId } from "react"

interface NotificationToggleProps {
  label: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function NotificationToggle({ label, enabled, onToggle }: NotificationToggleProps) {
  const safeId = useId()

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={safeId}
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
      <Label htmlFor={safeId} className="text-base">
        {label}
      </Label>
    </div>
  )
}
