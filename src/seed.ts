import 'dotenv/config'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from './payload.config'

// Import data asli dari src/data/april2026.json (di-generate dari REKAP_BUS_*.xlsx).
// Idempotent: skip kalau sudah ada jadwal. Untuk re-import bersih: hapus *.db lalu jalankan lagi.
type RouteData = {
  operator: string
  trayek: string
  type: 'AKAP' | 'AKDP'
  priceMin: number | null
  priceMax: number | null
  distanceKm: number | null
  times: string[]
}
type Dataset = { source: string; operators: string[]; routes: RouteData[] }

const dirname = path.dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(readFileSync(path.join(dirname, 'data/april2026.json'), 'utf8')) as Dataset

async function run() {
  const payload = await getPayload({ config })

  const users = await payload.count({ collection: 'users' })
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: 'admin@terminal.test', password: 'admin12345', name: 'Admin Terminal' },
    })
    console.log('→ Admin dibuat: admin@terminal.test / admin12345')
  }

  const existing = await payload.count({ collection: 'departures' })
  if (existing.totalDocs > 0) {
    console.log(`→ Skip: sudah ada ${existing.totalDocs} jadwal. Hapus *.db untuk re-import.`)
    process.exit(0)
  }

  // Operators
  const opId: Record<string, number> = {}
  for (const name of data.operators) {
    const doc = await payload.create({ collection: 'operators', data: { name } })
    opId[name] = Number(doc.id)
  }

  // Routes + Departures
  let nRoutes = 0
  let nDeps = 0
  for (const r of data.routes) {
    const route = await payload.create({
      collection: 'routes',
      data: {
        trayek: r.trayek,
        type: r.type,
        operator: opId[r.operator],
        priceMin: r.priceMin ?? 0,
        priceMax: r.priceMax ?? undefined,
        distanceKm: r.distanceKm ?? undefined,
      },
    })
    nRoutes++
    for (const time of r.times) {
      await payload.create({ collection: 'departures', data: { route: Number(route.id), time, isActive: true } })
      nDeps++
    }
  }

  const final = await payload.count({ collection: 'departures' })
  if (final.totalDocs !== nDeps) {
    throw new Error(`Seed mismatch: expected ${nDeps}, got ${final.totalDocs}`)
  }
  console.log(`→ Imported ${data.operators.length} PO, ${nRoutes} rute, ${nDeps} jadwal dari ${data.source}.`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
