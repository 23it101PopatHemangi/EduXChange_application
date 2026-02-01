// import React from "react"
// import type { Metadata, Viewport } from 'next'
// import { Inter, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import { Toaster } from '@/components/ui/sonner'
// import './globals.css'

// const _inter = Inter({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: 'EduXchange - Academic Resource Exchange',
//   description: 'Share and discover academic resources with your university community. Upload notes, PDFs, videos, and more.',
//   keywords: ['academic', 'resources', 'notes', 'university', 'study', 'education', 'sharing'],
//   generator: 'v0.app',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// export const viewport: Viewport = {
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: '#4361ee' },
//     { media: '(prefers-color-scheme: dark)', color: '#6b8aff' },
//   ],
//   width: 'device-width',
//   initialScale: 1,
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className="font-sans antialiased">
//         {children}
//         <Toaster richColors position="top-right" />
//         <Analytics />
//       </body>
//     </html>
//   )
// }

import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import SWRegister from "./sw-register"   // ✅ ADD THIS
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "EduXchange - Academic Resource Exchange",
  description:
    "Share and discover academic resources with your university community. Upload notes, PDFs, videos, and more.",
  keywords: [
    "academic",
    "resources",
    "notes",
    "university",
    "study",
    "education",
    "sharing",
  ],
  generator: "v0.app",

  // ✅ PWA
  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4361ee" },
    { media: "(prefers-color-scheme: dark)", color: "#6b8aff" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <SWRegister />   {/* ✅ ADD THIS */}
        {children}
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
