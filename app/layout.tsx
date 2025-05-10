import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { FaviconTimer } from "@/components/favicon-timer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PomoHelper - Focus Better with Pomodoro",
  description: "A Pomodoro timer app to help you focus and be more productive",
  icons: {
    icon: "/pomodoro.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="pomohelper-theme"
        >
          <Providers>
            <FaviconTimer />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
