/**
 * public.js - Interaktivitas Halaman Publik Koperasi Merah Putih Ulujami
 * Mengelola filter produk, modal unit & produk, dan alur pendaftaran WhatsApp privasi tinggi.
 */

document.addEventListener('DOMContentLoaded', () => {
  const Store = window.KMPStore;
  if (!Store) {
    console.error('KMPStore belum dimuat.');
    return;
  }

  // State Halaman Publik
  const state = {
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
    activeModalProduct: null,
    productOrderQty: 1
  };

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
    // Stats
    statMembers: document.getElementById('statMembers'),
    statUnits: document.getElementById('statUnits'),
    statUmkm: document.getElementById('statUmkm'),
    statAssets: document.getElementById('statAssets'),
    // Unit Usaha
    unitsContainer: document.getElementById('unitsContainer'),
    unitModal: document.getElementById('unitModal'),
    unitModalContent: document.getElementById('unitModalContent'),
    // Produk
    filterPillsContainer: document.getElementById('filterPillsContainer'),
    productSearchInput: document.getElementById('productSearchInput'),
    productSortSelect: document.getElementById('productSortSelect'),
    productsContainer: document.getElementById('productsContainer'),
    productModal: document.getElementById('productModal'),
    productModalContent: document.getElementById('productModalContent'),
    // Pengurus
    boardContainer: document.getElementById('boardContainer'),
    // Pendaftaran
    regForm: document.getElementById('registrationForm'),
    regSuccessModal: document.getElementById('regSuccessModal'),
    regSuccessCode: document.getElementById('regSuccessCode'),
    regWaBtn: document.getElementById('regWaBtn'),
    // Kontak
    contactAddress: document.getElementById('contactAddress'),
    contactPhone: document.getElementById('contactPhone'),
    contactWaLink: document.getElementById('contactWaLink'),
    contactWaText: document.getElementById('contactWaText'),
    contactEmail: document.getElementById('contactEmail'),
    contactHours: document.getElementById('contactHours'),
    contactMapEmbed: document.getElementById('contactMapEmbed'),
    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  // Helper Notifikasi Toast
  function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'warning' ? 'toast-warning' : ''}`;
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
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // 1. Tampilkan Identitas & Profil Koperasi
  function renderProfile() {
    const profile = Store.getProfile();

    // Terapkan Logo & Skala
    const logoSrc = profile.logoUrl && profile.logoUrl.trim() !== '' ? profile.logoUrl : Store.DEFAULT_LOGO_SVG;
    elements.brandLogos.forEach(img => {
      img.src = logoSrc;
      img.alt = profile.name;
      if (window.innerWidth <= 860) {
        img.style.height = (profile.logoScaleMobile || 38) + 'px';
      } else {
        img.style.height = (profile.logoScaleDesktop || 48) + 'px';
      }
    });

    // Sinkronisasi Favicon Dinamis Sesuai Logo Resmi
    const favicon = document.querySelector("link[rel*='icon']");
    if (favicon && logoSrc) {
      favicon.href = logoSrc;
    }

    // Nama & Tagline
    elements.brandTitles.forEach(el => el.textContent = profile.shortName || 'KKMP Ulujami');
    elements.brandSubtitles.forEach(el => el.textContent = profile.name);
    if (elements.heroTagline) elements.heroTagline.textContent = profile.tagline;
    elements.legalBadges.forEach(el => el.textContent = profile.legalBadge);

    // Statistik Riil
    if (elements.statMembers) elements.statMembers.textContent = (profile.stats?.activeMembers || 348) + '+';
    if (elements.statUnits) elements.statUnits.textContent = profile.stats?.businessUnits || 4;
    if (elements.statUmkm) elements.statUmkm.textContent = (profile.stats?.umkmPartners || 52) + '+';
    if (elements.statAssets) elements.statAssets.textContent = profile.stats?.totalAsset || 'Rp 1,45 M';

    // Kontak & Jam Operasional
    if (elements.contactAddress) elements.contactAddress.textContent = profile.address;
    if (elements.contactPhone) {
      elements.contactPhone.textContent = profile.phone;
      elements.contactPhone.href = `tel:${profile.phone.replace(/[^0-9]/g, '')}`;
    }
    if (elements.contactWaText) elements.contactWaText.textContent = profile.phone;
    if (elements.contactWaLink) {
      elements.contactWaLink.href = Store.buildWhatsAppUrl(profile.whatsapp, 'Halo Pengurus Koperasi Merah Putih Ulujami, saya ingin berkonsultasi mengenai layanan koperasi.');
    }
    if (elements.contactEmail) {
      elements.contactEmail.textContent = profile.email;
      elements.contactEmail.href = `mailto:${profile.email}`;
    }
    if (elements.contactHours) elements.contactHours.textContent = profile.operationalHours;
    if (elements.contactMapEmbed && profile.mapsEmbed) elements.contactMapEmbed.src = profile.mapsEmbed;
  }

  // 2. Render Bidang Usaha
  function renderUnits() {
    if (!elements.unitsContainer) return;
    const units = Store.getUnits();

    elements.unitsContainer.innerHTML = units.map(unit => `
      <div class="unit-card" data-unit-id="${unit.id}">
        <div class="unit-card-img-wrapper">
          <img class="unit-card-img" src="${Store.sanitize(unit.image)}" alt="${Store.sanitize(unit.name)}" loading="lazy">
          <span class="unit-card-category-tag">${Store.sanitize(unit.category)}</span>
        </div>
        <div class="unit-card-body">
          <h3 class="unit-card-title">${Store.sanitize(unit.name)}</h3>
          <p class="unit-card-desc">${Store.sanitize(unit.description)}</p>
          <ul class="unit-meta-list">
            <li class="unit-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C92532" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Jam Operasional: <strong>${Store.sanitize(unit.hours)}</strong></span>
            </li>
            <li class="unit-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C92532" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>PJ: <strong>${Store.sanitize(unit.pic)}</strong></span>
            </li>
          </ul>
          <div class="unit-card-footer">
            <button class="btn btn-secondary btn-sm btn-unit-detail" data-id="${unit.id}">
              Detail Layanan & Fasilitas
            </button>
            <a href="${Store.buildWhatsAppUrl(unit.contact, `Halo Pengurus ${unit.name}, saya ingin menanyakan informasi layanan.`)}" target="_blank" class="btn btn-wa btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              Kontak Unit
            </a>
          </div>
        </div>
      </div>
    `).join('');

    // Pasang Event Detail Unit
    document.querySelectorAll('.btn-unit-detail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openUnitModal(id);
      });
    });
  }

  // Modal Detail Unit Usaha
  function openUnitModal(unitId) {
    const unit = Store.getUnitById(unitId);
    if (!unit || !elements.unitModal || !elements.unitModalContent) return;

    elements.unitModalContent.innerHTML = `
      <div style="margin-bottom: 20px; border-radius: var(--radius-lg); overflow: hidden; height: 220px;">
        <img src="${Store.sanitize(unit.image)}" alt="${Store.sanitize(unit.name)}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div style="margin-bottom: 12px;">
        <span class="tag-unit">${Store.sanitize(unit.category)}</span>
      </div>
      <h3 style="margin-bottom: 14px; font-size: 1.5rem;">${Store.sanitize(unit.name)}</h3>
      <p style="margin-bottom: 20px; font-size: 0.95rem; line-height: 1.6;">${Store.sanitize(unit.description)}</p>

      <h4 style="font-size: 1rem; color: var(--deep-burgundy); margin-bottom: 10px;">Keunggulan & Fasilitas Layanan:</h4>
      <ul style="list-style: none; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px;">
        ${(unit.features || []).map(f => `
          <li style="display: flex; align-items: center; gap: 10px; font-size: 0.9rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C92532" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${Store.sanitize(f)}</span>
          </li>
        `).join('')}
      </ul>

      <div style="background-color: var(--surface-alt); padding: 16px; border-radius: var(--radius-md); font-size: 0.875rem;">
        <div style="margin-bottom: 6px;"><strong>Penanggung Jawab:</strong> ${Store.sanitize(unit.pic)}</div>
        <div style="margin-bottom: 6px;"><strong>Jam Buka:</strong> ${Store.sanitize(unit.hours)}</div>
        <div><strong>Hotline WhatsApp:</strong> ${Store.sanitize(unit.contact)}</div>
      </div>
    `;

    // Set link tombol kontak di footer modal
    const modalWaBtn = elements.unitModal.querySelector('.btn-modal-wa');
    if (modalWaBtn) {
      modalWaBtn.href = Store.buildWhatsAppUrl(unit.contact, `Halo Pengurus ${unit.name}, saya ingin berkonsultasi mengenai layanan unit usaha.`);
    }

    elements.unitModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // 3. Render Filter Kategori Produk
  function renderCategoryFilters() {
    if (!elements.filterPillsContainer) return;
    const categories = Store.getCategories();

    let pillsHtml = `
      <button class="filter-pill ${state.selectedCategory === 'all' ? 'active' : ''}" data-category="all">
        Semua Produk
      </button>
    `;

    pillsHtml += categories.map(cat => `
      <button class="filter-pill ${state.selectedCategory === cat.slug ? 'active' : ''}" data-category="${cat.slug}">
        ${Store.sanitize(cat.name)}
      </button>
    `).join('');

    elements.filterPillsContainer.innerHTML = pillsHtml;

    // Pasang Event Filter Pill
    elements.filterPillsContainer.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        elements.filterPillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.selectedCategory = e.currentTarget.getAttribute('data-category');
        renderProducts();
      });
    });
  }

  // 4. Render Katalog Produk Terintegrasi WhatsApp
  function renderProducts() {
    if (!elements.productsContainer) return;
    let products = Store.getProducts().filter(p => p.isPublished !== false);

    // Filter Kategori
    if (state.selectedCategory !== 'all') {
      products = products.filter(p => p.category === state.selectedCategory);
    }

    // Pencarian Live (Judul / Deskripsi)
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Pengurutan (Sorting)
    if (state.sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else {
      // Default: Produk featured di atas
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    if (products.length === 0) {
      elements.productsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--pure-white); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" stroke-width="1.5" style="margin: 0 auto 12px auto;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h4 style="font-size: 1.15rem; margin-bottom: 6px;">Tidak ada produk yang cocok</h4>
          <p style="font-size: 0.9rem;">Coba gunakan kata kunci pencarian lain atau pilih kategori Semua Produk.</p>
        </div>
      `;
      return;
    }

    elements.productsContainer.innerHTML = products.map(prod => `
      <div class="product-card" data-prod-id="${prod.id}">
        <div class="product-card-img-wrapper">
          <img class="product-card-img" src="${Store.sanitize(prod.image)}" alt="${Store.sanitize(prod.name)}" loading="lazy">
          ${prod.featured ? '<span class="product-badge-featured">Unggulan</span>' : ''}
          <span class="product-stock-badge">Stok: ${prod.stock}</span>
        </div>
        <div class="product-card-body">
          <span class="product-category-name">${Store.sanitize(prod.category)}</span>
          <h4 class="product-title">${Store.sanitize(prod.name)}</h4>
          <div class="product-price">${Store.formatRupiah(prod.price)}</div>
          <div class="product-card-actions">
            <button class="btn btn-wa btn-sm btn-quick-order" data-id="${prod.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              Pesan via WA
            </button>
            <button class="btn btn-secondary btn-sm btn-icon-only btn-product-detail" data-id="${prod.id}" title="Detail Produk">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Pasang Event Buka Detail / Pesan Langsung
    document.querySelectorAll('.btn-product-detail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openProductModal(id);
      });
    });

    document.querySelectorAll('.btn-quick-order').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openProductModal(id);
      });
    });
  }

  // Modal Detail & Pemesanan Produk via WhatsApp
  function openProductModal(prodId) {
    const prod = Store.getProductById(prodId);
    if (!prod || !elements.productModal || !elements.productModalContent) return;

    state.activeModalProduct = prod;
    state.productOrderQty = 1;
    const profile = Store.getProfile();

    elements.productModalContent.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 24px; margin-bottom: 24px;">
        <div style="border-radius: var(--radius-lg); overflow: hidden; height: 260px; background-color: #F3F4F6;">
          <img src="${Store.sanitize(prod.image)}" alt="${Store.sanitize(prod.name)}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div>
          <span class="tag-unit" style="margin-bottom: 8px;">${Store.sanitize(prod.category)}</span>
          <h3 style="font-size: 1.35rem; margin-bottom: 10px;">${Store.sanitize(prod.name)}</h3>
          <div style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--primary-red); font-weight: 700; margin-bottom: 12px;">
            ${Store.formatRupiah(prod.price)}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
            Status Ketersediaan: <strong style="color: #065F46;">Stok Siap (${prod.stock} unit)</strong>
          </div>
          <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-dark);">${Store.sanitize(prod.description)}</p>
        </div>
      </div>

      <!-- Formulir Pemesanan Langsung WhatsApp -->
      <div style="background-color: var(--surface-alt); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <h4 style="font-size: 1.05rem; margin-bottom: 14px; color: var(--deep-burgundy);">Formulir Pemesanan Cepat:</h4>
        
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
          <label style="font-size: 0.9rem; font-weight: 600;">Jumlah Pesanan:</label>
          <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: #FFF;">
            <button type="button" id="qtyMinusBtn" style="width: 36px; height: 36px; border: none; background: none; font-size: 1.2rem; cursor: pointer;">-</button>
            <span id="qtyDisplay" style="width: 44px; text-align: center; font-weight: 700;">1</span>
            <button type="button" id="qtyPlusBtn" style="width: 36px; height: 36px; border: none; background: none; font-size: 1.2rem; cursor: pointer;">+</button>
          </div>
          <span style="font-size: 0.95rem; font-weight: 700; color: var(--deep-burgundy); margin-left: auto;" id="modalTotalPrice">
            Total: ${Store.formatRupiah(prod.price)}
          </span>
        </div>

        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label">Nama Pemesan <span class="req">*</span></label>
          <input type="text" id="orderBuyerName" class="form-control" placeholder="Contoh: Bpk. Bambang Sutrisno">
        </div>

        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label">Alamat / RT-RW di Ulujami <span class="req">*</span></label>
          <input type="text" id="orderBuyerAddress" class="form-control" placeholder="Contoh: Jl. Ulujami Indah RT 04 / RW 02">
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">Catatan Tambahan (Opsional)</label>
          <input type="text" id="orderNote" class="form-control" placeholder="Contoh: Tolong diantar sore setelah jam 16.00 WIB">
        </div>

        <button type="button" id="btnSubmitWaOrder" class="btn btn-wa" style="width: 100%;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
          Kirim Pesanan ke WhatsApp Koperasi
        </button>
      </div>
    `;

    // Interaktivitas Qty
    const qtyMinusBtn = document.getElementById('qtyMinusBtn');
    const qtyPlusBtn = document.getElementById('qtyPlusBtn');
    const qtyDisplay = document.getElementById('qtyDisplay');
    const modalTotalPrice = document.getElementById('modalTotalPrice');

    function updateQty(newQty) {
      if (newQty < 1) newQty = 1;
      if (newQty > prod.stock) newQty = prod.stock;
      state.productOrderQty = newQty;
      qtyDisplay.textContent = newQty;
      modalTotalPrice.textContent = 'Total: ' + Store.formatRupiah(prod.price * newQty);
    }

    qtyMinusBtn.addEventListener('click', () => updateQty(state.productOrderQty - 1));
    qtyPlusBtn.addEventListener('click', () => updateQty(state.productOrderQty + 1));

    // Kirim Order via WhatsApp
    document.getElementById('btnSubmitWaOrder').addEventListener('click', () => {
      const buyerName = document.getElementById('orderBuyerName').value.trim();
      const buyerAddress = document.getElementById('orderBuyerAddress').value.trim();
      const note = document.getElementById('orderNote').value.trim();

      if (!buyerName || !buyerAddress) {
        showToast('Mohon lengkapi Nama Pemesan dan Alamat/RT-RW terlebih dahulu.', 'warning');
        return;
      }

      const msg = Store.Templates.productOrder(prod, state.productOrderQty, buyerName, buyerAddress, note);
      const url = Store.buildWhatsAppUrl(profile.whatsapp, msg);

      window.open(url, '_blank');
      closeAllModals();
      showToast('Pemesanan dialihkan ke WhatsApp resmi koperasi.', 'success');
    });

    elements.productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // 5. Render Struktur Pengurus
  function renderBoard() {
    if (!elements.boardContainer) return;
    const board = Store.getBoard();

    elements.boardContainer.innerHTML = board.map(m => `
      <div class="board-card">
        <div class="board-photo-wrapper">
          <img class="board-photo" src="${Store.sanitize(m.photo)}" alt="${Store.sanitize(m.name)}" loading="lazy">
        </div>
        <h4 class="board-name">${Store.sanitize(m.name)}</h4>
        <div class="board-position">${Store.sanitize(m.position)}</div>
        <div class="board-period">${Store.sanitize(m.period)}</div>
        <p class="board-bio">${Store.sanitize(m.bio)}</p>
      </div>
    `).join('');
  }

  // 6. Alur Pendaftaran Anggota via WhatsApp (Kebijakan Privasi Tinggi)
  function setupRegistrationFlow() {
    if (!elements.regForm) return;

    elements.regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('regFullName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const rtrw = document.getElementById('regRTRW').value.trim();
      const reason = document.getElementById('regReason').value.trim();

      if (!fullName || !phone || !rtrw || !reason) {
        showToast('Mohon lengkapi seluruh kolom formulir.', 'warning');
        return;
      }

      // Validasi nomor WhatsApp
      const cleaned = phone.replace(/[^0-9]/g, '');
      if (cleaned.length < 9) {
        showToast('Format nomor WhatsApp tidak valid (minimal 9 digit).', 'warning');
        return;
      }

      // Simpan ke Store (Auto-Persist Local-first + Cloud Supabase)
      const savedReg = Store.createRegistration({ fullName, phone, rtrw, reason });

      // Siapkan Pesan WhatsApp Terstruktur
      const profile = Store.getProfile();
      const waMsg = Store.Templates.memberRegistration(savedReg);
      const waUrl = Store.buildWhatsAppUrl(profile.whatsapp, waMsg);

      // Tampilkan Modal Sukses Pendaftaran & Rangkuman Data
      if (elements.regSuccessModal && elements.regSuccessCode && elements.regWaBtn) {
        elements.regSuccessCode.textContent = savedReg.refCode;

        const summaryEl = document.getElementById('regSuccessSummary');
        if (summaryEl) {
          summaryEl.innerHTML = `
            <div style="font-weight: 700; color: var(--deep-burgundy); margin-bottom: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">Rangkuman Data Calon Anggota:</div>
            <div style="display: grid; grid-template-columns: 110px 1fr; gap: 4px;">
              <span style="color: var(--text-muted);">Nama Lengkap:</span>
              <strong>${Store.sanitize(savedReg.fullName)}</strong>
              <span style="color: var(--text-muted);">No. WhatsApp:</span>
              <span>${Store.sanitize(savedReg.phone)}</span>
              <span style="color: var(--text-muted);">Domisili:</span>
              <span>${Store.sanitize(savedReg.rtrw)}</span>
              <span style="color: var(--text-muted);">Alasan Minat:</span>
              <span>${Store.sanitize(savedReg.reason)}</span>
            </div>
          `;
        }

        elements.regWaBtn.onclick = () => {
          window.open(waUrl, '_blank');
        };
        elements.regSuccessModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Reset Formulir
      elements.regForm.reset();
      showToast('Formulir pendaftaran berhasil diproses & disimpan!', 'success');
    });
  }

  // Tutup Semua Modal
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  // Event Listener Penutup Modal (Tombol silang & overlay klik)
  document.querySelectorAll('.modal-close-btn, .btn-modal-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Mobile Menu Toggle
  if (elements.navToggleBtn && elements.navMenu) {
    elements.navToggleBtn.addEventListener('click', () => {
      elements.navMenu.classList.toggle('open');
    });

    elements.navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        elements.navMenu.classList.remove('open');
      });
    });
  }

  // Event Filter Live Search & Sort
  if (elements.productSearchInput) {
    elements.productSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  if (elements.productSortSelect) {
    elements.productSortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Inisialisasi Tampilan
  renderProfile();
  renderUnits();
  renderCategoryFilters();
  renderProducts();
  renderBoard();
  setupRegistrationFlow();

  // Dengarkan Pembaruan Data Cloud dari Supabase
  window.addEventListener('kmp_data_synced', () => {
    renderProfile();
    renderUnits();
    renderCategoryFilters();
    renderProducts();
    renderBoard();
  });

  // Dengarkan perubahan ukuran jendela untuk penyesuaian tinggi logo mobile/desktop
  window.addEventListener('resize', () => {
    const profile = Store.getProfile();
    elements.brandLogos.forEach(img => {
      img.style.height = (window.innerWidth <= 860 ? profile.logoScaleMobile || 38 : profile.logoScaleDesktop || 48) + 'px';
    });
  });
});
