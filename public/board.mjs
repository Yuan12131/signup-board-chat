const openWriteModal = document.getElementById("openWriteModal");
const closeWriteModal = document.getElementById("closeWriteModal");
const closeReadModal = document.getElementById("closeReadModal");
const writeModal = document.getElementById("writeModal");
const readModal = document.getElementById("readModal");
const readContent = document.getElementById("readContent");
const readTitle = document.getElementById("readTitle");
const overlay = document.getElementById("overlay");
const itemRows = document.querySelectorAll(".item-row"); //각각의 글 제목 클릭 시 해당 글의 내용을 모달에 출력
const boardForm = document.getElementById("boardForm");
const home = document.querySelector("h1")

home.addEventListener("click", function () {
    window.location.href = "/";
});

// 페이징 상수
const postsPerPage = 10; // 페이지당 글 수

// 페이지 및 글 목록 로드
let currentPage = 1;

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadPosts();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  currentPage++;
  loadPosts();
});

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
      body: formData, // 이미 FormData 객체를 사용하므로 JSON.stringify가 필요하지 않음
    });

    if (response.ok) {
      // 글쓰기 성공 시
      writeModal.style.display = "none";
      overlay.style.display = "none";
      loadPosts();
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

(async () => {
  await loadPosts();
})();

// 글 목록 로드
async function loadPosts() {
  const startIdx = (currentPage - 1) * postsPerPage;
  const endIdx = startIdx + postsPerPage;

  // /get-posts 경로로 HTTP GET 요청을 보내고, 해당 요청에 대한 응답을 기다리기 위해 await 키워드를 사용
  const response = await fetch("/get-posts");
  if (response.ok) {
    const posts = await response.json();
    displayPosts(posts);
    document.getElementById("currentPage").textContent = currentPage;
  } else {
    console.error("글 목록 로드 실패:", response.statusText);
  }
}

// 글 목록 표시 함수 업데이트
function displayPosts(posts) {
  const tableBody = document.querySelector("#postTable tbody");

  // 기존 행 초기화
  tableBody.innerHTML = "";

  const startIdx = (currentPage - 1) * postsPerPage;
  const endIdx = startIdx + postsPerPage;

  // 적절한 범위 내의 글만 행을 추가
  posts.slice(startIdx, endIdx).forEach((post) => {
    const row = tableBody.insertRow();

    // post.timestamp를 새로운 형식으로 변환
    const dateObject = new Date(post.timestamp);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZone: "UTC",
    };
    const formattedTimestamp = dateObject.toLocaleString("en-US", options);

    // 제목에 아이콘 추가
    const titleCell = document.createElement("td");
    titleCell.classList.add("title-cell");
    titleCell.innerHTML = post.imagePath
      ? `<span class="icon">📷</span> ${post.title}`
      : post.title;
    row.appendChild(titleCell);

    // 다른 셀에 데이터 추가
    const userIdCell = row.insertCell();
    userIdCell.textContent = post.userId;

    const timestampCell = row.insertCell();
    timestampCell.textContent = formattedTimestamp;

    // 행에 클릭 이벤트 추가
    row.addEventListener("click", () => displayPostContent(post));
  });
}

// 글 내용 표시
function displayPostContent(post) {
  readTitle.innerHTML = post.imagePath
    ? `<span class="icon">📷</span> ${post.title}`
    : post.title;

  readContent.innerHTML = ''; // 기존 내용 초기화

  // 글 내용 표시
  const textRow = document.createElement("tr");
  const textCell = document.createElement("td");
  textCell.textContent = post.content;
  textRow.appendChild(textCell);
  readContent.appendChild(textRow);

  // 이미지가 있는 경우 이미지 표시
  if (post.imagePath) {
    const imageRow = document.createElement("tr");
    const imageCell = document.createElement("td");
    const imageElement = document.createElement("img");
    imageElement.src = post.imagePath;
    imageCell.appendChild(imageElement);
    imageRow.appendChild(imageCell);
    readContent.appendChild(imageRow);
  }

  readModal.style.display = "block";
}

// 글 읽기 모달 닫기
closeReadModal.addEventListener("click", () => {
  readModal.style.display = "none";
});