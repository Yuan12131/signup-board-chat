import mysql2 from "mysql2/promise"
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:3306
};

// 데이터베이스 연결을 관리하기 위한 데이터베이스 풀을 생성하는 메서드
// mysql2.createPool()을 호출하면 MySQL 데이터베이스 풀이 생성 -> 여러 연결을 관리
const pool = mysql2.createPool(dbConfig);

export { pool };
