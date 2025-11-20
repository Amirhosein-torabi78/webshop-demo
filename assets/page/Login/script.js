/** @format */
const input = document.querySelectorAll("input:not([type=checkbox])");
const loginBtn = document.querySelector(".login-btn");
// ---------------------------
// fetch با JSON
// ---------------------------
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  return await res.json();
};

// // این تابع برای گرقتن id کاربری که وارد شده هست
async function getUser(ev) {
  ev.preventDefault();
  try {
    const data = await fetchJSON("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: input[0].value,
        password: input[1].value,
      }),
    });
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
loginBtn.addEventListener("click", getUser);

// این بخش برای برای regexs input های فرم رورد هست
const regexs = {
  username: /^[A-Za-z0-9_\u0600-\u06FF]{3,16}$/,
  password: /^[\u0600-\u06FFA-Za-z0-9]{4,}$/,
};

function regexRecognition(element, regex) {
  const ok = regex.test(element.value);
  if (ok) {
    element.parentElement.style.borderColor = "green";
  } else {
    element.parentElement.style.borderColor = "red";
  }
}
input.forEach((el) => {
  el.addEventListener("input", () => {
    regexRecognition(el, regexs[el.name]);
  });
});
// این بخش برای تغییر تایپ input هست
function toggletype() {
  if (input[1].type == "password") {
    input[1].type = "text";
  } else if (input[1].type == "text") {
    input[1].type = "password";
  }
}
togglePassword.addEventListener("click", toggletype);
