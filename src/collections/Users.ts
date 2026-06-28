import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pengguna', plural: 'Pengguna' },
  admin: {
    useAsTitle: 'email',
    group: 'Sistem',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nama',
    },
  ],
}
