/** @format */

"use strict";

const $ = (sel) => document.querySelector(sel);

const btnMenu = $(".btn-menu");
const boxMenu = $(".box-menu");
const categorBtn = $(".Categor-btn");
const megaMenu = $(".mega-menu");
const searchInput = $(".search-input");
const select = $(".Categor-btn");
const elementShow = $(".element-show");
const showCategory = $(".Show-category");
const headerNav = $(".header-nav");
const sliders = document.querySelectorAll(".wrapper-slider");
const goUp = $(".Go-up");

// ---------------------------
// مدیریت کلاس فعال منو
// ---------------------------
const toggleClass = (element, className, action = "add") => {
  element.classList[action](className);
};

btnMenu.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleClass(boxMenu, "active");
});

document.body.addEventListener("click", (e) => {
  if (!boxMenu.contains(e.target)) {
    toggleClass(boxMenu, "active", "remove");
  }
});
//-----------------------------------
// این بخش برگشتن به بالای صفحه هست
//------------------------------------
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    // toggleClass(headerNav, "d-none", "add");
    // toggleClass(headerNav, "d-block", "remove");
    headerNav.classList.replace("fade-in", "fade-out");
  } else {
    // toggleClass(headerNav, "d-none", "remove");
    // toggleClass(headerNav, "d-block", "add");
    headerNav.classList.replace("fade-out", "fade-in");
  }
});

// ---------------------------
// گرفتن Category و ساخت لیست
// ---------------------------
const createCategoryList = async (
  element,
  tagName1,
  tagName2,
  options = { withIcon: false, iconPath: "/icons/icon" },
  url = "http://localhost:3000/api/categories"
) => {
  try {
    const res = await fetchJSON(url);
    const frg = document.createDocumentFragment();

    res.categories.forEach((e, index) => {
      const tag = document.createElement(tagName1);
      tag.setAttribute("data-index", index);
      tag.value = index;

      if (options.withIcon) {
        const img = document.createElement("img");
        img.src = `${options.iconPath}${index}.svg`;
        img.alt = e.title;

        const tag2 = document.createElement(tagName2);
        tag2.textContent = e.title;
        tag2.href = "#";

        const icon = document.createElement("i");
        icon.className = "fa fa-angle-left";

        tag.append(img, tag2, icon);
      } else {
        const tag2 = document.createElement(tagName2);
        tag2.textContent = e.title;
        tag.appendChild(tag2);
      }

      frg.appendChild(tag);
    });

    element.appendChild(frg);
  } catch {
    const frg = document.createDocumentFragment();
    const tag = document.createElement(tagName1);
    const tag2 = document.createElement(tagName2);
    tag2.textContent = "پاسخی از سرور دریافت نشد";
    tag.appendChild(tag2);
    frg.appendChild(tag);
    element.appendChild(frg);
  }
};

// ---------------------------
// fetch با JSON
// ---------------------------
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  return await res.json();
};

// ---------------------------
// نمایش نتایج سرچ
// ---------------------------
const renderSearchResults = (items) => {
  if (!items || items.length === 0) {
    toggleClass(elementShow, "d-none");
    elementShow.innerHTML = "";
    return;
  }
  toggleClass(elementShow, "d-none", "remove");
  elementShow.innerHTML = items
    .map(
      (item) => `
        <a href="#">
          <div class="col-1">
            <img class="w-100" src="${item.src}" alt="${item.title}" />
          </div>
          <div class="col-10">
            <p>${item.title}</p>
            <span>${item.price} تومان</span>
          </div>
        </a>
      `
    )
    .join("");
};

