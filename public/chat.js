const socket = io('http://localhost:8000', { path: '/socket.io' });

const chatBtn = document.getElementById("chatBtn");
const chatRoom = document.getElementById('roomList');
const title = document.getElementById("title");
const chatInput = document.getElementById("chatInput");
const messagesDiv = document.getElementById('chat');
const userProfile = document.getElementById('user');

function getCurrentRoomId() {
  const titleText = title.textContent;
  const roomIdIndex = titleText.indexOf("Room : ");
  
  if (roomIdIndex !== -1) {
    const roomId = titleText.substring(roomIdIndex + "Room : ".length);
    return roomId.trim();
  }
  
  return null;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedTimestamp;
}

function displayMessage(message, side) {
  const formattedTimestamp = new Date(message.timestamp).toLocaleString();

  messagesDiv.innerHTML += `<div class="message ${side}">
      <span>${message.userId}:</span>
      <span>${formattedTimestamp}:</span>
      <p>${message.message}</p>
  </div>`;
}

// 방에 입장할 때 이전 메시지를 요청
socket.on('joinRoom', (data) => {
  const { roomId } = data;
  
  // 이전 메시지를 요청
  socket.emit('loadMessages', { roomId });
});

// 서버로부터 받아온 메시지를 화면에 출력
socket.on('loadMessages', (messages) => {
  const currentRoomId = getCurrentRoomId();

  // 해당 방의 메시지만 필터링
  const roomMessages = messages.filter(message => message.roomId === currentRoomId);

  // 화면 초기화
  messagesDiv.innerHTML = '';

  // 왼쪽과 오른쪽으로 나누어 출력
  roomMessages.forEach(message => {
    if (message.isHost) {
      displayMessage(message, 'left'); // 호스트는 왼쪽에 출력
    } else {
      displayMessage(message, 'right'); // 호스트가 아닌 경우 오른쪽에 출력
    }
  });
});

function sendMessage(message) {
  const currentRoomId = getCurrentRoomId();
  if (currentRoomId) {
    // 서버로 메시지 전송
    socket.emit('sendMessage', { message, roomId: currentRoomId });
  }
}

// 메시지 입력 후 전송 버튼을 눌렀을 때의 이벤트 처리
chatBtn.addEventListener('click', function () {
  const message = chatInput.value;

  // 서버에 메시지 전송
  sendMessage(message);

  // 메시지 입력 필드 초기화
  chatInput.value = '';
});

// 서버에서 메시지를 전달받아 화면에 출력
socket.on('newMessage', (message) => {
  displayMessage(message);
});

socket.on('roomList', (rooms) => {
  // 받은 방 목록을 활용하여 UI에 표시
  chatRoom.innerHTML = ''; // 기존 목록 초기화

  rooms.forEach((room) => {
    const roomItem = document.createElement('li');
    roomItem.textContent = `Room : ${room.roomId} (Host: ${room.hostId})`;

    // 클릭 이벤트 핸들러 추가
    roomItem.addEventListener('click', () => {
      // 해당 방의 정보를 이용하여 joinRoom 이벤트 발생
      socket.emit('joinRoom', { roomId: room.roomId });
      title.textContent = `Room : ${room.roomId}`;
    });

    chatRoom.appendChild(roomItem);

  });
});

socket.on('userId', (user) => {
  userProfile.textContent = `USER : ${user}`
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});