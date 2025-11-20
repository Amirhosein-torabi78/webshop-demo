/** @format */
"use strict";

const $ = (sel) => document.querySelector(sel);
const btnMenu = $(".btn-menu");
const boxMenu = $(".box-menu");
const categorBtn = $(".Categor-btn");
const megaMenu = $(".mega-menu");
const categoryFilter = $(".category-filter ul");
const searchInput = $(".search-input");
const select = $(".Categor-btn");
const elementShow = $(".element-show");
const showCategory = $(".Show-category");
const headerNav = $(".nav");
const btnsSubMenu = document.querySelectorAll(".btns button");
const menuCategories = $(".menu-categories");
const subMenu = $(".sub-menu");

// ---------------------------
// مدیریت کلاس فعال منو
// ---------------------------
const toggleClass = (element, className, action = "add") => {
  element.classList[action](className);
};

btnMenu.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleClass(boxMenu, "active", "add");
});

document.body.addEventListener("click", (e) => {
  if (!boxMenu.contains(e.target)) {
    toggleClass(boxMenu, "active", "remove");
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
      tag.value = index;

      if (options.withIcon) {
        const img = document.createElement("img");
        img.src = `${options.iconPath}${index}.svg`;
        img.alt = e.title;

        const tag2 = document.createElement(tagName2);
        tag2.textContent = e.title;
        tag2.href = "#";
        tag2.setAttribute("data-index", index);
        tag2.className = "category__titles";

        const icon = document.createElement("i");
        icon.className = "fa fa-angle-left";

        tag.append(img, tag2, icon);
      } else {
        const tag2 = document.createElement(tagName2);
        tag2.textContent = e.title;
        tag.appendChild(tag2);
        tag2.setAttribute("data-index", index);
        tag2.className = "category__titles";
      }

      frg.appendChild(tag);
    });

    element.appendChild(frg);
  } catch {
    const frg = document.createDocumentFragment();
    const tag = document.createElement(tagName1);
    const tag2 = document.createElement(tagName2);
    tag2.textContent = "پاسخی از سرور دریافت نشد";
    tag2.className = "category__titles";
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
//---------------------
//اجرای اولیه
//----------------------
window.addEventListener("load", () => {
  createCategoryList(categorBtn, "option", "a");
  createCategoryList(megaMenu, "li", "a", {
    withIcon: true,
    iconPath: "../../img/svg/Mega-menu/",
  });
  createCategoryList(categoryFilter, "li", "span");
});
// این بخش برای نمایش تایتل محصولات هست
async function addSliderImages(
  apiUrl,
  selector,
  templateFn,
  productsKey = "products",
  appendMode = false
) {
  const container = document.querySelector(selector);
  if (!container) {
    return;
  }
  const data = await fetchJSON(apiUrl);
  let html = "";
  try {
    console.log("productsKey =", productsKey);
    console.log("data =", data);
    console.log("data[productsKey] =", data[productsKey]);

    data[productsKey].forEach((item, index) => {
      html += templateFn(item, index);
    });
    
    if (appendMode) {
      // container.innerHTML += html;
      container.insertAdjacentHTML("beforeend", html);
    } else {
      container.innerHTML = "";
      container.insertAdjacentHTML("beforeend", html);
    }
  } catch {
    let html = `<div>پاسخی از سرور دریافت نشد</div>`;
    container.innerHTML = html;
  }
}
// این بخش ساختار html محصولات هست
let minPriceProduct = Infinity;
let maxPriceProduct = -Infinity;
function syntaxproducts(e, i) {
  // این بخش برای کم کردن مقدار تخفیف از قیمت هست
  const price = e.price;
  const off = e.off;
  let result = price - (price * off) / 100;
  // این بخش برای مشخص کردن بیشترین قیمت و کمترین قیمت هست
  if (price < minPriceProduct) {
    minPriceProduct = price;
  }
  if (price > maxPriceProduct) {
    maxPriceProduct = price;
  }
  minRange.value = minPriceProduct;
  minRange.min = minPriceProduct;
  minRange.max = maxPriceProduct;
  minPrice.textContent = minPriceProduct.toLocaleString("fa-IR");
  maxRange.value = maxPriceProduct;
  maxRange.max = maxPriceProduct;
  maxRange.min = minPriceProduct;
  maxPrice.textContent = maxPriceProduct.toLocaleString("fa-IR");
  // ساختار html
  const Discounted = `
     <div class="product__car" data-index="${i}">
              <div class="wrapper-img">
                <img
                  class="w-100"
                  src="${e.src}"
                  alt=""
                />
                <span class="off">%${e.off}</span>
                <div class="wrapper-icons">
                  <button title="افزودن به علاقه مندی" class="slider-like">
                    <i class="fa-regular fa-heart" aria-hidden="true"></i>
                  </button>
                  <button title="مقایسه" class="slider-view d-none d-md-block">
                    <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
                  </button>
                  <button
                    title="مشاهده سریع"
                    class="slider-view d-none d-md-block"
                  >
                    <i
                      class="fa-solid fa-magnifying-glass"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
                <div class="wrapper-basket">
                  <div>
                    <span>سبد خرید</span>
                    <i
                      class="fa-solid fa-cart-shopping"
                      style="color: #ffffff"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="wrapper-discription">
                <h4>${e.title}</h4>
                <div>
                  <s>${result.toLocaleString()} تومان</s>
                  <span>${e.price.toLocaleString()}تومان</span>
                </div>
              </div>
            </div>
    `;
  const counted = `
     <div class="product__car" data-index="${i}">
              <div class="wrapper-img">
                <img
                  class="w-100"
                  src="${e.src}"
                  alt=""
                />
                <div class="wrapper-icons">
                  <button title="افزودن به علاقه مندی" class="slider-like">
                    <i class="fa-regular fa-heart" aria-hidden="true"></i>
                  </button>
                  <button title="مقایسه" class="slider-view d-none d-md-block">
                    <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
                  </button>
                  <button
                    title="مشاهده سریع"
                    class="slider-view d-none d-md-block"
                  >
                    <i
                      class="fa-solid fa-magnifying-glass"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
                <div class="wrapper-basket">
                  <div>
                    <span>سبد خرید</span>
                    <i
                      class="fa-solid fa-cart-shopping"
                      style="color: #ffffff"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="wrapper-discription">
                <h4>${e.title}</h4>
                <div>
                  <span>${e.price.toLocaleString()} تومان</span>
                </div>
              </div>
            </div>
    
    `;
  if (e.off > 0) {
    return Discounted;
  } else {
    return counted;
  }
}

addSliderImages(
  "http://localhost:3000/api/categories",
  ".title-categorys",
  (e, i) => {
    return `
    <div >
      <img src="../../img/svg-1/${i}.svg" alt="" />
        <span>
            <span data-index="${i}" class="category__titles">${e.title}</span>
            <span class="product-Number">${e.products.length} محصول</span>
        </span>
    </div>`;
  },
  "categories",
  true
);
addSliderImages(
  "http://localhost:3000/api/categories",
  ".menu-categories",
  (e, i) => {
    return `
    <li class="item category__titles" data-index="${i}">
      <img src="../../img/svg/Mega-menu/${i}.svg" alt="" />
            ${e.title}
    </li>`;
  },
  "categories"
);
//این بخش برای مدیریت فعال بودن باتن های منو درحالت رسپانسیو هست
btnsSubMenu[0].addEventListener("click", () => {
  toggleClass(btnsSubMenu[0], "btn-active", "add");
  toggleClass(btnsSubMenu[1], "btn-active", "remove");
  toggleClass(menuCategories, "d-none", "add");
  toggleClass(subMenu, "d-none", "remove");
});
btnsSubMenu[1].addEventListener("click", () => {
  toggleClass(btnsSubMenu[1], "btn-active", "add");
  toggleClass(btnsSubMenu[0], "btn-active", "remove");
  toggleClass(subMenu, "d-none", "add");
  toggleClass(menuCategories, "d-none", "remove");
});
//این بخش برای نمایش محصولات هست
const ProductCategoriesTitel = $(".Product-categories");
const breadcrumb = $(".breadcrumb");
setTimeout(InjectionProducts, 1000);
async function InjectionProducts() {
  const CategoryTitles = document.querySelectorAll(".category__titles");
  CategoryTitles.forEach((e) => {
    e.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      if (index) {
        breadcrumb.textContent = event.target.textContent.trim();
        ProductCategoriesTitel.textContent = event.target.textContent.trim();
        containerBtns.classList.add("d-none");
        sessionStorage.setItem("idCategory", index);
      }
      addSliderImages(
        `http://localhost:3000/api/categories/${index}`,
        ".product-container",
        syntaxproducts
      );
    });
  });
}
//این بخش برای نمایش همه محصولات به صورت pagination هست
const btnAllProducts = $(".btn__all__products");
const containerBtns = $(".container__btns");
btnAllProducts.addEventListener("click", GetAllProduct);
async function GetAllProduct(e) {
  //این بخش برای اضافه کردن btn های pagination هست
  e.preventDefault();
  let numberPage = await fetchJSON("http://localhost:3000/api/products?page");
  const Numberbtn = Math.ceil(numberPage.products.length / 10);
  containerBtns.innerHTML = "";
  for (let i = 1; i <= Numberbtn; i++) {
    containerBtns.insertAdjacentHTML(
      "beforeend",
      `<button type="button" value="${i}">${i}</button>`
    );
  }
  addSliderImages(
    `http://localhost:3000/api/products?page=1`,
    ".product-container",
    syntaxproducts
  );
  containerBtns.firstElementChild.classList.add("btn__active");
  containerBtns.classList.remove("d-none");
  breadcrumb.textContent = "فروشگاه";
  ProductCategoriesTitel.textContent = "فروشگاه";
  sessionStorage.setItem("idCategory", "All");
  pagination();
}
//این بخش برای نوار قیلنر قیمت محصولات هست
const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const minGap = 1000000;
const sliderMaxValue = maxRange.max;

