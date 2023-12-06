import mysql2 from "mysql2/promise"

const dbConfig = {
  host: "ls-a62ff2ea1286f86b13000fb6a0bd15377b4c3d94.crjdkcgcewsy.ap-northeast-2.rds.amazonaws.com",
  user: "dbmasteruser",
  password: "dldmsdk1", // 실제 비밀번호로 대체
  database: "community",
  port: 3306, // MariaDB의 포트 번호 (기본값은 3306)
};

// 데이터베이스 연결을 관리하기 위한 데이터베이스 풀을 생성하는 메서드
// mysql2.createPool()을 호출하면 MySQL 데이터베이스 풀이 생성 -> 여러 연결을 관리
const pool = mysql2.createPool(dbConfig);

export { pool };