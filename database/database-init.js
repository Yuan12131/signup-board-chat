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
async function initializeDatabase() {
  try {
    // 연결 풀에서 연결을 가져와 createTableQuery 쿼리를 실행 -> 프로미스 반환
    // await 키워드를 사용하여 프로미스가 완료될 때까지 대기 -> result에는 쿼리 실행 결과
    const [result] = await pool.query(createTableQuery);
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

// ! DB 초기화 시 명령어 : node -e "require('./database/database-init.js').initializeDatabase()"