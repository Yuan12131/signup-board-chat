import express from 'express';
import mysql from 'mysql2';
import fs from 'fs';

const app = express();

const port = 8080;

// MySQL 데이터베이스 연결 설정
const dbConfig = {
  host: 'localhost',
  user: 'lee',
  password: 'kdt',
  database: 'community',
}

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./public/index.html");
});

app.post("/signup", (req, res) => {
  const { name, password, email } = req.body;

  fs.writeFile("./data/signUp.json", JSON.stringify({ name, password, email }, null, 2), (err) => {
      if (err) {
          console.error("Error writing data.json:", err);
          res.status(500).send("Internal Server Error");
      } else {
          res.json({
              status: "success",
              formData: { name, password, email },
          });
      }
  });
});


app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
