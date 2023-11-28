import { pool } from "./config.mjs";

const tableName = "board";

/**
 * 사용자 레코드를 users 테이블에 삽입하는 함수
 * @param {object} record - 사용자 레코드 객체
 * @returns {Promise<object>} - 삽입 결과
 */
async function insertBoardRecord(record) {
  try {
    const { userId, title, content, timestamp, imagePath } = record;

    const insertQuery = `
      INSERT INTO ${tableName} (userId, title, content, timestamp, imagePath)
      VALUES (?, ?, ?, ?, ?);
    `;

    const values = [userId, title, content, timestamp, imagePath];
    const [result] = await pool.query(insertQuery, values);
    return result;
  } catch (err) {
    console.error("board 테이블에 데이터를 삽입하는 중 오류 발생:", err);
    throw err;
  }
}

/**
 * 여러 레코드를 users 테이블에 삽입하는 함수
 * @param {Array<object>} records - 사용자 레코드 객체들의 배열
 * @returns {Promise<void>} - 모든 레코드가 삽입되면 해결되는 Promise
 */
async function insertBoardRecords(records) {
  for (const record of records) {
    try {
      await insertBoardRecord(record);
    } catch (error) {
      console.error("Board 레코드 삽입 중 오류 발생:", error);
    }
  }
}

export { insertBoardRecords };