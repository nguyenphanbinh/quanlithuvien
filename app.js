/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THƯ VIỆN (LIBMASTER)
 * Tác giả: Nhóm phát triển Lab Antigravity
 * Chức năng: Quản lý Sách, Độc giả, Nghiệp vụ Mượn/Gia hạn/Trả sách, Dashboard
 * Lưu trữ: LocalStorage (HTML5 Web Storage)
 * ==============================================================================
 */

// STORAGE KEYS
const STORAGE_KEYS = {
  BOOKS: 'lib_books_data',
  READERS: 'lib_readers_data',
  LOANS: 'lib_loans_data'
};

// ==============================================================================
// 1. DỮ LIỆU MẪU BAN ĐẦU (INITIAL SAMPLE DATA)
// ==============================================================================
function getSampleData() {
  const today = new Date();
  
  // Format date to YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split('T')[0];
  const addDays = (baseDate, days) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return formatDate(d);
  };

  const sampleBooks = [
    {
      id: 'BK001',
      title: 'Clean Code - Mã Sạch',
      author: 'Robert C. Martin',
      category: 'Công nghệ thông tin',
      totalCopies: 5,
      availableCopies: 4,
      status: 'Đang mượn'
    },
    {
      id: 'BK002',
      title: 'Lập Trình JavaScript Nâng Cao',
      author: 'David Flanagan',
      category: 'Công nghệ thông tin',
      totalCopies: 4,
      availableCopies: 3,
      status: 'Đang mượn'
    },
    {
      id: 'BK003',
      title: 'Cấu Trúc Dữ Liệu & Giải Thuật',
      author: 'Lê Minh Hoàng',
      category: 'Công nghệ thông tin',
      totalCopies: 3,
      availableCopies: 3,
      status: 'Còn trong kho'
    },
    {
      id: 'BK004',
      title: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      category: 'Kinh tế & Quản trị',
      totalCopies: 6,
      availableCopies: 5,
      status: 'Đang mượn'
    },
    {
      id: 'BK005',
      title: 'Cha Giàu Cha Nghèo',
      author: 'Robert Kiyosaki',
      category: 'Kinh tế & Quản trị',
      totalCopies: 4,
      availableCopies: 4,
      status: 'Còn trong kho'
    },
    {
      id: 'BK006',
      title: 'Lược Sử Thời Gian',
      author: 'Stephen Hawking',
      category: 'Khoa học & Kỹ thuật',
      totalCopies: 2,
      availableCopies: 0,
      status: 'Đang mượn' // Hết bản khả dụng để kiểm thử nghiệp vụ
    },
    {
      id: 'BK007',
      title: 'Dế Mèn Phiêu Lưu Ký',
      author: 'Tô Hoài',
      category: 'Văn học & Nghệ thuật',
      totalCopies: 2,
      availableCopies: 0,
      status: 'Hư hỏng' // Sách hư hỏng để kiểm thử chặn mượn
    }
  ];

  const sampleReaders = [
    {
      id: 'DG001',
      fullName: 'Nguyễn Văn An',
      phone: '0901234567',
      email: 'an.nguyen@email.com',
      status: 'Hoạt động',
      createdAt: addDays(today, -60)
    },
    {
      id: 'DG002',
      fullName: 'Trần Thị Bích',
      phone: '0912345678',
      email: 'bich.tran@email.com',
      status: 'Hoạt động',
      createdAt: addDays(today, -45)
    },
    {
      id: 'DG003',
      fullName: 'Lê Hoàng Long',
      phone: '0988776655',
      email: 'long.le@email.com',
      status: 'Hoạt động',
      createdAt: addDays(today, -30)
    },
    {
      id: 'DG004',
      fullName: 'Phạm Minh Tuấn',
      phone: '0977112233',
      email: 'tuan.pham@email.com',
      status: 'Bị khóa', // Thẻ bị khóa để kiểm thử chặn mượn
      createdAt: addDays(today, -20)
    },
    {
      id: 'DG005',
      fullName: 'Võ Thu Hà',
      phone: '0933445566',
      email: 'ha.vo@email.com',
      status: 'Hoạt động',
      createdAt: addDays(today, -15)
    }
  ];

  const sampleLoans = [
    {
      id: 'PM001',
      readerId: 'DG001',
      readerName: 'Nguyễn Văn An',
      bookId: 'BK001',
      bookTitle: 'Clean Code - Mã Sạch',
      borrowDate: addDays(today, -5),
      dueDate: addDays(today, 9),
      returnDate: null,
      status: 'Đang mượn',
      renewCount: 0
    },
    {
      id: 'PM002',
      readerId: 'DG002',
      readerName: 'Trần Thị Bích',
      bookId: 'BK006',
      bookTitle: 'Lược Sử Thời Gian',
      borrowDate: addDays(today, -22),
      dueDate: addDays(today, -8), // Đã quá hạn 8 ngày!
      returnDate: null,
      status: 'Đang mượn',
      renewCount: 0
    },
    {
      id: 'PM003',
      readerId: 'DG003',
      readerName: 'Lê Hoàng Long',
      bookId: 'BK004',
      bookTitle: 'Đắc Nhân Tâm',
      borrowDate: addDays(today, -3),
      dueDate: addDays(today, 11),
      returnDate: null,
      status: 'Đang mượn',
      renewCount: 0
    },
    {
      id: 'PM004',
      readerId: 'DG005',
      readerName: 'Võ Thu Hà',
      bookId: 'BK002',
      bookTitle: 'Lập Trình JavaScript Nâng Cao',
      borrowDate: addDays(today, -25),
      dueDate: addDays(today, -11),
      returnDate: addDays(today, -12),
      status: 'Đã trả (Đúng hạn)',
      renewCount: 0
    },
    {
      id: 'PM005',
      readerId: 'DG001',
      readerName: 'Nguyễn Văn An',
      bookId: 'BK005',
      bookTitle: 'Cha Giàu Cha Nghèo',
      borrowDate: addDays(today, -35),
      dueDate: addDays(today, -21),
      returnDate: addDays(today, -17), // Trễ 4 ngày
      status: 'Đã trả (Trễ hạn)',
      renewCount: 1
    }
  ];

  return { sampleBooks, sampleReaders, sampleLoans };
}

