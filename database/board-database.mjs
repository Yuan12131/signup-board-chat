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

    // 중복 체크 쿼리
    const duplicateCheckQuery = `
        SELECT * FROM ${tableName} WHERE title = ? AND userId = ? AND timestamp = ?;
      `;

    const duplicateCheckValues = [title, userId, timestamp];
    const [existingRecords] = await pool.query(
      duplicateCheckQuery,
      duplicateCheckValues
    );

    if (existingRecords.length > 0) {
      // 이미 존재하는 레코드가 있으면 중복 처리
      return { status: "skipped", message: "레코드가 이미 존재합니다" };
    }

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