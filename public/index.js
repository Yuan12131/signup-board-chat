const root = document.getElementById("root");
const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const closeSignupModal = document.getElementById("closeSignupModal");
const signupModal = document.getElementById("signupModal");
const indexOverlay = document.getElementById("indexOverlay");
const usernameOutput = document.createElement("div");
root.appendChild(usernameOutput);
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginForm = document.getElementById("loginForm");
const loggedInUserId = document.getElementById("loggedInUserId");

// 로그인 함수
loginBtn.addEventListener("click", function () {
  const userId = document.getElementById("userId").value;
  // 여기에서 로그인 로직을 처리할 수 있습니다.
  // 성공 시 ID 출력 창을 갱신하고 로그인 및 회원가입 버튼 상태를 변경합니다.
  loggedInUserId.innerText = userId + "님 반갑습니다!";
  loggedInUserId.style.display = "block";
  loginForm.style.display = "none";
  logoutBtn.style.display = "block";
  signupBtn.style.display = "none";
});

// 로그아웃 함수
logoutBtn.addEventListener("click", function () {
  // 여기에서 로그아웃 로직을 처리할 수 있습니다.
  // 로그아웃 시 ID 출력 창을 갱신하고 로그인 및 회원가입 버튼 상태를 변경합니다.
  loggedInUserId.style.display = "none";
  loginForm.style.display = "block";
  logoutBtn.style.display = "none";
  signupBtn.style.display = "block";
});

// 회원가입 모달창 이벤트 리스너
signupBtn.addEventListener("click", () => {
  signupModal.style.display = "block";
  indexOverlay.style.display = "block";
  addSubmitEventListener();
});
closeSignupModal.addEventListener("click", () => {
  signupModal.style.display = "none";
  indexOverlay.style.display = "none";
});
// 회원가입 폼 데이터 처리 로직
function addSubmitEventListener() {
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(signupForm);

      try {
        const response = await fetch("/signup", {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(formData)),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const serverData = await response.json();
          usernameOutput.textContent = `${serverData.formData.signupId}님, 가입에 성공했습니다!`;
          signupModal.style.display = "none";
          indexOverlay.style.display = "none";

          const boardLink = document.querySelector(".board");
          boardLink.addEventListener("click", function () {
            window.location.href = "/board.html";
          });

          const chatLink = document.querySelector(".chat");
          chatLink.addEventListener("click", function () {
            window.location.href = "/chat.html";
          });
        } else {
          console.error("HTTP 오류:", response.status);
          usernameOutput.textContent = "오류가 발생했습니다.";
        }
      } catch (error) {
        console.error("에러:", error);
        usernameOutput.textContent =
          "오류가 발생했습니다. 서버에 연결할 수 없습니다.";
      }
    });
  } else {
    console.error("Error: signupForm element not found.");
  }
}
