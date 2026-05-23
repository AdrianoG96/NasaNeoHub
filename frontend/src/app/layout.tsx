import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { CosmicBackground } from "@/components/CosmicBackground"
import { ToastProvider } from "@/components/ToastProvider"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "NEO Dashboard — Near-Earth Objects Explorer",
  description:
    "Explore asteroids approaching Earth using real NASA data. Filter, sort, and discover near-Earth objects.",
  icons: {
    icon: "/rocket-favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <CosmicBackground />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
