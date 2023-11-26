const socket = io('http://localhost:8000', { path: '/socket.io' });

const chatRoom = document.getElementById('roomList');
const title = document.getElementById("title");

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

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
