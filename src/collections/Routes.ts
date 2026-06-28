import type { CollectionConfig } from 'payload'

// Rute = trayek yang melewati Terminal Kutoarjo, dilayani satu PO, jenis AKAP/AKDP,
// dengan rentang tarif. (Data April 2026 memakai trayek mis. "Yogyakarta - Jakarta".)
export const Routes: CollectionConfig = {
  slug: 'routes',
  labels: { singular: 'Rute', plural: 'Rute' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'priceMin'],
    group: 'Master Data',
  },
  access: { read: () => true },
  fields: [
    {
      // Judul otomatis untuk daftar admin & dropdown jadwal.
      name: 'title',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Dibuat otomatis dari trayek, PO, dan jenis.',
      },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (!data) return undefined
            const op = data.operator
              ? await req.payload
                  .findByID({ collection: 'operators', id: data.operator, depth: 0 })
                  .catch(() => null)
              : null
            return `${data.trayek ?? 'Trayek'} — ${op?.name ?? 'PO'} (${data.type ?? '-'})`
          },
        ],
      },
    },
    {
      name: 'trayek',
      type: 'text',
      required: true,
      label: 'Trayek / Rute',
      admin: { placeholder: 'Yogyakarta - Jakarta' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Jenis',
      options: [
        { label: 'AKAP (Antar Kota Antar Provinsi)', value: 'AKAP' },
        { label: 'AKDP (Antar Kota Dalam Provinsi)', value: 'AKDP' },
      ],
    },
    {
      name: 'operator',
      type: 'relationship',
      relationTo: 'operators',
      required: true,
      label: 'PO',
    },
    { name: 'priceMin', type: 'number', required: true, min: 0, label: 'Tarif minimum (Rp)' },
    {
      name: 'priceMax',
      type: 'number',
      min: 0,
      label: 'Tarif maksimum (Rp)',
      admin: { description: 'Kosongkan kalau tarif tunggal.' },
    },
    { name: 'distanceKm', type: 'number', min: 0, label: 'Estimasi jarak (km)' },
    { name: 'note', type: 'text', localized: true, label: 'Catatan (ID/EN)' },
  ],
}
