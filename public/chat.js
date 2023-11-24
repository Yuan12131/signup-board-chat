const socket = io('http://localhost:8000', { path: '/socket.io' });

const chatRoom = document.getElementById('roomList');
const title = document.getElementById("title")

// 클라이언트에서 방에 입장할 때 호출되는 함수
function joinRoom(roomId) {
  const userId = 'exampleUserId'; // 이 부분은 동적으로 또는 사용자 입력을 받아서 설정해야 합니다.

  if (userId) {
    // 서버에 방 입장 요청
    socket.emit('joinRoom', { roomId, userId });
    console.log(`Joined room ${roomId} successfully!`);
  } else {
    console.error('User ID not available.');
  }
}

socket.on('roomList', (rooms) => {
  // 받은 방 목록을 활용하여 UI에 표시
  rooms.forEach((room) => {
    const roomItem = document.createElement('li');
    roomItem.textContent = `Room : ${room.roomId} (Host: ${room.hostId})`;

    // 클릭 이벤트 핸들러 추가
    roomItem.addEventListener('click', () => {
      // 해당 방의 정보를 이용하여 joinRoom 이벤트 발생
      socket.emit('joinRoom', { roomId: room.roomId, userId: 'exampleUserId' });
      title.textContent = `Room : ${room.roomId}`
    });

    chatRoom.appendChild(roomItem);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
