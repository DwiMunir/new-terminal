# Deploy ke VPS (Docker Compose)

Stack: Next.js **standalone** + Payload CMS + **SQLite** (1 container, image ringan).
Data (db + media) disimpan di bind mount `./data` → gampang di-backup.

## 1. Prasyarat di VPS
- Docker + Docker Compose plugin terpasang.
- Project ini ada di VPS (git clone / scp).

## 2. Siapkan environment
```bash
cd terminal-schedule
# buat .env (DATABASE_URI di-override oleh compose, jadi cukup PAYLOAD_SECRET)
printf 'PAYLOAD_SECRET=%s\n' "$(openssl rand -hex 24)" > .env

# folder data (owner harus uid 1001 = user di dalam container)
mkdir -p data
sudo chown -R 1001:1001 data
```

## 3. Build image
```bash
docker compose build
```

## 4. Isi data (pilih salah satu)
**A. Reproducible (dari src/data/april2026.json):**
```bash
docker compose run --rm seed
```
**B. Pakai db yang sudah di-seed di lokal:**
```bash
# dari mesin lokal:
scp terminal-schedule.db user@vps:/path/terminal-schedule/data/
# di VPS:
sudo chown 1001:1001 data/terminal-schedule.db
```

## 5. Jalankan
```bash
docker compose up -d
docker compose logs -f app     # cek sehat
```
App jalan di `http://VPS_IP:3080` (publik `/`, admin `/admin`). Port host = `3080`
(diset di `docker-compose.yml`; container tetap 3000 — ganti kalau perlu).
Login admin awal: `admin@terminal.test` / `admin12345` → **segera ganti password**.

## 6. Pasang domain (reverse proxy)
Pakai Caddy / Nginx / Traefik di depan `app:3000`, lalu set URL publik supaya
login admin (CSRF/CORS) benar — uncomment di `docker-compose.yml`:
```yaml
NEXT_PUBLIC_SERVER_URL: https://jadwal.terminalkutoarjo.id
```
lalu `docker compose up -d` lagi.

Contoh Caddy (`Caddyfile`):
```
jadwal.terminalkutoarjo.id {
    reverse_proxy localhost:3080
}
```

## Update data berikutnya
- Lewat CMS: edit langsung di `/admin` (paling gampang).
- Dari Excel baru:
  ```bash
  python3 scripts/xlsx-to-json.py "FILE_BARU.xlsx"   # regen src/data/april2026.json
  docker compose build seed
  rm -f data/terminal-schedule.db*                   # reset (atau backup dulu)
  docker compose run --rm seed
  docker compose up -d
  ```

## Backup
Cukup salin folder `data/` (berisi `terminal-schedule.db` + `media/`).

## Update aplikasi (kode baru)
```bash
git pull
docker compose build
docker compose up -d
```
Skema SQLite otomatis menyesuaikan saat start (Payload dev push). Untuk perubahan
skema besar di produksi, pertimbangkan Payload migrations.