function formatPrice(num) {
  return num.toLocaleString("fa-IR");
}

minRange.addEventListener("input", () => {
  if (parseInt(maxRange.value) - parseInt(minRange.value) <= minGap) {
    minRange.value = parseInt(maxRange.value) - minGap;
  }
  minPrice.textContent = formatPrice(parseInt(minRange.value));
});

maxRange.addEventListener("input", () => {
  if (parseInt(maxRange.value) - parseInt(minRange.value) <= minGap) {
    maxRange.value = parseInt(minRange.value) + minGap;
  }
  maxPrice.textContent = formatPrice(parseInt(maxRange.value));
});
// این بخش برای فیلتر کردن محصولات بر اساس قیمت هست
const filterBtn = $(".filter-btn");
filterBtn.addEventListener("click", filterproduct);
function filterproduct() {
  const id = sessionStorage.getItem("idCategory");

  if (id == "All") {
    addSliderImages(
      `http://localhost:3000/api/products`,
      ".product-container",
      templateFilter
    );
  } else {
    addSliderImages(
      `http://localhost:3000/api/categories/${id}`,
      ".product-container",
      templateFilter,
    );
  }
}
function templateFilter(e, i) {
  // این بخش برای کم کردن مقدار تخفیف از قیمت هست
  const price = e.price;
  const off = e.off;
  let result = price - (price * off) / 100;
  const Discounted = `
     <div class="product__car" data-index="${i}">
              <div class="wrapper-img">
                <img
                  class="w-100"
                  src="${e.src}"
                  alt=""
                />
                <span class="off">%${e.off}</span>
                <div class="wrapper-icons">
                  <button title="افزودن به علاقه مندی" class="slider-like">
                    <i class="fa-regular fa-heart" aria-hidden="true"></i>
                  </button>
                  <button title="مقایسه" class="slider-view d-none d-md-block">
                    <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
                  </button>
                  <button
                    title="مشاهده سریع"
                    class="slider-view d-none d-md-block"
                  >
                    <i
                      class="fa-solid fa-magnifying-glass"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
                <div class="wrapper-basket">
                  <div>
                    <span>سبد خرید</span>
                    <i
                      class="fa-solid fa-cart-shopping"
                      style="color: #ffffff"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="wrapper-discription">
                <h4>${e.title}</h4>
                <div>
                  <s>${result.toLocaleString()} تومان</s>
                  <span>${e.price.toLocaleString()}تومان</span>
                </div>
              </div>
            </div>
    `;
  const counted = `
     <div class="product__car" data-index="${i}">
              <div class="wrapper-img">
                <img
                  class="w-100"
                  src="${e.src}"
                  alt=""
                />
                <div class="wrapper-icons">
                  <button title="افزودن به علاقه مندی" class="slider-like">
                    <i class="fa-regular fa-heart" aria-hidden="true"></i>
                  </button>
                  <button title="مقایسه" class="slider-view d-none d-md-block">
                    <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
                  </button>
                  <button
                    title="مشاهده سریع"
                    class="slider-view d-none d-md-block"
                  >
                    <i
                      class="fa-solid fa-magnifying-glass"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
                <div class="wrapper-basket">
                  <div>
                    <span>سبد خرید</span>
                    <i
                      class="fa-solid fa-cart-shopping"
                      style="color: #ffffff"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="wrapper-discription">
                <h4>${e.title}</h4>
                <div>
                  <span>${e.price.toLocaleString()} تومان</span>
                </div>
              </div>
            </div>
    
    `;
  if (e.price >= Number(minRange.value) && e.price <= Number(maxRange.value)) {
    if (e.off > 0) {
      return Discounted;
    } else {
      return counted;
    }
  }
   return "";
}

