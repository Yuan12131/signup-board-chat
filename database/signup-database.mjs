import { pool } from "./config.mjs";

const tableName = "users";

/**
 * 사용자 레코드를 users 테이블에 삽입하는 함수
 * @param {object} record - 사용자 레코드 객체
 * @returns {Promise<object>} - 삽입 결과
 */
async function insertRecord(record) {
  try {
    const { signupId, signupPassword, email, timestamp } = record;

    // 중복 체크 쿼리
    const duplicateCheckQuery = `
      SELECT * FROM ${tableName} WHERE signupId = ? AND email = ? AND timestamp = ?;
    `;

    const duplicateCheckValues = [signupId, email, timestamp];
    const [existingRecords] = await pool.query(
      duplicateCheckQuery,
      duplicateCheckValues
    );

    if (existingRecords.length > 0) {
      // 이미 존재하는 레코드가 있으면 중복 처리
      return { status: "skipped", message: "레코드가 이미 존재합니다" };
    }

    // 삽입 쿼리
    const insertQuery = `
      INSERT INTO ${tableName} (signupId, signupPassword, email, timestamp)
      VALUES (?, ?, ?, ?);
    `;

    const values = [signupId, signupPassword, email, timestamp];
    const [result] = await pool.query(insertQuery, values);
    return result;
  } catch (err) {
    console.error("users 테이블에 데이터를 삽입하는 중 오류 발생:", err);
    throw err;
  }
}

/**
 * 여러 레코드를 users 테이블에 삽입하는 함수
 * @param {Array<object>} records - 사용자 레코드 객체들의 배열
 * @returns {Promise<void>} - 모든 레코드가 삽입되면 해결되는 Promise
 */
async function insertRecords(records) {
  for (const record of records) {
    try {
      await insertRecord(record);
    } catch (error) {
      console.error("레코드 삽입 중 오류 발생:", error);
    }
  }
}

export { insertRecords };