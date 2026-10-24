/**
 * admin.js - Controller Dashboard Pengurus Koperasi Merah Putih Ulujami
 * Mengelola 7 Modul: Overview KPI, Follow-Up Pendaftaran WhatsApp, Produk,
 * Kategori, Unit Usaha, Pengurus, dan Pengaturan Identitas/Logo.
 */

document.addEventListener('DOMContentLoaded', () => {
  const Store = window.KMPStore;
  if (!Store) {
    console.error('KMPStore belum dimuat.');
    return;
  }

  // 1. Verifikasi Sesi Login
  if (!Store.checkAuth()) {
    window.location.href = 'login.html';
    return;
  }

  // State Manajemen Dashboard
  const state = {
    currentTab: 'overview',
    regFilterStatus: 'all',
    regSearch: '',
    prodFilterCat: 'all',
    prodSearch: '',
    activeFollowUpApplicant: null
  };

  // Elemen DOM
  const elements = {
    // Navigasi Tab
    navLinks: document.querySelectorAll('.admin-nav-link'),
    tabPanes: document.querySelectorAll('.admin-tab-pane'),
    pageTitle: document.getElementById('adminPageTitle'),
    mobileMenuBtn: document.getElementById('adminMobileMenuBtn'),
    sidebar: document.getElementById('adminSidebar'),
    logoutBtn: document.getElementById('adminLogoutBtn'),
    pendingBadge: document.getElementById('navPendingBadge'),
    // KPI Overview
    kpiApplicants: document.getElementById('kpiApplicants'),
    kpiPending: document.getElementById('kpiPending'),
    kpiProducts: document.getElementById('kpiProducts'),
    kpiUnits: document.getElementById('kpiUnits'),
    recentRegsTable: document.getElementById('recentRegsTableBody'),
    // Modul Pendaftaran
    regTableBody: document.getElementById('regTableBody'),
    regSearchInput: document.getElementById('regSearchInput'),
    regStatusSelect: document.getElementById('regStatusSelect'),
    followUpModal: document.getElementById('followUpModal'),
    followUpApplicantName: document.getElementById('followUpApplicantName'),
    followUpRefCode: document.getElementById('followUpRefCode'),
    followUpTemplateSelect: document.getElementById('followUpTemplateSelect'),
    followUpMessagePreview: document.getElementById('followUpMessagePreview'),
    btnSendFollowUpWa: document.getElementById('btnSendFollowUpWa'),
    // Modul Produk
    prodTableBody: document.getElementById('prodTableBody'),
    prodSearchInput: document.getElementById('prodSearchInput'),
    prodCatFilterSelect: document.getElementById('prodCatFilterSelect'),
    btnAddProduct: document.getElementById('btnAddProduct'),
    prodModal: document.getElementById('prodModal'),
    prodModalTitle: document.getElementById('prodModalTitle'),
    prodForm: document.getElementById('prodForm'),
    // Modul Kategori
    catTableBody: document.getElementById('catTableBody'),
    btnAddCategory: document.getElementById('btnAddCategory'),
    catModal: document.getElementById('catModal'),
    catForm: document.getElementById('catForm'),
    // Modul Unit Usaha
    unitTableBody: document.getElementById('unitTableBody'),
    btnAddUnit: document.getElementById('btnAddUnit'),
    unitModal: document.getElementById('unitModal'),
    unitForm: document.getElementById('unitForm'),
    // Modul Pengurus
    boardTableBody: document.getElementById('boardTableBody'),
    btnAddBoard: document.getElementById('btnAddBoard'),
    boardModal: document.getElementById('boardModal'),
    boardForm: document.getElementById('boardForm'),
    // Modul Identitas & Logo
    settingsForm: document.getElementById('settingsForm'),
    btnResetIdentity: document.getElementById('btnResetIdentity'),
    logoFileInput: document.getElementById('logoFileInput'),
    logoUrlInput: document.getElementById('logoUrlInput'),
    sliderDesktopScale: document.getElementById('sliderDesktopScale'),
    sliderMobileScale: document.getElementById('sliderMobileScale'),
    valDesktopScale: document.getElementById('valDesktopScale'),
    valMobileScale: document.getElementById('valMobileScale'),
    previewDesktopImg: document.getElementById('previewDesktopImg'),
    previewMobileImg: document.getElementById('previewMobileImg'),
    previewDesktopName: document.getElementById('previewDesktopName'),
    previewMobileName: document.getElementById('previewMobileName'),
    // Toast Container
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

  // ==================== NAVIGASI TAB MODUL ====================
  function switchTab(tabId) {
    state.currentTab = tabId;

    elements.navLinks.forEach(link => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
        if (elements.pageTitle) {
          elements.pageTitle.textContent = link.getAttribute('data-title') || 'Dashboard';
        }
      } else {
        link.classList.remove('active');
      }
    });

    elements.tabPanes.forEach(pane => {
      if (pane.id === `tab-${tabId}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Refresh data tab aktif
    if (tabId === 'overview') renderOverview();
    else if (tabId === 'registrations') renderRegistrations();
    else if (tabId === 'products') renderProducts();
    else if (tabId === 'categories') renderCategories();
    else if (tabId === 'units') renderUnits();
    else if (tabId === 'board') renderBoard();
    else if (tabId === 'settings') renderSettings();

    // Tutup mobile sidebar
    if (elements.sidebar) elements.sidebar.classList.remove('open');
  }

  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  if (elements.mobileMenuBtn && elements.sidebar) {
    elements.mobileMenuBtn.addEventListener('click', () => {
      elements.sidebar.classList.toggle('open');
    });
  }

  // Logout
  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin keluar dari Portal Pengurus?')) {
        Store.logout();
        window.location.href = 'login.html';
      }
    });
  }

  // ==================== MODUL 1: DASHBOARD OVERVIEW (KPI) ====================
  function renderOverview() {
    const regs = Store.getRegistrations();
    const prods = Store.getProducts();
    const units = Store.getUnits();
    const pendingList = regs.filter(r => r.status === 'Menunggu Verifikasi');

    if (elements.kpiApplicants) elements.kpiApplicants.textContent = regs.length;
    if (elements.kpiPending) elements.kpiPending.textContent = pendingList.length;
    if (elements.kpiProducts) elements.kpiProducts.textContent = prods.length;
    if (elements.kpiUnits) elements.kpiUnits.textContent = units.length;

    // Update badge di nav
    if (elements.pendingBadge) {
      elements.pendingBadge.textContent = pendingList.length;
      elements.pendingBadge.style.display = pendingList.length > 0 ? 'inline-block' : 'none';
    }

    // Tabel 5 Pendaftar Terbaru
    if (elements.recentRegsTable) {
      const recent = regs.slice(0, 5);
      if (recent.length === 0) {
        elements.recentRegsTable.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px;">Belum ada pendaftaran masuk.</td></tr>`;
      } else {
        elements.recentRegsTable.innerHTML = recent.map(r => `
          <tr>
            <td><strong>${Store.sanitize(r.refCode)}</strong></td>
            <td>${Store.sanitize(r.fullName)}</td>
            <td>${Store.sanitize(r.rtrw)}</td>
            <td><span class="status-pill status-${r.status.toLowerCase().replace(/\s+/g, '-')}">${Store.sanitize(r.status)}</span></td>
            <td>${Store.sanitize(r.date)}</td>
            <td>
              <button class="btn btn-wa btn-sm btn-quick-followup" data-id="${r.id}">
                Follow-up WA
              </button>
            </td>
          </tr>
        `).join('');

        elements.recentRegsTable.querySelectorAll('.btn-quick-followup').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openFollowUpModal(id);
          });
        });
      }
    }
  }

  // ==================== MODUL 2: TINDAK LANJUT PENDAFTARAN WA ====================
  function renderRegistrations() {
    if (!elements.regTableBody) return;
    let list = Store.getRegistrations();

    // Filter status
    if (state.regFilterStatus !== 'all') {
      list = list.filter(r => r.status === state.regFilterStatus);
    }

    // Filter pencarian
    if (state.regSearch.trim() !== '') {
      const q = state.regSearch.toLowerCase();
      list = list.filter(r =>
        r.refCode.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.rtrw.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    }

    if (list.length === 0) {
      elements.regTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px;">Tidak ada data pendaftaran yang sesuai kriteria.</td></tr>`;
      return;
    }

    elements.regTableBody.innerHTML = list.map(r => `
      <tr>
        <td>
          <span style="font-weight: 700; color: var(--deep-burgundy);">${Store.sanitize(r.refCode)}</span>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${Store.sanitize(r.date)}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${Store.sanitize(r.fullName)}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${Store.sanitize(r.phone)}</div>
        </td>
        <td>${Store.sanitize(r.rtrw)}</td>
        <td>
          <div style="font-size: 0.85rem; max-width: 200px; white-space: normal;">${Store.sanitize(r.reason)}</div>
        </td>
        <td>
          <select class="form-control status-changer" data-id="${r.id}" style="padding: 4px 8px; font-size: 0.8rem; width: auto;">
            <option value="Menunggu Verifikasi" ${r.status === 'Menunggu Verifikasi' ? 'selected' : ''}>Menunggu Verifikasi</option>
            <option value="Diverifikasi" ${r.status === 'Diverifikasi' ? 'selected' : ''}>Diverifikasi</option>
            <option value="Selesai" ${r.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
            <option value="Ditolak" ${r.status === 'Ditolak' ? 'selected' : ''}>Ditolak</option>
          </select>
        </td>
        <td>
          <input type="text" class="form-control note-editor" data-id="${r.id}" value="${Store.sanitize(r.notes || '')}" placeholder="Catatan internal..." style="padding: 4px 8px; font-size: 0.8rem; min-width: 140px;">
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-wa btn-sm btn-open-followup" data-id="${r.id}" title="Kirim Pesan WhatsApp">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              WA
            </button>
            <button class="btn btn-secondary btn-sm btn-icon-only btn-delete-reg" data-id="${r.id}" title="Hapus Data">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Event Ganti Status Langsung
    elements.regTableBody.querySelectorAll('.status-changer').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        Store.updateRegistration(id, { status: newStatus });
        showToast(`Status berhasil diubah menjadi "${newStatus}"`, 'success');
        renderOverview();
      });
    });

    // Event Simpan Catatan Internal
    elements.regTableBody.querySelectorAll('.note-editor').forEach(inp => {
      inp.addEventListener('blur', (e) => {
        const id = e.target.getAttribute('data-id');
        const notes = e.target.value.trim();
        Store.updateRegistration(id, { notes });
        showToast('Catatan internal tersimpan.', 'success');
      });
    });

    // Event Buka Modal Follow-up WA
    elements.regTableBody.querySelectorAll('.btn-open-followup').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openFollowUpModal(id);
      });
    });

    // Event Hapus Pendaftar
    elements.regTableBody.querySelectorAll('.btn-delete-reg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin menghapus arsip pendaftar ini?')) {
          Store.deleteRegistration(id);
          showToast('Data pendaftar telah dihapus.', 'info');
          renderRegistrations();
          renderOverview();
        }
      });
    });
  }

  // Modal 4 Template Pesan WhatsApp Follow-up
  function openFollowUpModal(regId) {
    const list = Store.getRegistrations();
    const applicant = list.find(r => r.id === regId);
    if (!applicant || !elements.followUpModal) return;

    state.activeFollowUpApplicant = applicant;

    if (elements.followUpApplicantName) elements.followUpApplicantName.textContent = applicant.fullName;
    if (elements.followUpRefCode) elements.followUpRefCode.textContent = applicant.refCode;

    updateFollowUpPreview();
    elements.followUpModal.classList.add('active');
  }

  function updateFollowUpPreview() {
    if (!state.activeFollowUpApplicant || !elements.followUpTemplateSelect || !elements.followUpMessagePreview) return;
    const applicant = state.activeFollowUpApplicant;
    const templateKey = elements.followUpTemplateSelect.value;
    const tmplFn = Store.Templates.adminFollowUps[templateKey];

    let messageText = '';
    if (typeof tmplFn === 'function') {
      messageText = tmplFn(applicant);
    }
    elements.followUpMessagePreview.value = messageText;
  }

  if (elements.followUpTemplateSelect) {
    elements.followUpTemplateSelect.addEventListener('change', updateFollowUpPreview);
  }

  if (elements.btnSendFollowUpWa) {
    elements.btnSendFollowUpWa.addEventListener('click', () => {
      if (!state.activeFollowUpApplicant) return;
      const text = elements.followUpMessagePreview.value.trim();
      const phone = state.activeFollowUpApplicant.phone;
      const url = Store.buildWhatsAppUrl(phone, text);

      window.open(url, '_blank');
      closeAllModals();
      showToast('Pesan WhatsApp siap dikirimkan kepada calon anggota.', 'success');
    });
  }

  if (elements.regSearchInput) {
    elements.regSearchInput.addEventListener('input', (e) => {
      state.regSearch = e.target.value;
      renderRegistrations();
    });
  }

  if (elements.regStatusSelect) {
    elements.regStatusSelect.addEventListener('change', (e) => {
      state.regFilterStatus = e.target.value;
      renderRegistrations();
    });
  }

  // ==================== MODUL 3: MANAJEMEN PRODUK ====================
  function renderProducts() {
    if (!elements.prodTableBody) return;
    let list = Store.getProducts();
    const categories = Store.getCategories();
    const units = Store.getUnits();

    // Sinkron dropdown kategori filter
    if (elements.prodCatFilterSelect) {
      const currentVal = elements.prodCatFilterSelect.value;
      elements.prodCatFilterSelect.innerHTML = `<option value="all">Semua Kategori</option>` +
        categories.map(c => `<option value="${c.slug}" ${currentVal === c.slug ? 'selected' : ''}>${Store.sanitize(c.name)}</option>`).join('');
    }

    if (state.prodFilterCat !== 'all') {
      list = list.filter(p => p.category === state.prodFilterCat);
    }

    if (state.prodSearch.trim() !== '') {
      const q = state.prodSearch.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }

    if (list.length === 0) {
      elements.prodTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px;">Tidak ada produk terdaftar.</td></tr>`;
      return;
    }

    elements.prodTableBody.innerHTML = list.map(p => {
      const unitObj = units.find(u => u.id === p.unitId);
      return `
        <tr>
          <td>
            <img src="${Store.sanitize(p.image)}" alt="${Store.sanitize(p.name)}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover;">
          </td>
          <td>
            <div style="font-weight: 700; color: var(--deep-burgundy);">${Store.sanitize(p.name)}</div>
            ${p.featured ? '<span class="product-badge-featured" style="position:static; display:inline-block; margin-top:2px;">Unggulan</span>' : ''}
          </td>
          <td><span class="tag-unit">${Store.sanitize(p.category)}</span></td>
          <td>${unitObj ? Store.sanitize(unitObj.name) : '-'}</td>
          <td><strong>${Store.formatRupiah(p.price)}</strong></td>
          <td>${p.stock}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm btn-icon-only btn-edit-prod" data-id="${p.id}" title="Edit Produk">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-secondary btn-sm btn-icon-only btn-delete-prod" data-id="${p.id}" title="Hapus Produk">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Event Edit & Hapus Produk
    elements.prodTableBody.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openProductFormModal(id);
      });
    });

    elements.prodTableBody.querySelectorAll('.btn-delete-prod').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Hapus produk ini dari katalog?')) {
          Store.deleteProduct(id);
          showToast('Produk berhasil dihapus.', 'info');
          renderProducts();
          renderOverview();
        }
      });
    });
  }

  // Modal Tambah/Edit Produk
  function openProductFormModal(prodId = null) {
    if (!elements.prodModal || !elements.prodForm) return;

    const categories = Store.getCategories();
    const units = Store.getUnits();

    // Isi Opsi Kategori & Unit Usaha
    const catSelect = document.getElementById('prodFormCategory');
    const unitSelect = document.getElementById('prodFormUnit');

    catSelect.innerHTML = categories.map(c => `<option value="${c.slug}">${Store.sanitize(c.name)}</option>`).join('');
    unitSelect.innerHTML = units.map(u => `<option value="${u.id}">${Store.sanitize(u.name)}</option>`).join('');

    const hiddenId = document.getElementById('prodFormId');
    const nameInput = document.getElementById('prodFormName');
    const priceInput = document.getElementById('prodFormPrice');
    const stockInput = document.getElementById('prodFormStock');
    const descInput = document.getElementById('prodFormDesc');
    const imgUrlInput = document.getElementById('prodFormImgUrl');
    const featuredCheck = document.getElementById('prodFormFeatured');
    const previewImg = document.getElementById('prodFormImgPreview');

    if (prodId) {
      const prod = Store.getProductById(prodId);
      if (!prod) return;
      if (elements.prodModalTitle) elements.prodModalTitle.textContent = 'Edit Data Produk';
      hiddenId.value = prod.id;
      nameInput.value = prod.name;
      catSelect.value = prod.category;
      unitSelect.value = prod.unitId;
      priceInput.value = prod.price;
      stockInput.value = prod.stock;
      descInput.value = prod.description || '';
      imgUrlInput.value = prod.image || '';
      featuredCheck.checked = !!prod.featured;
      if (previewImg) previewImg.src = prod.image || '';
    } else {
      if (elements.prodModalTitle) elements.prodModalTitle.textContent = 'Tambah Produk Baru';
      elements.prodForm.reset();
      hiddenId.value = '';
      if (previewImg) previewImg.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
      imgUrlInput.value = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
    }

    elements.prodModal.classList.add('active');
  }

  // Upload Foto Produk File -> Base64
  const prodFileInput = document.getElementById('prodFormFileInput');
  if (prodFileInput) {
    prodFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('prodFormImgUrl').value = event.target.result;
          document.getElementById('prodFormImgPreview').src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (elements.btnAddProduct) {
    elements.btnAddProduct.addEventListener('click', () => openProductFormModal(null));
  }

  if (elements.prodForm) {
    elements.prodForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('prodFormId').value;
      const productData = {
        name: document.getElementById('prodFormName').value.trim(),
        category: document.getElementById('prodFormCategory').value,
        unitId: document.getElementById('prodFormUnit').value,
        price: parseInt(document.getElementById('prodFormPrice').value, 10) || 0,
        stock: parseInt(document.getElementById('prodFormStock').value, 10) || 0,
        description: document.getElementById('prodFormDesc').value.trim(),
        image: document.getElementById('prodFormImgUrl').value.trim(),
        featured: document.getElementById('prodFormFeatured').checked,
        isPublished: true
      };

      if (id) productData.id = id;
      Store.saveProduct(productData);

      closeAllModals();
      showToast('Katalog produk berhasil diperbarui!', 'success');
      renderProducts();
      renderOverview();
    });
  }

  if (elements.prodSearchInput) {
    elements.prodSearchInput.addEventListener('input', (e) => {
      state.prodSearch = e.target.value;
      renderProducts();
    });
  }

  if (elements.prodCatFilterSelect) {
    elements.prodCatFilterSelect.addEventListener('change', (e) => {
      state.prodFilterCat = e.target.value;
      renderProducts();
    });
  }

  // ==================== MODUL 4: MANAJEMEN KATEGORI ====================
  function renderCategories() {
    if (!elements.catTableBody) return;
    const cats = Store.getCategories();
    const prods = Store.getProducts();

    elements.catTableBody.innerHTML = cats.map(c => {
      const count = prods.filter(p => p.category === c.slug).length;
      return `
        <tr>
          <td><strong>${Store.sanitize(c.name)}</strong></td>
          <td><code>${Store.sanitize(c.slug)}</code></td>
          <td><span class="status-pill status-diverifikasi">${count} Produk</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm btn-icon-only btn-edit-cat" data-id="${c.id}" data-name="${Store.sanitize(c.name)}" data-slug="${Store.sanitize(c.slug)}" title="Edit">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn btn-secondary btn-sm btn-icon-only btn-delete-cat" data-id="${c.id}" title="Hapus">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    elements.catTableBody.querySelectorAll('.btn-edit-cat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const name = e.currentTarget.getAttribute('data-name');
        const slug = e.currentTarget.getAttribute('data-slug');
        document.getElementById('catFormId').value = id;
        document.getElementById('catFormName').value = name;
        document.getElementById('catFormSlug').value = slug;
        elements.catModal.classList.add('active');
      });
    });

    elements.catTableBody.querySelectorAll('.btn-delete-cat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Hapus kategori ini? Produk terkait mungkin perlu dikategorikan ulang.')) {
          Store.deleteCategory(id);
          showToast('Kategori telah dihapus.', 'info');
          renderCategories();
        }
      });
    });
  }

  if (elements.btnAddCategory) {
    elements.btnAddCategory.addEventListener('click', () => {
      document.getElementById('catFormId').value = '';
      document.getElementById('catFormName').value = '';
      document.getElementById('catFormSlug').value = '';
      elements.catModal.classList.add('active');
    });
  }

  if (elements.catForm) {
    elements.catForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('catFormId').value;
      const name = document.getElementById('catFormName').value.trim();
      const slug = document.getElementById('catFormSlug').value.trim();

      Store.saveCategory({ id: id || undefined, name, slug });
      closeAllModals();
      showToast('Kategori produk berhasil disimpan!', 'success');
      renderCategories();
    });
  }

  // ==================== MODUL 5: MANAJEMEN UNIT USAHA ====================
  function renderUnits() {
    if (!elements.unitTableBody) return;
    const units = Store.getUnits();

    elements.unitTableBody.innerHTML = units.map(u => `
      <tr>
        <td>
          <img src="${Store.sanitize(u.image)}" alt="${Store.sanitize(u.name)}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;">
        </td>
        <td>
          <div style="font-weight: 700; color: var(--deep-burgundy);">${Store.sanitize(u.name)}</div>
          <span class="tag-unit" style="margin-top: 4px;">${Store.sanitize(u.category)}</span>
        </td>
        <td>${Store.sanitize(u.pic)}</td>
        <td>${Store.sanitize(u.hours)}</td>
        <td>${Store.sanitize(u.contact)}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm btn-icon-only btn-edit-unit" data-id="${u.id}" title="Edit Unit">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn btn-secondary btn-sm btn-icon-only btn-delete-unit" data-id="${u.id}" title="Hapus Unit">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    elements.unitTableBody.querySelectorAll('.btn-edit-unit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openUnitFormModal(id);
      });
    });

    elements.unitTableBody.querySelectorAll('.btn-delete-unit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Hapus unit usaha ini?')) {
          Store.deleteUnit(id);
          showToast('Unit usaha berhasil dihapus.', 'info');
          renderUnits();
          renderOverview();
        }
      });
    });
  }

  function openUnitFormModal(unitId = null) {
    if (!elements.unitModal || !elements.unitForm) return;

    const idInput = document.getElementById('unitFormId');
    const nameInput = document.getElementById('unitFormName');
    const catInput = document.getElementById('unitFormCategory');
    const picInput = document.getElementById('unitFormPic');
    const hoursInput = document.getElementById('unitFormHours');
    const contactInput = document.getElementById('unitFormContact');
    const descInput = document.getElementById('unitFormDesc');
    const featInput = document.getElementById('unitFormFeatures');
    const imgInput = document.getElementById('unitFormImg');

    if (unitId) {
      const u = Store.getUnitById(unitId);
      if (!u) return;
      idInput.value = u.id;
      nameInput.value = u.name;
      catInput.value = u.category;
      picInput.value = u.pic;
      hoursInput.value = u.hours;
      contactInput.value = u.contact;
      descInput.value = u.description;
      featInput.value = (u.features || []).join('\n');
      imgInput.value = u.image;
    } else {
      elements.unitForm.reset();
      idInput.value = '';
      imgInput.value = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700';
    }

    elements.unitModal.classList.add('active');
  }

  if (elements.btnAddUnit) {
    elements.btnAddUnit.addEventListener('click', () => openUnitFormModal(null));
  }

  if (elements.unitForm) {
    elements.unitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('unitFormId').value;
      const unitData = {
        name: document.getElementById('unitFormName').value.trim(),
        category: document.getElementById('unitFormCategory').value.trim(),
        pic: document.getElementById('unitFormPic').value.trim(),
        hours: document.getElementById('unitFormHours').value.trim(),
        contact: document.getElementById('unitFormContact').value.trim(),
        description: document.getElementById('unitFormDesc').value.trim(),
        features: document.getElementById('unitFormFeatures').value.split('\n').map(s => s.trim()).filter(Boolean),
        image: document.getElementById('unitFormImg').value.trim()
      };

      if (id) unitData.id = id;
      Store.saveUnit(unitData);

      closeAllModals();
      showToast('Unit usaha berhasil disimpan!', 'success');
      renderUnits();
      renderOverview();
    });
  }

  // ==================== MODUL 6: STRUKTUR PENGURUS ====================
  function renderBoard() {
    if (!elements.boardTableBody) return;
    const board = Store.getBoard();

    elements.boardTableBody.innerHTML = board.map(m => `
      <tr>
        <td>
          <img src="${Store.sanitize(m.photo)}" alt="${Store.sanitize(m.name)}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;">
        </td>
        <td><strong>${Store.sanitize(m.name)}</strong></td>
        <td><span class="tag-unit">${Store.sanitize(m.position)}</span></td>
        <td>${Store.sanitize(m.period)}</td>
        <td>${m.order || 1}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm btn-icon-only btn-edit-board" data-id="${m.id}" title="Edit Pengurus">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn btn-secondary btn-sm btn-icon-only btn-delete-board" data-id="${m.id}" title="Hapus">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    elements.boardTableBody.querySelectorAll('.btn-edit-board').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openBoardFormModal(id);
      });
    });

    elements.boardTableBody.querySelectorAll('.btn-delete-board').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Hapus profil pengurus ini?')) {
          Store.deleteBoardMember(id);
          showToast('Data pengurus telah dihapus.', 'info');
          renderBoard();
        }
      });
    });
  }

  function openBoardFormModal(boardId = null) {
    if (!elements.boardModal || !elements.boardForm) return;

    const idInput = document.getElementById('boardFormId');
    const nameInput = document.getElementById('boardFormName');
    const posInput = document.getElementById('boardFormPosition');
    const perInput = document.getElementById('boardFormPeriod');
    const ordInput = document.getElementById('boardFormOrder');
    const bioInput = document.getElementById('boardFormBio');
    const photoInput = document.getElementById('boardFormPhoto');

    if (boardId) {
      const board = Store.getBoard();
      const m = board.find(b => b.id === boardId);
      if (!m) return;
      idInput.value = m.id;
      nameInput.value = m.name;
      posInput.value = m.position;
      perInput.value = m.period;
      ordInput.value = m.order || 1;
      bioInput.value = m.bio;
      photoInput.value = m.photo;
    } else {
      elements.boardForm.reset();
      idInput.value = '';
      ordInput.value = 1;
      photoInput.value = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
    }

    elements.boardModal.classList.add('active');
  }

  if (elements.btnAddBoard) {
    elements.btnAddBoard.addEventListener('click', () => openBoardFormModal(null));
  }

  if (elements.boardForm) {
    elements.boardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('boardFormId').value;
      const boardData = {
        name: document.getElementById('boardFormName').value.trim(),
        position: document.getElementById('boardFormPosition').value.trim(),
        period: document.getElementById('boardFormPeriod').value.trim(),
        order: parseInt(document.getElementById('boardFormOrder').value, 10) || 1,
        bio: document.getElementById('boardFormBio').value.trim(),
        photo: document.getElementById('boardFormPhoto').value.trim()
      };

      if (id) boardData.id = id;
      Store.saveBoardMember(boardData);

      closeAllModals();
      showToast('Profil pengurus berhasil disimpan!', 'success');
      renderBoard();
    });
  }

  // ==================== MODUL 7: PENGATURAN IDENTITAS & LOGO KOPERASI ====================
  function renderSettings() {
    const profile = Store.getProfile();

    document.getElementById('setCoopName').value = profile.name || '';
    document.getElementById('setShortName').value = profile.shortName || '';
    document.getElementById('setTagline').value = profile.tagline || '';
    document.getElementById('setLegalBadge').value = profile.legalBadge || '';
    document.getElementById('setAddress').value = profile.address || '';
    document.getElementById('setPhone').value = profile.phone || '';
    document.getElementById('setWhatsapp').value = profile.whatsapp || '';
    document.getElementById('setEmail').value = profile.email || '';
    document.getElementById('setHours').value = profile.operationalHours || '';

    if (elements.logoUrlInput) elements.logoUrlInput.value = profile.logoUrl || '';
    if (elements.sliderDesktopScale) elements.sliderDesktopScale.value = profile.logoScaleDesktop || 48;
    if (elements.sliderMobileScale) elements.sliderMobileScale.value = profile.logoScaleMobile || 38;
    if (elements.valDesktopScale) elements.valDesktopScale.textContent = (profile.logoScaleDesktop || 48) + 'px';
    if (elements.valMobileScale) elements.valMobileScale.textContent = (profile.logoScaleMobile || 38) + 'px';

    updateLogoSimulators();
  }

  function updateLogoSimulators() {
    const profile = Store.getProfile();
    const currentUrl = elements.logoUrlInput ? elements.logoUrlInput.value.trim() : '';
    const logoSrc = currentUrl !== '' ? currentUrl : Store.DEFAULT_LOGO_SVG;

    const deskH = elements.sliderDesktopScale ? elements.sliderDesktopScale.value : (profile.logoScaleDesktop || 48);
    const mobH = elements.sliderMobileScale ? elements.sliderMobileScale.value : (profile.logoScaleMobile || 38);

    if (elements.previewDesktopImg) {
      elements.previewDesktopImg.src = logoSrc;
      elements.previewDesktopImg.style.height = deskH + 'px';
    }
    if (elements.previewMobileImg) {
      elements.previewMobileImg.src = logoSrc;
      elements.previewMobileImg.style.height = mobH + 'px';
    }

    const shortName = document.getElementById('setShortName')?.value.trim() || profile.shortName || 'KKMP Ulujami';
    if (elements.previewDesktopName) elements.previewDesktopName.textContent = shortName;
    if (elements.previewMobileName) elements.previewMobileName.textContent = shortName;
  }

  if (elements.sliderDesktopScale) {
    elements.sliderDesktopScale.addEventListener('input', (e) => {
      if (elements.valDesktopScale) elements.valDesktopScale.textContent = e.target.value + 'px';
      updateLogoSimulators();
    });
  }

  if (elements.sliderMobileScale) {
    elements.sliderMobileScale.addEventListener('input', (e) => {
      if (elements.valMobileScale) elements.valMobileScale.textContent = e.target.value + 'px';
      updateLogoSimulators();
    });
  }

  if (elements.logoUrlInput) {
    elements.logoUrlInput.addEventListener('input', updateLogoSimulators);
  }

  // Upload Logo Kustom File -> Base64
  if (elements.logoFileInput) {
    elements.logoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (elements.logoUrlInput) elements.logoUrlInput.value = event.target.result;
          updateLogoSimulators();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (elements.settingsForm) {
    elements.settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const updated = {
        name: document.getElementById('setCoopName').value.trim(),
        shortName: document.getElementById('setShortName').value.trim(),
        tagline: document.getElementById('setTagline').value.trim(),
        legalBadge: document.getElementById('setLegalBadge').value.trim(),
        address: document.getElementById('setAddress').value.trim(),
        phone: document.getElementById('setPhone').value.trim(),
        whatsapp: document.getElementById('setWhatsapp').value.trim(),
        email: document.getElementById('setEmail').value.trim(),
        operationalHours: document.getElementById('setHours').value.trim(),
        logoUrl: elements.logoUrlInput ? elements.logoUrlInput.value.trim() : '',
        logoScaleDesktop: parseInt(elements.sliderDesktopScale.value, 10) || 48,
        logoScaleMobile: parseInt(elements.sliderMobileScale.value, 10) || 38
      };

      Store.saveProfile(updated);
      showToast('Pengaturan identitas koperasi berhasil disimpan!', 'success');
      renderSettings();
    });
  }

  // Tombol Reset ke Default
  if (elements.btnResetIdentity) {
    elements.btnResetIdentity.addEventListener('click', () => {
      if (confirm('Kembalikan seluruh identitas koperasi ke profil bawaan?')) {
        Store.resetToDefault();
        showToast('Identitas telah dikembalikan ke kondisi awal pabrikan.', 'info');
        renderSettings();
        renderOverview();
      }
    });
  }

  // Tutup Semua Modal
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
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

  // Jalankan render awal
  switchTab('overview');
});
