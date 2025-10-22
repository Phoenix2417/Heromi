const AuthService = require('./auth');
const UploadHandler = require('./uploadHandlers');

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
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new HeromiApp();
});
