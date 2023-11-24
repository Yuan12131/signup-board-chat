import { pool } from "./config.mjs";

// MySQL 연결 풀 생성
const tableName = "chat";

// 서버 측 JavaScript 코드
socket.on('chat message', async function (data) {
  const messagesFilePath = path.join(__dirname, 'messages.json');

  try {
    // 기존 메시지 데이터 읽기
    const existingMessages = await readMessagesFromFile(messagesFilePath);

    // 새 메시지 추가
    existingMessages.push(data);

    // 메시지 데이터를 JSON 파일에 저장
    await fs.writeFile(messagesFilePath, JSON.stringify(existingMessages, null, 2));

    // 데이터베이스에도 저장
    await saveMessageToDatabase(data);
  } catch (error) {
    console.error('Error saving message to JSON file and database:', error.message);
  }
});

// JSON 파일에서 메시지 데이터 읽기
async function readMessagesFromFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    // 파일이 없거나 오류가 발생하면 빈 배열 반환
    return [];
  }
}

// 데이터베이스에 메시지 저장
async function saveMessageToDatabase(data) {
  try {
    const { userId, message } = data;
    const query = 'INSERT INTO messages (user_id, message) VALUES ($1, $2)';
    const values = [userId, message];
    await pool.query(query, values);
  } catch (error) {
    console.error('Error saving message to database:', error.message);
  }
}

/**
 * 사용자 레코드를 users 테이블에 삽입하는 함수
 * @param {object} record - 사용자 레코드 객체
 * @returns {Promise<object>} - 삽입 결과
 */
async function insertChatRecord(record) {
  try {
    const { message, userId, timestamp, imagePath } = record;

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
async function insertChatRecords(records) {
  for (const record of records) {
    try {
      await insertChatRecord(record);
    } catch (error) {
      console.error("Board 레코드 삽입 중 오류 발생:", error);
    }
  }
}

export { insertChatRecords };