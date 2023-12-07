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
const idCheckBtn = document.getElementById("idCheckBtn");

// 페이지 로딩 시 실행
window.addEventListener("load", async function () {
    // 세션 확인 요청을 서버로 보냄
    const sessionResponse = await fetch("/check-session");

    if (sessionResponse.ok) {
      // 세션이 유효하면 로그인 상태로 간주
      const status = await sessionResponse.text();

      if (status === "세션 유효") {
        // 세션이 유효하면 로그인 상태로 간주
          loggedInUserId.style.display = "block";
          loginForm.style.display = "none";
          logoutBtn.style.display = "block";
          signupBtn.style.display = "none";
        } else {
      // 세션이 없으면 로그인 폼 표시
      console.log("User is not logged in");
      loginForm.style.display = "block";
      logoutBtn.style.display = "none";
      signupBtn.style.display = "block";
    }
}
});

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
      h3.innerText =  " 👤 " + userId;
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
      logoutBtn.style.display = "none";
      signupBtn.style.display = "block";
      console.log("Logout successful");
    } else {
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

// idCheckBtn 클릭 이벤트 처리
idCheckBtn.addEventListener("click", async function () {
  const signupId = document.getElementById("signupId").value; // 사용자가 입력한 ID

  try {
    // 서버로 중복 확인 요청
    const response = await fetch("/check-id-duplicate", {
      method: "POST",
      body: JSON.stringify({ signupId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const { isIdDuplicate } = await response.json();

      if (isIdDuplicate) {
        // 중복된 아이디가 있을 경우 메시지 표시
        alert("아이디가 이미 사용 중입니다. 다른 아이디를 입력해주세요.");
      } else {
        // 중복이 없을 경우 메시지 표시 및 회원가입 폼 제출 허용
        alert("사용 가능한 아이디입니다. 회원가입을 진행하세요.");
        // 회원가입 폼 제출을 허용하도록 설정
        signupForm.isIdDuplicate = false;
      }
    } else {
      // 서버에서 중복 확인에 대한 응답이 실패한 경우
      console.error("HTTP 오류:", response.status);
    }
  } catch (error) {
    // 오류 발생 시
    console.error("에러:", error);
  }
});

// 회원가입 폼 데이터 처리 로직
function addSubmitEventListener() {
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // 중복 확인을 통과하지 않은 경우
      if (signupForm.isIdDuplicate !== false) {
        alert("아이디 중복 확인을 먼저 진행해주세요.");
        return; // 폼 제출을 중단
      }

      const formData = new FormData(signupForm);

      try {
        // 회원가입 진행
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
          console.error("HTTP 오류:", response.status);
        }
      } catch (error) {
        console.error("에러:", error);
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