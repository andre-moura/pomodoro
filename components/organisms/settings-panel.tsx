"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { SessionSettings } from "@/components/molecules/session-settings"
import { AlertSettings } from "@/components/molecules/alert-settings"
import { useSettings } from "@/hooks/use-settings"
import { Button } from "@/components/atoms/button"
import { Switch } from "@/components/atoms/switch"
import { Label } from "@/components/atoms/label"
import { useTheme } from "next-themes"
import { Moon, Sun, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { ConfirmDialog } from "@/components/molecules/confirm-dialog"
import { useAnalytics } from "@/hooks/use-analytics"

export function SettingsPanel() {
  const { settings, updateSettings } = useSettings()
  const { sessions } = useAnalytics()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to export data to CSV
  const exportToCSV = () => {
    if (sessions.length === 0) {
      alert("No data to export")
      return
    }

    // Create CSV content
    const headers = ["Date", "Duration (minutes)", "Completed"]
    const csvRows = [headers.join(",")]

    sessions.forEach((session) => {
      const date = new Date(session.date).toLocaleString()
      const row = [
        `"${date}"`, // Wrap in quotes to handle commas in date
        session.duration,
        session.completed ? "Yes" : "No",
      ]
      csvRows.push(row.join(","))
    })

    const csvContent = csvRows.join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.setAttribute("href", url)
    link.setAttribute("download", `pomohelper-sessions-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Clean up to avoid memory leaks
  }

  // Handle reset settings
  const handleResetSettings = () => {
    updateSettings({
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      browserNotifications: true,
      soundAlerts: true,
      vibration: false,
      autoStartNextSession: false,
    })
    setShowResetDialog(false)
  }

  // Handle clear analytics data
  const handleClearAnalytics = () => {
    localStorage.removeItem("pomohelper-sessions")
    window.location.reload()
  }

  // Don't render theme buttons until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="space-y-6">
        <Card className="glass-card overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-primary">Timer Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SessionSettings
              focusDuration={settings.focusDuration}
              shortBreakDuration={settings.shortBreakDuration}
              longBreakDuration={settings.longBreakDuration}
              onFocusChange={(duration) => updateSettings({ focusDuration: duration })}
              onShortBreakChange={(duration) => updateSettings({ shortBreakDuration: duration })}
              onLongBreakChange={(duration) => updateSettings({ longBreakDuration: duration })}
            />

            <div className="mt-6 flex items-center space-x-2">
              <Switch
                id="auto-start"
                checked={settings.autoStartNextSession}
                onCheckedChange={(checked) => updateSettings({ autoStartNextSession: checked })}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="auto-start">Auto-start next session</Label>
            </div>
          </CardContent>
        </Card>

        <AlertSettings
          browserNotifications={settings.browserNotifications}
          soundAlerts={settings.soundAlerts}
          vibration={settings.vibration}
          onBrowserNotificationsChange={(enabled) => updateSettings({ browserNotifications: enabled })}
          onSoundAlertsChange={(enabled) => updateSettings({ soundAlerts: enabled })}
          onVibrationChange={(enabled) => updateSettings({ vibration: enabled })}
        />

        {/* Skip rendering appearance card until mounted */}

        <Card className="glass-card overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-primary">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={() => setShowResetDialog(true)} className="flex-1 min-w-[200px]">
                Reset Settings
              </Button>

              <Button variant="destructive" onClick={() => setShowClearDialog(true)} className="flex-1 min-w-[200px]">
                Clear Analytics Data
              </Button>
            </div>

            <div className="pt-4 border-t border-border/50 mt-4">
              <Button variant="outline" onClick={exportToCSV} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Analytics Data (CSV)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-primary">Timer Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <SessionSettings
            focusDuration={settings.focusDuration}
            shortBreakDuration={settings.shortBreakDuration}
            longBreakDuration={settings.longBreakDuration}
            onFocusChange={(duration) => updateSettings({ focusDuration: duration })}
            onShortBreakChange={(duration) => updateSettings({ shortBreakDuration: duration })}
            onLongBreakChange={(duration) => updateSettings({ longBreakDuration: duration })}
          />

          <div className="mt-6 flex items-center space-x-2">
            <Switch
              id="auto-start"
              checked={settings.autoStartNextSession}
              onCheckedChange={(checked) => updateSettings({ autoStartNextSession: checked })}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="auto-start">Auto-start next session</Label>
          </div>
        </CardContent>
      </Card>

      <AlertSettings
        browserNotifications={settings.browserNotifications}
        soundAlerts={settings.soundAlerts}
        vibration={settings.vibration}
        onBrowserNotificationsChange={(enabled) => updateSettings({ browserNotifications: enabled })}
        onSoundAlertsChange={(enabled) => updateSettings({ soundAlerts: enabled })}
        onVibrationChange={(enabled) => updateSettings({ vibration: enabled })}
      />

      <Card className="glass-card overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-primary">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <Label className="text-base">Theme</Label>
            <div className="flex gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
                className={`flex-1 ${theme === "light" ? "bg-primary text-primary-foreground" : ""}`}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
                className={`flex-1 ${theme === "dark" ? "bg-primary text-primary-foreground" : ""}`}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-primary">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => setShowResetDialog(true)} className="flex-1 min-w-[200px]">
              Reset Settings
            </Button>

            <Button variant="destructive" onClick={() => setShowClearDialog(true)} className="flex-1 min-w-[200px]">
              Clear Analytics Data
            </Button>
          </div>

          <div className="pt-4 border-t border-border/50 mt-4">
            <Button variant="outline" onClick={exportToCSV} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Analytics Data (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showResetDialog}
        title="Reset Settings"
        description="Are you sure you want to reset all settings to default? This action cannot be undone."
        confirmLabel="Reset"
        onConfirm={handleResetSettings}
        onCancel={() => setShowResetDialog(false)}
      />

      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear Analytics Data"
        description="Are you sure you want to clear all analytics data? This action cannot be undone."
        confirmLabel="Clear Data"
        variant="destructive"
        onConfirm={handleClearAnalytics}
        onCancel={() => setShowClearDialog(false)}
      />
    </div>
  )
}