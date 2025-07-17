import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { SessionProvider } from "@/contexts/SessionContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Guidly - AI Career Companion",
  description: "Transform your career with AI-powered resume building, personalized career guidance, and interview preparation. Available 24/7.",
  generator: 'v0.dev',
  icons: {
    icon: [
      {
        url: '/guidly_logos/Guidly/Favicon-2.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    shortcut: '/guidly_logos/Guidly/Favicon-2.png',
    apple: '/guidly_logos/Guidly/Favicon-2.png',
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
