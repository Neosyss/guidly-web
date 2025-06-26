import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { SessionProvider } from "@/contexts/SessionContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Neo-AI Counseling - Your AI Life Companion",
  description: "Navigate life's challenges with personalized AI guidance for mental wellness, career growth, and entrepreneurial success",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SessionProvider>
              {children}
            </SessionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
