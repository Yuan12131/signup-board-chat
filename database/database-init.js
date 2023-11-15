import fs from "fs/promises";
import mysql from "mysql2/promise";
import { dbConfig } from './config.mjs';

const pool = mysql.createPool(dbConfig);

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (    
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

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