import type { CollectionConfig } from 'payload'

// Jadwal tetap: jam keberangkatan rutin untuk sebuah rute.
export const Departures: CollectionConfig = {
  slug: 'departures',
  labels: { singular: 'Jadwal', plural: 'Jadwal Keberangkatan' },
  admin: {
    useAsTitle: 'time',
    defaultColumns: ['time', 'route', 'price', 'isActive'],
    group: 'Jadwal',
  },
  defaultSort: 'time',
  access: { read: () => true },
  fields: [
    { name: 'route', type: 'relationship', relationTo: 'routes', required: true, label: 'Rute' },
    {
      name: 'time',
      type: 'text',
      required: true,
      label: 'Jam (HH:mm)',
      admin: { placeholder: '05:30', description: 'Format 24 jam, mis. 14:00' },
      validate: (val: string | null | undefined) =>
        typeof val === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(val)
          ? true
          : 'Format jam harus HH:mm (00:00–23:59)',
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      label: 'Harga override (Rp)',
      admin: { description: 'Kosongkan untuk memakai harga dari rute.' },
    },
    {
      name: 'days',
      type: 'select',
      hasMany: true,
      label: 'Hari operasi',
      defaultValue: ['1', '2', '3', '4', '5', '6', '0'],
      options: [
        { label: 'Senin', value: '1' },
        { label: 'Selasa', value: '2' },
        { label: 'Rabu', value: '3' },
        { label: 'Kamis', value: '4' },
        { label: 'Jumat', value: '5' },
        { label: 'Sabtu', value: '6' },
        { label: 'Minggu', value: '0' },
      ],
    },
    { name: 'isActive', type: 'checkbox', label: 'Aktif', defaultValue: true },
  ],
}
