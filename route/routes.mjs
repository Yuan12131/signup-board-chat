import express from "express";
import fs from "fs/promises"; // Promise 기반의 fs 모듈
import path from "path";
import { readJsonFile, insertRecords } from "../database/signup-database.mjs";
import { pool } from "../database/signup-database.mjs";

const router = express.Router();
const jsonFilePath = new URL("../data/signUp.json", import.meta.url).pathname;

// Serve index.html
router.get("/", async (req, res) => {
  try {
    // index.html 파일의 절대 경로
    const indexPath = path.resolve(__dirname, "./public/index.html");
    // fs/promises 모듈을 사용하여 파일을 읽어오는 비동기 코드
    const indexData = await fs.readFile(indexPath, "utf-8");
    // 클라이언트에 읽은 파일 데이터를 응답
    res.send(indexData);
  } catch (error) {
    console.error("Error reading index.html:", error);
    res.status(500).send("Internal Server Error");
  }
});

// login 요청
router.post('/login', async (req, res) => {
  try {
    const { signupId, signupPassword } = req.body;

    // 로그인 로직 수행
    const selectQuery = 'SELECT * FROM users WHERE signupId = ? AND signupPassword = ?';
    const [results] = await pool.query(selectQuery, [signupId, signupPassword]);

    if (results.length > 0) {
      // 로그인 성공
      req.session.user = { id: signupId }; // 세션에 사용자 정보 저장
      console.log('User logged in:', req.session.user);
      res.status(200).send('Login successful');
    } else {
      // 로그인 실패
      res.status(401).send('Invalid login credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

// logout 요청
router.get('/logout', (req, res) => {
  req.session.destroy(); // 세션 파기
  res.redirect('/'); // 로그아웃 후 리다이렉트할 경로 설정
});

// sign up Form
router.post("/signup", async (req, res) => {
  try {
    // POST 요청에서 속성 : id, password, email을 추출을 위한 비구조화 할당
    const { signupId, signupPassword, email } = req.body;
    // timestamp를 MySQL datetime 형식('YYYY-MM-DD HH:mm:ss')으로 변환
    const timestamp = new Date().toISOString().replace(/T/, " ").replace(/\.\d+Z$/, "");
    // signUp.json 파일을 비동기적으로 가져오기
    const data = await fs.readFile("./data/signUp.json", "utf-8");
    // JSON 데이터로 파싱
    const formData = JSON.parse(data);

    // 새로운 레코드 객체를 생성
    const newRecord = {
      signupId: signupId,
      signupPassword: signupPassword,
      email: email,
      timestamp: timestamp,
    };

    // 기존 데이터 배열에 새 레코드를 추가
    formData.inputRecords.push(newRecord);

    // 업데이트된 JSON 데이터를 파일에 쓰기
    await fs.writeFile("./data/signUp.json", JSON.stringify(formData, null, 2));

    const jsonData = await readJsonFile(jsonFilePath);
    const inputRecords = jsonData.inputRecords || [];

    await insertRecords(inputRecords);

    // 성공 응답 클라이언트에 전송
    res.json({
      status: "success",
      formData: {
        signupId: signupId,
        signupPassword: signupPassword,
        email: email,
      },
    });
  } catch (error) {
    console.error("Error handling signup:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Serve board.html
router.get("/board.html", async (req, res) => {
  try {
    const boardPath = path.resolve(__dirname, "./public/board.html");
    const boardData = await fs.readFile(boardPath, "utf-8");
    res.send(boardData);
  } catch (error) {
    console.error("Error reading board.html:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Serve chat.html
router.get("/chat.html", async (req, res) => {
  try {
    const chatPath = path.resolve(__dirname, "./public/chat.html");
    const chatData = await fs.readFile(chatPath, "utf-8");
    res.send(chatData);
  } catch (error) {
    console.error("Error reading chat.html:", error);
    res.status(500).send("Internal Server Error");
  }
});

// '/board' 경로에 대한 POST 요청 처리
router.post("/board", async (req, res) => {
  try {
    // POST 요청에서 속성 : name, password, email을 추출을 위한 비구조화 할당
    const { title, content } = req.body;
    // timestamp를 MySQL datetime 형식('YYYY-MM-DD HH:mm:ss')으로 변환
    const timestamp = new Date().toISOString().replace(/T/, " ").replace(/\.\d+Z$/, "");
    // signUp.json 파일을 비동기적으로 가져오기
    const data = await fs.readFile("./data/board.json", "utf-8");
    // JSON 데이터로 파싱
    const formData = JSON.parse(data);

    // 새로운 레코드 객체를 생성
    const newRecord = {
      id: signupId,
      title: title,
      content: content,
      timestamp: timestamp,
    };

    // 기존 데이터 배열에 새 레코드를 추가
    formData.inputRecords.push(newRecord);

    // 업데이트된 JSON 데이터를 파일에 쓰기
    await fs.writeFile("./data/board.json", JSON.stringify(formData, null, 2));

    const jsonData = await readJsonFile(jsonFilePath);
    const inputRecords = jsonData.inputRecords || [];

    await insertRecords(inputRecords);

    // 성공 응답 클라이언트에 전송
    res.json({
      status: "success",
      formData: {
        id: id,
        title: title,
        content: content,
        timestamp: timestamp,
      },
    });
  } catch (error) {
    console.error("Error handling signup:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;