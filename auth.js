const db = require('./backend');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class AuthService {
  constructor(db) {
    this.db = db;
    this.currentUser = null;
    this.sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
  }

  async login(username, password) {
    try {
      const user = await this.db.getUserByUsername(username);
      if (!user) {
        throw new Error('Tài khoản không tồn tại');
      }

      const isValidPassword = await this.verifyPassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Mật khẩu không chính xác');
      }

      const session = this.createSession(user);
      this.currentUser = user;
      return { user, session };
    } catch (error) {
      throw new Error(`Đăng nhập thất bại: ${error.message}`);
    }
  }

  async register(userData) {
    try {
      // Validate
      this.validateUserData(userData);

      // Check existing
      const existing = await this.db.getUserByUsername(userData.username);
      if (existing) {
        throw new Error('Tên đăng nhập đã tồn tại');
      }

      // Hash password
      userData.password = await this.hashPassword(userData.password);
      
      // Create user without role
      const user = await this.db.addUser({
        username: userData.username,
        email: userData.email,
        password: userData.password
      });
      return user;
    } catch (error) {
      throw new Error(`Đăng ký thất bại: ${error.message}`);
    }
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  createSession(user) {
    const sessionId = uuidv4();
    const expires = Date.now() + this.sessionDuration;
    // Save session to database or in-memory store
    return { sessionId, expires };
  }

  validateUserData({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error('Thiếu thông tin đăng ký');
    }
    // Add more validation as needed
  }
}

module.exports = new AuthService(require('./backend'));