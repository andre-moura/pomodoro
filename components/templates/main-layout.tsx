"use client"

import { PomodoroTimer } from "@/components/organisms/pomodoro-timer"
import { MainHeader } from "@/components/layout/main-header"

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <MainHeader />

      <main className="flex-1 container py-12 md:py-16">
        <div className="max-w-md mx-auto">
          <PomodoroTimer />
        </div>
      </main>

      <footer className="pt-8 border-t border-border/40">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30 w-full py-3">
              <span>PomoHelper, focus better with the Pomodoro technique</span>
            </div>
            <div className="w-full">
              <p className="text-sm text-muted-foreground py-3">
                &copy; 2022 Andre. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
