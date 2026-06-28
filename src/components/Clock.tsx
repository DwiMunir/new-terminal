'use client'

import { useEffect, useState } from 'react'

// Live terminal-board clock (WIB / browser local). Renders a placeholder on the
// server to avoid hydration mismatch, then ticks every second on the client.
export function Clock() {
  const [now, setNow] = useState('')

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    setNow(fmt())
    const id = setInterval(() => setNow(fmt()), 1000)
    return () => clearInterval(id)
  }, [])

  return <span suppressHydrationWarning>{now || '--:--:--'}</span>
}
