const input = document.querySelectorAll("input:not([type=checkbox])");
const submitBtn = document.querySelector(".submit-btn");
const togglePassword = document.querySelector("#togglePassword");
// این بخش برای برای regexs input های فرم رورد هست
const regexs = {
  username: /^[A-Za-z0-9_\u0600-\u06FF]{3,16}$/,
  password: /^[\u0600-\u06FFA-Za-z0-9]{4,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

function regexRecognition(element, regex) {
  const ok = regex.test(element.value);
  if (ok) {
    element.style.borderColor = "green";
  } else {
    element.style.borderColor = "red";
  }
}
input.forEach((el) => {
  el.addEventListener("input", () => {
    regexRecognition(el, regexs[el.name]);
  });
});
// این بخش برای تغییر تایپ input هست
function toggletype() {
  if (input[2].type == "password") {
    input[2].type = "text";
  } else if (input[2].type == "text") {
    input[2].type = "password";
  }
}
togglePassword.addEventListener("click", toggletype);
// ---------------------------
// fetch با JSON
// ---------------------------
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  return await res.json();
};
document.querySelector("#signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
});

// این تابع برای گرقتن id کاربری که وارد شده هست
async function getUser(ev) {
  // ev.preventDefault();
  try {
    const data = await fetchJSON("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: input[0].value,
        email: input[1].value,
        password: input[2].value,
      }),
    });
    console.log(data);

    if (data.success) {
      localStorage.clear();
      localStorage.setItem("userId", data.id);
      alert(data.message);
      setTimeout(() => {
        window.location.href = "../../../index.html";
      }, 400);
    } else {
      alert(data.error);
    }
  } catch {
    alert("پاسخی از سرور دریافت نشد");
  }
}
submitBtn.addEventListener("click", getUser);
