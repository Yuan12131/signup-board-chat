const openWriteModal = document.getElementById("openWriteModal");
const closeWriteModal = document.getElementById("closeWriteModal");
const closeReadModal = document.getElementById("closeReadModal");
const writeModal = document.getElementById("writeModal");
const readModal = document.getElementById("readModal");
const readContent = document.getElementById("readContent")
const readTitle = document.getElementById("readTitle")
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

boardForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(boardForm);

  try {
    // 회원가입 진행
    const response = await fetch("/board", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // 글쓰기 성공 시
      loadPosts()
    } else {
      // 글쓰기 실패 시
      console.error("HTTP 오류:", response.status);
      alert("오류가 발생했습니다. 서버에 연결할 수 없습니다.");
    }
  } catch (error) {
    // 오류 발생 시
    console.error("서버 오류:", error);
    alert("오류가 발생했습니다. 서버에 연결할 수 없습니다.");
  }
});


// 글 목록 로드
async function loadPosts() {
  const response = await fetch("/get-posts");
  if (response.ok) {
    const posts = await response.json();
    displayPosts(posts);
  } else {
    console.error("글 목록 로드 실패:", response.statusText);
  }
}
