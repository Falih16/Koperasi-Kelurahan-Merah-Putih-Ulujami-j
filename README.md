# Website Institusional Koperasi Kelurahan Merah Putih Ulujami

Website institusional modern, kredibel, dan siap langsung di-deploy ke **Vercel (Zero-Error Deployment)** untuk **Koperasi Kelurahan Merah Putih Ulujami**, Kecamatan Pesanggrahan, Kota Administrasi Jakarta Selatan, DKI Jakarta.

Proyek ini dibangun menggunakan arsitektur web murni sisi browser (*Client-Side Static Architecture*) berbasis **HTML5 Semantik, CSS3 Kustom Bertema Merah-Putih Indonesia, dan Vanilla JavaScript Modular** dengan sistem penyimpanan lokal persisten (`localStorage`) yang telah di-*seed* dengan data awal riil lengkap.

---

## 🏛️ Fitur Utama & Keunggulan Arsitektur

### 1. Zero-Error Vercel Ready
- **Murni File Statis Terstruktur**: Tidak membutuhkan runtime serverless node/python yang rentan deprecation, dan bebas dari kendala read-only filesystem cloud.
- **Konfigurasi `vercel.json`**: Menyertakan Clean URLs (`"cleanUrls": true`) dan URL Rewrites untuk rute instan:
  - `/login` → `/login.html`
  - `/admin` → `/admin.html`
  - `/` → `/index.html`

### 2. Sistem Desain: Modalitas Institusional & Semangat Merah-Putih
- Palet warna institusional: Deep Burgundy (`#8F1722`), Primary Red (`#C92532`), Soft Red (`#F8E8E9`), dan aksen emas kemakmuran.
- Tipografi editorial berwibawa: **Lora** (Headings) dan **Plus Jakarta Sans** (Teks isi & antarmuka).
- Garis aksen bawah navbar 3px bergradien khas Merah Putih.
- Efek elevasi kartu, aksen border hover, pola latar titik geometris elegan pada section CTA, dan footer gradien marun.

### 3. Halaman Publik Lengkap (`index.html`)
- **Beranda & Hero Section**: Badge status badan hukum AHU Kemenkumham, tagline, dual CTA, dan 4 Kartu Statistik Riil (*348+ Anggota, 4 Unit Usaha, 52+ UMKM Binaan, Rp 1,45 M Perputaran Aset*).
- **Tentang Kami**: Latar belakang pendirian di Ulujami, 4 Pilar Misi Strategis, dan 3 Nilai Luhur (*Gotong Royong, Transparansi Penuh, Profesional & Andal*).
- **4 Unit Usaha Mandiri**:
  1. *Toko Sembako Warga Merah Putih* (Retail komoditas pangan pokok murah pro-warga).
  2. *Galeri UMKM Kelurahan Ulujami* (Sentra kurasi, legalitas P-IRT/Halal, dan promosi produk RT/RW).
  3. *Layanan Jasa & PPOB Terpadu* (Token listrik, PDAM, BPJS, transfer bank biaya hemat).
  4. *Logistik Distribusi Lokal Ulujami* (Armada pengantaran subuh anti-tengkulak).
  - Modal detail unit usaha lengkap dengan jam layanan dan kontak hotline WhatsApp penanggung jawab.
- **Katalog Produk Terintegrasi WhatsApp**:
  - Live instant keyword search (nama & deskripsi).
  - Filter pills kategori produk (Sembako, Kuliner, Kerajinan, Jasa, Sayur).
  - Pengurutan harga termurah/termahal dan produk unggulan.
  - Modal detail produk & pemilihan kuantitas dengan tombol **"Pesan via WhatsApp"** yang otomatis menyusun format pemesanan rapi ke nomor WhatsApp resmi koperasi.
- **Struktur Pengurus**: Profil foto, nama, jabatan, dan biografi Pengurus & Pengawas periode 2024–2027.
- **Alur Pendaftaran Anggota (Kebijakan Privasi Tinggi)**:
  - **Dilarang keras meminta NIK 16 digit atau upload foto KTP** di website publik demi keamanan data pribadi warga.
  - Formulir hanya meminta: Nama Lengkap, Nomor WhatsApp, Domisili RT/RW, dan Alasan Bergabung.
  - Penerbitan otomatis **Kode Referensi Unik** berformat `REG-KMPU-YYYYMMDD-XXXX`.
  - Data langsung tercatat ke dashboard pengurus dengan status `Menunggu Verifikasi`.
  - Pembukaan otomatis WhatsApp resmi koperasi untuk konfirmasi verifikasi fisik langsung di sekretariat.
