import express from "express";
import routes from "./route/routes.mjs";

const app = express();
const port = 8080;

// 정적 파일 미들웨어 등록
app.use(express.static("public"));

// JSON 파싱 미들웨어 등록
app.use(express.json());

// 라우트 등록
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});