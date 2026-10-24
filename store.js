/**
 * store.js - Pusat Data Persisten (localStorage), Autentikasi, dan Helper WhatsApp
 * Koperasi Kelurahan Merah Putih Ulujami
 */

(function (window) {
  'use strict';

  // Kunci Penyimpanan localStorage
  const KEYS = {
    PROFILE: 'kmp_profile',
    CATEGORIES: 'kmp_categories',
    UNITS: 'kmp_business_units',
    PRODUCTS: 'kmp_products',
    BOARD: 'kmp_board_members',
    REGISTRATIONS: 'kmp_registrations',
    AUTH_SESSION: 'kmp_auth_session',
    LOGIN_ATTEMPTS: 'kmp_login_attempts',
    ADMIN_CREDENTIALS: 'kmp_admin_credentials'
  };

  // Default Logo SVG Institusional Merah-Putih Koperasi
  const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8F1722" />
          <stop offset="60%" stop-color="#C92532" />
          <stop offset="100%" stop-color="#700F17" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE082" />
          <stop offset="50%" stop-color="#FFB300" />
          <stop offset="100%" stop-color="#FF8F00" />
        </linearGradient>
      </defs>
      <!-- Perisai Lingkaran Luar -->
      <circle cx="100" cy="100" r="92" fill="url(#bgGrad)" stroke="#FFD54F" stroke-width="4"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4,3"/>
      
      <!-- Bendera Merah Putih Pita Melengkung -->
      <path d="M 50 145 C 80 165, 120 165, 150 145 L 146 135 C 120 152, 80 152, 54 135 Z" fill="#FFFFFF" opacity="0.95"/>
      <path d="M 50 145 C 80 165, 120 165, 150 145 L 148 152 C 120 172, 80 172, 52 152 Z" fill="#8F1722"/>

      <!-- Roda Gigi Koperasi (Gotong Royong & Industri) -->
      <g fill="#FFE082" opacity="0.95">
        <circle cx="100" cy="85" r="30" fill="none" stroke="#FFE082" stroke-width="6"/>
        <circle cx="100" cy="85" r="16" fill="#8F1722"/>
        <path d="M 97 48 h 6 v 8 h -6 z M 97 114 h 6 v 8 h -6 z M 63 82 h 8 v 6 h -8 z M 129 82 h 8 v 6 h -8 z M 75 60 l 5 5 l -4 4 l -5 -5 z M 121 106 l 5 5 l -4 4 l -5 -5 z M 125 64 l -5 5 l -4 -4 l 5 -5 z M 79 110 l -5 5 l -4 -4 l 5 -5 z"/>
      </g>

      <!-- Tangkai Padi & Kapas (Kesejahteraan & Keadilan) -->
      <path d="M 52 95 C 48 70, 68 52, 85 45" fill="none" stroke="#FFE082" stroke-width="3" stroke-linecap="round"/>
      <circle cx="56" cy="85" r="3.5" fill="#FFE082"/>
      <circle cx="62" cy="72" r="3.5" fill="#FFE082"/>
      <circle cx="72" cy="58" r="3.5" fill="#FFE082"/>
      <circle cx="85" cy="46" r="3.5" fill="#FFE082"/>

      <path d="M 148 95 C 152 70, 132 52, 115 45" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      <circle cx="144" cy="85" r="3.5" fill="#FFFFFF"/>
      <circle cx="138" cy="72" r="3.5" fill="#FFFFFF"/>
      <circle cx="128" cy="58" r="3.5" fill="#FFFFFF"/>
      <circle cx="115" cy="46" r="3.5" fill="#FFFFFF"/>

      <!-- Bintang Emas Pusat -->
      <polygon points="100,68 104,78 115,79 107,86 109,96 100,90 91,96 93,86 85,79 96,78" fill="url(#goldGrad)" stroke="#B78103" stroke-width="0.8"/>

      <!-- Teks Tulisan Institusi -->
      <text x="100" y="172" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="10.5" fill="#FFFFFF" letter-spacing="1">KOPERASI MERAH PUTIH</text>
      <text x="100" y="185" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="8.5" fill="#FFD54F" letter-spacing="1.5">KELURAHAN ULUJAMI</text>
    </svg>
  `)}`;

  // DATA BENIH AWAL (INITIAL SEED DATA)
  const SEED_PROFILE = {
    name: 'Koperasi Kelurahan Merah Putih Ulujami',
    shortName: 'KKMP Ulujami',
    tagline: 'Wadah Gotong Royong Ekonomi Warga Menuju Kemandirian & Kesejahteraan Bersama',
    legalBadge: 'Badan Hukum No: AHU-0012849.AH.01.26.TAHUN 2023',
    decreeDate: '17 Agustus 2023',
    address: 'Jl. Ulujami Raya No. 42, RT 05 / RW 01, Kelurahan Ulujami, Kecamatan Pesanggrahan, Kota Administrasi Jakarta Selatan, DKI Jakarta 12250',
    phone: '0812-8912-3456',
    whatsapp: '6281289123456',
    email: 'kontak@koperasimerahputih-ulujami.id',
    operationalHours: 'Senin – Sabtu: 08.00 – 17.00 WIB (Minggu & Libur Nasional Tutup)',
    mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15864.845814578508!2d106.7589255!3d-6.2358897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f10a80e7d013%3A0x6b7ca2c525f2ee3f!2sUlujami%2C%20Pesanggrahan%2C%20South%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
    logoUrl: '',
    logoScaleDesktop: 48,
    logoScaleMobile: 38,
    stats: {
      activeMembers: 348,
      businessUnits: 4,
      umkmPartners: 52,
      totalAsset: 'Rp 1,45 Miliar'
    },
    mission: [
      'Menyediakan pasokan pangan pokok berkualitas dengan harga terjangkau dan stabil bagi seluruh warga Ulujami.',
      'Membina, menginkubasi, serta memasarkan produk-produk UMKM warga RT dan RW secara berkelanjutan.',
      'Menyediakan layanan utilitas dan transaksi finansial mikro yang modern, transparan, dan terpercaya.',
      'Mengembangkan jaringan logistik mandiri antar-warga guna memangkas rantai pasok tengkulak.'
    ],
    values: [
      { title: 'Gotong Royong', desc: 'Bahu-membahu dari warga, oleh warga, dan untuk kemakmuran warga kelurahan.' },
      { title: 'Transparansi Penuh', desc: 'Laporan keuangan dan tata kelola unit usaha terbuka untuk seluruh anggota.' },
      { title: 'Profesional & Andal', desc: 'Standar mutu pelayanan modern dengan kehangatan silaturahmi tetangga.' }
    ]
  };

  const SEED_CATEGORIES = [
    { id: 'cat-sembako', name: 'Sembako & Pangan Pokok', slug: 'sembako' },
    { id: 'cat-kuliner', name: 'Kuliner & Kudapan UMKM', slug: 'kuliner' },
    { id: 'cat-kerajinan', name: 'Kriya & Kerajinan Tangan', slug: 'kerajinan' },
    { id: 'cat-jasa', name: 'Layanan Jasa & PPOB', slug: 'jasa' },
    { id: 'cat-pertanian', name: 'Urban Farming & Sayur Segar', slug: 'pertanian' }
  ];

  const SEED_UNITS = [
    {
      id: 'unit-sembako',
      name: 'Toko Sembako Warga Merah Putih',
      category: 'Retail Pangan Pokok',
      pic: 'Bpk. Rahmat Hidayat (Manajer Distribusi)',
      hours: '07.30 - 20.30 WIB',
      contact: '081289123456',
      description: 'Menyediakan beras kualitas super, minyak goreng resmi HET pemerintah, gula pasir murni, telur ayam ras langsung dari peternak binaan, tepung terigu, dan aneka bahan pokok harian dengan jaminan harga adil pro-warga.',
      features: [
        'Harga stabil terkendali anti-spekulan',
        'Gratis antar ke rumah warga untuk belanja di atas Rp 100.000',
        'Program Tebus Murah Bulanan Khusus Anggota Terdaftar'
      ],
      icon: 'storefront',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'unit-umkm',
      name: 'Galeri UMKM Kelurahan Ulujami',
      category: 'Sentra Kurasi & Promosi Produk Lokal',
      pic: 'Ibu Siti Fatimah (Koordinator Pemberdayaan)',
      hours: '09.00 - 18.00 WIB',
      contact: '081289123457',
      description: 'Pusat etalase dan promosi produk unggulan warga dari 9 RW di Kelurahan Ulujami. Mulai dari aneka camilan gurih, sambal botol khas, frozen food halal, hingga batik corak Betawi Pesanggrahan dan kriya rajut bernilai estetika tinggi.',
      features: [
        'Fasilitasi legalitas P-IRT, Sertifikasi Halal, dan NIB UMKM',
        'Etalase fisik toko di kantor sekretariat & promosi digital live',
        'Sistem konsinyasi transparan dengan pencairan berkala'
      ],
      icon: 'shopping_bag',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'unit-jasa',
      name: 'Layanan Jasa & PPOB Terpadu',
      category: 'Finansial Mikro & Layanan Utilitas',
      pic: 'Sdr. Dimas Prasetyo (Supervisor Layanan)',
      hours: '08.00 - 21.00 WIB',
      contact: '081289123458',
      description: 'Solusi satu pintu kebutuhan pembayaran tagihan bulanan dan transaksi keuangan warga: Token Listrik PLN, Tagihan Air PAM Jaya, Iuran BPJS Kesehatan, Pulsa/Data All Operator, Transfer Uang Antar-Bank, serta administrasi digital kelurahan.',
      features: [
        'Biaya administrasi paling hemat se-lingkungan Ulujami',
        'Buka hingga malam hari untuk kenyamanan pulang kerja',
        'Struk bukti transaksi fisik & bukti digital WhatsApp instan'
      ],
      icon: 'credit_card',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'unit-logistik',
      name: 'Logistik Distribusi Lokal Ulujami',
      category: 'Rantai Pasok & Antar Cepat Lingkungan',
      pic: 'Bpk. Bambang Supeno (Kepala Operasional)',
      hours: '06.00 - 17.00 WIB',
      contact: '081289123459',
      description: 'Unit armada pengantaran pasokan kebutuhan pokok dari distributor ke warung-warung tetangga se-Kelurahan Ulujami. Beroperasi setiap fajar untuk memangkas jalur tengkulak dan menjaga kestabilan harga pangan lingkungan.',
      features: [
        'Armada kendaraan operasional Tossa dan roda dua kelurahan',
        'Jadwal pasokan subuh tepat waktu bagi pedagang sarapan & warteg',
        'Tarif pengantaran tersubsidi untuk anggota resmi koperasi'
      ],
      icon: 'local_shipping',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&auto=format&fit=crop&q=80'
    }
  ];

  const SEED_PRODUCTS = [
    {
      id: 'prod-1',
      name: 'Beras Pandan Wangi Super 5 Kg',
      category: 'sembako',
      unitId: 'unit-sembako',
      price: 74500,
      stock: 125,
      description: 'Beras premium asli Cianjur tanpa pemutih, tanpa pewangi buatan, dan tanpa pengawet. Pulen, harum alami, dan higienis bersertifikasi.',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      featured: true,
      isPublished: true
    },
    {
      id: 'prod-2',
      name: 'Minyak Goreng Minyakita Pouch 2 Liter',
      category: 'sembako',
      unitId: 'unit-sembako',
      price: 32000,
      stock: 240,
      description: 'Minyak goreng kelapa sawit higienis alokasi resmi pemerintah untuk warga, jernih, tahan panas, dan kaya Vitamin A.',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
      featured: true,
      isPublished: true
    },
    {
      id: 'prod-3',
      name: 'Telur Ayam Negeri Segar Pilihan 1 Kg',
      category: 'sembako',
      unitId: 'unit-sembako',
      price: 28000,
      stock: 80,
      description: 'Telur ayam ras segar dari peternakan binaan. Cangkang bersih, isi padat, dan dipanen setiap pagi.',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80',
      featured: false,
      isPublished: true
    },
    {
      id: 'prod-4',
      name: 'Kripik Tempe Renyah Gurih Bu Hj. Nurul',
      category: 'kuliner',
      unitId: 'unit-umkm',
      price: 18000,
      stock: 45,
      description: 'Produk olahan UMKM binaan RW 02 Ulujami. Irisan tempe kedelai murni berbalut rempah ketumbar dan daun jeruk yang sangat gurih tanpa MSG berlebih.',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
      featured: true,
      isPublished: true
    },
    {
      id: 'prod-5',
      name: 'Sambal Cakalang Asap Ulujami Spesial',
      category: 'kuliner',
      unitId: 'unit-umkm',
      price: 29000,
      stock: 35,
      description: 'Sambal racikan rumahan Bu Dewi (RW 04) dengan suwiran ikan cakalang asap pilihan, cabe rawit segar, dan minyak kelapa asli. Siap santap.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      featured: true,
      isPublished: true
    },
    {
      id: 'prod-6',
      name: 'Tas Anyam Rajut Motif Pesanggrahan',
      category: 'kerajinan',
      unitId: 'unit-umkm',
      price: 65000,
      stock: 18,
      description: 'Karya kerajinan tangan kelompok ibu-ibu PKK RW 06 Ulujami berbahan tali kur kuat dengan perpaduan warna Merah-Putih elegan dan tahan air.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      featured: true,
      isPublished: true
    },
    {
      id: 'prod-7',
      name: 'Paket Sayur Hidroponik Segar RW 03',
      category: 'pertanian',
      unitId: 'unit-sembako',
      price: 15000,
      stock: 30,
      description: 'Panen sayur hidroponik harian (Pakcoy, Selada, Bayam Hijau) dari kebun atap warga RW 03. Bebas pestisida kimia dan dipetik saat order tiba.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      featured: false,
      isPublished: true
    },
    {
      id: 'prod-8',
      name: 'Token Listrik PLN Prabayar (PPOB Resmi)',
      category: 'jasa',
      unitId: 'unit-jasa',
      price: 22500,
      stock: 999,
      description: 'Pengisian pulsa listrik PLN 20.000 dengan biaya admin termurah (Rp 2.500). Kode token 20 digit dikirim instan ke WhatsApp Anda.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
      featured: false,
      isPublished: true
    }
  ];

  const SEED_BOARD = [
    {
      id: 'board-1',
      name: 'H. Hendro Siswanto, S.E.',
      position: 'Ketua Koperasi',
      period: '2024 – 2027',
      order: 1,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Praktisi ekonomi kerakyatan berpengalaman 15 tahun di bidang perkoperasian dan pengembangan unit usaha mikro perkotaan.'
    },
    {
      id: 'board-2',
      name: 'Dra. Hj. Nuraini Wahyuni',
      position: 'Sekretaris',
      period: '2024 – 2027',
      order: 2,
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: 'Tokoh penggerak perempuan Ulujami yang berdedikasi mengawal tertib administrasi, pendaftaran anggota, dan kepatuhan hukum.'
    },
    {
      id: 'board-3',
      name: 'Drs. M. Taufik Kurniawan, Ak.',
      position: 'Bendahara',
      period: '2024 – 2027',
      order: 3,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'Akuntan profesional yang memegang teguh asas keterbukaan neraca pembukuan, audit kas berkala, dan kesehatan permodalan.'
    },
    {
      id: 'board-4',
      name: 'Bpk. Drs. H. Achmad Fauzi, M.Si.',
      position: 'Ketua Dewan Pengawas',
      period: '2024 – 2027',
      order: 4,
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      bio: 'Mantan pamong senior yang bertugas mengawasi jalannya roda organisasi agar konsisten selaras dengan AD/ART dan regulasi dinas.'
    },
    {
      id: 'board-5',
      name: 'Ibu Ratna Dewi Sartika, S.Sos.',
      position: 'Anggota Dewan Pengawas',
      period: '2024 – 2027',
      order: 5,
      photo: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80',
      bio: 'Penggiat sosial kemasyarakatan yang aktif mengawal kepuasan pelayanan anggota dan ketepatan pembagian SHU tahunan.'
    }
  ];

  const SEED_REGISTRATIONS = [
    {
      id: 'reg-1',
      refCode: 'REG-KMPU-20241020-8391',
      fullName: 'Agus Supriyadi',
      phone: '081298765432',
      rtrw: 'RT 03 / RW 01',
      reason: 'Ingin belanja sembako murah untuk kebutuhan warung nasi dan menabung simpanan wajib secara teratur.',
      date: '2024-10-20 09:15',
      status: 'Menunggu Verifikasi',
      notes: 'Sudah dihubungi via WA. Dijadwalkan hadir ke kantor hari Senin pukul 10.00 WIB.'
    },
    {
      id: 'reg-2',
      refCode: 'REG-KMPU-20241021-1248',
      fullName: 'Endang Sulastri',
      phone: '085711223344',
      rtrw: 'RT 07 / RW 04',
      reason: 'Memasarkan produk keripik pisang madu dan aneka kue basah ke Galeri UMKM Kelurahan.',
      date: '2024-10-21 14:30',
      status: 'Diverifikasi',
      notes: 'Sampel produk olahan sudah diuji rasa dan kemasannya memenuhi standar P-IRT.'
    },
    {
      id: 'reg-3',
      refCode: 'REG-KMPU-20241022-7714',
      fullName: 'Budi Santoso',
      phone: '081399887766',
      rtrw: 'RT 02 / RW 05',
      reason: 'Mendukung gerakan gotong royong ekonomi warga serta memfasilitasi kebutuhan PPOB di lingkungan RT.',
      date: '2024-10-22 10:05',
      status: 'Selesai',
      notes: 'Buku anggota dan kartu simpanan fisik telah diserahkan di sekretariat.'
    },
    {
      id: 'reg-4',
      refCode: 'REG-KMPU-20241023-4521',
      fullName: 'Sri Wahyuni',
      phone: '087812349876',
      rtrw: 'RT 05 / RW 02',
      reason: 'Ingin mendapatkan harga pasokan beras dan minyak langsung dari distributor untuk konsumsi keluarga besar.',
      date: '2024-10-23 16:45',
      status: 'Menunggu Verifikasi',
      notes: 'Pendaftaran baru masuk melalui formulir publik website.'
    }
  ];

  // Helper Sanitasi & Keamanan String (Cegah XSS)
  function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Format Mata Uang Rupiah
  function formatRupiah(amount) {
    const num = Number(amount) || 0;
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  // Generator Kode Registrasi Unik: REG-KMPU-YYYYMMDD-XXXX
  function generateRefCode() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `REG-KMPU-${yyyy}${mm}${dd}-${code}`;
  }

  // Format Nomor WhatsApp Standar Indonesia (08xxx -> 628xxx)
  function cleanPhoneWA(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  }

  // Bangun URL WhatsApp Aman
  function buildWhatsAppUrl(phoneNumber, messageText) {
    const cleanNum = cleanPhoneWA(phoneNumber);
    const encoded = encodeURIComponent(messageText);
    return `https://wa.me/${cleanNum}?text=${encoded}`;
  }

  // Helper Template Pesan WhatsApp
  const Templates = {
    // 1. Pesan Pemesanan Produk oleh Warga
    productOrder(product, qty, buyerName, buyerAddress, note) {
      const total = (product.price || 0) * (qty || 1);
      return (
        `Halo Admin Koperasi Merah Putih Ulujami,\n\n` +
        `Saya ingin memesan produk berikut melalui website resmi:\n\n` +
        `*Detail Pesanan:*\n` +
        `• Produk: ${product.name}\n` +
        `• Harga Satuan: ${formatRupiah(product.price)}\n` +
        `• Jumlah: ${qty} item\n` +
        `• Estimasi Total: ${formatRupiah(total)}\n\n` +
        `*Data Pemesan:*\n` +
        `• Nama: ${buyerName || '-'}\n` +
        `• Alamat/Domisili: ${buyerAddress || '-'}\n` +
        (note ? `• Catatan Khusus: ${note}\n` : '') +
        `\nMohon informasi ketersediaan stok dan konfirmasi nomor rekening/pembayaran di tempat. Terima kasih!`
      );
    },

    // 2. Pesan Pendaftaran Anggota Baru Warga
    memberRegistration(regData) {
      return (
        `*PENDAFTARAN ANGGOTA BARU*\n` +
        `Koperasi Kelurahan Merah Putih Ulujami\n\n` +
        `Yth. Tim Pengurus Koperasi,\n` +
        `Saya telah melengkapi formulir pendaftaran melalui website resmi dengan rincian sbb:\n\n` +
        `• *Kode Registrasi:* ${regData.refCode}\n` +
        `• *Nama Lengkap:* ${regData.fullName}\n` +
        `• *Nomor WhatsApp:* ${regData.phone}\n` +
        `• *Domisili:* ${regData.rtrw}\n` +
        `• *Alasan/Minat:* ${regData.reason}\n\n` +
        `Demi perlindungan data pribadi, dokumen KTP/KK asli akan saya tunjukkan secara langsung saat verifikasi fisik di Sekretariat Koperasi.\n\n` +
        `Mohon petunjuk jadwal verifikasi dan langkah selanjutnya. Terima kasih!`
      );
    },

    // 3. Empat Template Follow-up Pengurus Dashboard
    adminFollowUps: {
      inviteVerification(applicant) {
        return (
          `Halo Bapak/Ibu ${applicant.fullName},\n\n` +
          `Terima kasih telah mendaftar menjadi calon anggota Koperasi Kelurahan Merah Putih Ulujami (Kode Registrasi: *${applicant.refCode}*).\n\n` +
          `Kami mengundang Bapak/Ibu untuk hadir verifikasi berkas dokumen identitas (membawa KTP & KK untuk dicocokkan) di Sekretariat Koperasi:\n` +
          `📍 Jl. Ulujami Raya No. 42 (Senin – Sabtu, 08.00 – 17.00 WIB).\n\n` +
          `Mari bersama kita bangun kemandirian dan gotong royong ekonomi warga Ulujami!`
        );
      },
      reminderSchedule(applicant) {
        return (
          `Salam hangat Bapak/Ibu ${applicant.fullName},\n\n` +
          `Mengingatkan kembali tindak lanjut verifikasi keanggotaan Koperasi Merah Putih Ulujami dengan nomor *${applicant.refCode}*.\n\n` +
          `Sekretariat kami siap menyambut kehadiran Bapak/Ibu di hari kerja. Silakan konfirmasi waktu kedatangan yang nyaman bagi Anda. Terima kasih.`
        );
      },
      approvalSuccess(applicant) {
        return (
          `Selamat Bapak/Ibu ${applicant.fullName}! 🎉\n\n` +
          `Proses verifikasi pendaftaran keanggotaan Koperasi Kelurahan Merah Putih Ulujami (Ref: *${applicant.refCode}*) telah *SELESAI & RESMI DISETUJUI*.\n\n` +
          `Kini Anda telah terdaftar sebagai anggota penuh dan berhak menikmati harga khusus Toko Sembako, promo Galeri UMKM, serta hak Sisa Hasil Usaha (SHU) tahunan. Buku keanggotaan dapat diambil di kantor koperasi.`
        );
      },
      rejectionClarification(applicant) {
        return (
          `Yth. Bapak/Ibu ${applicant.fullName},\n\n` +
          `Sehubungan dengan formulir pendaftaran anggota Anda (Ref: *${applicant.refCode}*), terdapat data domisili atau persyaratan administrasi yang memerlukan klarifikasi lebih lanjut.\n\n` +
          `Mohon berkenan membalas pesan ini atau berkunjung langsung ke Sekretariat Koperasi pada jam kerja agar kami dapat membantu prosesnya. Terima kasih.`
        );
      }
    }
  };

  // OBJEK UTAMA STORE
  const Store = {
    DEFAULT_LOGO_SVG,
    sanitize,
    formatRupiah,
    generateRefCode,
    cleanPhoneWA,
    buildWhatsAppUrl,
    Templates,

    // Inisialisasi & Benih Data Awal jika kosong
    init() {
      if (!localStorage.getItem(KEYS.PROFILE)) {
        localStorage.setItem(KEYS.PROFILE, JSON.stringify(SEED_PROFILE));
      }
      if (!localStorage.getItem(KEYS.CATEGORIES)) {
        localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
      }
      if (!localStorage.getItem(KEYS.UNITS)) {
        localStorage.setItem(KEYS.UNITS, JSON.stringify(SEED_UNITS));
      }
      if (!localStorage.getItem(KEYS.PRODUCTS)) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
      }
      if (!localStorage.getItem(KEYS.BOARD)) {
        localStorage.setItem(KEYS.BOARD, JSON.stringify(SEED_BOARD));
      }
      if (!localStorage.getItem(KEYS.REGISTRATIONS)) {
        localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(SEED_REGISTRATIONS));
      }
      if (!localStorage.getItem(KEYS.ADMIN_CREDENTIALS)) {
        localStorage.setItem(KEYS.ADMIN_CREDENTIALS, JSON.stringify({
          username: 'admin',
          password: 'admin123'
        }));
      }
    },

    // Reset Data ke Benih Asli
    resetToDefault() {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(SEED_PROFILE));
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
      localStorage.setItem(KEYS.UNITS, JSON.stringify(SEED_UNITS));
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
      localStorage.setItem(KEYS.BOARD, JSON.stringify(SEED_BOARD));
      localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(SEED_REGISTRATIONS));
      localStorage.setItem(KEYS.ADMIN_CREDENTIALS, JSON.stringify({
        username: 'admin',
        password: 'admin123'
      }));
    },

    // ==================== PROFILE ====================
    getProfile() {
      try {
        const raw = localStorage.getItem(KEYS.PROFILE);
        return raw ? JSON.parse(raw) : SEED_PROFILE;
      } catch (e) {
        return SEED_PROFILE;
      }
    },

    saveProfile(profileData) {
      const current = this.getProfile();
      const updated = { ...current, ...profileData };
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    },

    // ==================== CATEGORIES ====================
    getCategories() {
      try {
        const raw = localStorage.getItem(KEYS.CATEGORIES);
        return raw ? JSON.parse(raw) : SEED_CATEGORIES;
      } catch (e) {
        return SEED_CATEGORIES;
      }
    },

    saveCategory(cat) {
      const cats = this.getCategories();
      if (cat.id) {
        const idx = cats.findIndex(c => c.id === cat.id);
        if (idx >= 0) cats[idx] = { ...cats[idx], ...cat };
      } else {
        const newCat = {
          id: 'cat-' + Date.now(),
          name: cat.name,
          slug: (cat.slug || cat.name).toLowerCase().replace(/[^a-z0-9]/g, '-')
        };
        cats.push(newCat);
      }
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
      return cats;
    },

    deleteCategory(id) {
      let cats = this.getCategories();
      cats = cats.filter(c => c.id !== id);
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
      return cats;
    },

    // ==================== UNITS ====================
    getUnits() {
      try {
        const raw = localStorage.getItem(KEYS.UNITS);
        return raw ? JSON.parse(raw) : SEED_UNITS;
      } catch (e) {
        return SEED_UNITS;
      }
    },

    getUnitById(id) {
      const units = this.getUnits();
      return units.find(u => u.id === id) || null;
    },

    saveUnit(unit) {
      const units = this.getUnits();
      if (unit.id) {
        const idx = units.findIndex(u => u.id === unit.id);
        if (idx >= 0) units[idx] = { ...units[idx], ...unit };
        else units.push(unit);
      } else {
        unit.id = 'unit-' + Date.now();
        units.push(unit);
      }
      localStorage.setItem(KEYS.UNITS, JSON.stringify(units));
      return units;
    },

    deleteUnit(id) {
      let units = this.getUnits();
      units = units.filter(u => u.id !== id);
      localStorage.setItem(KEYS.UNITS, JSON.stringify(units));
      return units;
    },

    // ==================== PRODUCTS ====================
    getProducts() {
      try {
        const raw = localStorage.getItem(KEYS.PRODUCTS);
        return raw ? JSON.parse(raw) : SEED_PRODUCTS;
      } catch (e) {
        return SEED_PRODUCTS;
      }
    },

    getProductById(id) {
      const prods = this.getProducts();
      return prods.find(p => p.id === id) || null;
    },

    saveProduct(prod) {
      const prods = this.getProducts();
      if (prod.id) {
        const idx = prods.findIndex(p => p.id === prod.id);
        if (idx >= 0) prods[idx] = { ...prods[idx], ...prod };
        else prods.push(prod);
      } else {
        prod.id = 'prod-' + Date.now();
        prods.unshift(prod);
      }
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(prods));
      return prods;
    },

    deleteProduct(id) {
      let prods = this.getProducts();
      prods = prods.filter(p => p.id !== id);
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(prods));
      return prods;
    },

    // ==================== BOARD MEMBERS ====================
    getBoard() {
      try {
        const raw = localStorage.getItem(KEYS.BOARD);
        const list = raw ? JSON.parse(raw) : SEED_BOARD;
        return list.sort((a, b) => (a.order || 99) - (b.order || 99));
      } catch (e) {
        return SEED_BOARD;
      }
    },

    saveBoardMember(member) {
      const list = this.getBoard();
      if (member.id) {
        const idx = list.findIndex(m => m.id === member.id);
        if (idx >= 0) list[idx] = { ...list[idx], ...member };
        else list.push(member);
      } else {
        member.id = 'board-' + Date.now();
        member.order = member.order || (list.length + 1);
        list.push(member);
      }
      localStorage.setItem(KEYS.BOARD, JSON.stringify(list));
      return list;
    },

    deleteBoardMember(id) {
      let list = this.getBoard();
      list = list.filter(m => m.id !== id);
      localStorage.setItem(KEYS.BOARD, JSON.stringify(list));
      return list;
    },

    // ==================== REGISTRATIONS (PENDAFTARAN) ====================
    getRegistrations() {
      try {
        const raw = localStorage.getItem(KEYS.REGISTRATIONS);
        const list = raw ? JSON.parse(raw) : SEED_REGISTRATIONS;
        return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      } catch (e) {
        return SEED_REGISTRATIONS;
      }
    },

    createRegistration(formData) {
      const list = this.getRegistrations();
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const ii = String(now.getMinutes()).padStart(2, '0');

      const newReg = {
        id: 'reg-' + Date.now(),
        refCode: generateRefCode(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        rtrw: formData.rtrw.trim(),
        reason: formData.reason.trim(),
        date: `${yyyy}-${mm}-${dd} ${hh}:${ii}`,
        status: 'Menunggu Verifikasi',
        notes: 'Pendaftaran otomatis tersimpan via portal web.'
      };

      list.unshift(newReg);
      localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(list));
      return newReg;
    },

    updateRegistration(id, updateData) {
      const list = this.getRegistrations();
      const idx = list.findIndex(r => r.id === id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...updateData };
        localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(list));
        return list[idx];
      }
      return null;
    },

    deleteRegistration(id) {
      let list = this.getRegistrations();
      list = list.filter(r => r.id !== id);
      localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(list));
      return list;
    },

    // ==================== AUTH & BRUTE FORCE LIMITER ====================
    getBruteForceStatus() {
      try {
        const raw = localStorage.getItem(KEYS.LOGIN_ATTEMPTS);
        if (!raw) return { attempts: 0, isLocked: false, remainingSeconds: 0 };
        const data = JSON.parse(raw);
        const now = Date.now();
        if (data.lockedUntil && data.lockedUntil > now) {
          const remaining = Math.ceil((data.lockedUntil - now) / 1000);
          return { attempts: data.attempts, isLocked: true, remainingSeconds: remaining };
        }
        if (data.lockedUntil && data.lockedUntil <= now) {
          // Reset lock setelah lewat waktu
          this.resetFailedAttempts();
          return { attempts: 0, isLocked: false, remainingSeconds: 0 };
        }
        return { attempts: data.attempts || 0, isLocked: false, remainingSeconds: 0 };
      } catch (e) {
        return { attempts: 0, isLocked: false, remainingSeconds: 0 };
      }
    },

    recordFailedAttempt() {
      let status = this.getBruteForceStatus();
      let attempts = status.attempts + 1;
      let lockedUntil = null;
      if (attempts >= 5) {
        // Kunci selama 30 detik
        lockedUntil = Date.now() + 30000;
      }
      const state = { attempts, lockedUntil };
      localStorage.setItem(KEYS.LOGIN_ATTEMPTS, JSON.stringify(state));
      return this.getBruteForceStatus();
    },

    resetFailedAttempts() {
      localStorage.removeItem(KEYS.LOGIN_ATTEMPTS);
    },

    login(username, password) {
      const brute = this.getBruteForceStatus();
      if (brute.isLocked) {
        return {
          success: false,
          locked: true,
          remainingSeconds: brute.remainingSeconds,
          message: `Terlalu banyak percobaan gagal. Silakan tunggu ${brute.remainingSeconds} detik.`
        };
      }

      let creds;
      try {
        creds = JSON.parse(localStorage.getItem(KEYS.ADMIN_CREDENTIALS)) || { username: 'admin', password: 'admin123' };
      } catch (e) {
        creds = { username: 'admin', password: 'admin123' };
      }

      const inputUser = (username || '').trim().toLowerCase();
      const inputPass = (password || '').trim();

      if (inputUser === creds.username.toLowerCase() && inputPass === creds.password) {
        this.resetFailedAttempts();
        const session = {
          loggedIn: true,
          username: creds.username,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify(session));
        return { success: true };
      } else {
        const state = this.recordFailedAttempt();
        return {
          success: false,
          locked: state.isLocked,
          remainingSeconds: state.remainingSeconds,
          attempts: state.attempts,
          message: state.isLocked
            ? `Terlalu banyak percobaan gagal. Akses formulir dikunci selama ${state.remainingSeconds} detik.`
            : `Username atau kata sandi tidak cocok. (Sisa percobaan: ${5 - state.attempts})`
        };
      }
    },

    checkAuth() {
      try {
        const raw = localStorage.getItem(KEYS.AUTH_SESSION);
        if (!raw) return false;
        const session = JSON.parse(raw);
        return !!(session && session.loggedIn);
      } catch (e) {
        return false;
      }
    },

    logout() {
      localStorage.removeItem(KEYS.AUTH_SESSION);
    }
  };

  // Jalankan inisialisasi awal
  Store.init();

  // Daftarkan ke window
  window.KMPStore = Store;

})(window);
