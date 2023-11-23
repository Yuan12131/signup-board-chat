import mysql2 from "mysql2/promise"

const dbConfig = {
  host: "localhost",
  user: "lee",
  password: "kdt",
  database: "community",
};

const pool = mysql2.createPool(dbConfig);

export { pool };