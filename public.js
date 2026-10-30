/**
 * public.js - Interaktivitas Halaman Publik Koperasi Merah Putih Ulujami
 * Mengelola Identitas Koperasi, Galeri Gambar Kustom, Profil Pengurus,
 * dan Alur Pendaftaran Calon Anggota WhatsApp Berprivasi Tinggi.
 */

document.addEventListener('DOMContentLoaded', () => {
  const Store = window.KMPStore;
  if (!Store) {
    console.error('KMPStore belum dimuat. Pastikan store.js dimuat sebelum public.js!');
    return;
  }

  // Elemen DOM Utama
  const elements = {
    // Profil & Header
    brandLogos: document.querySelectorAll('.brand-logo-img'),
    brandTitles: document.querySelectorAll('.brand-title-text'),
    brandSubtitles: document.querySelectorAll('.brand-subtitle-text'),
    heroTagline: document.getElementById('heroTagline'),
    legalBadges: document.querySelectorAll('.legal-badge-text'),
    navMenu: document.getElementById('navMenu'),
    navToggleBtn: document.getElementById('navToggleBtn'),
    
    // CMS Gambar Dinamis
    heroImageEl: document.getElementById('heroImageEl'),
    heroStatMembers: document.getElementById('heroStatMembers'),
    aboutBannerImg: document.getElementById('aboutBannerImg'),
    ctaSection: document.getElementById('ctaSection'),
    ctaWaBtn: document.getElementById('ctaWaBtn'),

    // Statistik Riil
    statMembers: document.getElementById('statMembers'),
    statRw: document.getElementById('statRw'),
    statSatisfaction: document.getElementById('statSatisfaction'),
    statAssets: document.getElementById('statAssets'),

    // Pengurus
    boardContainer: document.getElementById('boardContainer'),

    // Pendaftaran Anggota
    regForm: document.getElementById('registrationForm'),
    regSubmitBtn: document.getElementById('regSubmitBtn'),
    regSuccessModal: document.getElementById('regSuccessModal'),
    regSuccessCode: document.getElementById('regSuccessCode'),
    regSuccessSummary: document.getElementById('regSuccessSummary'),
    regWaBtn: document.getElementById('regWaBtn'),

    // Kontak & Operasional
    contactAddress: document.getElementById('contactAddress'),
    contactPhone: document.getElementById('contactPhone'),
    contactWaLink: document.getElementById('contactWaLink'),
    contactWaText: document.getElementById('contactWaText'),
    contactEmail: document.getElementById('contactEmail'),
    contactHours: document.getElementById('contactHours'),
    contactMapEmbed: document.getElementById('contactMapEmbed'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  // Helper Notifikasi Toast
  function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'warning' ? 'toast-warning' : ''}`;
    toast.style.cssText = `
      background: ${type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#3B82F6'};
      color: white; padding: 12px 20px; border-radius: 6px; margin-bottom: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 8px;
      transition: all 0.3s ease;
    `;
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${Store.sanitize(message)}</span>
    `;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Helper Set DOM Aman
  function setSafeText(el, text) {
    if (el && text) el.textContent = text;
  }

  // 1. Tampilkan Identitas & Gambar CMS Koperasi
  function renderProfile() {
    const profile = Store.getProfile();

    // Terapkan Logo & Skala Responsif
    const logoSrc = profile.logoUrl || profile.logo_url || Store.DEFAULT_LOGO_SVG;
    elements.brandLogos.forEach(img => {
      img.src = logoSrc;
      img.alt = profile.name || profile.coop_name || 'Logo Koperasi';
      if (img.closest('.site-header')) {
        img.style.height = (window.innerWidth <= 860 ? (profile.logoScaleMobile || profile.logo_scale_mobile || 38) : (profile.logoScaleDesktop || profile.logo_scale_desktop || 48)) + 'px';
      } else if (img.closest('.footer-brand')) {
        img.style.height = '42px';
      }
    });

    // Sinkronisasi Favicon Dinamis
    const favicon = document.querySelector("link[rel*='icon']");
    if (favicon) favicon.href = logoSrc;

    // Nama & Tagline
    const shortName = profile.shortName || profile.short_name || 'KKMP Ulujami';
    const fullName = profile.name || profile.coop_name || 'Koperasi Merah Putih Ulujami';
    
    elements.brandTitles.forEach(el => el.textContent = shortName);
    elements.brandSubtitles.forEach(el => el.textContent = fullName);
    setSafeText(elements.heroTagline, profile.tagline);
    
    const legalText = profile.legalBadge || profile.legal_badge;
    elements.legalBadges.forEach(el => el.textContent = legalText);

    // CMS Gambar
    const heroImg = profile.heroImageUrl || profile.hero_image_url;
    if (elements.heroImageEl && heroImg) elements.heroImageEl.src = heroImg;

    const aboutImg = profile.aboutBannerUrl || profile.about_banner_url;
    if (elements.aboutBannerImg && aboutImg) elements.aboutBannerImg.src = aboutImg;

    const ctaImg = profile.ctaBannerUrl || profile.cta_banner_url;
    if (elements.ctaSection) {
      if (ctaImg && ctaImg.trim() !== '') {
        elements.ctaSection.style.backgroundImage = `linear-gradient(rgba(143, 23, 34, 0.88), rgba(112, 15, 23, 0.92)), url('${ctaImg}')`;
        elements.ctaSection.style.backgroundPosition = 'center';
        elements.ctaSection.style.backgroundSize = 'cover';
        elements.ctaSection.style.backgroundRepeat = 'no-repeat';
      } else {
        elements.ctaSection.style.backgroundImage = 'none';
        elements.ctaSection.style.backgroundColor = 'var(--deep-burgundy)';
      }
    }

    // Statistik Riil
    const stats = profile.stats || {};
    const activeCount = stats.activeMembers || profile.stat_members || '348+';
    setSafeText(elements.statMembers, activeCount);
    setSafeText(elements.heroStatMembers, `${activeCount} Warga Ulujami`);
    setSafeText(elements.statRw, stats.rwCount || profile.stat_rw || '9');
    setSafeText(elements.statSatisfaction, stats.satisfaction || profile.stat_satisfaction || '100%');
    setSafeText(elements.statAssets, stats.assetTurnover || profile.stat_assets || 'Rp 1,45 M');

    // Kontak & Jam Operasional
    setSafeText(elements.contactAddress, profile.address);
    setSafeText(elements.contactHours, profile.operationalHours || profile.hours);
    setSafeText(elements.contactWaText, profile.phone);
    
    if (elements.contactPhone) {
      elements.contactPhone.textContent = profile.phone;
      elements.contactPhone.href = `tel:${(profile.phone || '').replace(/[^0-9]/g, '')}`;
    }

    const waNum = profile.whatsapp || '';
    if (elements.contactWaLink) {
      elements.contactWaLink.href = Store.buildWhatsAppUrl(waNum, 'Halo Pengurus Koperasi Merah Putih Ulujami, saya ingin berkonsultasi mengenai pendaftaran dan layanan koperasi.');
    }
    if (elements.ctaWaBtn) {
      elements.ctaWaBtn.href = Store.buildWhatsAppUrl(waNum, 'Halo Pengurus Koperasi Merah Putih Ulujami, saya ingin menanyakan informasi seputar keanggotaan koperasi.');
    }
    if (elements.contactEmail) {
      elements.contactEmail.textContent = profile.email;
      elements.contactEmail.href = `mailto:${profile.email}`;
    }
    const mapSrc = profile.mapsEmbed || profile.maps_embed;
    if (elements.contactMapEmbed && mapSrc) elements.contactMapEmbed.src = mapSrc;
  }

  // 2. Render Profil Pengurus & Dewan Pengawas
  function renderBoard() {
    if (!elements.boardContainer) return;
    const board = Store.getBoard();

    if (!board || board.length === 0) {
      elements.boardContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #fff; border-radius: 10px; border: 1px dashed #ccc;">
          <p style="color: #777; margin-bottom: 0;">Data struktur pengurus sedang disinkronkan.</p>
        </div>
      `;
      return;
    }

    elements.boardContainer.innerHTML = board.map(m => `
      <div class="board-card" style="text-align:center; padding:20px; background:#fff; border:1px solid #eee; border-radius:10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="margin: 0 auto 15px auto; width: 100px; height: 100px; overflow: hidden; border-radius: 50%;">
          <img src="${Store.sanitize(m.photo || m.photo_url || 'https://via.placeholder.com/150')}" alt="${Store.sanitize(m.name)}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
        </div>
        <h4 style="color: #8F1722; margin-bottom: 5px; font-size: 1.1rem;">${Store.sanitize(m.name)}</h4>
        <div style="font-size: 0.85rem; font-weight: 600; color: #333; margin-bottom: 4px;">${Store.sanitize(m.position)}</div>
        <div style="font-size: 0.75rem; color: #777; margin-bottom: 10px;">Periode: ${Store.sanitize(m.period)}</div>
        <p style="font-size: 0.85rem; line-height: 1.5; color: #555;">${Store.sanitize(m.bio || '')}</p>
      </div>
    `).join('');
  }

  // 3. Alur Pendaftaran Calon Anggota via WhatsApp
  function setupRegistrationFlow() {
    if (!elements.regForm) return;

    elements.regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = elements.regSubmitBtn;
      const originalBtnText = btn.innerHTML;
      btn.innerHTML = '<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Memproses...';
      btn.disabled = true;

      const fullName = document.getElementById('regFullName')?.value.trim() || '';
      const phone = document.getElementById('regPhone')?.value.trim() || '';
      const rtrw = document.getElementById('regRTRW')?.value.trim() || '';
      const reason = document.getElementById('regReason')?.value.trim() || '';

      if (!fullName || !phone || !rtrw || !reason) {
        showToast('Mohon lengkapi seluruh kolom formulir pendaftaran.', 'warning');
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
        return;
      }

      // Validasi Nomor WhatsApp
      const cleanedPhone = phone.replace(/[^0-9]/g, '');
      if (cleanedPhone.length < 9) {
        showToast('Format nomor WhatsApp tidak valid (minimal 9 digit angka).', 'warning');
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
        return;
      }

      try {
        // Simpan Pendaftaran (0ms Instant Local-first + Cloud Upsert)
        const savedReg = Store.createRegistration({
          fullName,
          phone,
          rtrw,
          reason
        });

        // Siapkan Pesan WhatsApp Terformat
        const profile = Store.getProfile();
        const waMsg = Store.Templates.memberRegistration(savedReg);
        const waUrl = Store.buildWhatsAppUrl(profile.whatsapp || profile.phone, waMsg);

        // Tampilkan Modal Sukses Pendaftaran & Rangkuman Data
        if (elements.regSuccessModal && elements.regSuccessCode && elements.regWaBtn) {
          elements.regSuccessCode.textContent = savedReg.refCode || savedReg.ref_code;

          if (elements.regSuccessSummary) {
            elements.regSuccessSummary.innerHTML = `
              <div style="font-weight: 700; color: #8F1722; margin-bottom: 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px;">Rangkuman Data Calon Anggota:</div>
              <div style="display: grid; grid-template-columns: 110px 1fr; gap: 4px; font-size: 0.85rem;">
                <span style="color: #666;">Nama Lengkap:</span>
                <strong>${Store.sanitize(fullName)}</strong>
                <span style="color: #666;">No. WhatsApp:</span>
                <span>${Store.sanitize(phone)}</span>
                <span style="color: #666;">Domisili:</span>
                <span>${Store.sanitize(rtrw)}</span>
                <span style="color: #666;">Alasan Minat:</span>
                <span>${Store.sanitize(reason)}</span>
              </div>
            `;
          }

          elements.regWaBtn.href = waUrl;
          elements.regSuccessModal.style.display = 'flex';
          elements.regSuccessModal.classList.add('active');
        }

        // Reset Formulir
        elements.regForm.reset();
        showToast('Formulir pendaftaran berhasil diproses & disimpan!', 'success');
      } catch (err) {
        showToast('Terjadi kesalahan saat memproses formulir. Coba lagi.', 'error');
        console.error(err);
      } finally {
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
      }
    });
  }

  // Tutup Semua Modal
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.classList.remove('active');
      m.style.display = 'none';
    });
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal-close-btn, .btn-modal-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Mobile Menu Toggle
  if (elements.navToggleBtn && elements.navMenu) {
    // Karena ID navMenu ada pada tag <ul>, kita harus memunculkan parent-nya (.site-nav)
    const siteNav = document.getElementById('mainNav');
    elements.navToggleBtn.addEventListener('click', () => {
      if (siteNav) siteNav.classList.toggle('active');
    });

    elements.navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (siteNav) siteNav.classList.remove('active');
      });
    });
  }

  // Inisialisasi Tampilan
  renderProfile();
  renderBoard();
  setupRegistrationFlow();

  // Dengarkan Pembaruan Data Cloud & Lokal
  window.addEventListener('kmp_data_synced', () => {
    renderProfile();
    renderBoard();
  });

  window.addEventListener('storage', (e) => {
    if (!e.key || e.key.startsWith('kmp_')) {
      renderProfile();
      renderBoard();
    }
  });

  // Listener Resize Logo
  window.addEventListener('resize', () => {
    const profile = Store.getProfile();
    elements.brandLogos.forEach(img => {
      if (img.closest('.site-header')) {
        img.style.height = (window.innerWidth <= 860 ? (profile.logoScaleMobile || profile.logo_scale_mobile || 38) : (profile.logoScaleDesktop || profile.logo_scale_desktop || 48)) + 'px';
      }
    });
  });
});
