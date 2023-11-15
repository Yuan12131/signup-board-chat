import fs from "fs/promises";
import mysql from "mysql2/promise"; // Promise 기반 MySQL2 모듈 사용
import { dbConfig } from './config.mjs';

// MySQL Promise 기반 연결
// createPool : MySQL 데이터베이스에 연결하기 위한 연결 풀을 생성
// 연결 풀은 애플리케이션에서 데이터베이스에 연결할 때 이미 생성된 연결을 풀에서 가져와 사용함으로써 성능 향상
const pool = mysql.createPool(dbConfig);


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
    const { name, password, email, timestamp } = record;
  
    // 삽입 쿼리
    const insertQuery = `
      INSERT INTO ${tableName} (name, password, email, timestamp)
      VALUES (?, ?, ?, ?);
    `;

    // 삽입에 사용할 값들
    const values = [name, password, email, timestamp];

    // 쿼리 실행 및 결과 출력
    const [result] = await pool.query(insertQuery, values);
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

export {readJsonFile, insertRecords}