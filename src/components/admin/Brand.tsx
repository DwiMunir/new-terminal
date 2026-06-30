// Custom branding for the Payload admin: Logo (login screen) + Icon (nav).
// Server components — no hooks. Text uses currentColor so it adapts to light/dark.
import React from 'react'

const AMBER = '#fbbf24'
const INK = '#1c1917'

function BusMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden role="img">
      <rect width="32" height="32" rx="8" fill={AMBER} />
      <rect x="6.5" y="8.5" width="19" height="12" rx="2.5" fill={INK} />
      <rect x="9" y="11" width="3.6" height="3.2" rx="0.8" fill={AMBER} />
      <rect x="14.2" y="11" width="3.6" height="3.2" rx="0.8" fill={AMBER} />
      <rect x="19.4" y="11" width="3.6" height="3.2" rx="0.8" fill={AMBER} />
      <circle cx="11" cy="22" r="2.2" fill={INK} />
      <circle cx="21" cy="22" r="2.2" fill={INK} />
    </svg>
  )
}

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <BusMark size={44} />
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Terminal Kutoarjo</div>
        <div style={{ fontSize: 13, opacity: 0.6, fontWeight: 500 }}>Panel Admin — Jadwal Keberangkatan</div>
      </div>
    </div>
  )
}

export function Icon() {
  return <BusMark size={26} />
}
