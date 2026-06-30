import type { GlobalConfig } from 'payload'

// Site-wide display settings, editable in the admin.
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Pengaturan',
  admin: { group: 'Master Data' },
  access: { read: () => true },
  fields: [
    {
      name: 'showFare',
      type: 'checkbox',
      label: 'Tampilkan kolom Tarif',
      defaultValue: false,
      admin: {
        description:
          'Matikan untuk menyembunyikan tarif saat harga belum pasti (mis. akibat kenaikan BBM). Nyalakan lagi bila tarif sudah stabil.',
      },
    },
  ],
}
