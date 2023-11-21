import mysql from "mysql2/promise";
import { dbConfig } from "./config.mjs";

const pool = mysql.createPool(dbConfig);

// 테이블 쿼리
const createUsersTableQuery = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  signupId VARCHAR(255) NOT NULL,
  signupPassword VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`

const createBoardTableQuery = `CREATE TABLE IF NOT EXISTS board (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  userId INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
`

// 데이터베이스 초기화 함수
async function initializeDatabase() {
  try {
    const [result] = await pool.query(createBoardTableQuery);
    console.log("table created successfully");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

export { initializeDatabase };

// ! DB 초기화 시 명령어 : node -e "import('./database/database-init.js').then(module => module.initializeDatabase())"