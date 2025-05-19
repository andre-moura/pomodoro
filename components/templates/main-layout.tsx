"use client"

import { PomodoroTimer } from "@/components/organisms/pomodoro-timer"
import { MainHeader } from "@/components/layout/main-header"
import { Footer } from "@/components/layout/footer"

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <MainHeader />

      <main className="flex-1 container py-12 md:py-16 flex items-center min-h-[calc(100vh-64px)]">
        <div className="max-w-md mx-auto">
          <PomodoroTimer />
        </div>
      </main>

      <Footer />
    </div>
  )
}
