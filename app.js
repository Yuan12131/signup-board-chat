import express from 'express';

const app = express();

const port = 8080;

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
