const AuthService = require('./auth');
const UploadHandler = require('./uploadHandlers');
const i18n = require('./i18n');

// Khởi tạo ứng dụng
class HeromiApp {
  constructor() {
    this.currentUser = null;
    this.initEventListeners();
    this.checkLoginSession();
    i18n.applyTranslations();
  }

  initEventListeners() {
    // Sidebar
    document.getElementById('sidebarToggleBtn').addEventListener('click', this.toggleSidebar);
    document.getElementById('sidebarCloseBtn').addEventListener('click', this.closeSidebar);
    
    // Đăng nhập/đăng ký
    document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
    document.getElementById('registerForm').addEventListener('submit', this.handleRegister.bind(this));
    
    // Upload
    document.getElementById('baitapUploadForm').addEventListener('submit', UploadHandler.handleBaiTapUpload);
    // Các form upload khác...
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
        throw new Error('Tên đăng nhập, mật khẩu hoặc chức vụ không đúng');
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

  // Các phương thức khác...
}

// Khởi chạy ứng dụng
window.addEventListener('DOMContentLoaded', () => {
  window.app = new HeromiApp();
});