// function pagination(eve) {
//   [...containerBtns.children].forEach((e) => {
//     e.addEventListener("click", (event) => {
//       event.preventDefault();
//       [...containerBtns.children].forEach((element) => {
//         element.classList.remove("btn__active");
//       });
//       event.target.classList.add("btn__active");
//       addSliderImages(
//         `http://localhost:3000/api/products?page=${event.target.value}`,
//         ".product-container",
//         syntaxproducts
//       );
//     });
//   });
// }
// این بخش برای رفتن به صفحه های دیگه pagination هست
containerBtns.addEventListener("click", (event) => {
  const btn = event.target;
  if (btn.tagName === "BUTTON") {
    event.preventDefault(); // همیشه جلوی رفتار پیش‌فرض را می‌گیرد

    // حذف کلاس فعال از همه
    [...containerBtns.children].forEach((element) => {
      element.classList.remove("btn__active");
    });

    // اضافه کردن کلاس به دکمه کلیک شده
    btn.classList.add("btn__active");

    // فراخوانی تابع برای بارگذاری صفحه مورد نظر
    addSliderImages(
      `http://localhost:3000/api/products?page=${btn.value}`,
      ".product-container",
      syntaxproducts
    );
  }
});
// این تابع برای تغییر سایز محصولات هست
function ChangingProductSizes(classname, element) {
  const viewOptions = $(element);
  viewOptions.className = "product-container";
  viewOptions.classList.add(classname);
}
