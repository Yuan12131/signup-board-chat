const socket = io("http://15.165.148.2:8000", {
  transports: ["websocket"],
});
const chatForm = document.getElementById("chatForm");
const chatRoom = document.getElementById("roomList");
const title = document.getElementById("title");
const chatInput = document.getElementById("chatInput");
const messagesDiv = document.getElementById("chat");
const userProfile = document.getElementById("user");

function getCurrentRoomId() {
  const titleText = title.textContent;
  // 텍스트에서 "Room : "이라는 문자열이 처음으로 등장하는 인덱스를 찾아, 만약 해당 문자열이 없으면 -1이 반환
  const roomIdIndex = titleText.indexOf("");

  if (roomIdIndex !== -1) {
    const roomId = titleText.substring(roomIdIndex + "".length);
    return roomId.trim(); // 추출한 ID의 앞뒤 공백을 제거하고 정리된 방 ID를 반환
  }

  return null;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedTimestamp;
}

function displayMessage(message, side) {
  const formattedTimestamp = new Date(message.timestamp).toLocaleString();

  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container", side);
  messagesDiv.appendChild(messageContainer);

  const profilePic = document.createElement("div");
  profilePic.classList.add("profilePic");
  profilePic.appendChild(document.createTextNode("👤"));
  messageContainer.appendChild(profilePic);

  const userMessageContainer = document.createElement("div");
  userMessageContainer.classList.add("userMessageContainer");

  const userId = document.createElement("div");
  userId.classList.add("userId");
  userId.textContent = message.userId;

  const messageText = document.createElement("p");
  messageText.classList.add("messageText");
  messageText.textContent = message.message;

  const timestampDiv = document.createElement("div");
  timestampDiv.classList.add("timestamp", side);
  timestampDiv.textContent = formattedTimestamp;

  messageContainer.appendChild(userMessageContainer);
  userMessageContainer.appendChild(userId);
  userMessageContainer.appendChild(messageText);
  messageText.appendChild(timestampDiv);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage(message) {
  const currentRoomId = getCurrentRoomId();
  if (currentRoomId) {
    // 서버로 메시지 전송
    socket.emit("sendMessage", { message, roomId: currentRoomId });
  }
}

// 소켓에 연결되면 userId 이벤트를 발생시켜 사용자 ID를 요청
socket.on("connect", () => {
  socket.emit("userIdRequest");
});

// 서버로부터 받은 사용자 ID를 출력
socket.on("userId", (user) => {
  userProfile.textContent = `🫶 ${user.userId.id} 🫶`;
});

socket.on("roomList", (rooms) => {
  // 받은 방 목록을 활용하여 UI에 표시
  rooms.forEach((room) => {
    const roomItem = document.createElement("li");
    roomItem.textContent = `${room.roomId} (Host: ${room.hostId})`;
    chatRoom.appendChild(roomItem);
    // 클릭 이벤트 핸들러 추가
    roomItem.addEventListener("click", () => {
      // 해당 방의 정보를 이용하여 joinRoom 이벤트 발생
      socket.emit("joinRoom", { roomId: room.roomId });
      title.textContent = `${room.roomId}`;
    });
  });
});

// 방에 입장할 때 서버에 이전 메세지를 전달받음
socket.on("joinRoom", (data) => {
  const { roomId } = data;

  // 이전 메시지를 요청
  socket.emit("loadMessages", { roomId });
});

// 서버로부터 받아온 메시지를 화면에 출력
socket.on("loadMessages", (messages) => {
  // 화면 초기화
  messagesDiv.innerHTML = "";

  // 왼쪽과 오른쪽으로 나누어 출력
  messages.forEach((message) => {
    if (message.isHost) {
      displayMessage(message, "left"); // 호스트는 왼쪽에 출력
    } else {
      displayMessage(message, "right"); // 호스트가 아닌 경우 오른쪽에 출력
    }
  });
});

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();  // 기본 제출 동작 방지

  const message = chatInput.value;
  sendMessage(message);
  chatInput.value = "";
});

// 서버에서 메시지를 전달받아 화면에 출력
socket.on("newMessage", (message) => {
  // 왼쪽과 오른쪽으로 나누어 출력
  if (message.isHost) {
    displayMessage(message, "left"); // 호스트는 왼쪽에 출력
  } else {
    displayMessage(message, "right"); // 호스트가 아닌 경우 오른쪽에 출력
  }
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});