// ---------------------------
// جستجو محصولات
// ---------------------------
const searchProducts = async (value, categoryId = "") => {
  const url = categoryId
    ? "http://localhost:3000/api/categories/search"
    : "http://localhost:3000/api/products/search";

  const bodyData = categoryId ? { categoryId, value } : { value };

  try {
    const data = await fetchJSON(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    const items = data.products || data.categories || [];
    renderSearchResults(items);
  } catch (err) {
    elementShow.innerHTML = "<a>پاسخی از سرور دریافت نشد</a>";
  }
};

// ---------------------------
// Event Input Search
// ---------------------------
searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  const categoryId = select.value;
  searchProducts(value, categoryId);
});
//----------------------------
//تایمر شماره معکوس
//----------------------------
(function () {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  //I'm adding this section so I don't have to keep updating this pen every year :-)
  //remove this if you don't need it
  let today = new Date(),
    dd = String(today.getDate()).padStart(2, "0"),
    mm = String(today.getMonth() + 1).padStart(2, "0"),
    yyyy = today.getFullYear(),
    nextYear = yyyy + 1,
    dayMonth = "09/30/",
    birthday = dayMonth + yyyy;

  today = mm + "/" + dd + "/" + yyyy;
  if (today > birthday) {
    birthday = dayMonth + nextYear;
  }
  //end

  const countDown = new Date(birthday).getTime(),
    x = setInterval(function () {
      const now = new Date().getTime(),
        distance = countDown - now;

      (document.getElementById("days").innerText = Math.floor(distance / day)),
        (document.getElementById("hours").innerText = Math.floor(
          (distance % day) / hour
        )),
        (document.getElementById("minutes").innerText = Math.floor(
          (distance % hour) / minute
        )),
        (document.getElementById("seconds").innerText = Math.floor(
          (distance % minute) / second
        ));

      //do something later when date is reached
      if (distance < 0) {
        document.getElementById("headline").innerText = "It's my birthday!";
        document.getElementById("countdown").style.display = "none";
        document.getElementById("content").style.display = "block";
        clearInterval(x);
      }
      //seconds
    }, 0);
})();
// این تابع برای برگشت به اول صفحه هست
goUp.addEventListener("click", goingUp);
function goingUp() {
  window.scrollTo({
    top: 0,
    behavior: "auto",
  });
}
// تابع ای که کنترل میکنه بیشتر از تعداد ایتم ها اسلایدر حرکت نکنه
function showElement(element, btnSlider) {
  const observer = new IntersectionObserver(
    (enters) => {
      enters.forEach((enter) => {
        if (enter.isIntersecting) {
          toggleClass(btnSlider, "d-none", "add");
        } else {
          toggleClass(btnSlider, "d-none", "remove");
        }
      });
    },
    { threshold: 0.8 }
  );
  observer.observe(element);
}

// تابع اصلی اسلایدر
function Slider() {
  const sliders = document.querySelectorAll(".wrapper-slider");

  sliders.forEach((slider) => {
    const items = slider.querySelectorAll(".slider-item");
    if (items.length === 0) return;
    const sliderWrapper = slider.querySelector(".wrapper-Slider-item");
    const btnNext = slider.querySelector(".btn-slider-right");
    const btnPrev = slider.querySelector(".btn-slider-left");
    const lastProductIndex = items.length - 1;
    const style = window.getComputedStyle(items[0]);
    let width = parseFloat(style.width);
    let marginLeft = parseFloat(style.marginLeft);
    let marginRight = parseFloat(style.marginRight);

    let currentIndex = 0;
    const itemWidth = width + marginLeft + marginRight;

    // تابع برای تغییر موقعیت آیتم‌ها
    function updateSlider() {
      sliderWrapper.style.transform = `translateX(${
        currentIndex * itemWidth
      }px)`;
    }

    function moveRight(event) {
      event.preventDefault();
      if (Math.abs(currentIndex) == lastProductIndex) return;
      currentIndex++;
      updateSlider();
      showElement(items[0], btnPrev);
    }

    function moveLeft(event) {
      event.preventDefault();
      if (Math.abs(currentIndex) == 0) return;
      currentIndex--;
      updateSlider();
      showElement(items[items.length - 1], btnNext);
    }

    btnNext.addEventListener("click", moveRight);
    btnPrev.addEventListener("click", moveLeft);

    showElement(items[0], btnPrev);
    showElement(items[items.length - 1], btnNext);
  });
}
//-----------------------------------------------------------

