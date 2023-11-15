import fs from "fs/promises";
import express from "express";
import routes from "./route/routes.mjs";
import {initializeDatabase, readJsonFile, insertRecord, insertRecords} from "./database/signup-database.mjs"

const app = express();
const port = 8080;

// 데이터베이스 초기화
await initializeDatabase();

// signUp.json 파일에서 데이터 읽어오기
const jsonFilePath = "./data/signUp.json";

// 서버 시작 함수
async function startServer() {
  try {
    const jsonData = await readJsonFile(jsonFilePath);
    const inputRecords = jsonData.inputRecords || [];

    // 각 레코드를 비동기적으로 삽입
    await insertRecords(inputRecords);

    // 데이터베이스에 레코드 삽입 후 연결 종료
    await pool.end();
  } catch (error) {
    console.error("Error reading JSON file or inserting records:", error);
    await pool.end();
  }
}

startServer();

app.use(express.static("public"));
app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
