import { COMPLAINT_FORM_URL } from '@/lib/contact'

// Floating complaint button → opens the Google Form.
// Pure link (no JS needed); label expands on hover (desktop).
export function ComplaintFab({ label }: { label: string }) {
  return (
    <a
      href={COMPLAINT_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center"
    >
      <span className="mr-2 hidden whitespace-nowrap rounded-full bg-slate-900/90 px-3 py-1.5 text-sm font-medium text-white shadow-lg ring-1 ring-white/10 group-hover:inline-block">
        {label}
      </span>
      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg shadow-amber-900/40 transition-transform hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-40" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative h-7 w-7" aria-hidden>
          <path d="M3 11l18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      </span>
    </a>
  )
}
