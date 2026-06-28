export function formatRupiah(n: number): string {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID')
}

// Tarif bisa berupa rentang (min–max) atau tunggal.
export function formatRange(min: number, max?: number | null): string {
  if (max != null && max > min) {
    return `Rp ${Math.round(min).toLocaleString('id-ID')}–${Math.round(max).toLocaleString('id-ID')}`
  }
  return formatRupiah(min)
}

// Times are already stored as HH:mm; keep helper for a single formatting point.
export function formatTime(t: string): string {
  return t
}
