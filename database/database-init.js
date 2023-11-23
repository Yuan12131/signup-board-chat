import { pool } from "./config.mjs";

// 테이블 쿼리
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    signupId VARCHAR(255) NOT NULL,
    signupPassword VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY unique_signupId (signupId)
  );
`

const createBoardTableQuery = `
  CREATE TABLE IF NOT EXISTS board (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    userId VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    imagePath VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(signupId)
  );
`;

const createChatTableQuery = `CREATE TABLE IF NOT EXISTS chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Message TEXT NOT NULL,
  userId VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(signupId)
);
`;

// 데이터베이스 초기화 함수
async function initializeDatabase() {
  try {
    const [result1] = await pool.query(createUsersTableQuery);
    const [result2] = await pool.query(createBoardTableQuery);
    const [result3] = await pool.query(createChatTableQuery);
    console.log("table created successfully");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

export { initializeDatabase };

// ! DB 초기화 시 명령어 : node -e "import('./database/database-init.js').then(module => module.initializeDatabase())"