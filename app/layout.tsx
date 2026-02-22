import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { fontSans, fontSerif, fontMono } from "@/lib/fonts"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { SessionProvider } from "next-auth/react"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "CWRU.WTF - We Tinker Fearlessly",
  description: "A collective of CWRU students building the future (or just building cool stuff).",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "CWRU.WTF - We Tinker Fearlessly",
    description: "A collective of CWRU students building the future (or just building cool stuff).",
    images: [
      {
        url: '/cwru-wtf.png',
        width: 1200,
        height: 630,
        alt: 'CWRU.WTF - We Tinker Fearlessly',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CWRU.WTF - We Tinker Fearlessly",
    description: "A collective of CWRU students building the future (or just building cool stuff).",
    images: ['/cwru-wtf.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}>
      <body className="font-sans antialiased">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Navbar />
            {children}
            <Toaster
              theme="light"
              position="bottom-right"
              expand={false}
              richColors
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
