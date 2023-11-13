const root = document.getElementById("root");
const signupForm = document.getElementById("signupForm");

const usernameOutput = document.createElement("div");
root.appendChild(usernameOutput);

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // 폼의 기본 동작을 막음
    const formData = new FormData(signupForm);

    try {
        const response = await fetch("/signup", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(formData)), // FormData를 객체로 변환
            headers: {
            "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const serverData = await response.json();
            usernameOutput.textContent = `가입한 이름: ${serverData.formData.name}`;
            signupForm.style.display = "none";
        } else {
            console.error("HTTP 오류:", response.status);
            usernameOutput.textContent = "오류가 발생했습니다.";
        }
    } catch (error) {
        console.error("에러:", error);
        usernameOutput.textContent = "오류가 발생했습니다. 서버에 연결할 수 없습니다.";
    }
});
