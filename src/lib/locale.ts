import { cookies } from 'next/headers'
import { defaultLocale, type Locale } from './i18n'

export const LOCALE_COOKIE = 'locale'

// Server-only: read the active UI locale from the cookie.
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  return store.get(LOCALE_COOKIE)?.value === 'en' ? 'en' : defaultLocale
}
