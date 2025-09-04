import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SwissWork - Schweizer Freelance Marktplatz',
  description: 'Der professionelle Marktplatz für Schweizer Dienstleistungen. Finden Sie qualifizierte Freelancer oder bieten Sie Ihre Dienste an.',
  keywords: ['Freelance', 'Schweiz', 'Dienstleistungen', 'Jobs', 'Marktplatz'],
  authors: [{ name: 'SwissWork Team' }],
  openGraph: {
    title: 'SwissWork - Schweizer Freelance Marktplatz',
    description: 'Der professionelle Marktplatz für Schweizer Dienstleistungen',
    type: 'website',
    locale: 'de_CH',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}