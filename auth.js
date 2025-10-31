const API_BASE = process.env.API_BASE || 'http://localhost:80';

class AuthService {
  async authenticate(username, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({ message: 'Lỗi xác thực' }));
      throw new Error(err.message || 'Đăng nhập thất bại');
    }
    return res.json();
  }

  async registerUser({ username, email, password }) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role: 'Admin' })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({ message: 'Lỗi đăng ký' }));
      throw new Error(err.message || 'Đăng ký thất bại');
    }
    return res.json();
  }

  logout() {
    fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' }).catch(()=>{});
    try { localStorage.removeItem('userSession'); } catch(e){}
  }
}

module.exports = new AuthService();