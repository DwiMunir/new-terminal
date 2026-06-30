// Lightweight UI i18n. Only the chrome is translated; schedule data is language-neutral
// (the localized `note` field is resolved server-side via Payload's own localization).
// ponytail: client toggle + cookie, no next-intl routing. Upgrade to next-intl `[locale]`
// routing only if per-language URLs / SEO become a requirement.

export type Locale = 'id' | 'en'
export const locales: Locale[] = ['id', 'en']
export const defaultLocale: Locale = 'id'

export interface Messages {
  brand: string
  title: string
  subtitle: string
  search: string
  jenis: string
  all: string
  po: string
  allPo: string
  sort: string
  sortTime: string
  sortPriceLow: string
  sortPriceHigh: string
  reset: string
  filter: string
  colTime: string
  colPo: string
  colRoute: string
  colJenis: string
  colPrice: string
  countSuffix: string
  empty: string
  emptyHint: string
  footerNote: string
  complaint: string
  complaintCta: string
}

export const messages: Record<Locale, Messages> = {
  id: {
    brand: 'Terminal Kutoarjo',
    title: 'Jadwal Keberangkatan',
    subtitle: 'Informasi keberangkatan bus AKAP & AKDP',
    search: 'Cari trayek atau PO…',
    jenis: 'Jenis',
    all: 'Semua',
    po: 'PO',
    allPo: 'Semua PO',
    sort: 'Urutkan',
    sortTime: 'Jam',
    sortPriceLow: 'Tarif termurah',
    sortPriceHigh: 'Tarif termahal',
    reset: 'Reset',
    filter: 'Filter',
    colTime: 'Jam',
    colPo: 'PO',
    colRoute: 'Trayek / Rute',
    colJenis: 'Jenis',
    colPrice: 'Tarif',
    countSuffix: 'keberangkatan',
    empty: 'Tidak ada keberangkatan yang cocok',
    emptyHint: 'Coba ubah kata kunci atau filter.',
    footerNote: 'Jadwal dapat berubah sewaktu-waktu. Konfirmasi ke loket / PO terkait.',
    complaint: 'Pengaduan & Informasi',
    complaintCta: 'Sampaikan Aduan',
  },
  en: {
    brand: 'Kutoarjo Terminal',
    title: 'Departure Schedule',
    subtitle: 'AKAP & AKDP intercity bus departures',
    search: 'Search route or operator…',
    jenis: 'Type',
    all: 'All',
    po: 'Operator',
    allPo: 'All operators',
    sort: 'Sort',
    sortTime: 'Time',
    sortPriceLow: 'Lowest fare',
    sortPriceHigh: 'Highest fare',
    reset: 'Reset',
    filter: 'Filter',
    colTime: 'Time',
    colPo: 'Operator',
    colRoute: 'Route',
    colJenis: 'Type',
    colPrice: 'Fare',
    countSuffix: 'departures',
    empty: 'No matching departures',
    emptyHint: 'Try changing the keyword or filters.',
    footerNote: 'Schedules may change. Please confirm at the counter / operator.',
    complaint: 'Complaints & Info',
    complaintCta: 'Submit a Complaint',
  },
}
