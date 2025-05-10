"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { NotificationToggle } from "@/components/atoms/notification-toggle"
import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

interface AlertSettingsProps {
  browserNotifications: boolean
  soundAlerts: boolean
  vibration: boolean
  onBrowserNotificationsChange: (enabled: boolean) => void
  onSoundAlertsChange: (enabled: boolean) => void
  onVibrationChange: (enabled: boolean) => void
}

export function AlertSettings({
  browserNotifications,
  soundAlerts,
  vibration,
  onBrowserNotificationsChange,
  onSoundAlertsChange,
  onVibrationChange,
}: AlertSettingsProps) {
  const [notificationsPermission, setNotificationsPermission] = useState<string>("default")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if ("Notification" in window) {
      setNotificationsPermission(Notification.permission)
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationsPermission(permission)
      if (permission === "granted") {
        onBrowserNotificationsChange(true)
      } else {
        onBrowserNotificationsChange(false)
      }
    }
  }

  // Check if vibration is supported (only when client-side)
  const isVibrationSupported = isMounted && typeof navigator !== "undefined" && "vibrate" in navigator

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-primary flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-col gap-2">
          <NotificationToggle
            label="Browser Notifications"
            enabled={browserNotifications && notificationsPermission === "granted"}
            onToggle={(enabled) => {
              if (enabled && notificationsPermission !== "granted") {
                requestNotificationPermission()
              } else {
                onBrowserNotificationsChange(enabled)
              }
            }}
          />
          {notificationsPermission === "denied" && (
            <p className="text-xs text-destructive ml-7">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
        </div>

        <NotificationToggle label="Sound Alerts" enabled={soundAlerts} onToggle={onSoundAlertsChange} />

        {/* Only render vibration toggle if mounted and supported */}
        {isVibrationSupported && (
          <NotificationToggle label="Vibration (Mobile)" enabled={vibration} onToggle={onVibrationChange} />
        )}
      </CardContent>
    </Card>
  )
}