import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: "localhost",
  user: "lee",
  password: process.env.DB_PASSWORD,
  database: "community",
};

export { dbConfig };