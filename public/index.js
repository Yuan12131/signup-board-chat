const root = document.getElementById("root");
const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const closeSignupModal = document.getElementById("closeSignupModal");
const signupModal = document.getElementById("signupModal");
const indexOverlay = document.getElementById("indexOverlay");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginForm = document.getElementById("loginForm");
const loggedInUserId = document.getElementById("loggedInUserId");
const h3 = document.querySelector("h3");

// 로그인 함수
loginBtn.addEventListener("click", async function () {
  const userId = document.getElementById('userId').value;
  const userPassword = document.getElementById('userPassword').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signupId: userId,
        signupPassword: userPassword,
      }),
    });

    const result = await response.text();

    if (response.ok) {
      // 로그인 성공 시
      console.log('Login successful');
      h3.innerText = userId + "님 반갑습니다!";
      loggedInUserId.style.display = "block";
      loginForm.style.display = "none";
      logoutBtn.style.display = "block";
      signupBtn.style.display = "none";
    } else {
      // 로그인 실패 시
      console.error('Login failed:', result);
      alert("올바른 ID와 PASSWORD를 입력해주세요")
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert("로그인 중 오류가 발생했습니다.");
  }
});

// 로그아웃 함수
logoutBtn.addEventListener("click", function () {
  // 로그아웃 시 초기화
  h3.innerText = "로그인 후 서비스를 이용하세요"
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

// 모달창 닫기 버튼 이벤트 리스너
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
          // 회원가입 성공 시
          const serverData = await response.json();
          h3.textContent = `${serverData.formData.signupId}님, 가입에 성공했습니다!`;
          signupModal.style.display = "none";
          indexOverlay.style.display = "none";

          // 이동할 페이지 설정
          const boardLink = document.querySelector(".board");
          boardLink.addEventListener("click", function () {
            window.location.href = "/board.html";
          });

          const chatLink = document.querySelector(".chat");
          chatLink.addEventListener("click", function () {
            window.location.href = "/chat.html";
          });
        } else {
          // 회원가입 실패 시
          console.error("HTTP 오류:", response.status);
          h3.textContent = "오류가 발생했습니다.";
        }
      } catch (error) {
        // 오류 발생 시
        console.error("에러:", error);
        h3.textContent = "오류가 발생했습니다. 서버에 연결할 수 없습니다.";
      }
    });
  } else {
    console.error("Error: signupForm element not found.");
  }
}