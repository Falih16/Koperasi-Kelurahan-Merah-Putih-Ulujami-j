/**
 * store.js - Pusat Data Persisten (Hybrid: LocalStorage & Supabase Cloud PostgreSQL)
 * Koperasi Kelurahan Merah Putih Ulujami
 * Fokus: Portal Pendaftaran Anggota Berbasis WhatsApp & Full Custom Image CMS
 */

(function (window) {
  'use strict';

  // Kunci Penyimpanan localStorage
  const KEYS = {
    PROFILE: 'kmp_profile',
    BOARD: 'kmp_board_members',
    REGISTRATIONS: 'kmp_registrations',
    AUTH_SESSION: 'kmp_auth_session',
    LOGIN_ATTEMPTS: 'kmp_login_attempts',
    ADMIN_CREDENTIALS: 'kmp_admin_credentials',
    SUPABASE_CONFIG: 'kmp_supabase_config'
  };

  // Skrip SQL Lengkap Siap Pakai untuk Supabase SQL Editor
  const SUPABASE_SQL_SCHEMA = `-- SKRIP SKEMA DATABASE KOPERASI MERAH PUTIH ULUJAMI
-- Fokus: Portal Pendaftaran Warga & Full Image CMS

-- 1. TABEL: kmp_profile
CREATE TABLE IF NOT EXISTS kmp_profile (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  coop_name TEXT DEFAULT 'Koperasi Kelurahan Merah Putih Ulujami',
  short_name TEXT DEFAULT 'KKMP Ulujami',
  tagline TEXT DEFAULT 'Membangun kemandirian ekonomi lingkungan...',
  legal_badge TEXT DEFAULT 'Badan Hukum No: AHU-0012849.AH.01.26.TAHUN 2023',
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  hours TEXT,
  maps_embed TEXT,
  logo_url TEXT,
  logo_scale_desktop INTEGER DEFAULT 48,
  logo_scale_mobile INTEGER DEFAULT 38,
  hero_image_url TEXT,
  about_banner_url TEXT,
  cta_banner_url TEXT,
  cta_bg_url TEXT,
  stat_members TEXT DEFAULT '348+',
  stat_rw TEXT DEFAULT '9',
  stat_satisfaction TEXT DEFAULT '100%',
  stat_assets TEXT DEFAULT 'Rp 1,45 M',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL: kmp_board
CREATE TABLE IF NOT EXISTS kmp_board (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  period TEXT DEFAULT '2024 – 2027',
  display_order INTEGER DEFAULT 1,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL: kmp_registrations
CREATE TABLE IF NOT EXISTS kmp_registrations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ref_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  rt_rw TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'Menunggu Verifikasi',
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. KEAMANAN RLS
ALTER TABLE kmp_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmp_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE kmp_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Akses Publik" ON kmp_profile FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Akses Publik" ON kmp_board FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Akses Publik" ON kmp_registrations FOR ALL TO anon USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
`;

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
      <circle cx="100" cy="100" r="92" fill="url(#bgGrad)" stroke="#FFD54F" stroke-width="4"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4,3"/>
      
      <path d="M 50 145 C 80 165, 120 165, 150 145 L 146 135 C 120 152, 80 152, 54 135 Z" fill="#FFFFFF" opacity="0.95"/>
      <path d="M 50 145 C 80 165, 120 165, 150 145 L 148 152 C 120 172, 80 172, 52 152 Z" fill="#8F1722"/>

      <g fill="#FFE082" opacity="0.95">
        <circle cx="100" cy="85" r="30" fill="none" stroke="#FFE082" stroke-width="6"/>
        <circle cx="100" cy="85" r="16" fill="#8F1722"/>
        <path d="M 97 48 h 6 v 8 h -6 z M 97 114 h 6 v 8 h -6 z M 63 82 h 8 v 6 h -8 z M 129 82 h 8 v 6 h -8 z M 75 60 l 5 5 l -4 4 l -5 -5 z M 121 106 l 5 5 l -4 4 l -5 -5 z M 125 64 l -5 5 l -4 -4 l 5 -5 z M 79 110 l -5 5 l -4 -4 l 5 -5 z"/>
      </g>

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

      <polygon points="100,68 104,78 115,79 107,86 109,96 100,90 91,96 93,86 85,79 96,78" fill="url(#goldGrad)" stroke="#B78103" stroke-width="0.8"/>

      <text x="100" y="172" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="10.5" fill="#FFFFFF" letter-spacing="1">KOPERASI MERAH PUTIH</text>
      <text x="100" y="185" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="8.5" fill="#FFD54F" letter-spacing="1.5">KELURAHAN ULUJAMI</text>
    </svg>
  `)}`;

  // DATA BENIH AWAL (INITIAL SEED DATA LOKAL)
  const SEED_PROFILE = {
    name: 'Koperasi Kelurahan Merah Putih Ulujami',
    shortName: 'KKMP Ulujami',
    tagline: 'Wadah Gotong Royong Ekonomi Warga Menuju Kemandirian & Kesejahteraan Bersama',
    legalBadge: 'Badan Hukum No: AHU-0012849.AH.01.26.TAHUN 2023',
    address: 'Jl. Ulujami Raya No. 42, RT 05 / RW 01, Kelurahan Ulujami, Kecamatan Pesanggrahan, Kota Administrasi Jakarta Selatan, DKI Jakarta 12250',
    phone: '0812-8912-3456',
    whatsapp: '6281289123456',
    email: 'kontak@koperasimerahputih-ulujami.id',
    operationalHours: 'Senin – Sabtu: 08.00 – 17.00 WIB',
    mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15864.845814578508!2d106.7589255!3d-6.2358897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f10a80e7d013%3A0x6b7ca2c525f2ee3f!2sUlujami%2C%20Pesanggrahan%2C%20South%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
    logoUrl: '',
    logoScaleDesktop: 48,
    logoScaleMobile: 38,
    heroImageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    aboutBannerUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80',
    ctaBannerUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80',
    stats: {
      activeMembers: '348+',
      rwCount: '9',
      satisfaction: '100%',
      assetTurnover: 'Rp 1,45 M'
    }
  };

  const SEED_BOARD = [
    { id: 'board-1', name: 'H. Hendro Siswanto, S.E.', position: 'Ketua Koperasi', period: '2024 – 2027', order: 1, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', bio: 'Praktisi ekonomi kerakyatan.' },
    { id: 'board-2', name: 'Dra. Hj. Nuraini Wahyuni', position: 'Sekretaris', period: '2024 – 2027', order: 2, photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', bio: 'Tokoh penggerak perempuan.' },
    { id: 'board-3', name: 'Drs. M. Taufik Kurniawan', position: 'Bendahara', period: '2024 – 2027', order: 3, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', bio: 'Akuntan profesional.' }
  ];

  const SEED_REGISTRATIONS = [
    { id: 'reg-1', refCode: 'REG-KMPU-20241020-8391', fullName: 'Agus Supriyadi', phone: '081298765432', rtrw: 'RT 03 / RW 01', reason: 'Ingin partisipasi', date: '2024-10-20 09:15', status: 'Menunggu Verifikasi', notes: '' }
  ];

  // Helper Utilities
  function sanitize(str) {
    if (str === null || str === undefined) return '';
    const temp = document.createElement('div');
    temp.textContent = String(str);
    return temp.innerHTML;
  }

  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(number || 0);
  }

  function generateRefCode() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return `REG-KMPU-${yyyy}${mm}${dd}-${code}`;
  }

  function cleanPhoneWA(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) cleaned = '62' + cleaned.substring(1);
    else if (cleaned.startsWith('8')) cleaned = '62' + cleaned;
    return cleaned;
  }

  function buildWhatsAppUrl(targetPhone, message) {
    return `https://wa.me/${cleanPhoneWA(targetPhone)}?text=${encodeURIComponent(message)}`;
  }

  function isValidHttpUrl(str) {
    if (!str || typeof str !== 'string') return false;
    try {
      const url = new URL(str.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) { return false; }
  }

  function isValidAnonKey(key) {
    return typeof key === 'string' && key.trim().length >= 20;
  }

  function executeCloudQuery(queryPromise, actionLabel = 'Operasi Cloud') {
    return Promise.resolve(queryPromise)
      .then(({ data, error }) => {
        if (error) {
          console.error(`[Supabase ${actionLabel} Gagal]:`, error);
          return { success: false, error };
        }
        return { success: true, data };
      })
      .catch((err) => {
        console.error(`[Supabase ${actionLabel} Eksepsi]:`, err);
        return { success: false, error: err };
      });
  }

  const Templates = {
    memberRegistration(regData) {
      return `*PENDAFTARAN ANGGOTA BARU*\nKoperasi Kelurahan Merah Putih Ulujami\n\nYth. Tim Pengurus Koperasi,\nSaya telah melengkapi formulir pendaftaran melalui website resmi dengan rincian sbb:\n\n• *Kode Registrasi:* ${regData.refCode}\n• *Nama Lengkap:* ${regData.fullName}\n• *Nomor WhatsApp:* ${regData.phone}\n• *Domisili:* ${regData.rtrw}\n• *Alasan/Minat:* ${regData.reason}\n\nDemi perlindungan data pribadi, dokumen KTP/KK asli akan saya tunjukkan secara langsung saat verifikasi fisik di Sekretariat Koperasi.\n\nMohon petunjuk jadwal verifikasi dan langkah selanjutnya. Terima kasih!`;
    },
    adminFollowUps: {
      inviteVerification(applicant) { return `Halo Bapak/Ibu ${applicant.fullName},\n\nTerima kasih telah mendaftar menjadi calon anggota (Kode Registrasi: *${applicant.refCode}*).\n\nKami mengundang Bapak/Ibu untuk hadir verifikasi berkas dokumen identitas di Sekretariat Koperasi.\nMari bersama kita bangun kemandirian dan gotong royong ekonomi warga Ulujami!`; },
      reminderSchedule(applicant) { return `Salam hangat Bapak/Ibu ${applicant.fullName},\n\nMengingatkan kembali tindak lanjut verifikasi keanggotaan (Ref: *${applicant.refCode}*).\nSekretariat kami siap menyambut kehadiran Bapak/Ibu di hari kerja. Terima kasih.`; },
      approvalSuccess(applicant) { return `Selamat Bapak/Ibu ${applicant.fullName}! 🎉\n\nProses verifikasi (Ref: *${applicant.refCode}*) telah *SELESAI & RESMI DISETUJUI*.\nKini Anda terdaftar sebagai anggota penuh.`; },
      rejectionClarification(applicant) { return `Yth. Bapak/Ibu ${applicant.fullName},\n\nSehubungan dengan pendaftaran anggota Anda (Ref: *${applicant.refCode}*), terdapat persyaratan yang memerlukan klarifikasi.\nSilakan menghubungi pengurus kembali. Terima kasih.`; }
    }
  };

  // OBJEK UTAMA STORE
  let _supabaseInstance = null;
  let _syncPromise = null;

  const Store = {
    DEFAULT_LOGO_SVG,
    SUPABASE_SQL_SCHEMA,
    sanitize,
    formatRupiah,
    generateRefCode,
    cleanPhoneWA,
    buildWhatsAppUrl,
    isValidHttpUrl,
    isValidAnonKey,
    Templates,

    // Inisialisasi awal
    init() {
      if (!localStorage.getItem(KEYS.PROFILE)) localStorage.setItem(KEYS.PROFILE, JSON.stringify(SEED_PROFILE));
      if (!localStorage.getItem(KEYS.BOARD)) localStorage.setItem(KEYS.BOARD, JSON.stringify(SEED_BOARD));
      if (!localStorage.getItem(KEYS.REGISTRATIONS)) localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(SEED_REGISTRATIONS));
      if (!localStorage.getItem(KEYS.ADMIN_CREDENTIALS)) localStorage.setItem(KEYS.ADMIN_CREDENTIALS, JSON.stringify({ username: 'admin', password: 'admin123' }));

      const client = this.getSupabaseClient();
      if (client && this.isCloudEnabled()) {
        this.syncFromSupabase().catch(err => console.warn('[Supabase Sync Fallback]', err));
      }
    },

    // ==================== CONFIG & CLIENT SUPABASE ====================
    getSupabaseConfig() {
      const DEFAULT_CONFIG = { url: '', anonKey: '', isEnabled: false };
      try {
        const raw = localStorage.getItem(KEYS.SUPABASE_CONFIG);
        if (!raw) return DEFAULT_CONFIG;
        return JSON.parse(raw);
      } catch (e) { return DEFAULT_CONFIG; }
    },

    saveSupabaseConfig(cfg) {
      localStorage.setItem(KEYS.SUPABASE_CONFIG, JSON.stringify(cfg));
      _supabaseInstance = null; // reset client
      return cfg;
    },

    isCloudEnabled() {
      const cfg = this.getSupabaseConfig();
      return Boolean(cfg.isEnabled && isValidHttpUrl(cfg.url) && isValidAnonKey(cfg.anonKey) && window.supabase);
    },

    getSupabaseClient() {
      if (_supabaseInstance) return _supabaseInstance;
      const cfg = this.getSupabaseConfig();
      if (this.isCloudEnabled()) {
        try {
          _supabaseInstance = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: false } });
          return _supabaseInstance;
        } catch (e) { console.error('[Supabase Init]:', e); }
      }
      return null;
    },

    // Fungsi Pengunggahan Aset Gambar ke Storage Koperasi
    async uploadImageToStorage(fileElementId) {
      const fileInput = document.getElementById(fileElementId);
      if (!fileInput || fileInput.files.length === 0) return null;

      const client = this.getSupabaseClient();
      if (!client) return null;

      const file = fileInput.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      try {
        const { data, error } = await client.storage.from('koperasi-assets').upload(filePath, file, { upsert: true });
        if (error) throw error;
        const { data: publicData } = client.storage.from('koperasi-assets').getPublicUrl(filePath);
        return publicData.publicUrl;
      } catch (err) {
        console.error('Gagal upload gambar:', err);
        return null;
      }
    },

    // Sinkronisasi dari Cloud ke Lokal
    async syncFromSupabase() {
      if (_syncPromise) return _syncPromise;
      const client = this.getSupabaseClient();
      if (!client) return false;

      _syncPromise = (async () => {
        try {
          const [pRes, bRes, rRes] = await Promise.all([
            client.from('kmp_profile').select('*').limit(1),
            client.from('kmp_board').select('*'),
            client.from('kmp_registrations').select('*')
          ]);

          if (pRes.data && pRes.data.length > 0) {
            const r = pRes.data[0];
            const prof = {
              name: r.coop_name,
              shortName: r.short_name,
              tagline: r.tagline,
              legalBadge: r.legal_badge,
              address: r.address,
              phone: r.phone,
              whatsapp: r.whatsapp,
              email: r.email,
              operationalHours: r.hours,
              mapsEmbed: r.maps_embed,
              logoUrl: r.logo_url,
              logoScaleDesktop: r.logo_scale_desktop,
              logoScaleMobile: r.logo_scale_mobile,
              heroImageUrl: r.hero_image_url,
              aboutBannerUrl: r.about_banner_url,
              ctaBannerUrl: r.cta_banner_url,
              stats: {
                activeMembers: r.stat_members,
                rwCount: r.stat_rw,
                satisfaction: r.stat_satisfaction,
                assetTurnover: r.stat_assets
              }
            };
            localStorage.setItem(KEYS.PROFILE, JSON.stringify(prof));
          }

          if (bRes.data) {
            const board = bRes.data.map(b => ({ id: b.id, name: b.name, position: b.position, period: b.period, order: b.display_order, bio: b.bio, photo: b.photo_url }));
            localStorage.setItem(KEYS.BOARD, JSON.stringify(board));
          }

          if (rRes.data) {
            const regs = rRes.data.map(r => ({ id: r.id, refCode: r.ref_code, fullName: r.full_name, phone: r.phone, rtrw: r.rt_rw, reason: r.reason, date: r.created_at, status: r.status, notes: r.internal_notes }));
            localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(regs));
          }
          return true;
        } catch (err) {
          console.error('[Supabase Sync Error]:', err);
          return false;
        } finally { _syncPromise = null; }
      })();
      return _syncPromise;
    },

    // ==================== OPERASI CRUD ====================
    getProfile() {
      try { return JSON.parse(localStorage.getItem(KEYS.PROFILE)) || SEED_PROFILE; }
      catch { return SEED_PROFILE; }
    },

    getBoard() {
      try { return JSON.parse(localStorage.getItem(KEYS.BOARD)) || SEED_BOARD; }
      catch { return SEED_BOARD; }
    },

    getRegistrations() {
      try { return JSON.parse(localStorage.getItem(KEYS.REGISTRATIONS)) || SEED_REGISTRATIONS; }
      catch { return SEED_REGISTRATIONS; }
    },

    // ==================== AUTH & BRUTE FORCE ====================
    getBruteForceStatus() {
      try {
        const raw = localStorage.getItem(KEYS.LOGIN_ATTEMPTS);
        if (!raw) return { attempts: 0, isLocked: false, remainingSeconds: 0 };
        const data = JSON.parse(raw);
        const now = Date.now();
        if (data.lockedUntil && data.lockedUntil > now) {
          return { attempts: data.attempts, isLocked: true, remainingSeconds: Math.ceil((data.lockedUntil - now) / 1000) };
        }
        return { attempts: data.lockedUntil && data.lockedUntil <= now ? 0 : data.attempts, isLocked: false, remainingSeconds: 0 };
      } catch { return { attempts: 0, isLocked: false, remainingSeconds: 0 }; }
    },

    recordFailedAttempt() {
      const status = this.getBruteForceStatus();
      const attempts = (status.attempts || 0) + 1;
      const lockedUntil = attempts >= 5 ? Date.now() + 30 * 1000 : null; // Kunci 30 detik
      localStorage.setItem(KEYS.LOGIN_ATTEMPTS, JSON.stringify({ attempts, lockedUntil }));
      return { attempts, isLocked: attempts >= 5, remainingSeconds: attempts >= 5 ? 30 : 0 };
    },

    login(username, password) {
      const brute = this.getBruteForceStatus();
      if (brute.isLocked) return { success: false, locked: true, message: `Dikunci selama ${brute.remainingSeconds} detik.` };

      let creds = { username: 'admin', password: 'admin123' };
      if (username === creds.username && password === creds.password) {
        localStorage.removeItem(KEYS.LOGIN_ATTEMPTS);
        localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify({ loggedIn: true, user: username }));
        return { success: true };
      } else {
        const state = this.recordFailedAttempt();
        return { success: false, locked: state.isLocked, message: state.isLocked ? `Dikunci ${state.remainingSeconds} detik.` : `Kredensial salah. Sisa: ${5 - state.attempts}` };
      }
    },

    checkAuth() {
      try { return !!JSON.parse(localStorage.getItem(KEYS.AUTH_SESSION))?.loggedIn; }
      catch { return false; }
    },

    logout() {
      localStorage.removeItem(KEYS.AUTH_SESSION);
    }
  };

  Store.init();
  window.KMPStore = Store;

})(window);
