// JavaScript로 모달을 제어하는 스크립트
const openWriteModal = document.getElementById('openWriteModal');
const closeWriteModal = document.getElementById('closeWriteModal');
const writeModal = document.getElementById('writeModal');
const overlay = document.getElementById('overlay');

openWriteModal.addEventListener('click', () => {
  writeModal.style.display = 'block';
  overlay.style.display = 'block';
});

closeWriteModal.addEventListener('click', () => {
  writeModal.style.display = 'none';
  overlay.style.display = 'none';
});