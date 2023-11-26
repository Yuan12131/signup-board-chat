const socket = io('http://localhost:8000', { path: '/socket.io' });

const chatBtn = document.getElementById("chatBtn");
const chatRoom = document.getElementById('roomList');
const title = document.getElementById("title");
const chatInput = document.getElementById("chatInput");
const messagesDiv = document.getElementById('chat');

chatBtn.addEventListener("click", function () {
  const message = chatInput.value;

  // 전송한 메시지와 현재 선택된 방의 roomId를 서버로 전송
  const currentRoomId = getCurrentRoomId();
  if (currentRoomId) {
    socket.emit('sendMessage', { message, roomId: currentRoomId });
  }

  // 메시지 입력 필드 초기화
  chatInput.value = '';
});

function getCurrentRoomId() {
  const titleText = title.textContent;
  const roomIdIndex = titleText.indexOf("Room : ");
  
  if (roomIdIndex !== -1) {
    const roomId = titleText.substring(roomIdIndex + "Room : ".length);
    return roomId.trim();
  }
  
  return null;
}

// 클라이언트 측 JavaScript
function displayMessage(message) {
  const isCurrentUser = message.userId === currentUser.id;
  const sideClass = isCurrentUser ? 'right' : 'left';

  messagesDiv.innerHTML += `<div class="message ${sideClass}">
      <span>${message.username}:</span>
      <p>${message.content}</p>
  </div>`;
}

socket.on('roomList', (rooms) => {
  // 받은 방 목록을 활용하여 UI에 표시
  rooms.forEach((room) => {
    const roomItem = document.createElement('li');
    roomItem.textContent = `Room : ${room.roomId} (Host: ${room.hostId})`;

    // 클릭 이벤트 핸들러 추가
    roomItem.addEventListener('click', () => {
      // 해당 방의 정보를 이용하여 joinRoom 이벤트 발생
      socket.emit('joinRoom', { roomId: room.roomId });
      title.textContent = `Room : ${room.roomId}`
    });

    chatRoom.appendChild(roomItem);
  });
});

// 서버로부터 받아온 메시지를 화면에 출력
socket.on('loadMessages', (messages) => {
  messages.forEach(displayMessage);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
