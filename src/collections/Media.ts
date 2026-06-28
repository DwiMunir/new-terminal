import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  admin: { group: 'Sistem' },
  access: { read: () => true },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Teks alternatif',
    },
  ],
  upload: {
    // In Docker set MEDIA_DIR=/app/data/media (persisted volume); locally → ./media.
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
  },
}
