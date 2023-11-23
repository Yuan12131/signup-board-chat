import fs from "fs/promises"; // Promise 기반의 fs 모듈

/**
 * JSON 파일을 비동기적으로 읽어오는 함수
 * @param {string} filePath - JSON 파일의 경로
 * @returns {Promise<object>} - 파싱된 JSON 데이터
 */
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`JSON 파일 읽기 오류 (${filePath}):`, error);
    throw error;
  }
}  

export {readJsonFile};