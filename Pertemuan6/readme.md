# Identitas
Nama: Daniel Joan Fernando
NIM: 255314040

# Sistem Pendaftaran Mahasiswa Baru

Aplikasi web sederhana untuk formulir pendaftaran mahasiswa baru Universitas Sanata Dharma Yogyakarta (Jalur Reguler), dilengkapi halaman untuk melihat, mencari, dan mengekspor data pendaftar. Seluruh data disimpan di browser pengguna menggunakan `localStorage`, tanpa server maupun database.

## Fitur
**Formulir pendaftaran (`pendaftaran.html`)**
- Pengisian data calon mahasiswa, orang tua/wali, asal sekolah, dan pilihan program studi (hingga tiga pilihan)
- Permohonan keringanan DPP dengan pilihan dokumen pendukung
- Pilihan partisipasi program beasiswa
- Validasi bawaan HTML5 untuk kolom wajib
- Notifikasi berhasil terkirim, lalu otomatis diarahkan ke halaman data pendaftar

**Data pendaftar (`dataPendaftar.html`)**
- Tabel daftar pendaftar dengan nomor, nama, e-mail, HP, pilihan I, dan waktu daftar
- Pencarian berdasarkan nama, e-mail, atau program studi
- Tampilan detail lengkap per pendaftar
- Hapus data satu per satu atau hapus seluruh data
- Unduh data dalam format JSON atau CSV (CSV kompatibel dengan Excel)

## Struktur Berkas
├── pendaftaran.html # Formulir pendaftaran
├── dataPendaftar.html # Halaman daftar dan detail pendaftar
├── script.js # Logika penyimpanan, tampilan tabel, dan ekspor
└── style.css # Gaya tampilan (responsif untuk mobile)

## Cara Menjalankan

1. Salin keempat berkas ke satu folder yang sama.
2. Jalankan melalui server lokal, misalnya dengan ekstensi **Live Server** di VS Code, atau perintah:
```bash
   python -m http.server 8000
```
3. Buka `http://localhost:8000/pendaftaran.html` di browser.

> **Catatan:** Dianjurkan menggunakan server lokal, bukan membuka berkas HTML secara langsung (`file://`), karena beberapa browser membatasi `localStorage` pada mode tersebut.

## Alur Penggunaan

1. Calon mahasiswa mengisi formulir di `pendaftaran.html`.
2. Setelah menekan **Kirim pendaftaran**, data disimpan ke `localStorage` dan muncul notifikasi.
3. Halaman berpindah ke `dataPendaftar.html`, tempat data dapat dilihat dan diekspor.

## Penyimpanan Data

| Aspek | Keterangan |
|---|---|
| Lokasi | `localStorage` browser, dengan kunci `dataCalonMhs` |
| Cakupan | Hanya tersedia di browser dan perangkat yang sama |
| Kapasitas | Sekitar 5 MB per domain |
| Penghapusan | Melalui tombol "Hapus" / "Hapus semua", atau membersihkan data situs di browser |

Untuk melihat data secara manual: buka DevTools (F12), lalu masuk ke tab *Application* (Chrome/Edge) atau *Storage* (Firefox), dan pilih `localStorage`.

## Batasan

- Data tidak terkumpul secara terpusat. Pendaftar yang mengisi di perangkat berbeda tidak akan terlihat di halaman admin yang sama.
- Data bisa hilang jika cache atau data situs browser dibersihkan.
- Tidak ada autentikasi. Siapa pun yang mengakses `dataPendaftar.html` dari browser yang sama dapat melihat dan menghapus data.
- Tidak ada enkripsi. Data pribadi tersimpan dalam bentuk teks biasa di browser.

## Teknologi

- HTML5
- CSS3 (variabel CSS, grid, dan flexbox)
- JavaScript (vanilla, tanpa framework)
- Font Inter dari Google Fonts