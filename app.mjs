import express from "express";
import { createServer } from 'http';  // http 모듈 추가
import { Server } from 'socket.io';
import session from "express-session";
import cors from 'cors';
import { pool } from "./database/config.mjs";
import { router, attachSocketEvents } from "./route/routes.mjs";

const app = express();

// Socket.io는 HTTP 서버를 사용하여 웹소켓 연결을 설정 (HTTP 서버 위에서 작동)
// createServer(app)를 사용하여 만든 HTTP 서버 객체를 이용해 소켓 연결을 활성화
const server = createServer(app);

// Socket.io의 Server 클래스를 사용하여 웹소켓 서버를 생성
// io 객체는 웹소켓 연결을 관리하고, 클라이언트와 서버 간의 양방향 통신을 담당
const io = new Server(server, {
  path: "/socket.io",
});

const PORT = 8000;

// Express 애플리케이션에서 사용되는 세션 관리를 위한 미들웨어를 설정
// 세션은 사용자의 상태를 서버에 저장하고 유지하는 데 사용되며, 로그인 상태를 유지하거나 사용자에 대한 정보를 저장하는 데 주로 활용
const sessionMiddleware = session({
  secret: "kdt",
  resave: false,
  saveUninitialized: false,
  store: new session.MemoryStore(),
});

app.use(cors({
  origin: "http://15.165.148.2:8000",
  methods: ["GET", "POST"],
}));

app.use(sessionMiddleware);

// 정적 파일 미들웨어 등록
app.use(express.static("public"));

// 라우트 등록
app.use("/", router);

// Socket.io 이벤트 리스너 -> attachSocketEvents 함수에 io를 전달
attachSocketEvents(io);

// express에서는 req, res 객체에 세션을 저장하고, 관리
// 소켓 연결(socket connection)에 대한 세션 정보를 처리해야 함
io.use((socket, next) => {
  // 요청 객체, 응답 객체 (기본값)
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

// 프로그램 종료 시 MySQL 연결 종료
process.on("SIGINT", async () => {
  if (pool._closed) {
    console.log("MySQL connection is already closed.");
  } else {
    await pool.end();
    console.log("MySQL connection closed.");
  }
  process.exit();
});

server.listen(PORT, (err) => {
  if (err) {
    console.error("Server err : ", err);
  } else {
    console.log(`Server running : http://15.165.148.2:${PORT}`);
  }
});