const openWriteModal = document.getElementById("openWriteModal");
const closeWriteModal = document.getElementById("closeWriteModal");
const closeReadModal = document.getElementById("closeReadModal");
const writeModal = document.getElementById("writeModal");
const readModal = document.getElementById("readModal");
const overlay = document.getElementById("overlay");
// 각각의 글 제목 클릭 시 해당 글의 내용을 모달에 출력
const itemRows = document.querySelectorAll(".item-row"); 

const boardForm = document.getElementById("boardForm");

openWriteModal.addEventListener("click", () => {
  writeModal.style.display = "block";
  overlay.style.display = "block";
});

closeWriteModal.addEventListener("click", () => {
  writeModal.style.display = "none";
  overlay.style.display = "none";
});

itemRows.forEach((row) => {
  row.addEventListener("click", () => {
    readModal.style.display = "block";
    overlay.style.display = "block";
    // 여기서 서버에 해당 글의 내용을 요청하고, 응답으로 받은 데이터를 모달에 채워 넣는 로직을 추가
    readModal.textContent = row.dataset.content;
  });
});

closeReadModal.addEventListener("click", () => {
  readModal.style.display = "none";
  overlay.style.display = "none";
});

boardForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // 폼의 기본 동작을 막음
    const formData = new FormData(boardForm);

    try {
        const response = await fetch("/board", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)), // FormData를 객체로 변환
        headers: {
            "Content-Type": "application/json",
        },
        });
    } catch (error) {
        console.error("에러:", error);
    }
});