- **Kontak & Lokasi**: Peta sematan Google Maps interaktif, alamat lengkap Jl. Ulujami Raya No. 42, jam operasional, email, dan telepon.

### 4. Portal Masuk Pengurus Aman (`login.html`)
- Tata letak desktop 2 kolom (45% panel branding merah marun, 55% form putih bersih).
- Input username & kata sandi kosong (tanpa prefill hardcode terbuka).
- Tombol toggle mata untuk melihat/sembunyikan kata sandi.
- Checkbox "Ingat saya" & modal panduan "Lupa kata sandi?".
- **Proteksi Brute-Force Client-Side**: Otomatis mengunci form selama 30 detik jika terjadi 5 kali kegagalan login berturut-turut dilengkapi penghitung waktu mundur (*countdown*).
- Kredensial default: `admin` / `admin123`.

### 5. Dashboard Pengurus Interaktif (`admin.html`)
Proteksi sesi login aktif dengan 8 modul administrasi:
1. **Overview KPI**: Kartu metrik total pendaftar, produk, unit, dan tabel notifikasi pendaftar baru yang memerlukan follow-up.
2. **Tindak Lanjut Pendaftaran WhatsApp**:
   - Pencarian pendaftar dan filter status (`Menunggu Verifikasi`, `Diverifikasi`, `Selesai`, `Ditolak`).
   - Fitur ubah status langsung dan catatan internal pengurus.
   - Tombol **Follow-up WhatsApp Cepat** dengan modal 4 pilihan template pesan otomatis.
3. **Manajemen Produk**: CRUD produk lengkap dengan unggah foto (Base64 file / URL eksternal) dan penandaan produk unggulan (*featured*).
4. **Kategori Produk**: CRUD kategori dan sinkronisasi otomatis ke katalog publik.
5. **Bidang Usaha**: CRUD unit usaha mandiri (penanggung jawab, jam layanan, fasilitas keunggulan).
6. **Struktur Pengurus**: CRUD profil pengurus/dewan pengawas dan urutan tampil.
7. **Pengaturan Identitas & Logo Koperasi**:
   - Unggah logo kustom (Base64/URL) dengan fitur **Live Preview Simulator** pada Navbar Desktop dan Mobile View secara instan.
   - Slider pengatur skala tinggi logo (Desktop: 30–80px, Mobile: 24–60px).
   - Edit identitas resmi, alamat, kontak WhatsApp, dan jam kerja.
8. **Integrasi Database Cloud (Supabase PostgreSQL)**:
   - Panel konfigurasi URL dan Public Anon Key Supabase langsung dari antarmuka web.
   - Indikator status koneksi (*Online Cloud vs Mode Lokal Offline*).
   - Tombol **1-Click Migrasi**: Ekspor seluruh data lokal ke cloud Supabase secara otomatis.
   - Tombol tarik data dari cloud ke peramban.
   - Tombol salin skrip SQL schema lengkap siap pakai.

---

## ☁️ Integrasi Database Cloud Gratis (Supabase PostgreSQL)

Website ini menerapkan sistem **Hybrid Architecture**:
- **Bekerja Offline & Cepat (0ms Latency)**: Secara default menggunakan cache `localStorage`.
- **Tersinkronisasi Real-Time ke Cloud**: Saat Supabase terhubung, setiap perubahan produk, pendaftaran warga, maupun profil koperasi otomatis disinkronkan ke cloud PostgreSQL Supabase gratis.

