import express from "express";
import routes from "./route/routes.mjs";
import fs from "fs/promises";
import mysql from "mysql2/promise"; // Promise 기반 MySQL2 모듈 사용

const app = express();
const port = 8080;

import dotenv from 'dotenv';
dotenv.config();

// MySQL 데이터베이스 연결 설정
const dbConfig = {
  host: "localhost",
  user: "lee",
  // 비밀번호 보안을 위한 모듈
  password: process.env.DB_PASSWORD,
  database: "community",
};

// MySQL Promise 기반 연결
// createPool : MySQL 데이터베이스에 연결하기 위한 연결 풀을 생성
// 연결 풀은 애플리케이션에서 데이터베이스에 연결할 때 이미 생성된 연결을 풀에서 가져와 사용함으로써 성능 향상
const pool = mysql.createPool(dbConfig);

// 데이터베이스의 테이블 생성 쿼리
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (    
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Promise 기반으로 데이터베이스에 쿼리를 실행하고 그 결과를 반환
try {
  // 연결 풀에서 연결을 가져와 createTableQuery 쿼리를 실행 -> 프로미스 반환
  // await 키워드를 사용하여 프로미스가 완료될 때까지 대기 -> result에는 쿼리 실행 결과
  const [result] = await pool.query(createTableQuery);
  console.log("Users table created successfully:", result);
} catch (err) {
  console.error("Error creating users table:", err);
}

// signUp.json 파일에서 데이터 읽어오기
const jsonFilePath = "./data/signUp.json";

// 서버 시작 함수
async function startServer() {
  try {
    const jsonData = await readJsonFile(jsonFilePath);
    const inputRecords = jsonData.inputRecords || [];

    // 각 레코드를 비동기적으로 삽입
    await insertRecords(inputRecords);

    // 데이터베이스에 레코드 삽입 후 연결 종료
    await pool.end();
  } catch (error) {
    console.error("Error reading JSON file or inserting records:", error);
    await pool.end();
  }
}

startServer();

// JSON 파일 읽기 함수
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file (${filePath}):`, error);
    throw error;
  }
}

const tableName = "users";

// 레코드 삽입 함수
async function insertRecord(record) {
  try {
    const { name, password, email } = record;

    // 현재 날짜 및 시간을 ISO 형식으로 변환 ("YYYY-MM-DD HH:mm:ss" 형식)
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    // 삽입 쿼리
    const insertQuery = `
      INSERT INTO ${tableName} (name, password, email, timestamp)
      VALUES (?, ?, ?, ?);
    `;

    // 삽입에 사용할 값들
    const values = [name, password, email, timestamp];

    // 쿼리 실행 및 결과 출력
    const [result] = await pool.query(insertQuery, values);
    console.log("Data inserted successfully:", result);
    return result;
  } catch (err) {
    console.error("Error inserting data into users table:", err);
    throw err;
  }
}

// 여러 레코드 삽입 함수 - 여러 사용자의 데이터를 한 번에 데이터베이스에 추가하거나 여러 데이터를 초기화할 때 사용
async function insertRecords(records) {
  for (const record of records) {
    try {
      await insertRecord(record);
    } catch (error) {
      console.error("Error inserting record:", error);
    }
  }
}

app.use(express.static("public"));
app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
