const root = document.getElementById("root")
const signupForm = document.getElementById("signupForm");

const usernameOutput = document.createElement("div");
root.appendChild(usernameOutput);

signupForm.addEventListener("submit", async(event) => {
    event.preventDefault();  // 폼의 기본 동작을 막습니다.
    const formData = new FormData(signupForm);

    try {
        const response = await fetch("/signup", {
            method: "POST",
            body: formData,
        });
    
        if (response.ok) {
            const serverData = await response.json();
            usernameOutput.textContent = `가입한 이름: ${serverData.formData.name}`;
            signupForm.style.display = "none";
        }
    } catch (error) {
        console.error("에러:", error);
        usernameOutput.textContent = "오류가 발생했습니다.";
    }
});