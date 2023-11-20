import mysql from "mysql2/promise";
import { dbConfig } from "./config.mjs";

const pool = mysql.createPool(dbConfig);

// 테이블 쿼리
const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (    
  id INT AUTO_INCREMENT PRIMARY KEY,
  signupId VARCHAR(255) NOT NULL,
  signupPassword VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// 데이터베이스 초기화 함수
async function initializeDatabase() {
  try {
    const [result] = await pool.query(createTableQuery);
    console.log("Users table created successfully");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

export { initializeDatabase };

// ! DB 초기화 시 명령어 : node -e "import('./database/database-init.js').then(module => module.initializeDatabase())"