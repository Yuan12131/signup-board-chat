import express from "express";
import cors from "cors";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";
import { router, attachSocketEvents } from "./route/routes.mjs";

const app = express();

// Socket.io는 HTTP 서버를 사용하여 웹소켓 연결을 설정 (HTTP 서버 위에서 작동)
// createServer(app)를 사용하여 만든 HTTP 서버 객체를 이용해 소켓 연결을 활성화
const server = createServer(app);
// Socket.io의 Server 클래스를 사용하여 웹소켓 서버를 생성
// ! io 객체는 웹소켓 연결을 관리하고, 클라이언트와 서버 간의 양방향 통신을 담당
const io = new Server(server, { path: "/socket.io" });
const PORT = 8000;

const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: new session.MemoryStore(),
});

app.use(sessionMiddleware);
app.use(cors());

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

server.listen(PORT, (err) => {
  if (err) {
    console.error("Server err : ", err);
  } else {
    console.log(`Server running : http://localhost:${PORT}`);
  }
});