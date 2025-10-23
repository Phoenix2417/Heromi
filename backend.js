// Backend kết nối database Postgres/Supabase
require('dotenv').config();
const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = null;
    this.connectionRetries = 3;
    this.retryDelay = 1000;
  }

  async connect() {
    if (this.pool) return;

    for (let i = 0; i < this.connectionRetries; i++) {
      try {
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });
        await this.testConnection();
        console.log('Database connected successfully');
        return;
      } catch (error) {
        console.error(`Connection attempt ${i + 1} failed:`, error);
        if (i === this.connectionRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  async testConnection() {
    try {
      const res = await this.pool.query('SELECT NOW()');
      console.log('Kết nối thành công:', res.rows[0]);
      return true;
    } catch (err) {
      console.error('Lỗi kết nối database:', err);
      return false;
    }
  }

  async query(text, params = []) {
    await this.connect();

    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Query executed', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Query error', { text, params, error });
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  // User methods
  async getUsers() {
    const { rows } = await this.query('SELECT * FROM users');
    return rows;
  }

  async getUserByUsername(username) {
    const { rows } = await this.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  async addUser({ username, password, email, role }) {
    const hashedPassword = await this.hashPassword(password);
    const query = `
      INSERT INTO users (username, password, email, role) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`;
    const values = [username, hashedPassword, email, role];
    const { rows } = await this.query(query, values);
    return rows[0];
  }

  async hashPassword(password) {
    // Thực tế nên sử dụng bcrypt hoặc thư viện mã hóa mạnh
    return password; // Đây chỉ là ví dụ, cần thay thế bằng mã hóa thực sự
  }
}

module.exports = new Database();