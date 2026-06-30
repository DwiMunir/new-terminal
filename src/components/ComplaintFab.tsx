import { WHATSAPP, waLink } from '@/lib/contact'

// Floating WhatsApp button → opens chat with a pre-filled message.
// Pure link (no JS needed); label expands on hover (desktop).
export function WhatsAppFab({ label }: { label: string }) {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center"
    >
      <span className="mr-2 hidden whitespace-nowrap rounded-full bg-slate-900/90 px-3 py-1.5 text-sm font-medium text-white shadow-lg ring-1 ring-white/10 group-hover:inline-block">
        {label}
      </span>
      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/40 transition-transform hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
        <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-7 w-7" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.06 1.6 5.83L2 22l4.4-1.15a9.9 9.9 0 0 0 5.64 1.74h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.17 0 4.21.85 5.74 2.38a8.06 8.06 0 0 1 2.38 5.73c0 4.47-3.64 8.11-8.12 8.11a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-2.6.68.7-2.54-.2-.31a8.02 8.02 0 0 1-1.24-4.3c0-4.47 3.64-8.1 8.11-8.1zm-2.74 3.7c-.13 0-.34.05-.52.24-.18.2-.69.68-.69 1.65 0 .97.71 1.91.81 2.04.1.13 1.39 2.12 3.37 2.97.47.2.84.32 1.12.41.47.15.9.13 1.24.08.38-.06 1.16-.47 1.33-.93.16-.46.16-.85.11-.93-.05-.08-.18-.13-.38-.23-.2-.1-1.16-.57-1.34-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.61.77-.12.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.59-.53-.99-1.18-1.1-1.38-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.44-1.08-.62-1.48-.16-.39-.32-.33-.44-.34l-.38-.01z" />
        </svg>
      </span>
    </a>
  )
}
