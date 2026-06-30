import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getLocale } from '@/lib/locale'
import { messages } from '@/lib/i18n'
import { TerminalBackground } from '@/components/TerminalBackground'
import { ComplaintFab } from '@/components/ComplaintFab'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jadwal Keberangkatan — Terminal Kutoarjo',
  description: 'Informasi jadwal keberangkatan bus AKAP & AKDP di Terminal Kutoarjo.',
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale}>
      <body className="relative min-h-screen bg-slate-950 text-slate-100 antialiased">
        <TerminalBackground />
        <div className="relative z-10">{children}</div>
        <ComplaintFab label={messages[locale].complaintCta} />
      </body>
    </html>
  )
}