// ==============================================================================
// 2. DATA SERVICE (LOCALSTORAGE MANAGEMENT)
// ==============================================================================
const DataService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.BOOKS) || !localStorage.getItem(STORAGE_KEYS.READERS) || !localStorage.getItem(STORAGE_KEYS.LOANS)) {
      this.resetToSampleData(false);
    }
  },

  resetToSampleData(notify = true) {
    const { sampleBooks, sampleReaders, sampleLoans } = getSampleData();
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(sampleBooks));
    localStorage.setItem(STORAGE_KEYS.READERS, JSON.stringify(sampleReaders));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(sampleLoans));
    
    if (notify) {
      showToast('Thành công', 'Đã khôi phục toàn bộ dữ liệu mẫu!', 'success');
      App.refreshAll();
    }
  },

  getBooks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || '[]');
  },

  saveBooks(books) {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  },

  getReaders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.READERS) || '[]');
  },

  saveReaders(readers) {
    localStorage.setItem(STORAGE_KEYS.READERS, JSON.stringify(readers));
  },

  getLoans() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOANS) || '[]');
  },

  saveLoans(loans) {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }
};

// ==============================================================================
// 3. TOAST NOTIFICATIONS HELPER
// ==============================================================================
function showToast(title, message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    danger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || iconMap.info}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close-btn" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// ==============================================================================
// 4. MODAL CONTROLS
// ==============================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Click outside modal content to close
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// ==============================================================================
// 5. APPLICATION LOGIC & RENDERING
// ==============================================================================
const App = {
  currentTab: 'dashboard',

  init() {
    DataService.init();
    this.bindEvents();
    this.refreshAll();
  },

  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });

    // Reset Sample Data Button
    document.getElementById('btnResetData')?.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu mẫu ban đầu? Toàn bộ thay đổi hiện tại sẽ được thay thế.')) {
        DataService.resetToSampleData(true);
      }
    });

    // Quick Borrow Button in Header
    document.getElementById('btnQuickBorrow')?.addEventListener('click', () => {
      openLoanModal();
    });

    // Book Search & Filter Inputs
    document.getElementById('bookSearchInput')?.addEventListener('input', () => this.renderBooks());
    document.getElementById('bookCategoryFilter')?.addEventListener('change', () => this.renderBooks());
    document.getElementById('bookStatusFilter')?.addEventListener('change', () => this.renderBooks());

    // Reader Search & Filter Inputs
    document.getElementById('readerSearchInput')?.addEventListener('input', () => this.renderReaders());
    document.getElementById('readerStatusFilter')?.addEventListener('change', () => this.renderReaders());

    // Loan Search & Filter Inputs
    document.getElementById('loanSearchInput')?.addEventListener('input', () => this.renderLoans());
    document.getElementById('loanStatusFilter')?.addEventListener('change', () => this.renderLoans());
  },

  refreshAll() {
    this.renderDashboard();
    this.renderBooks();
    this.renderReaders();
    this.renderLoans();
    this.populateCategoryFilter();
  },

  // ----------------------------------------------------------------------------
  // DASHBOARD
  // ----------------------------------------------------------------------------
  renderDashboard() {
    const books = DataService.getBooks();
    const readers = DataService.getReaders();
    const loans = DataService.getLoans();
    const todayStr = new Date().toISOString().split('T')[0];

    // Stats calculations
    const totalBooks = books.length;
    const totalCopies = books.reduce((sum, b) => sum + (parseInt(b.totalCopies) || 0), 0);
    const availableCopies = books.reduce((sum, b) => sum + (parseInt(b.availableCopies) || 0), 0);
    
    // Active loans
    const activeLoans = loans.filter(l => l.status === 'Đang mượn');
    
    // Overdue loans (Loans currently 'Đang mượn' and dueDate < today)
    const overdueLoans = activeLoans.filter(l => l.dueDate < todayStr);

    // Unique active readers borrowing books
    const activeBorrowerIds = new Set(activeLoans.map(l => l.readerId));

    // Unique categories
    const categories = new Set(books.map(b => b.category));

    // Update UI Stats
    document.getElementById('statTotalBooks').textContent = totalBooks;
    document.getElementById('statCategoriesCount').textContent = `${categories.size} thể loại sách`;
    
    document.getElementById('statAvailableCopies').textContent = availableCopies;
    document.getElementById('statTotalCopies').textContent = `Trên tổng ${totalCopies} bản in`;

    document.getElementById('statActiveLoans').textContent = activeLoans.length;
    document.getElementById('statActiveReaders').textContent = `Bởi ${activeBorrowerIds.size} độc giả`;

    document.getElementById('statOverdueLoans').textContent = overdueLoans.length;

    // Render Urgent / Recent Loans Table on Dashboard
    const recentTableBody = document.getElementById('dashboardRecentLoansTable');
    if (recentTableBody) {
      if (loans.length === 0) {
        recentTableBody.innerHTML = `<tr><td colspan="5" class="empty-state">Chưa có phiếu mượn nào</td></tr>`;
      } else {
        // Show active loans, prioritize overdue first, then newest
        const sortedLoans = [...loans].sort((a, b) => {
          if (a.status === 'Đang mượn' && b.status !== 'Đang mượn') return -1;
          if (b.status === 'Đang mượn' && a.status !== 'Đang mượn') return 1;
          return new Date(b.borrowDate) - new Date(a.borrowDate);
        }).slice(0, 5);

        recentTableBody.innerHTML = sortedLoans.map(loan => {
          const isOverdue = (loan.status === 'Đang mượn' && loan.dueDate < todayStr);
          let badgeHtml = '';
          if (isOverdue) {
            badgeHtml = `<span class="badge badge-danger"><span class="badge-dot"></span>Quá hạn</span>`;
          } else if (loan.status === 'Đang mượn') {
            badgeHtml = `<span class="badge badge-info"><span class="badge-dot"></span>Đang mượn</span>`;
          } else if (loan.status.includes('Đúng hạn')) {
            badgeHtml = `<span class="badge badge-success"><span class="badge-dot"></span>${loan.status}</span>`;
          } else {
            badgeHtml = `<span class="badge badge-warning"><span class="badge-dot"></span>${loan.status}</span>`;
          }

          return `
            <tr>
              <td><strong>${loan.id}</strong></td>
              <td>${loan.readerName}</td>
              <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${loan.bookTitle}</td>
              <td>${loan.dueDate}</td>
              <td>${badgeHtml}</td>
            </tr>
          `;
        }).join('');
      }
    }

    // Render Category Distribution
    const catContainer = document.getElementById('categoryDistributionList');
    if (catContainer) {
      const catCount = {};
      books.forEach(b => {
        catCount[b.category] = (catCount[b.category] || 0) + 1;
      });

      if (Object.keys(catCount).length === 0) {
        catContainer.innerHTML = `<div class="empty-state">Chưa có dữ liệu thể loại</div>`;
      } else {
        catContainer.innerHTML = Object.entries(catCount).map(([cat, count]) => {
          const percent = totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0;
          return `
            <div style="margin-bottom: 0.9rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.825rem; font-weight: 600; margin-bottom: 0.3rem;">
                <span>${cat}</span>
                <span style="color: var(--text-muted);">${count} đầu sách (${percent}%)</span>
              </div>
              <div style="background-color: var(--border-color); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background-color: var(--primary); height: 100%; width: ${percent}%; border-radius: 4px;"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  },

  // ----------------------------------------------------------------------------
  // BOOKS MANAGEMENT
  // ----------------------------------------------------------------------------
  populateCategoryFilter() {
    const books = DataService.getBooks();
    const categories = Array.from(new Set(books.map(b => b.category))).filter(Boolean);
    const select = document.getElementById('bookCategoryFilter');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">-- Tất cả thể loại --</option>' + 
      categories.map(c => `<option value="${c}">${c}</option>`).join('');
    select.value = currentVal;
  },

  renderBooks() {
    const books = DataService.getBooks();
    const tbody = document.getElementById('booksTableBody');
    if (!tbody) return;

    const searchKeyword = (document.getElementById('bookSearchInput')?.value || '').toLowerCase().trim();
    const categoryFilter = document.getElementById('bookCategoryFilter')?.value || '';
    const statusFilter = document.getElementById('bookStatusFilter')?.value || '';

    // Filter books
    const filtered = books.filter(b => {
      const matchSearch = !searchKeyword || 
        b.id.toLowerCase().includes(searchKeyword) ||
        b.title.toLowerCase().includes(searchKeyword) ||
        b.author.toLowerCase().includes(searchKeyword);
      
      const matchCategory = !categoryFilter || b.category === categoryFilter;
      const matchStatus = !statusFilter || b.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Không tìm thấy sách nào phù hợp</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(b => {
      let statusBadge = '';
      if (b.status === 'Còn trong kho') {
        statusBadge = `<span class="badge badge-success"><span class="badge-dot"></span>Còn trong kho</span>`;
      } else if (b.status === 'Đang mượn') {
        statusBadge = `<span class="badge badge-info"><span class="badge-dot"></span>Đang mượn</span>`;
      } else if (b.status === 'Hư hỏng') {
        statusBadge = `<span class="badge badge-danger"><span class="badge-dot"></span>Hư hỏng</span>`;
      } else {
        statusBadge = `<span class="badge badge-warning"><span class="badge-dot"></span>Thất lạc</span>`;
      }

      // Copies styling
      const avail = parseInt(b.availableCopies) || 0;
      const total = parseInt(b.totalCopies) || 0;
      let copiesClass = 'copies-full';
      if (avail === 0) copiesClass = 'copies-empty';
      else if (avail < total) copiesClass = 'copies-partial';

      return `
        <tr>
          <td><strong>${b.id}</strong></td>
          <td style="font-weight: 600;">${b.title}</td>
          <td>${b.author}</td>
          <td><span class="tag-category">${b.category}</span></td>
          <td>
            <span class="copies-indicator ${copiesClass}">
              ${avail} / ${total}
            </span>
          </td>
          <td>${statusBadge}</td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button class="btn btn-outline btn-sm" onclick="editBook('${b.id}')" title="Chỉnh sửa thông tin sách">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Sửa
              </button>
              <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #fecaca;" onclick="deleteBook('${b.id}')" title="Xóa sách khỏi hệ thống">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Xóa
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // ----------------------------------------------------------------------------
  // READERS MANAGEMENT
  // ----------------------------------------------------------------------------
  renderReaders() {
    const readers = DataService.getReaders();
    const loans = DataService.getLoans();
    const tbody = document.getElementById('readersTableBody');
    if (!tbody) return;

    const searchKeyword = (document.getElementById('readerSearchInput')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('readerStatusFilter')?.value || '';

    const filtered = readers.filter(r => {
      const matchSearch = !searchKeyword ||
        r.id.toLowerCase().includes(searchKeyword) ||
        r.fullName.toLowerCase().includes(searchKeyword) ||
        r.phone.toLowerCase().includes(searchKeyword) ||
        (r.email && r.email.toLowerCase().includes(searchKeyword));
      
      const matchStatus = !statusFilter || r.status === statusFilter;

      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Không tìm thấy độc giả nào phù hợp</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(r => {
      const isBlocked = r.status === 'Bị khóa';
      const badgeHtml = isBlocked
        ? `<span class="badge badge-danger"><span class="badge-dot"></span>Bị khóa</span>`
        : `<span class="badge badge-success"><span class="badge-dot"></span>Hoạt động</span>`;

      // Count active books borrowed
      const activeBorrowCount = loans.filter(l => l.readerId === r.id && l.status === 'Đang mượn').length;
      const borrowTag = activeBorrowCount > 0
        ? `<span class="badge badge-info">${activeBorrowCount} cuốn</span>`
        : `<span style="color: var(--text-light); font-size: 0.8rem;">0</span>`;

      return `
        <tr>
          <td><strong>${r.id}</strong></td>
          <td style="font-weight: 600;">${r.fullName}</td>
          <td>
            <div>${r.phone}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted);">${r.email || 'Chưa cập nhật'}</div>
          </td>
          <td>${badgeHtml}</td>
          <td>${borrowTag}</td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button class="btn btn-outline btn-sm" onclick="editReader('${r.id}')" title="Sửa thông tin độc giả">
                Sửa
              </button>
              <button class="btn btn-sm ${isBlocked ? 'btn-success' : 'btn-warning'}" onclick="toggleReaderStatus('${r.id}')" title="${isBlocked ? 'Mở khóa thẻ' : 'Khóa thẻ thư viện'}">
                ${isBlocked ? 'Mở khóa' : 'Khóa thẻ'}
              </button>
              <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #fecaca;" onclick="deleteReader('${r.id}')" title="Xóa độc giả">
                Xóa
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // ----------------------------------------------------------------------------
  // LOANS MANAGEMENT
  // ----------------------------------------------------------------------------
  renderLoans() {
    const loans = DataService.getLoans();
    const tbody = document.getElementById('loansTableBody');
    if (!tbody) return;

    const searchKeyword = (document.getElementById('loanSearchInput')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('loanStatusFilter')?.value || '';
    const todayStr = new Date().toISOString().split('T')[0];

    const filtered = loans.filter(l => {
      const matchSearch = !searchKeyword ||
        l.id.toLowerCase().includes(searchKeyword) ||
        l.readerId.toLowerCase().includes(searchKeyword) ||
        l.readerName.toLowerCase().includes(searchKeyword) ||
        l.bookId.toLowerCase().includes(searchKeyword) ||
        l.bookTitle.toLowerCase().includes(searchKeyword);
      
      let matchStatus = true;
      if (statusFilter === 'QUÁ HẠN') {
        matchStatus = (l.status === 'Đang mượn' && l.dueDate < todayStr);
      } else if (statusFilter) {
        matchStatus = (l.status === statusFilter);
      }

      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="empty-state">Không có phiếu mượn nào phù hợp</td></tr>`;
      return;
    }

    // Sort: newest borrow date first
    filtered.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));

    tbody.innerHTML = filtered.map(l => {
      const isOverdue = (l.status === 'Đang mượn' && l.dueDate < todayStr);
      
      let statusBadge = '';
      if (isOverdue) {
        statusBadge = `<span class="badge badge-danger"><span class="badge-dot"></span>Quá hạn</span>`;
      } else if (l.status === 'Đang mượn') {
        statusBadge = `<span class="badge badge-info"><span class="badge-dot"></span>Đang mượn</span>`;
      } else if (l.status.includes('Đúng hạn')) {
        statusBadge = `<span class="badge badge-success"><span class="badge-dot"></span>Đúng hạn</span>`;
      } else {
        statusBadge = `<span class="badge badge-warning"><span class="badge-dot"></span>Trễ hạn</span>`;
      }

      const canAction = (l.status === 'Đang mượn');

      return `
        <tr>
          <td><strong>${l.id}</strong></td>
          <td>
            <div style="font-weight: 600;">${l.readerName}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${l.readerId}</div>
          </td>
          <td>
            <div style="font-weight: 500;">${l.bookTitle}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${l.bookId}</div>
          </td>
          <td>${l.borrowDate}</td>
          <td style="${isOverdue ? 'color: var(--danger); font-weight: 700;' : ''}">${l.dueDate}</td>
          <td>${l.returnDate || '<span style="color: var(--text-light);">-</span>'}</td>
          <td>${statusBadge}</td>
          <td style="text-align: center;">
            ${l.renewCount > 0 ? `<span class="badge badge-secondary">+${l.renewCount * 7}d (${l.renewCount}l)</span>` : '<span style="color: var(--text-light);">-</span>'}
          </td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              ${canAction ? `
                <button class="btn btn-outline btn-sm" onclick="renewLoan('${l.id}')" title="Gia hạn thêm 7 ngày vào hạn trả">
                  Gia hạn +7d
                </button>
                <button class="btn btn-success btn-sm" onclick="openReturnModal('${l.id}')" title="Thực hiện nhận trả sách">
                  Trả sách
                </button>
              ` : `
                <span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Đã hoàn tất</span>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
};

// ==============================================================================
// 6. TAB SWITCHING FUNCTION
// ==============================================================================
function switchTab(tabId) {
  // Update nav tabs
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Update tab content
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabId}`);
  });

  App.currentTab = tabId;

  // Refresh tab-specific data
  if (tabId === 'dashboard') App.renderDashboard();
  else if (tabId === 'books') App.renderBooks();
  else if (tabId === 'readers') App.renderReaders();
  else if (tabId === 'loans') App.renderLoans();
}

// Reset Filter Helpers
function resetBookFilters() {
  const s = document.getElementById('bookSearchInput');
  const c = document.getElementById('bookCategoryFilter');
  const st = document.getElementById('bookStatusFilter');
  if (s) s.value = '';
  if (c) c.value = '';
  if (st) st.value = '';
  App.renderBooks();
}

function resetReaderFilters() {
  const s = document.getElementById('readerSearchInput');
  const st = document.getElementById('readerStatusFilter');
  if (s) s.value = '';
  if (st) st.value = '';
  App.renderReaders();
}

function resetLoanFilters() {
  const s = document.getElementById('loanSearchInput');
  const st = document.getElementById('loanStatusFilter');
  if (s) s.value = '';
  if (st) st.value = '';
  App.renderLoans();
}

// ==============================================================================
// 7. BOOKS ACTIONS (ADD, EDIT, DELETE, SAVE)
// ==============================================================================
function openBookModal(isEdit = false) {
  const form = document.getElementById('bookForm');
  form.reset();
  
  const titleElem = document.getElementById('bookModalTitle');
  const idInput = document.getElementById('bookId');
  const modeInput = document.getElementById('bookEditMode');

  if (isEdit) {
    titleElem.innerHTML = `Chỉnh Sửa Thông Tin Sách`;
    idInput.readOnly = true;
    modeInput.value = 'edit';
  } else {
    titleElem.innerHTML = `Thêm Sách Mới`;
    idInput.readOnly = false;
    modeInput.value = 'create';
    
    // Auto-generate Book ID
    const books = DataService.getBooks();
    const nextNum = books.length + 1;
    idInput.value = `BK${String(nextNum).padStart(3, '0')}`;
  }

  openModal('bookModal');
}

function editBook(bookId) {
  const books = DataService.getBooks();
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  openBookModal(true);

  document.getElementById('bookId').value = book.id;
  document.getElementById('bookTitle').value = book.title;
  document.getElementById('bookAuthor').value = book.author;
  document.getElementById('bookCategory').value = book.category;
  document.getElementById('bookTotalCopies').value = book.totalCopies;
  document.getElementById('bookAvailableCopies').value = book.availableCopies;
  document.getElementById('bookStatus').value = book.status;
}

function handleSaveBook(e) {
  e.preventDefault();
  const mode = document.getElementById('bookEditMode').value;
  const id = document.getElementById('bookId').value.trim();
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const category = document.getElementById('bookCategory').value.trim();
  const totalCopies = parseInt(document.getElementById('bookTotalCopies').value) || 1;
  let availableCopies = parseInt(document.getElementById('bookAvailableCopies').value) || 0;
  let status = document.getElementById('bookStatus').value;

  // Validation
  if (!id || !title || !author || !category) {
    showToast('Thiếu thông tin', 'Vui lòng điền đầy đủ tất cả các trường bắt buộc!', 'warning');
    return;
  }

  if (availableCopies > totalCopies) {
    showToast('Không hợp lệ', 'Số bản khả dụng không thể lớn hơn tổng số bản in!', 'warning');
    return;
  }

  const books = DataService.getBooks();

  if (mode === 'create') {
    // Check duplicate ID
    if (books.some(b => b.id.toLowerCase() === id.toLowerCase())) {
      showToast('Trùng mã', `Mã sách "${id}" đã tồn tại. Vui lòng chọn mã khác!`, 'danger');
      return;
    }

    // Auto set status if not manually overridden to damaged/lost
    if (status !== 'Hư hỏng' && status !== 'Thất lạc') {
      status = (availableCopies === totalCopies) ? 'Còn trong kho' : 'Đang mượn';
    }

    books.push({
      id,
      title,
      author,
      category,
      totalCopies,
      availableCopies,
      status
    });

    showToast('Thành công', `Đã thêm mới sách "${title}"!`, 'success');
  } else {
    // Edit mode
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return;

    // Auto sync status if regular
    if (status !== 'Hư hỏng' && status !== 'Thất lạc') {
      if (availableCopies === 0) status = 'Đang mượn';
      else if (availableCopies === totalCopies) status = 'Còn trong kho';
      else status = 'Đang mượn';
    }

    books[idx] = {
      ...books[idx],
      title,
      author,
      category,
      totalCopies,
      availableCopies,
      status
    };

    showToast('Cập nhật thành công', `Đã cập nhật thông tin sách "${title}"!`, 'success');
  }

  DataService.saveBooks(books);
  closeModal('bookModal');
  App.refreshAll();
}

function deleteBook(bookId) {
  const loans = DataService.getLoans();
  const hasActiveLoan = loans.some(l => l.bookId === bookId && l.status === 'Đang mượn');

  if (hasActiveLoan) {
    showToast('Nghiệp vụ vi phạm', 'Không thể xóa cuốn sách này vì đang có độc giả mượn chưa trả!', 'danger');
    return;
  }

  if (confirm(`Bạn có chắc chắn muốn xóa cuốn sách mã "${bookId}"?`)) {
    const books = DataService.getBooks().filter(b => b.id !== bookId);
    DataService.saveBooks(books);
    showToast('Đã xóa', `Đã xóa sách mã "${bookId}" khỏi thư viện.`, 'info');
    App.refreshAll();
  }
}

// ==============================================================================
// 8. READERS ACTIONS (ADD, EDIT, TOGGLE STATUS, DELETE, SAVE)
// ==============================================================================
function openReaderModal(isEdit = false) {
  const form = document.getElementById('readerForm');
  form.reset();

  const titleElem = document.getElementById('readerModalTitle');
  const idInput = document.getElementById('readerId');
  const modeInput = document.getElementById('readerEditMode');

  if (isEdit) {
    titleElem.innerHTML = `Chỉnh Sửa Thông Tin Độc Giả`;
    idInput.readOnly = true;
    modeInput.value = 'edit';
  } else {
    titleElem.innerHTML = `Thêm Độc Giả Mới`;
    idInput.readOnly = false;
    modeInput.value = 'create';

    const readers = DataService.getReaders();
    const nextNum = readers.length + 1;
    idInput.value = `DG${String(nextNum).padStart(3, '0')}`;
  }

  openModal('readerModal');
}

function editReader(readerId) {
  const readers = DataService.getReaders();
  const reader = readers.find(r => r.id === readerId);
  if (!reader) return;

  openReaderModal(true);

  document.getElementById('readerId').value = reader.id;
  document.getElementById('readerFullName').value = reader.fullName;
  document.getElementById('readerPhone').value = reader.phone;
  document.getElementById('readerEmail').value = reader.email || '';
  document.getElementById('readerStatus').value = reader.status;
}

function handleSaveReader(e) {
  e.preventDefault();
  const mode = document.getElementById('readerEditMode').value;
  const id = document.getElementById('readerId').value.trim();
  const fullName = document.getElementById('readerFullName').value.trim();
  const phone = document.getElementById('readerPhone').value.trim();
  const email = document.getElementById('readerEmail').value.trim();
  const status = document.getElementById('readerStatus').value;

  if (!id || !fullName || !phone) {
    showToast('Thiếu thông tin', 'Vui lòng nhập đầy đủ mã, họ tên và số điện thoại!', 'warning');
    return;
  }

  const readers = DataService.getReaders();

  if (mode === 'create') {
    if (readers.some(r => r.id.toLowerCase() === id.toLowerCase())) {
      showToast('Trùng mã', `Mã độc giả "${id}" đã tồn tại trên hệ thống!`, 'danger');
      return;
    }

    readers.push({
      id,
      fullName,
      phone,
      email,
      status,
      createdAt: new Date().toISOString().split('T')[0]
    });

    showToast('Thành công', `Đã thêm độc giả mới: ${fullName}!`, 'success');
  } else {
    const idx = readers.findIndex(r => r.id === id);
    if (idx === -1) return;

    readers[idx] = {
      ...readers[idx],
      fullName,
      phone,
      email,
      status
    };

    showToast('Thành công', `Đã cập nhật thông tin độc giả: ${fullName}!`, 'success');
  }

  DataService.saveReaders(readers);
  closeModal('readerModal');
  App.refreshAll();
}

function toggleReaderStatus(readerId) {
  const readers = DataService.getReaders();
  const reader = readers.find(r => r.id === readerId);
  if (!reader) return;

  reader.status = (reader.status === 'Hoạt động') ? 'Bị khóa' : 'Hoạt động';
  DataService.saveReaders(readers);

  const msg = reader.status === 'Hoạt động'
    ? `Thẻ của độc giả "${reader.fullName}" đã được MỞ KHÓA.`
    : `Thẻ của độc giả "${reader.fullName}" đã BỊ KHÓA (chặn quyền mượn sách).`;

  showToast('Cập nhật trạng thái thẻ', msg, reader.status === 'Hoạt động' ? 'success' : 'warning');
  App.refreshAll();
}

function deleteReader(readerId) {
  const loans = DataService.getLoans();
  const hasActiveLoan = loans.some(l => l.readerId === readerId && l.status === 'Đang mượn');

  if (hasActiveLoan) {
    showToast('Nghiệp vụ vi phạm', 'Độc giả này đang mượn sách chưa hoàn trả, không thể xóa khỏi hệ thống!', 'danger');
    return;
  }

  if (confirm(`Bạn có chắc chắn muốn xóa độc giả mã "${readerId}"?`)) {
    const readers = DataService.getReaders().filter(r => r.id !== readerId);
    DataService.saveReaders(readers);
    showToast('Đã xóa', `Đã xóa hồ sơ độc giả "${readerId}".`, 'info');
    App.refreshAll();
  }
}

// ==============================================================================
// 9. LOANS BUSINESS LOGIC: CREATE, RENEW, RETURN
// ==============================================================================
function openLoanModal() {
  const readers = DataService.getReaders();
  const books = DataService.getBooks();

  const readerSelect = document.getElementById('loanReaderSelect');
  const bookSelect = document.getElementById('loanBookSelect');
  const borrowDateInput = document.getElementById('loanBorrowDate');
  const dueDateInput = document.getElementById('loanDueDate');
  const readerHint = document.getElementById('loanReaderStatusHint');
  const bookHint = document.getElementById('loanBookStatusHint');

  if (!readerSelect || !bookSelect) return;

  // Set default dates: borrowDate = today, dueDate = +14 days
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  borrowDateInput.value = todayStr;
  dueDateInput.value = dueDateStr;
  readerHint.innerHTML = '';
  bookHint.innerHTML = '';

  // Populate readers dropdown
  readerSelect.innerHTML = '<option value="">-- Chọn độc giả mượn --</option>' +
    readers.map(r => {
      const isBlocked = r.status === 'Bị khóa';
      return `<option value="${r.id}" data-status="${r.status}">${r.id} - ${r.fullName} ${isBlocked ? '⚠️ [THẺ BỊ KHÓA]' : '✓ [Hoạt động]'}</option>`;
    }).join('');

  // Populate books dropdown
  bookSelect.innerHTML = '<option value="">-- Chọn sách trong kho --</option>' +
    books.map(b => {
      const avail = parseInt(b.availableCopies) || 0;
      const isUnavailable = (avail <= 0 || b.status === 'Hư hỏng' || b.status === 'Thất lạc');
      let statusTag = `(Khả dụng: ${avail}/${b.totalCopies})`;
      if (avail <= 0) statusTag = '⚠️ [HẾT BẢN KHẢ DỤNG]';
      else if (b.status === 'Hư hỏng') statusTag = '⚠️ [HƯ HỎNG]';
      else if (b.status === 'Thất lạc') statusTag = '⚠️ [THẤT LẠC]';

      return `<option value="${b.id}" data-available="${avail}" data-status="${b.status}">${b.id} - ${b.title} ${statusTag}</option>`;
    }).join('');

  openModal('loanModal');
}

function handleBorrowDateChange() {
  const borrowDateVal = document.getElementById('loanBorrowDate').value;
  if (!borrowDateVal) return;

  const d = new Date(borrowDateVal);
  d.setDate(d.getDate() + 14);
  document.getElementById('loanDueDate').value = d.toISOString().split('T')[0];
}

function handleSelectReaderForLoan() {
  const select = document.getElementById('loanReaderSelect');
  const hint = document.getElementById('loanReaderStatusHint');
  const opt = select.selectedOptions[0];
  if (!opt || !opt.value) {
    hint.innerHTML = '';
    return;
  }

  const status = opt.getAttribute('data-status');
  if (status === 'Bị khóa') {
    hint.innerHTML = `<span style="color: var(--danger); font-weight: 600;">⚠️ Thẻ độc giả đang BỊ KHÓA. Hệ thống sẽ từ chối tạo phiếu!</span>`;
    showToast('Cảnh báo thẻ', 'Thẻ độc giả đang bị khóa, không được phép mượn sách!', 'warning');
  } else {
    hint.innerHTML = `<span style="color: var(--success); font-weight: 500;">✓ Thẻ độc giả hợp lệ (Được phép mượn).</span>`;
  }
}

function handleSelectBookForLoan() {
  const select = document.getElementById('loanBookSelect');
  const hint = document.getElementById('loanBookStatusHint');
  const opt = select.selectedOptions[0];
  if (!opt || !opt.value) {
    hint.innerHTML = '';
    return;
  }

  const avail = parseInt(opt.getAttribute('data-available')) || 0;
  const status = opt.getAttribute('data-status');

  if (avail <= 0 || status === 'Hư hỏng' || status === 'Thất lạc') {
    hint.innerHTML = `<span style="color: var(--danger); font-weight: 600;">⚠️ Cuốn sách này không sẵn sàng để mượn (Số bản: ${avail}, Trạng thái: ${status})!</span>`;
    showToast('Cảnh báo sách', 'Sách đã hết bản khả dụng hoặc bị hư hỏng/thất lạc!', 'warning');
  } else {
    hint.innerHTML = `<span style="color: var(--success); font-weight: 500;">✓ Sẵn sàng trong kho (${avail} bản khả dụng).</span>`;
  }
}

function handleCreateLoan(e) {
  e.preventDefault();
  const readerId = document.getElementById('loanReaderSelect').value;
  const bookId = document.getElementById('loanBookSelect').value;
  const borrowDate = document.getElementById('loanBorrowDate').value;
  const dueDate = document.getElementById('loanDueDate').value;

  if (!readerId || !bookId || !borrowDate || !dueDate) {
    showToast('Thiếu thông tin', 'Vui lòng chọn đầy đủ độc giả, sách và ngày mượn/hạn trả!', 'warning');
    return;
  }

  if (dueDate < borrowDate) {
    showToast('Ngày không hợp lệ', 'Hạn trả sách không thể trước ngày mượn!', 'danger');
    return;
  }

  const readers = DataService.getReaders();
  const books = DataService.getBooks();
  const loans = DataService.getLoans();

  const reader = readers.find(r => r.id === readerId);
  const book = books.find(b => b.id === bookId);

  if (!reader || !book) {
    showToast('Lỗi', 'Không tìm thấy dữ liệu độc giả hoặc sách!', 'danger');
    return;
  }

  // BUSINESS RULE 1: Reader card must be 'Hoạt động'
  if (reader.status !== 'Hoạt động') {
    showToast('Nghiệp vụ từ chối', `Độc giả "${reader.fullName}" có thẻ trạng thái [BỊ KHÓA]. Không thể mượn sách!`, 'danger', 4500);
    return;
  }

  // BUSINESS RULE 2: Book availableCopies > 0 and not damaged/lost
  if (book.availableCopies <= 0 || book.status === 'Hư hỏng' || book.status === 'Thất lạc') {
    showToast('Nghiệp vụ từ chối', `Sách "${book.title}" đã hết bản khả dụng hoặc đang ở trạng thái [${book.status}]!`, 'danger', 4500);
    return;
  }

  // Generate Loan ID
  const loanId = `PM${String(loans.length + 1).padStart(3, '0')}`;

  // Create new Loan record
  const newLoan = {
    id: loanId,
    readerId: reader.id,
    readerName: reader.fullName,
    bookId: book.id,
    bookTitle: book.title,
    borrowDate,
    dueDate,
    returnDate: null,
    status: 'Đang mượn',
    renewCount: 0
  };

  // Update Book: Decrease available copies by 1
  book.availableCopies = Math.max(0, book.availableCopies - 1);
  if (book.availableCopies === 0) {
    book.status = 'Đang mượn';
  } else {
    book.status = 'Đang mượn';
  }

  // Persist changes
  loans.push(newLoan);
  DataService.saveLoans(loans);
  DataService.saveBooks(books);

  closeModal('loanModal');
  showToast('Tạo phiếu mượn thành công', `Mã phiếu: ${loanId}. Đã trừ 1 bản sao khả dụng của sách "${book.title}".`, 'success', 4000);
  App.refreshAll();
}

// RENEW LOAN (+7 DAYS)
function renewLoan(loanId) {
  const loans = DataService.getLoans();
  const loan = loans.find(l => l.id === loanId);

  if (!loan) return;

  if (loan.status !== 'Đang mượn') {
    showToast('Không thể gia hạn', 'Chỉ có thể gia hạn phiếu đang mượn sách!', 'warning');
    return;
  }

  // Add 7 days to current dueDate
  const currentDueDate = new Date(loan.dueDate);
  currentDueDate.setDate(currentDueDate.getDate() + 7);
  const newDueDateStr = currentDueDate.toISOString().split('T')[0];

  loan.dueDate = newDueDateStr;
  loan.renewCount = (loan.renewCount || 0) + 1;

  DataService.saveLoans(loans);
  showToast('Gia hạn thành công', `Phiếu mượn ${loan.id} đã được gia hạn thêm 7 ngày. Hạn trả mới: ${newDueDateStr}`, 'success');
  App.refreshAll();
}

// OPEN RETURN BOOK MODAL
function openReturnModal(loanId) {
  const loans = DataService.getLoans();
  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  document.getElementById('returnLoanId').value = loan.id;
  document.getElementById('returnInfoLoanId').textContent = loan.id;
  document.getElementById('returnInfoReader').textContent = `${loan.readerName} (${loan.readerId})`;
  document.getElementById('returnInfoBook').textContent = `${loan.bookTitle} (${loan.bookId})`;
  document.getElementById('returnInfoDueDate').textContent = loan.dueDate;

  // Set default actual return date = today
  const todayStr = new Date().toISOString().split('T')[0];
  const returnInput = document.getElementById('returnActualDate');
  returnInput.value = todayStr;

  evaluateReturnStatus();
  openModal('returnModal');
}

function evaluateReturnStatus() {
  const loanId = document.getElementById('returnLoanId').value;
  const returnDateVal = document.getElementById('returnActualDate').value;
  const feedback = document.getElementById('returnStatusFeedback');
  const loans = DataService.getLoans();
  const loan = loans.find(l => l.id === loanId);

  if (!loan || !returnDateVal || !feedback) return;

  const returnDate = new Date(returnDateVal);
  const dueDate = new Date(loan.dueDate);

  if (returnDate <= dueDate) {
    feedback.style.backgroundColor = 'var(--success-light)';
    feedback.style.color = '#065f46';
    feedback.style.border = '1px solid #a7f3d0';
    feedback.innerHTML = `<strong>✓ Trả đúng hạn:</strong> Ngày trả (${returnDateVal}) nằm trong hạn quy định (${loan.dueDate}).`;
  } else {
    const diffTime = Math.abs(returnDate - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    feedback.style.backgroundColor = 'var(--danger-light)';
    feedback.style.color = '#991b1b';
    feedback.style.border = '1px solid #fecaca';
    feedback.innerHTML = `<strong>⚠️ Trả trễ hạn:</strong> Quá hạn quy định <strong>${diffDays} ngày</strong> (Hạn: ${loan.dueDate}, Ngày trả: ${returnDateVal}).`;
  }
}

function handleConfirmReturn(e) {
  e.preventDefault();
  const loanId = document.getElementById('returnLoanId').value;
  const returnDateVal = document.getElementById('returnActualDate').value;

  if (!loanId || !returnDateVal) {
    showToast('Thiếu thông tin', 'Vui lòng chọn ngày trả sách!', 'warning');
    return;
  }

  const loans = DataService.getLoans();
  const books = DataService.getBooks();

  const loan = loans.find(l => l.id === loanId);
  if (!loan) return;

  const book = books.find(b => b.id === loan.bookId);

  // Evaluate final status: Đúng hạn vs Trễ hạn
  const isLate = returnDateVal > loan.dueDate;
  loan.returnDate = returnDateVal;
  loan.status = isLate ? 'Đã trả (Trễ hạn)' : 'Đã trả (Đúng hạn)';

  // Return book to stock: Increase availableCopies by 1
  if (book) {
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
    if (book.availableCopies === book.totalCopies && book.status !== 'Hư hỏng' && book.status !== 'Thất lạc') {
      book.status = 'Còn trong kho';
    }
    DataService.saveBooks(books);
  }

  DataService.saveLoans(loans);
  closeModal('returnModal');

  const toastMsg = isLate 
    ? `Đã nhận trả sách "${loan.bookTitle}". Độc giả trả TRỄ HẠN.`
    : `Đã nhận trả sách "${loan.bookTitle}". Độc giả trả ĐÚNG HẠN.`;

  showToast('Đã hoàn tất trả sách', toastMsg, isLate ? 'warning' : 'success', 4000);
  App.refreshAll();
}

// ==============================================================================
// 10. INITIALIZATION
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
