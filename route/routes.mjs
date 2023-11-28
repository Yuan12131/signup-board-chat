import express from "express";
import fs from "fs/promises"; // Promise 기반의 fs 모듈
import path from "path";
import multer from "multer"; // Node.js에서 파일 업로드를 처리하기 위한 미들웨어
import { pool } from "../database/config.mjs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readJsonFile } from "../database/readJsonFile.mjs";
import { insertRecords } from "../database/signup-database.mjs";
import { insertBoardRecords } from "../database/board-database.mjs";
import { insertRoomsRecord, insertMessagesRecord, loadMessages } from "../database/chat-database.mjs";

const router = express.Router();
const signupJsonFile = new URL("../data/signUp.json", import.meta.url).pathname;
const boardJsonFile = new URL("../data/board.json", import.meta.url).pathname;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// 예시: 이미지가 저장된 디렉토리를 정적 파일로 제공하는 설정
router.use("/data/uploadsImg", express.static("data/uploadsImg"));

// 세션은 사용자가 로그인한 후 서버에 의해 유지되는 데이터 저장 공간
// 로그인 세션 확인
router.get("/check-session", (req, res) => {
  if (req.session && req.session.user) {
    // 세션이 있는 경우, 세션은 유효하다고 응답
    res.status(200).send("세션 유효");
  } else {
    // 세션이 없는 경우, 세션이 유효하지 않다고 응답
    res.status(401).send("세션 유효하지 않음");
  }
});

// Serve index.html
router.get("/", async (req, res) => {
  try {
    // index.html 파일의 절대 경로
    const indexPath = path.resolve(__dirname, "./public/index.html");
    // fs/promises 모듈을 사용하여 파일을 읽어오는 비동기 코드
    const indexData = await fs.readFile(indexPath, "utf-8");
    // 클라이언트에 읽은 파일 데이터를 응답
    res.send(indexData);
  } catch (error) {
    console.error("Error reading index.html:", error);
    res.status(500).send("Internal Server Error");
  }
});

