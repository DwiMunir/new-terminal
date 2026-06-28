// ponytail: satu sumber nomor WhatsApp. GANTI nilai di bawah dengan nomor asli.
// Kalau nanti mau diedit lewat CMS, promote ke Payload Global "Settings".
export const WHATSAPP = {
  // Untuk link wa.me: format internasional tanpa "+" / "0" depan. 0812... -> 62812...
  number: '6281234567890',
  // Untuk ditampilkan ke pengunjung.
  display: '+62 812-3456-7890',
  // Pesan yang otomatis terisi saat tombol diklik.
  defaultMessage:
    'Halo Admin Terminal Kutoarjo, saya ingin menyampaikan pengaduan/pertanyaan terkait jadwal keberangkatan bus.',
}

export function waLink(number: string = WHATSAPP.number, message: string = WHATSAPP.defaultMessage): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
