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
const boardLink = document.querySelector(".board");
const chatLink = document.querySelector(".chat");


// 로그인 함수
loginBtn.addEventListener("click", async function () {
  const userId = document.getElementById("userId").value;
  const userPassword = document.getElementById("userPassword").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signupId: userId,
        signupPassword: userPassword,
      }),
    });

    const result = await response.text();

    if (response.ok) {
      // 로그인 성공 시
      console.log("Login successful");
      h3.innerText = userId + "님 반갑습니다!";
      loggedInUserId.style.display = "block";
      loginForm.style.display = "none";
      logoutBtn.style.display = "block";
      signupBtn.style.display = "none";
    } else {
      // 로그인 실패 시
      console.error("Login failed:", result);
      alert("올바른 ID와 PASSWORD를 입력해주세요");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("로그인 중 오류가 발생했습니다.");
  }
});

// 로그아웃 함수
logoutBtn.addEventListener("click", async function () {
  try {
    const response = await fetch("/logout", {
      method: "GET",
    });

    if (response.ok) {
      // 로그아웃 성공 시 클라이언트 UI 변경
      loginForm[0].value = "";
      loginForm[1].value = "";
      h3.innerText = "로그인 후 서비스를 이용하세요";
      loggedInUserId.style.display = "none";
      loginForm.style.display = "block";
      loginForm.value = "";
      logoutBtn.style.display = "none";
      signupBtn.style.display = "block";
      console.log("Logout successful");
    } else {
      // 로그아웃 실패 시 처리
      console.error("Logout failed:", response.statusText);
    }
  } catch (error) {
    console.error("Network error during logout:", error);
  }
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

// boardLink 클릭 시
boardLink.addEventListener("click", async function () {
  try {
    const response = await fetch("/check-session", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
    }
    // 성공적으로 데이터를 받아왔을 때 처리
    window.location.href = "/board.html";
  } catch (error) {
    // 오류가 발생했을 때 처리
    console.error("GET 요청 실패:", error);
    alert("로그인 후 이용해주세요");
  }
});

// chatLink 클릭 시
chatLink.addEventListener("click", async function () {
  try {
    const response = await fetch("/check-session", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
    }
    // 성공적으로 데이터를 받아왔을 때 처리
    window.location.href = "/chat.html";
  } catch (error) {
    // 오류가 발생했을 때 처리
    console.error("GET 요청 실패:", error);
    alert("로그인 후 이용해주세요");
  }
});