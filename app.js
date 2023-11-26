import express from "express";
import { createServer } from 'http';  // http 모듈 추가
import { router, attachSocketEvents } from "./route/routes.mjs";
import { Server } from 'socket.io';
import session from "express-session";
import cors from 'cors';

const app = express();
const server = createServer(app);  // createServer 함수 사용
const io = new Server(server, { path: '/socket.io' });
const PORT = 8000;

const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: new session.MemoryStore(),
});

app.use(sessionMiddleware);

// 정적 파일 미들웨어 등록
app.use(express.static("public"));

app.use(cors());

// 라우트 등록
app.use("/", router);

// Socket.io 이벤트 리스너 추가
attachSocketEvents(io); // attachSocketEvents 함수에 io를 전달하도록 수정

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

server.listen(PORT, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
  } else {
    console.log(`Server is running on port: http://localhost:${PORT}`);
  }
});