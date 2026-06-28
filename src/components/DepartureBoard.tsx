'use client'

import { useMemo, useState } from 'react'
import type { Messages } from '@/lib/i18n'
import { formatRange } from '@/lib/format'

export type DepartureRow = {
  id: string
  time: string
  type: 'AKAP' | 'AKDP'
  operator: string
  trayek: string
  priceMin: number
  priceMax?: number | null
  distanceKm?: number | null
  note?: string | null
}

type TypeFilter = 'ALL' | 'AKAP' | 'AKDP'
type SortKey = 'time' | 'price-asc' | 'price-desc'

function TypeBadge({ type }: { type: 'AKAP' | 'AKDP' }) {
  const style =
    type === 'AKAP'
      ? 'bg-amber-400/15 text-amber-300 ring-amber-400/30'
      : 'bg-sky-400/15 text-sky-300 ring-sky-400/30'
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-bold tracking-wide ring-1 ring-inset ${style}`}
    >
      {type}
    </span>
  )
}

const fieldCls =
  'rounded-lg border border-white/10 bg-slate-800/70 px-3 py-1.5 text-sm text-slate-100 outline-none transition-colors focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20'

export function DepartureBoard({ rows, t }: { rows: DepartureRow[]; t: Messages }) {
  const [q, setQ] = useState('')
  const [type, setType] = useState<TypeFilter>('ALL')
  const [operator, setOperator] = useState('ALL')
  const [sort, setSort] = useState<SortKey>('time')

  const operators = useMemo(
    () => Array.from(new Set(rows.map((r) => r.operator))).sort((a, b) => a.localeCompare(b)),
    [rows],
  )

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const out = rows.filter((r) => {
      if (type !== 'ALL' && r.type !== type) return false
      if (operator !== 'ALL' && r.operator !== operator) return false
      if (needle && !`${r.trayek} ${r.operator}`.toLowerCase().includes(needle)) return false
      return true
    })
    out.sort((a, b) => {
      if (sort === 'price-asc') return a.priceMin - b.priceMin || a.time.localeCompare(b.time)
      if (sort === 'price-desc') return b.priceMin - a.priceMin || a.time.localeCompare(b.time)
      return a.time.localeCompare(b.time)
    })
    return out
  }, [rows, q, type, operator, sort])

  const dirty = q !== '' || type !== 'ALL' || operator !== 'ALL' || sort !== 'time'

  function reset() {
    setQ('')
    setType('ALL')
    setOperator('ALL')
    setSort('time')
  }

  const seg = (active: boolean) =>
    'px-3 py-1.5 text-sm font-semibold transition-colors ' +
    (active ? 'bg-amber-400 text-slate-900' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/60')

  return (
    <div className="rounded-2xl shadow-2xl shadow-black/40">
      {/* Filter bar (sticky, forms the panel's top) */}
      <div className="sticky top-0 z-20 rounded-t-2xl border border-b-0 border-white/10 bg-slate-900/85 px-4 py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
            className={`${fieldCls} min-w-[12rem] flex-1 placeholder:text-slate-500`}
          />

          <div
            className="inline-flex overflow-hidden rounded-lg border border-white/10"
            role="group"
            aria-label={t.jenis}
          >
            {(['ALL', 'AKAP', 'AKDP'] as TypeFilter[]).map((v) => (
              <button key={v} type="button" onClick={() => setType(v)} aria-pressed={type === v} className={seg(type === v)}>
                {v === 'ALL' ? t.all : v}
              </button>
            ))}
          </div>

          <select value={operator} onChange={(e) => setOperator(e.target.value)} aria-label={t.po} className={fieldCls}>
            <option value="ALL">{t.allPo}</option>
            {operators.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t.sort} className={fieldCls}>
            <option value="time">{t.sortTime}</option>
            <option value="price-asc">{t.sortPriceLow}</option>
            <option value="price-desc">{t.sortPriceHigh}</option>
          </select>

          {dirty && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              {t.reset}
            </button>
          )}
        </div>
      </div>

      {/* Board body */}
      <div className="rounded-b-2xl border border-t-0 border-white/10 bg-slate-900/80">
        <p className="flex items-center gap-2 px-5 py-3 text-sm text-slate-400" aria-live="polite">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-semibold text-slate-200">{filtered.length}</span> {t.countSuffix}
        </p>

        {filtered.length === 0 ? (
          <div className="mx-4 mb-4 rounded-xl border border-dashed border-white/15 py-16 text-center">
            <p className="font-semibold text-slate-200">{t.empty}</p>
            <p className="mt-1 text-sm text-slate-500">{t.emptyHint}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-b-2xl md:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-y border-white/10 bg-black/30 text-left text-[11px] uppercase tracking-wider text-amber-300/80">
                    <th scope="col" className="px-5 py-2.5 font-semibold">{t.colTime}</th>
                    <th scope="col" className="px-5 py-2.5 font-semibold">{t.colPo}</th>
                    <th scope="col" className="px-5 py-2.5 font-semibold">{t.colRoute}</th>
                    <th scope="col" className="px-5 py-2.5 font-semibold">{t.colJenis}</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-semibold">{t.colPrice}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-white/[0.04]">
                      <td className="px-5 py-3 font-mono text-lg font-semibold tabular-nums text-amber-300">{r.time}</td>
                      <td className="px-5 py-3 text-slate-300">{r.operator}</td>
                      <td className="px-5 py-3">
                        <span className="font-medium text-white">{r.trayek}</span>
                        {r.distanceKm ? <span className="ml-1.5 text-xs text-slate-500">· {r.distanceKm} km</span> : null}
                        {r.note ? <span className="block text-xs text-slate-500">{r.note}</span> : null}
                      </td>
                      <td className="px-5 py-3"><TypeBadge type={r.type} /></td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-white">{formatRange(r.priceMin, r.priceMax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="space-y-2 px-3 pb-3 md:hidden">
              {filtered.map((r) => (
                <li key={r.id} className="rounded-xl border border-white/10 bg-slate-800/40 p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-2xl font-bold tabular-nums text-amber-300">{r.time}</span>
                    <span className="font-semibold tabular-nums text-white">{formatRange(r.priceMin, r.priceMax)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-medium text-white">
                      {r.trayek}
                      {r.distanceKm ? <span className="ml-1 text-xs text-slate-500">· {r.distanceKm} km</span> : null}
                    </span>
                    <TypeBadge type={r.type} />
                  </div>
                  <div className="mt-0.5 text-sm text-slate-400">{r.operator}</div>
                  {r.note ? <div className="mt-0.5 text-xs text-slate-500">{r.note}</div> : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
