import express from "express";
import routes from "./route/routes.mjs";
import { createServer } from 'http';
import { Server } from 'socket.io';
const app = express();
const PORT = 8000;
const server = createServer(app);
const io = new Server(server);

// 정적 파일 미들웨어 등록
app.use(express.static("public"));

// 라우트 등록
app.use("/", routes);

server.listen(PORT, () => {
    console.log(`Server is running on port : http://localhost:${PORT}`);
});

// Socket.io 이벤트 리스너 추가
io.on('connection', (socket) => {
  console.log('A user connected');

  // 예시: 클라이언트로 메시지 전송
  socket.emit('message', 'Welcome to the chat!');

  // 클라이언트로 방 목록 전송
  socket.emit("roomList", rooms);

  // 클라이언트로부터 메시지 수신
  socket.on('chat message', (message) => {
      console.log(`Received message: ${message}`);
      // 예시: 모든 클라이언트에게 메시지 전송
      io.emit('chat message', message);
  });

  // 연결이 끊어졌을 때 처리
  socket.on('disconnect', () => {
      console.log('A user disconnected');
  });
});

// 방 정보를 저장할 배열
const rooms = [
  { id: 1, hostId: "vv", name: "Room 1" },
  { id: 2, hostId: "sh", name: "Room 2" },
  { id: 3, hostId: "hello", name: "Room 3" },
];

// 방 목록을 클라이언트에게 전달
app.get("/rooms", (req, res) => {
  res.json(rooms);
});