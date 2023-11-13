import express from 'express';
import routes from './route/routes.mjs';

import mysql from "mysql2";

// MySQL 데이터베이스 연결 설정
const dbConfig = {
  host: "localhost",
  user: "lee",
  password: "kdt",
  database: "community",
};

const app = express();
const port = 8080;

app.use(express.static('public'));
app.use(express.json());

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
