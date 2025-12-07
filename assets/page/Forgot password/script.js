document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const form = $("#forgotPasswordForm");
  const email = $("#email");
  const pass = $("#password");
  const btn = $(".submit-btn");

  const msg = document.createElement("div");
  msg.className = "error-message";
  form.prepend(msg);

  const show = (t, err = true) => {
    msg.className = (err ? "error-message" : "success-message") + " show";
    msg.textContent = t;

    setTimeout(() => msg.classList.remove("show"), 2000);
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPass = (v) => v.length >= 4;

  const validate = () => {
    if (!email.value.trim()) return show("ایمیل را وارد کنید"), false;
    if (!isEmail(email.value)) return show("ایمیل نامعتبر است"), false;
    if (!pass.value) return show("رمز عبور را وارد کنید"), false;
    if (!isPass(pass.value)) return show("حداقل 4 کاراکتر"), false;
    return true;
  };

  const styleCheck = (inp, fn) => {
    inp.addEventListener("blur", () => {
      inp.style.borderColor = inp.value && !fn(inp.value) ? "#dc3545" : "#ccc";
    });
    inp.addEventListener("focus", () => (inp.style.borderColor = "#667eea"));
  };

  styleCheck(email, isEmail);
  styleCheck(pass, isPass);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    btn.disabled = true;
    btn.textContent = "در حال پردازش...";

    const res = await fetchJSON(
      "http://localhost:3000/api/users/resetPassword",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value, newPassword: pass.value }),
      }
    );

    show("رمز عبور با موفقیت تغییر کرد!", false);

    // ⬅ فقط در اینجا، وقتی موفق شد → ریدایرکت کنیم
    setTimeout(() => {
      window.location.href = "../Login/login.html";
    }, 2000);

    btn.disabled = false;
    btn.textContent = "تغییر رمز عبور";
  });
  //این بخش برای تغییر type input هست
  const showPassword = document.querySelector(".show__Password");
  showPassword.addEventListener("click", () => {
    pass.type = pass.type === "password" ? "text" : "password";
  });
});
const fetchJSON = async (u, o = {}) => (await fetch(u, o)).json();
