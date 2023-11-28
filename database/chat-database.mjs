import { pool } from "../database/config.mjs";

async function insertRoomsRecord(record) {
  try {
    const { roomId, userId, isHost } = record;

    const timestamp = new Date()
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");

    const insertQuery = `
  INSERT INTO rooms (roomId, userId, isHost, timestamp)
  VALUES (?, ?, ?, ?);
`;

    const values = [roomId, userId, isHost, timestamp];
    const [result] = await pool.query(insertQuery, values);
    return result;
  } catch (err) {
    console.error("rooms 테이블에 데이터를 삽입하는 중 오류 발생:", err);
    throw err;
  }
}

async function insertMessagesRecord(record) {
  try {
    const { roomId, userId, isHost, message } = record;

    const timestamp = new Date()
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");

    const insertQuery = `
  INSERT INTO messages (roomId, userId, isHost, message, timestamp)
  VALUES (?, ?, ?, ?, ?);
`;

    const values = [roomId, userId, isHost, message, timestamp];
    const [result] = await pool.query(insertQuery, values);
    return result;
  } catch (err) {
    console.error("messages 테이블에 데이터를 삽입하는 중 오류 발생:", err);
    throw err;
  }
}

async function loadMessages(roomId) {
  try {
    const messages = await getMessagesByRoomId(roomId);
    return messages;
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error;
  }
}

async function getMessagesByRoomId(roomId) {
  const selectQuery =
    "SELECT * FROM messages WHERE roomId = ? ORDER BY timestamp;";
  const [messages] = await pool.query(selectQuery, [roomId]);
  return messages;
}

export { insertRoomsRecord, insertMessagesRecord, loadMessages }