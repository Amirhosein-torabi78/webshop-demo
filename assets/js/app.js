/** @format */

"use strict";
(async () => {
  const $ = (sel) => document.querySelector(sel);

  const btnMenu = $(".btn-menu");
  const boxMenu = $(".box-menu");
  const categorBtn = $(".Categor-btn");
  const megaMenu = $(".mega-menu");
  const searchInput = $(".search-input");
  const select = $(".Categor-btn");
  const elementShow = $(".element-show");
  const headerNav = $(".header-nav");
  const goUp = $(".Go-up");
  const showProduct = $(".show__product");
  const userId = window.localStorage.getItem("userId");

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
        <a href="#" onclick="showProductData('${item.id}')">
          <div class="col-1">
            <img class="w-100" src="${item.src}" alt="${item.title}" />
          </div>
          <div class="col-10">
            <p>${item.title}</p>
            <span>${item.price.toLocaleString("fa-IR")} تومان</span>
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
  const btnSearch = $(".btn-search");
  btnSearch.addEventListener("click", () => {
    movePage(select.value);
  });

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

        (document.getElementById("days").innerText = Math.floor(
          distance / day
        )),
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
  let currentUser = null;
  async function loadUserData() {
    try {
      const res = await fetch("http://localhost:3000/api/users/" + userId);
      const data = await res.json();
      return await data;
    } catch (err) {
      console.error("خطا در گرفتن اطلاعات کاربر:", err);
    }
  }

  // تابع ساختار پیش فرض اسلایدر ها
  function syntaxSlider(e, i) {
    //این بخش برای تشخیص محصولاتی که در سبد خرید و موردعلاقه هست
    let classNameFavorite = currentUser.favorite.some((p) => p.id === e.id)
      ? "fa-solid fa-check"
      : "fa-regular fa-heart";

    let classNameBasket = currentUser.basket.some((p) => p.id === e.id)
      ? "fa-solid fa-check"
      : "fa-solid fa-cart-shopping";

    return `
    <a href="javascript:void(0)" class="slider-item" data-index="${i}">
      <div class="slider-img">
        <img src="${e.src}" alt="${e.title}" class="w-100" />
        <div class="slider-iconds">
              <button title="سبدخرید" class="slider-basket w-100" onclick="addProductToList('${
                e.id
              }', 'basket', this)">
        <i class="${classNameBasket}"></i>
              </button>
              <button title="مشاهده سریع" class="slider-view w-100 d-none d-md-block" onclick="showProductData('${
                e.id
              }')">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
              <button title="مقایسه" class="slider-comparison w-100 d-none d-md-block">
                <i class="fa-solid fa-shuffle"></i>
              </button>
              <button title="افزودن به علاقه مندی ها" class="slider-like w-100" onclick="addProductToList('${
                e.id
              }', 'favorite', this)">
                <i class="${classNameFavorite}"></i>
              </button>
            </div>
      </div>
      <p>${e.title}</p>
      <span>${e.price.toLocaleString()} تومان</span>
    </a>
  
  `;
  }

  //---------------------------------------------------------
  // این بخش برای نمایش دادن data کاربر بعد از ورود یا ثبت نام هست
  //---------------------------------------------------------
  async function showDataUser() {
    const Numberbasket = $(".Number-shopping-lists");
    const ExitUser = $(".wrapper-Login");
    const price = $(".Total-cart-price");

    if (userId) {
      // const data = await fetchJSON(`http://localhost:3000/api/users/${userId}`);
      Numberbasket.innerText =
        currentUser.basket.length.toLocaleString("fa-IR");
      const Exit = `
     <a href="./assets/page/Login/login.html" onclick="exitUsers()"> 
     <i class="fa-solid fa-arrow-right-from-bracket"></i>خروج
     </a>
     `;
      ExitUser.innerHTML = Exit;
      let totalPrice = 0;
      currentUser.basket.forEach((product) => {
        totalPrice += product.price;
      });
      price.innerText = `${totalPrice.toLocaleString("fa-IR")} تومان`;
    } else {
      Numberbasket.innerText = "0".toLocaleString("fa-IR");
      const login = `
    <i class="fa-regular fa-user"></i>
    <a href="./assets/page/sign up/sign-up.html">ثبت نام</a> /
    <a href="./assets/page/Login/login.html">ورود</a>
    `;
      ExitUser.innerHTML = login;
      price.innerText = "0 تومان".toLocaleString("fa-IR");
    }
  }

  //-----------------------------------------------
  // این تابع برای خروج کاربر از حساب کاربری خودش هست
  //-----------------------------------------------
  function exitUsers() {
    window.localStorage.clear();
  }
  //این بخش برای اضافه کردن محصولات به سبدخرید هست
  async function addProductToList(Product_Id, saveLocation, buttonElement) {
    const iconTag = buttonElement.querySelector("i");
    iconTag.className = "fa-solid fa-check";

    // let userId = window.localStorage.getItem("userId");

    await fetchJSON(
      `http://localhost:3000/api/users/${userId}/${saveLocation}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: Product_Id }),
      }
    );
  }
  //این تابع برای set کردن مقدار  هست
  function movePage(value) {
    window.sessionStorage.setItem("id", value);
    window.location.href = "./assets/page/product/index.html";
  }
  //این بخش برای اضافه کردن محصولات به سبدخرید هست
  async function addProductToList(Product_Id, saveLocation, buttonElement) {
    const iconTag = buttonElement.querySelector("i");
    iconTag.className = "fa-solid fa-check";

    await fetchJSON(
      `http://localhost:3000/api/users/${userId}/${saveLocation}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: Product_Id }),
      }
    );
  }

  //این تابع برای نمایش سریع محصولات تعریف شده
  async function showProductData(productId) {
    let data = await fetchJSON(
      `http://localhost:3000/api/products/${productId}`
    );

    let templateHtml = `
    <div class="container__product">
  <i class="fa-solid fa-xmark" onclick="addClass()"></i>

  <div class="img__product">
    <div>
      <img
        src="${data.src}"
        alt=""
      />
    </div>
  </div>

  <div class="data__product">
    <h3>${data.title}</h3>
    <p>${data.price.toLocaleString("fa-IR")}تومان</p>

    <ul>
      <li>${data.features[0].name}<span>${data.features[0].value}</span></li>
      <li>${data.features[1].name}<span>${data.features[1].value}</span></li>
      <li>${data.features[2].name}<span>${data.features[2].value}</span></li>
    </ul>

    <div class="add__to__basket">
      <button onclick="addProductToList('${
        data.id
      }', 'basket',this)">افزودن به سبدخرید<i class=""></i></button>
    </div>

    <div class="add__to__favorite">
      <button onclick="addProductToList('${data.id}', 'favorite', this)">
        <i class="fa-regular fa-heart"></i>
        افزودن به علاقه‌مندی
      </button>
      <button>
        <i class="fa-solid fa-shuffle"></i>
        مقایسه
      </button>
    </div>

    <div class="Product__features">
      <p>شناسه محصول: <span>${data.ProductID}</span></p>
      <p>دسته: <span>${data.title}</span></p>
      <p>برچسب: <span>چسب زخم</span></p>
      <p>
        اشتراک گذاری:
        <span>
          <i class="fa-solid fa-envelope"></i>
          <i class="fa-brands fa-facebook-f"></i>
          <i class="fa-brands fa-pinterest"></i>
          <i class="fa-brands fa-x-twitter"></i>
        </span>
      </p>
    </div>
  </div>
</div>`;
    showProduct.innerHTML = templateHtml;
    toggleClass(showProduct, "d-none", "remove");
  }
  function addClass() {
    showProduct.classList.add("d-none");
  }
  //---------------------
  //اجرای اولیه
  //----------------------
  window.addEventListener("load", async () => {
    createCategoryList(categorBtn, "option", "a");
    createCategoryList(megaMenu, "li", "a", {
      withIcon: true,
      iconPath: "./assets/img/svg/Mega-menu/",
    });
    addSliderImages();
    currentUser = await loadUserData();
    showDataUser();
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
    // اسلایدر category
    addSliderImages(
      "http://localhost:3000/api/categories",
      ".Show-category",
      (e, i) => {
        return `
     <a href="./assets/page/product/index.html" class="slider-item col" data-index="${i}" onclick="movePage('${i}')">
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
        //این بخش برای تشخیص محصولاتی که در سبد خرید و موردعلاقه هست
        let classNameFavorite = currentUser.favorite.some((p) => p.id === e.id)
          ? "fa-solid fa-check"
          : "fa-regular fa-heart";

        let classNameBasket = currentUser.basket.some((p) => p.id === e.id)
          ? "fa-solid fa-check"
          : "fa-solid fa-cart-shopping";
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
                <button title="سبدخرید" class="slider-basket w-100" onclick="addProductToList('${
                  e.id
                }', 'basket', this)">
                <i class="${classNameBasket}"></i>
                </button>
                <button title="مشاهده سریع" class="slider-view w-100 d-none d-md-block" onclick="showProductData('${
                  e.id
                }')">
                  <i class="fa-solid fa-magnifying-glass"></i>
                </button>
                <button title="مقایسه" class="slider-comparison w-100 d-none d-md-block">
                  <i class="fa-solid fa-shuffle"></i>
                </button>
                <button title="افزودن به سبدخرید" class="slider-like w-100" onclick="addProductToList('${
                  e.id
                }', 'favorite', this)">
                  <i class="${classNameFavorite}"></i>
                </button>
            </div>
              </div>
              <p>${e.title}}</p>
              <span><del>${e.price.toLocaleString()} تومان</del> ${result.toLocaleString()} تومان</span>
            </a>
          `;
      }
    );
  });
  window.movePage = movePage;
  window.addProductToList = addProductToList;
  window.showDataUser = showDataUser;
  window.exitUsers = exitUsers;
  window.showProductData = showProductData;
  window.addClass = addClass;
})();
