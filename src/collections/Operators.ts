import type { CollectionConfig } from 'payload'

// PO = Perusahaan Otobus (bus operator)
export const Operators: CollectionConfig = {
  slug: 'operators',
  labels: { singular: 'PO (Operator)', plural: 'PO (Operator)' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'contact'],
    group: 'Master Data',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nama PO' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'contact', type: 'text', label: 'Kontak (telepon / WA)' },
  ],
}
