import fs from "fs/promises";
import express from "express";
import routes from "./route/routes.mjs";

const app = express();
const port = 8080;
// signUp.json 파일에서 데이터 읽어오기

app.use(express.static("public"));
app.use(express.json());



app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
