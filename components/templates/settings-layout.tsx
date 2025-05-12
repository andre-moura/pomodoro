"use client"

import { SettingsPanel } from "@/components/organisms/settings-panel"
import { MainHeader } from "@/components/layout/main-header"
import { Footer } from "@/components/layout/footer"

export default function SettingsLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <MainHeader />

      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-primary">Settings</h1>
          <SettingsPanel />
        </div>
      </main>

      <Footer />
    </div>
  )
}