### Cara Mengaktifkan Database Supabase:
1. Buat akun & project gratis di [supabase.com](https://supabase.com) (Region: *Singapore*).
2. Masuk ke menu **SQL Editor**, salin skrip SQL yang telah disediakan di tab **Database Cloud** dashboard admin website ini, lalu klik **Run**.
3. Ambil **Project URL** dan **Anon Key** dari menu *Project Settings -> API*.
4. Buka **Dashboard Admin KKMP Ulujami** (`/admin.html`), buka tab **Database Cloud**, masukkan URL & Anon Key, lalu centang **"Aktifkan Sinkronisasi Otomatis"** dan klik **Simpan**.
5. Klik tombol **"Ekspor Semua Data ke Cloud"** untuk mengunggah seluruh data awal secara instan! Selesai, website Anda kini memiliki database cloud terpusat!

---

## 📂 Struktur Direktori Proyek

```text
├── vercel.json           # Konfigurasi rewrite & clean URLs Vercel
├── package.json          # Metadata proyek
├── index.html            # Halaman Publik Utama
├── login.html            # Portal Masuk Pengurus
├── admin.html            # Dashboard Administrasi Pengurus (7 Modul)
├── assets/
│   ├── css/
│   │   └── style.css     # Sistem Desain, Variabel Warna & Gradien Merah-Putih
│   └── js/
│       ├── store.js      # Pusat Data Persisten (localStorage), Seeding, & WA Helpers
│       ├── public.js     # Interaktivitas Halaman Publik & Pendaftaran Privasi
│       └── admin.js      # Controller Dashboard Admin & 7 Modul CRUD
└── README.md             # Panduan Teknis & Deployment
```

---

## 🚀 Panduan Deploy ke Vercel (Langkah demi Langkah)

### Metode 1: Deploy Langsung via Vercel CLI (Direkomendasikan)
1. Buka Terminal / PowerShell di folder proyek ini (`KKMP Ulujami`).
2. Pastikan Vercel CLI telah terpasang:
   ```bash
   npm i -g vercel
   ```
3. Jalankan perintah deploy:
   ```bash
   vercel
   ```
4. Ikuti instruksi di layar:
   - *Set up and deploy?* Tekan **Y**
   - *Which scope?* Pilih akun Vercel Anda
   - *Link to existing project?* Pilih **N**
   - *Project name?* Tekan **Enter** (default: `kkmp-ulujami`)
   - *In which directory is your code located?* Tekan **Enter** (`./`)
5. Untuk deploy versi produksi (*production domain*):
   ```bash
   vercel --prod
   ```

### Metode 2: Deploy Melalui Git Repository (GitHub / GitLab / Bitbucket)
1. Buat repository baru di GitHub (misal: `kkmp-ulujami`).
2. Inisialisasi dan push seluruh file:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi portal koperasi merah putih ulujami vercel ready"
   git branch -M main
   git remote add origin https://github.com/USERNAME/kkmp-ulujami.git
   git push -u origin main
   ```
3. Buka dashboard [Vercel](https://vercel.com).
4. Klik **"Add New Project"** -> **"Import Git Repository"**.
5. Pilih repository `kkmp-ulujami`.
6. Biarkan *Framework Preset* pada opsi **Other** (*Static Site*).
7. Klik **"Deploy"**. Proses build akan selesai dalam waktu kurang dari 10 detik!

---

## 💻 Pengujian Lokal (Local Development)

Proyek ini dapat diuji secara langsung di browser lokal Anda dengan salah satu cara berikut:
1. **Langsung Buka File**: Klik dua kali berkas `index.html` pada File Explorer Windows Anda.
2. **Menggunakan Web Server Lokal**:
   ```bash
   npx serve .
   ```
   Atau jika menggunakan Python:
   ```bash
   python -m http.server 3000
   ```
   Buka peramban pada `http://localhost:3000`.

---

## 🔑 Informasi Masuk Pengurus Bawaan

| Parameter | Kredensial Default | Keterangan |
| :--- | :--- | :--- |
| **URL Portal** | `/login` atau `login.html` | Portal khusus pengurus koperasi |
| **Username** | `admin` | Akun administrator |
| **Kata Sandi** | `admin123` | Sandi default |
| **Proteksi** | 5x Salah -> Kunci 30 Detik | Perlindungan brute-force otomatis |

---

## 🇮🇩 Hak Cipta & Kepemilikan
Dikembangkan untuk kemajuan warga **Kelurahan Ulujami, Kecamatan Pesanggrahan, Kota Administrasi Jakarta Selatan, DKI Jakarta**.
Mari bersama tegakkan gotong royong dan kemandirian ekonomi Merah-Putih!
