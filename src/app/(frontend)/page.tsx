import { getPayload } from 'payload'
import config from '@payload-config'
import { getLocale } from '@/lib/locale'
import { messages } from '@/lib/i18n'
import { LangSwitch } from '@/components/LangSwitch'
import { Clock } from '@/components/Clock'
import { DepartureBoard, type DepartureRow } from '@/components/DepartureBoard'
import { COMPLAINT_FORM_URL } from '@/lib/contact'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const locale = await getLocale()
  const t = messages[locale]

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const showFare = settings?.showFare ?? false
  const { docs } = await payload.find({
    collection: 'departures',
    where: { isActive: { equals: true } },
    depth: 2,
    limit: 1000,
    locale,
    sort: 'time',
  })

  // Flatten populated relations into a language-neutral row for the client board.
  const rows: DepartureRow[] = docs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((d: any): DepartureRow | null => {
      const route = typeof d.route === 'object' && d.route ? d.route : null
      if (!route || !d.time) return null
      const op = typeof route.operator === 'object' ? route.operator : null
      const override = typeof d.price === 'number' ? d.price : null
      return {
        id: String(d.id),
        time: d.time as string,
        type: route.type as 'AKAP' | 'AKDP',
        operator: op?.name ?? '—',
        trayek: route.trayek ?? '—',
        priceMin: override ?? Number(route.priceMin ?? 0),
        priceMax: override != null ? null : (route.priceMax ?? null),
        distanceKm: route.distanceKm ?? null,
        note: route.note ?? null,
      }
    })
    .filter((r): r is DepartureRow => r !== null)

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24">
      <header className="flex flex-wrap items-end justify-between gap-4 pt-10 pb-7 sm:pt-14">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {t.brand}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.title}</h1>
          <p className="mt-1.5 text-sm text-slate-400">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-right backdrop-blur sm:block">
            <div className="font-mono text-xl font-semibold tabular-nums leading-none text-amber-300">
              <Clock />
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">WIB</div>
          </div>
          <LangSwitch locale={locale} />
        </div>
      </header>

      <DepartureBoard rows={rows} t={t} showFare={showFare} />

      <footer className="mt-6 space-y-2 text-center text-xs text-slate-500">
        <p>
          <span className="text-slate-400">{t.complaint}:</span>{' '}
          <a
            href={COMPLAINT_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-amber-300 hover:text-amber-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
              <path d="M3 11l18-5v12L3 14v-3z" />
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
            {t.complaintCta}
          </a>
        </p>
        <p>{t.footerNote}</p>
        <p className="text-[10px] text-slate-600">
          Foto:{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:Terminal_Kutoarjo_Kab.Purworejo.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-400"
          >
            SATELITBM / Wikimedia Commons
          </a>{' '}
          (CC BY-SA 4.0)
        </p>
      </footer>
    </main>
  )
}
