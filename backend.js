// Backend kết nối database Postgres/Supabase

const { Pool } = require('pg');

// Lấy thông tin kết nối từ biến môi trường hoặc hardcode (demo)
const POSTGRES_URL = process.env.POSTGRES_URL || "postgres://postgres.txpxsfvigxbuozoiikjr:QMHI0Kf9u8ioxvk6@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x";
const POSTGRES_USER = process.env.POSTGRES_USER || "postgres";
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "QMHI0Kf9u8ioxvk6";
const POSTGRES_HOST = process.env.POSTGRES_HOST || "db.txpxsfvigxbuozoiikjr.supabase.co";
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || "postgres";
const POSTGRES_PORT = process.env.POSTGRES_PORT || 6543;

// Khởi tạo pool kết nối
const pool = new Pool({
    connectionString: POSTGRES_URL,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    port: POSTGRES_PORT,
    ssl: { rejectUnauthorized: false }
});

// Hàm test kết nối
async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Kết nối thành công:', res.rows[0]);
    } catch (err) {
        console.error('Lỗi kết nối database:', err);
    }
}

// Ví dụ: Lấy danh sách người dùng
async function getUsers() {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
}

// Ví dụ: Thêm người dùng mới
async function addUser({ username, password, email, role }) {
    const query = 'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [username, password, email, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Xuất module cho sử dụng ở server (Express, ...)
// Ví dụ dùng: const backend = require('./backend');
module.exports = {
    pool,
    testConnection,
    getUsers,
    addUser
};

// Nếu chạy trực tiếp file này, test kết nối
if (require.main === module) {
    testConnection();
}
