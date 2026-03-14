import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Langium', template: '%s | Langium' },
  description: 'Langium is an open source language engineering tool with first-class support for the Language Server Protocol, written in TypeScript and running in Node.js.',
  icons: {
    icon: [
      { url: '/assets/nib.svg', type: 'image/svg+xml' },
      { url: '/favicon/32px.png', sizes: '32x32' },
      { url: '/favicon/16px.png', sizes: '16x16' },
    ],
    apple: '/assets/nib.svg',
  },
  openGraph: {
    siteName: 'Langium',
    images: ['https://langium.org/assets/social-card.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* nextra-theme-docs uses Tailwind v4 CSS — load as static file to bypass Tailwind v3 PostCSS */}
        <link rel="stylesheet" href="/nextra-theme-docs.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white dark:bg-gray-900 font-mono">
        <div className="wrapper relative bg-white dark:bg-gray-900">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
