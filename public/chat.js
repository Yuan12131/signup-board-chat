const socket = io('http://localhost:8000', { path: '/socket.io' });

const chatRoom = document.getElementById('roomList');

socket.on('roomList', (rooms) => {
  console.log(rooms)
  // 받은 방 목록을 활용하여 UI에 표시
  rooms.forEach((room) => {
    const roomItem = document.createElement('li');
    roomItem.textContent = `Room ${room.id}: ${room.roomId} (Host: ${room.hostId})`;
    chatRoom.appendChild(roomItem);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
