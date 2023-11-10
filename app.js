import express from 'express';
import mysql from 'mysql2';

const app = express();

const port = 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "../public/index.html");
});

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
