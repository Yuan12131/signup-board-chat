import dotenv from 'dotenv';
import mysql2 from "mysql2/promise"

dotenv.config();

const dbConfig = {
  host: "localhost",
  user: "lee",
  password: process.env.DB_PASSWORD,
  database: "community",
};

const pool = mysql2.createPool(dbConfig);

export { dbConfig, pool };