const db = require('./backend');
const { v4: uuidv4 } = require('uuid');

class AuthService {
  static isTeacher(user) {
    return user && user.role === 'Giáo viên';
  }

  static isAdmin(user) {
    return user && user.role === 'Admin';
  }

  static async authenticate(username, password, role) {
    if (username === 'admin') {
      const user = await db.getUserByUsername('admin');
      if (user && user.password === password && user.role === 'Admin') {
        return user;
      }
      return null;
    }

    const user = await db.getUserByUsername(username);
    if (user && user.password === password && user.role === role) {
      return user;
    }
    return null;
  }

  static async registerUser({ username, email, password, role }) {
    if (username === 'admin') {
      throw new Error('Không thể đăng ký tài khoản admin');
    }

    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }

    return db.addUser({ username, email, password, role });
  }

  static generateSessionToken() {
    return uuidv4();
  }
}

module.exports = AuthService;