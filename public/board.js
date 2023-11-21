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

closeReadModal.addEventListener("click", () => {
  readModal.style.display = "none";
  overlay.style.display = "none";
});

boardForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(boardForm);

  try {
    const response = await fetch("/board", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // 글쓰기 성공 시
      writeModal.style.display = "none";
      overlay.style.display = "none";
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

// 글 목록 표시
function displayPosts(posts) {
  const tableBody = document.querySelector("#postTable tbody");
  tableBody.innerHTML = "";

  posts.forEach((post) => {
    const row = tableBody.insertRow();
    row.innerHTML = `<td class="title-cell">${post.title}</td><td>${post.userId}</td><td>${post.timestamp}</td>`;
    row.addEventListener("click", () => displayPostContent(post));
  });
}

// 글 내용 표시
function displayPostContent(post) {
  readTitle.textContent = post.title;
  readContent.textContent = post.content;
  readModal.style.display = "block";
}

// 모달 닫기
closeReadModal.addEventListener("click", () => {
  readModal.style.display = "none";
});

// 초기 로드
loadPosts();