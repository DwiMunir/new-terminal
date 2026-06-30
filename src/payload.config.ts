import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Operators } from './collections/Operators'
import { Routes } from './collections/Routes'
import { Departures } from './collections/Departures'
import { Settings } from './globals/Settings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      title: 'Terminal Kutoarjo',
      titleSuffix: ' — Admin',
    },
    components: {
      graphics: {
        Logo: '/components/admin/Brand#Logo',
        Icon: '/components/admin/Brand#Icon',
      },
    },
  },
  // Order = sidebar order
  collections: [Departures, Routes, Operators, Media, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  // Set NEXT_PUBLIC_SERVER_URL in prod so admin login (CSRF/CORS) works behind a domain.
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || undefined,
  cors: process.env.NEXT_PUBLIC_SERVER_URL ? [process.env.NEXT_PUBLIC_SERVER_URL] : undefined,
  csrf: process.env.NEXT_PUBLIC_SERVER_URL ? [process.env.NEXT_PUBLIC_SERVER_URL] : undefined,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || 'file:./terminal-schedule.db' },
  }),
  sharp,
  localization: {
    locales: [
      { label: 'Indonesia', code: 'id' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'id',
    fallback: true,
  },
})
