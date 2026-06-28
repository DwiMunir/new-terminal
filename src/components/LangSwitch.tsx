'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import type { Locale } from '@/lib/i18n'
import { locales } from '@/lib/i18n'

export function LangSwitch({ locale }: { locale: Locale }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function set(next: Locale) {
    if (next === locale) return
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`
    startTransition(() => router.refresh())
  }

  return (
    <div
      className="inline-flex overflow-hidden rounded-lg border border-white/15 bg-white/5 text-xs font-semibold backdrop-blur"
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => set(l)}
          disabled={pending}
          aria-pressed={l === locale}
          className={
            'px-3 py-1.5 uppercase transition-colors ' +
            (l === locale
              ? 'bg-amber-400 text-slate-900'
              : 'text-slate-300 hover:bg-white/10')
          }
        >
          {l}
        </button>
      ))}
    </div>
  )
}
