const socket = io('http://localhost:8000');
const roomList = document.getElementById("roomList");
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('m').value;
    socket.emit('chat message', message);
    document.getElementById('m').value = '';
});

socket.on('chat message', (msg) => {
    const ul = document.getElementById('messages');
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(msg));
    ul.appendChild(li);
});

// 방 목록을 받아서 처리
socket.on("roomList", (rooms) => {

  rooms.forEach((room) => {
    const listItem = document.createElement("li");
    listItem.textContent = room.name;
    listItem.addEventListener("click", () => {
      // 클릭한 방에 입장하는 로직 추가
      console.log(`Joining room: ${room.name}`);
    });

    roomList.appendChild(listItem);
  });
});