async function addSliderImages(
  apiUrl,
  selector,
  templateFn,
  productsKey = "products"
) {
  const container = document.querySelector(selector);
  if (!container) {
    return;
  }

  const data = await fetchJSON(apiUrl);

  let html = "";
  data[productsKey].forEach((item, index) => {
    html += templateFn(item, index);
  });

  container.innerHTML = html;
  Slider();
}
// تابع پیش فرض اسلایدر ها
function syntaxSlider(e, i) {
  return `
    <a href="javascript:void(0)" class="slider-item" data-index="${i}">
      <div class="slider-img">
        <img src="${e.src}" alt="${e.title}" class="w-100" />
        <div class="slider-iconds">
              <button title="انخاب گذینه ها" class="slider-basket w-100">
        <i class="fa-solid fa-cart-shopping"></i>
              </button>
              <button title="مشاهده سریع" class="slider-view w-100 d-none d-md-block">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
              <button title="مقایسه" class="slider-comparison w-100 d-none d-md-block">
                <i class="fa-solid fa-shuffle"></i>
              </button>
              <button title="افزودن به علاقه مندی" class="slider-like w-100">
                <i class="fa-regular fa-heart"></i>
              </button>
            </div>
      </div>
      <p>${e.title}</p>
      <span>${e.price.toLocaleString()} تومان</span>
    </a>
  
  `;
}
// اسلایدر category
addSliderImages(
  "http://localhost:3000/api/categories",
  ".Show-category",
  (e, i) => {
    return `
     <a href="void:javascript(0)" class="slider-item col" data-index="${i}">
         <div class="slider-img">
            <img
               class="w-100" src="${e.products[0].src}" alt=""/>
           </div>
          <p class ="title-item">${e.title}</p>
           <span>${e.products.length} محصول</span>
        </a>`;
  },
  "categories"
);
// برای اسلایدر off صدا زده شده
addSliderImages(
  "http://localhost:3000/api/products/offs",
  ".products",
  (e, i) => {
    const price = e.price;
    const off = e.off;
    let result = price - (price * off) / 100;
    return `
            <a href="void:javascript()" class="slider-item" data-index=${i}>
              <div class="slider-img">
              <span>${e.off}% -</span>
                <img
                  class="w-100"
                  src="${e.src}"
                  alt=""
                />
            <div class="slider-iconds">
                <button title="انخاب گذینه ها" class="slider-basket w-100">
                <i class="fa-solid fa-cart-shopping"></i>
                </button>
                <button title="مشاهده سریع" class="slider-view w-100 d-none d-md-block">
                  <i class="fa-solid fa-magnifying-glass"></i>
                </button>
                <button title="مقایسه" class="slider-comparison w-100 d-none d-md-block">
                  <i class="fa-solid fa-shuffle"></i>
                </button>
                <button title="افزودن به علاقه مندی" class="slider-like w-100">
                  <i class="fa-regular fa-heart"></i>
                </button>
            </div>
              </div>
              <p>${e.title}}</p>
              <span><del>${e.price.toLocaleString()} تومان</del> ${result.toLocaleString()} تومان</span>
            </a>
          `;
  }
);
// پربازدید ترین اسلایدر
addSliderImages(
  "http://localhost:3000/api/categories/0",
  ".most-visited",
  syntaxSlider
);
// اسلایدر برندهای موبایل
addSliderImages(
  "http://localhost:3000/api/categories/0",
  ".mobile-brands",
  (e, i) => {
    return `
     <a href="void:javascript(0)" class="slider-item col" data-index="${i}">
         <div class="slider-img">
            <img
               class="w-100" src="${e.brand.src}" alt=""/>
           </div>
       <div class="location-brand">
          <p class ="">${e.brand.title}</p>
           <span>${e.brand.location}</span>
       </div>
        </a>`;
  },
  "products"
);
// پرفروش ترین اسلایدر
addSliderImages(
  "http://localhost:3000/api/categories/6",
  ".bestsellers",
  syntaxSlider
);
// اسلایدر محصولات موبایل
addSliderImages(
  "http://localhost:3000/api/categories/0",
  ".slider-mobile",
  syntaxSlider
);
// اسلایدر اسپیکر
addSliderImages(
  "http://localhost:3000/api/categories/5",
  ".slider-Speaker",
  syntaxSlider
);
// اسلایدر تلویزیون
addSliderImages(
  "http://localhost:3000/api/categories/3",
  ".slider-Television",
  syntaxSlider
);
//اسلایدر کنسول بازی
addSliderImages(
  "http://localhost:3000/api/categories/7",
  ".slider-game-console",
  syntaxSlider
);
// اسلایدر لپ تاپ
addSliderImages(
  "http://localhost:3000/api/categories/4",
  ".slider-Laptop",
  syntaxSlider
);
//---------------------------------------------------------
// این بخش برای نمایش دادن data کاربر بعد از ورود یا ثبت نام هست
//---------------------------------------------------------
async function showDataUser() {
  const Numberbasket = $(".Number-shopping-lists");
  const ExitUser = $(".wrapper-Login");
  const price = $(".Total-cart-price");
  const userId = window.localStorage.getItem("userId");

  if (userId) {
    const data = await fetchJSON(`http://localhost:3000/api/users/${userId}`);
    Numberbasket.innerText = data.basket.length;
    const Exit = `
     <a href="./assets/page/Login/login.html" onclick="exitUsers()"> 
     <i class="fa-solid fa-arrow-right-from-bracket"></i>خروج
     </a>
     `;
    ExitUser.innerHTML = Exit;
    let totalPrice = 0;
    data.basket.forEach((product) => {
      totalPrice += product.price;
    });
    price.innerText = `${totalPrice.toLocaleString()} تومان`;
  } else {
    Numberbasket.innerText = 0;
    const login = `
    <i class="fa-regular fa-user"></i>
    <a href="./assets/page/sign up/sign-up.html">ثبت نام</a> /
    <a href="./assets/page/Login/login.html">ورود</a>
    `;
    ExitUser.innerHTML = login;
    price.innerText = "0 تومان";
  }
}
//-----------------------------------------------
// این تابع برای خروج کاربر از حساب کاربری خودش هست
//-----------------------------------------------
function exitUsers() {
  window.localStorage.clear();
}
//---------------------
//اجرای اولیه
//----------------------
window.addEventListener("load", () => {
  createCategoryList(categorBtn, "option", "a");
  createCategoryList(megaMenu, "li", "a", {
    withIcon: true,
    iconPath: "./assets/img/svg/Mega-menu/",
  });
  addSliderImages();
  showDataUser();
});
