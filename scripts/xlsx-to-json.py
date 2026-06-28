#!/usr/bin/env python3
"""
Konversi REKAP_BUS_AKAP_AKDP_*.xlsx -> src/data/april2026.json (pakai stdlib, tanpa install).

Sumber:
- Sheet DETAIL AKAP / DETAIL AKDP  -> jam keberangkatan asli (di-dedup jadi timetable)
- Sheet REKAP AKAP / REKAP AKDP    -> rentang tarif & jarak per (PO, trayek)

Pakai:
  python3 scripts/xlsx-to-json.py ["REKAP_BUS_AKAP_AKDP_KUTOARJO_APRIL2026 (1).xlsx"]
Lalu (untuk muat ulang bersih):
  rm -f terminal-schedule.db* && pnpm seed
"""
import sys, zipfile, re, json
from xml.etree import ElementTree as ET

F = sys.argv[1] if len(sys.argv) > 1 else "REKAP_BUS_AKAP_AKDP_KUTOARJO_APRIL2026 (1).xlsx"
OUT = sys.argv[2] if len(sys.argv) > 2 else "src/data/april2026.json"

z = zipfile.ZipFile(F)
lname = lambda t: t.split('}')[-1]
shared = []
if 'xl/sharedStrings.xml' in z.namelist():
    for si in ET.fromstring(z.read('xl/sharedStrings.xml')):
        if lname(si.tag) == 'si':
            shared.append(''.join(t.text or '' for t in si.iter() if lname(t.tag) == 't'))

def colnum(ref):
    m = re.match(r'([A-Z]+)(\d+)', ref); n = 0
    for c in m.group(1): n = n * 26 + (ord(c) - 64)
    return n, int(m.group(2))

def sheet_rows(path):
    rows = {}
    for c in ET.fromstring(z.read(path)).iter():
        if lname(c.tag) != 'c': continue
        ref, t, v = c.get('r'), c.get('t'), None
        for ch in c:
            if lname(ch.tag) == 'v': v = ch.text
            elif lname(ch.tag) == 'is':
                v = ''.join(x.text or '' for x in ch.iter() if lname(x.tag) == 't')
        if v is None: continue
        if t == 's': v = shared[int(v)]
        col, row = colnum(ref); rows.setdefault(row, {})[col] = v
    return rows

norm = lambda s: re.sub(r'\s+', ' ', (s or '').strip()).upper()
def parse_km(s):
    m = re.search(r'(\d+)\s*km', (s or ''), re.I); return int(m.group(1)) if m else None
def parse_price(s):
    nums = [int(x.replace('.', '')) for x in re.findall(r'[\d.]+', (s or '').replace('Rp', ''))]
    nums = [n for n in nums if n >= 1000]
    return (min(nums), max(nums)) if nums else (None, None)
TIME = re.compile(r'^([01]\d|2[0-3]):[0-5]\d$')

# REKAP -> tarif/jarak per (PO, trayek)
rekap = {}
for path in ('xl/worksheets/sheet1.xml', 'xl/worksheets/sheet2.xml'):
    rows = sheet_rows(path)
    for r in sorted(rows):
        c = rows[r]
        if not str(c.get(1, '')).strip().isdigit(): continue
        pmin, pmax = parse_price(c.get(5, ''))
        rekap[(norm(c.get(2, '')), norm(c.get(3, '')))] = {
            'priceMin': pmin, 'priceMax': pmax, 'distanceKm': parse_km(c.get(4, '')),
        }

# DETAIL -> jam unik per (PO, trayek, jenis)
groups = {}
for path, typ in (('xl/worksheets/sheet3.xml', 'AKAP'), ('xl/worksheets/sheet4.xml', 'AKDP')):
    rows = sheet_rows(path)
    for r in sorted(rows):
        if r <= 2: continue
        c = rows[r]
        if not str(c.get(1, '')).strip().isdigit(): continue
        po, jam, trayek = (c.get(3, '') or '').strip(), (c.get(4, '') or '').strip(), (c.get(5, '') or '').strip()
        if not TIME.match(jam): continue
        g = groups.setdefault((norm(po), norm(trayek), typ),
                              {'operator': po, 'trayek': trayek, 'type': typ, 'times': set(), 'distanceKm': parse_km(c.get(6, ''))})
        g['times'].add(jam)

routes = []
for (pk, tk, typ), g in groups.items():
    rk = rekap.get((pk, tk), {})
    routes.append({
        'operator': g['operator'], 'trayek': g['trayek'], 'type': typ,
        'priceMin': rk.get('priceMin'), 'priceMax': rk.get('priceMax'),
        'distanceKm': rk.get('distanceKm') or g['distanceKm'],
        'times': sorted(g['times']),
    })
routes.sort(key=lambda x: (x['type'], x['operator'], x['trayek']))
operators = sorted({r['operator'] for r in routes}, key=lambda s: s.upper())

json.dump({'source': F, 'operators': operators, 'routes': routes},
          open(OUT, 'w'), ensure_ascii=False, indent=1)
print(f"OK -> {OUT}: {len(operators)} PO, {len(routes)} rute, "
      f"{sum(len(r['times']) for r in routes)} jadwal")
