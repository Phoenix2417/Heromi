const API_BASE = process.env.API_BASE || 'http://localhost:3000';

// Minimal AuthService wrapper that main.js expects (authenticate, registerUser)
const AuthService = {
  async authenticate(username, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }), // no role
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({ message: 'Đăng nhập thất bại' }));
      throw new Error(err.message || 'Đăng nhập thất bại');
    }
    return res.json();
  },

  async registerUser({ username, email, password }) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role: 'Admin' }), // force Admin
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({ message: 'Đăng ký thất bại' }));
      throw new Error(err.message || 'Đăng ký thất bại');
    }
    return res.json();
  }
};

// Lưu trạng thái trang hiện tại
function saveCurrentPage(page) {
  localStorage.setItem('currentPage', page);
}

// Chuyển đến trang cụ thể
function navigateToPage(page) {
  // Giả sử mỗi trang là một section có id tương ứng
  const allPages = document.querySelectorAll('.page-section');
  allPages.forEach(p => p.style.display = 'none');

  const targetPage = document.getElementById(page);
  if (targetPage) {
    targetPage.style.display = 'block';
    saveCurrentPage(page);
  }
}

class HeromiApp {
  constructor() {
    this.currentUser = null;
    this.API_BASE_URL = API_BASE; // use localhost:3000
    this.initEventListeners();
    this.checkLoginSession();
    this.loadTranslations();
  }

  initEventListeners() {
    // Sidebar
    this.sidebar = document.getElementById('sidebar');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');
    this.sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

    this.sidebarToggleBtn.addEventListener('click', () => this.toggleSidebar());
    this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        this.handleNavigation(e.currentTarget.dataset.section);
      });
    });

    // Auth
    document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
  }

  async checkLoginSession() {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
        this.updateUIForUser();
      } catch (error) {
        localStorage.removeItem('userSession');
      }
    }
  }

  updateUIForUser() {
    if (this.currentUser) {
      // Show upload buttons for all logged in users
      document.querySelectorAll('.upload-btn').forEach(btn => {
        btn.style.display = 'block';
      });
    } else {
      document.querySelectorAll('.upload-btn').forEach(btn => {
        btn.style.display = 'none';
      });
    }
  }

  handleNavigation(section) {
    this.hideAllSections();
    if (section) {
      const sectionEl = document.getElementById(`section-${section}`);
      if (sectionEl) {
        sectionEl.style.display = 'block';
        this.updateActiveNavItem(section);
        if (window.innerWidth <= 768) this.closeSidebar();
      }
    }
  }

  restoreLastPage() {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage && savedPage !== 'dashboard') {
      navigateToPage(savedPage);
    } else {
      navigateToPage('dashboard'); // mặc định là trang dashboard
    }
  }

  async handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    try {
      const user = await AuthService.authenticate(username, password, role);
      if (user) {
        this.currentUser = user;
        this.saveLoginSession(user);
        this.showUserProfile();
        this.closePopup();
      } else {
        throw new Error('Tên đăng nhập, mật khẩu không đúng');
      }
    } catch (error) {
      document.getElementById('loginError').textContent = error.message;
    }
  }

  async handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    try {
      const newUser = await AuthService.registerUser({ username, email, password, role });
      if (newUser) {
        this.currentUser = newUser;
        this.saveLoginSession(newUser);
        this.showUserProfile();
        this.closePopup();
      } else {
        throw new Error('Đăng ký không thành công');
      }
    } catch (error) {
      document.getElementById('registerError').textContent = error.message;
    }
  }

  async handleUpload(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Remove role check, only verify login
      if (!this.currentUser) {
        throw new Error('Vui lòng đăng nhập để upload file');
      }

      const response = await fetch(`${this.API_BASE_URL}/api/upload/${type}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new HeromiApp();
});
