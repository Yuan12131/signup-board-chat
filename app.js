import express from "express";
import mysql from "mysql2";

import fs from "fs";

const app = express();

const port = 8080;

// MySQL 데이터베이스 연결 설정
const dbConfig = {
  host: "localhost",
  user: "lee",
  password: "kdt",
  database: "community",
};

app.use(express.static("public"));

// 클라이언트로 부터 받은 http 요청 메시지 형식에서 body데이터를 해석
// 미들웨어로 수신된 JSON 요청을 파싱
app.use(express.json());

// index.html 불러오기
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// sign up form data POST 요청 처리
app.post("/signup", (req, res) => {
  // form data에서 속성을 추출하기 위한 비구조화 할당
  const { name, password, email } = req.body;
  const timestamp = new Date().toLocaleTimeString();

  fs.readFile("./data/signUp.json", (err, data) => {
    if (err) {
      console.error("Error reading signUp.json:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // 파일에서 파싱된 기존 JSON 데이터
      let formData = JSON.parse(data);

      const newRecord = {
        name: name,
        password: password,
        email: email,
        timestamp: timestamp,
      };

      // 새 레코드를 "inputRecords" 배열에 추가
      formData.inputRecords.push(newRecord);

      // 업데이트된 JSON 데이터를 다시 "signUp.json" 파일에 쓰기
      fs.writeFile(
        "./data/signUp.json",
        JSON.stringify(formData, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing signUp.json:", err);
            res.status(500).send("Internal Server Error");
          } else {
            // 성공 상태와 수신된 데이터를 포함한 JSON 응답
            res.json({
              status: "success",
              formData: {
                name: name,
                password: password,
                email: email,
              },
            });
          }
        }
      );
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