// login 요청
router.post("/login", async (req, res) => {
  try {
    const { signupId, signupPassword } = req.body;
    // 로그인 로직 수행
    // SQL 쿼리를 정의 - users 테이블에서 주어진 signupId와 signupPassword와 일치하는 레코드를 찾음
    const selectQuery =
      "SELECT * FROM users WHERE signupId = ? AND signupPassword = ?";
    // await pool.query(selectQuery, [signupId, signupPassword])를 사용하여 데이터베이스에서 쿼리를 실행
    // pool.query는 MySQL 풀에서 연결을 가져와 쿼리를 실행하며, [signupId, signupPassword]는 SQL 쿼리에 전달할 매개변수
    // 쿼리 결과를 분해하여 첫 번째 요소를 results에 할당 - results는 SQL 쿼리에 의해 반환된 결과
    const [results] = await pool.query(selectQuery, [signupId, signupPassword]);

    // 쿼리 결과가 하나 이상의 레코드를 반환했는지 확인 -> 사용자가 올바른 아이디와 비밀번호로 로그인한 경우
    if (results.length > 0) {
      // 로그인이 성공한 경우, req.session.user에 사용자 정보를 저장 -> 세션에 사용자 정보를 기록
      req.session.user = { id: signupId };
      console.log("User logged in:", req.session.user);
      res.status(200).send("Login successful");
    } else {
      // 로그인 실패
      res.status(401).send("Invalid login credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

// logout 요청
router.get("/logout", (req, res) => {
  // 현재 세션을 파괴하는 메서드
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // 클라이언트에게 응답을 보내기 전에 세션 쿠키를 클리어
      res.clearCookie("connect.sid");
      res.status(200).send("Logout successful");
    }
  });
});

// sign up Form
router.post("/signup", async (req, res) => {
  try {
    // POST 요청에서 속성 : id, password, email을 추출을 위한 비구조화 할당
    const { signupId, signupPassword, email } = req.body;
    // timestamp를 MySQL datetime 형식('YYYY-MM-DD HH:mm:ss')으로 변환
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\.\d+Z$/, "");
    // signUp.json 파일을 비동기적으로 가져오기
    const data = await fs.readFile("./data/signUp.json", "utf-8");
    // JSON 데이터로 파싱
    const formData = JSON.parse(data);

    // 새로운 레코드 객체를 생성
    const newRecord = {
      signupId: signupId,
      signupPassword: signupPassword,
      email: email,
      timestamp: timestamp,
    };

    // 기존 데이터 배열에 새 레코드를 추가
    formData.inputRecords.push(newRecord);

    // 업데이트된 JSON 데이터를 파일에 쓰기
    await fs.writeFile("./data/signUp.json", JSON.stringify(formData, null, 2));

    const jsonData = await readJsonFile(signupJsonFile);
    // jsonData에 inputRecords가 존재하지 않을 경우에는 빈 배열([])
    const inputRecords = jsonData.inputRecords || [];

    await insertRecords(inputRecords);

    // 성공 응답 클라이언트에 전송
    res.json({
      status: "success",
      formData: {
        signupId: signupId,
        signupPassword: signupPassword,
        email: email,
      },
    });
  } catch (error) {
    console.error("Error handling signup:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function checkIdDuplicate(signupId) {
  const selectQuery = "SELECT COUNT(*) as count FROM users WHERE signupId = ?";
  // 비구조화 할당
  // pool.query 함수의 결과로 반환되는 배열의 첫 번째 요소를 result 변수에 할당
  // selectQuery로 정의된 쿼리를 실행하고, 그 중에서 signupId 값이 일치하는 데이터를 검색하는 역할
  const [result] = await pool.query(selectQuery, [signupId]);

  // 결과에서 중복 여부 확인
  const isDuplicate = result[0].count > 0;
  return isDuplicate;
}

router.post("/check-id-duplicate", async (req, res) => {
  try {
    const { signupId } = req.body;

    // 중복 여부 확인 함수 호출
    const isIdDuplicate = await checkIdDuplicate(signupId);

    // 클라이언트에 응답
    res.json({ isIdDuplicate });
  } catch (error) {
    console.error("Error checking ID duplicate:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 이미지를 저장할 디렉토리 설정
const storage = multer.diskStorage({
  // 이미지 파일이 저장될 위치와 파일명을 지정
  destination: function (req, file, cb) {
    cb(null, "./data/uploadsImg"); // 'uploads/' 디렉토리에 이미지를 저장
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // 파일명 중복을 피하기 위해 고유한 파일명 생성
  },
});

// multer를 호출해서 파일 업로드를 처리하고 저장할 위치 및 파일명에 대한 설정이 담긴 storage 객체를 받는 미들웨어 설정
const upload = multer({ storage: storage });

// '/board' 경로에 대한 POST 요청 처리
router.post("/board", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const userId = req.session.user.id; // 현재 로그인된 사용자의 ID
    
    // timestamp를 MySQL datetime 형식('YYYY-MM-DD HH:mm:ss')으로 변환
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\.\d+Z$/, "");

    // 이미지 파일에 대한 정보
    const imagePath = req.file ? req.file.path : null;

    // board.json 파일을 비동기적으로 가져오기
    const data = await fs.readFile("./data/board.json", "utf-8");
    // JSON 데이터로 파싱
    const formData = JSON.parse(data);

    // 새로운 레코드 객체를 생성
    const newRecord = {
      userId: userId,
      title: title,
      content: content,
      timestamp: timestamp,
      imagePath: imagePath,
    };

    // 기존 데이터 배열에 새 레코드를 추가
    formData.inputRecords.push(newRecord);

    // 업데이트된 JSON 데이터를 파일에 쓰기
    await fs.writeFile("./data/board.json", JSON.stringify(formData, null, 2));

    const jsonData = await readJsonFile(boardJsonFile);
    const inputRecords = jsonData.inputRecords || [];

    await insertBoardRecords(inputRecords);

    // 성공 응답 클라이언트에 전송
    res.json({
      status: "success",
      formData: {
        userId: userId,
        title: title,
        content: content,
        timestamp: timestamp,
        imagePath: imagePath,
      },
    });
  } catch (error) {
    console.error("Error handling board:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /get-posts 엔드포인트에 대한 처리
router.get("/get-posts", async (req, res) => {
  try {
    // 시간 순으로 정렬된 글 목록 조회 쿼리
    const query =
      "SELECT userId, title, content, timestamp, imagePath FROM board ORDER BY timestamp DESC";

    // 쿼리 실행
    const [results] = await pool.query(query);

    // 정상적으로 글 목록을 조회한 경우 클라이언트로 보내기
    res.json(results);
  } catch (err) {
    console.error("글 목록 조회 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

const attachSocketEvents = (io) => {
  // 방 목록
  const rooms = [
    { id: 1, hostId: "vv", roomId: "Room 1" },
    { id: 2, hostId: "sh", roomId: "Room 2" },
    { id: 3, hostId: "hello", roomId: "Room 3" },
  ];

  io.on("connection", (socket) => {
    // 초기 방 목록을 클라이언트에게 보내줌
    socket.emit("roomList", rooms);

    // 클라이언트가 userIdRequest 이벤트를 발생시키면 사용자 ID를 전송
    socket.on("userIdRequest", () => {
      const userId = socket.request.session.user;
      socket.emit("userId", { userId });
    });

    // 방 입장 시 클라이언트에서 "joinRoom" 이벤트가 발생하면 이 이벤트를 처리하는 콜백 함수가 실행
    socket.on("joinRoom", async (data) => {
      const { roomId } = data; // 클라이언트에서 전달된 데이터 객체에서 roomId를 추출
      const userId = socket.request.session.user.id;
      socket.join(roomId);

      try {
        const roomInfo = rooms.find((room) => room.roomId === roomId);

        if (roomInfo) {
          const isHost = roomInfo.hostId === userId;

          // DB에 입장 정보 저장
          await insertRoomsRecord({
            roomId: roomId,
            userId: userId,
            isHost: isHost,
            timestamp: new Date().toISOString(),
          });

          // DB에서 해당 방의 이전 메시지를 불러옴
          const messages = await loadMessages(roomId);
          socket.emit("loadMessages", messages); // 클라이언트에 전송
        } else {
          // 방이 존재하지 않는 경우 등에 대한 처리
          socket.emit("joinRoomError", { message: "Invalid room or user" });
        }
      } catch (error) {
        console.error("Error during user authentication:", error);
        socket.emit("joinRoomError", { message: "User authentication failed" });
      }
    });

    socket.on("sendMessage", async (data) => {
      const { message, roomId } = data;
      const userId = socket.request.session.user.id;

      try {
        const roomInfo = rooms.find((room) => room.roomId === roomId);

        if (roomInfo) {
          const isHost = roomInfo.hostId === userId;

          // DB에 메시지 저장
          await insertMessagesRecord({
            roomId: roomId,
            userId: userId,
            isHost: isHost,
            message: message,
            timestamp: new Date().toISOString(),
          });

          // 방에 속한 사용자들에게 메시지 전송
          io.to(roomId).emit("newMessage", {
            userId,
            isHost,
            message,
            timestamp: new Date().toISOString(),
          });
        } else {
          // 방이 존재하지 않는 경우 등에 대한 처리
          socket.emit("messageError", { message: "Invalid message or user" });
        }
      } catch (error) {
        console.error("Error during user authentication:", error);
        socket.emit("messageError", { message: "User authentication failed" });
      }
    });
  });
};

export { router, attachSocketEvents };