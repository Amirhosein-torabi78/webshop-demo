/** @format */
"use strict";
(async () => {
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
  const containerFilter = $(".container__filter");
  const userId = window.localStorage.getItem("userId");

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
  //این بخش برای گرفتن اطلاعات کاربر هست و ذخیره در متغییر سراسری
  let currentUser = null;
  async function loadUserData() {
    try {
      const res = await fetch("http://localhost:3000/api/users/" + userId);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("خطا در گرفتن اطلاعات کاربر:", err);
    }
  }

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
    showDataUser();
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
      await templateFn;
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
      containerFilter.classList.remove("d-none");
      PurchasePayment.classList.add("d-none");
    } catch {
      let html = `<div>پاسخی از سرور دریافت نشد</div>`;
      container.innerHTML = html;
    }
  }
  // این بخش ساختار html محصولات هست
  let minPriceProduct = Infinity;
  let maxPriceProduct = -Infinity;
  currentUser = await loadUserData();

  function templateProduct(e, i) {
    let resultOff = "d-none";
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
    // این شرط برای کنترل داشتن تخفیف هست
    if (e.off > 0) {
      resultOff = "";
    } else {
      resultOff = "d-none";
    }
    //این بخش برای تشخیص محصولاتی که در سبد خرید و موردعلاقه هست
    let classNameFavorite = currentUser.favorite.some((p) => p.id === e.id)
      ? "fa-solid fa-check"
      : "fa-regular fa-heart";

    let classNameBasket = currentUser.basket.some((p) => p.id === e.id)
      ? "fa-solid fa-check"
      : "fa-solid fa-cart-shopping";

    // if (Filter) {
    //   if (
    //     e.price >= Number(minRange.value) &&
    //     e.price <= Number(maxRange.value)
    //   ) {
    //     if (e.off > 0) {
    //       resultOff = "d-inlin";
    //     } else {
    //       resultOff = "d-none";
    //     }
    //   }
    // }

    // if (Off) {
    //   if (e.off > 0) {
    //     resultOff = "d-inlin";
    //   }
    // }
    // ساختار html
    return `
  <div class="product__car" data-index="${i}">
    <div class="wrapper-img">
      <img class="w-100" src="${e.src}" alt="${e.title}" />
      <span class="off ${resultOff}">%${e.off}</span>
      <div class="wrapper-icons">
        <button 
          class="slider-like" 
          title="افزودن به علاقه مندی" 
          onclick="addProductToList('${e.id}', 'favorite', this)">
          <i class="${classNameFavorite}" aria-hidden="true"></i>
        </button>
        <button title="مقایسه" class="slider-view d-none d-md-block">
          <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
        </button>
        <button title="مشاهده سریع" class="slider-view d-none d-md-block" onclick="ShowDroductData('${
          e.id
        }')">
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        </button>
      </div>
      <div class="wrapper-basket" onclick="addProductToList('${
        e.id
      }', 'basket', this)">
        <div>
          <span>سبد خرید</span>
          <i class="${classNameBasket}" style="color: #ffffff"></i>
        </div>
      </div>
    </div>
    <div class="wrapper-discription">
      <h4>${e.title}</h4>
      <div>
        <s class ="${resultOff}">${e.price.toLocaleString("fa-IR")}تومان </s>
        <span>${result.toLocaleString("fa-IR")}تومان</span>
      </div>
    </div>
  </div>
`;
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
          templateProduct
        );
      });
    });
  }
  //این بخش برای نمایش همه محصولات به صورت pagination هست
  const btnAllProducts = $(".btn__all__products");
  const containerBtns = $(".container__btns");
  const Suggestions = $(".Suggestions");
  const stor = document.querySelector(".sub-menu .stor");
  btnAllProducts.addEventListener("click", GetAllProduct);
  Suggestions.addEventListener("click", GetAllProduct);
  stor.addEventListener("click", GetAllProduct);
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
      templateProduct
    );
    containerBtns.firstElementChild.classList.add("btn__active");
    containerBtns.classList.remove("d-none");
    breadcrumb.textContent = "فروشگاه";
    ProductCategoriesTitel.textContent = "فروشگاه";
    sessionStorage.setItem("idCategory", "All");
    // pagination();
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
        (e, i) => templateFilter(e, i, true, false)
      );
    } else {
      addSliderImages(
        `http://localhost:3000/api/categories/${id}`,
        ".product-container",
        (e, i) => templateFilter(e, i, true, false)
      );
    }
  }
  // این بخش برای نمایش محصولات تخفیف دار هست
  const NewsArticles = $(".News-articles");
  const NewsArticlesSubMenu = $(".sub-menu .Off");
  NewsArticles.addEventListener("click", filterOff);
  NewsArticlesSubMenu.addEventListener("click", filterOff);
  function filterOff() {
    addSliderImages(
      "http://localhost:3000/api/products/offs",
      ".product-container",
      templateProduct
    );
  }
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
        templateProduct
      );
    }
  });
  // این تابع برای تغییر سایز محصولات هست
  function ChangingProductSizes(classname, element) {
    const viewOptions = $(element);
    viewOptions.className = "product-container";
    viewOptions.classList.add(classname);
  }
  function handleCheck(element, container, callback) {
    const discount = $(element);
    const Container = $(container);
    discount.addEventListener("change", () => {
      if (discount.checked) {
        callback();
      } else {
        Container.innerHTML = "";
      }
    });
  }

  handleCheck(".discount", ".product-container", filterOff);
  //---------------------------------------------------------
  // این بخش برای نمایش دادن data کاربر بعد از ورود یا ثبت نام هست
  //---------------------------------------------------------
  async function showDataUser() {
    const Numberbasket = $(".Number-shopping-lists");
    const NumberInterest = $(".Number-Interest-lists");
    const price = $(".Total-cart-price");
    if (userId) {
      let currentUser = await loadUserData();
      Numberbasket.innerText =
        currentUser.basket.length.toLocaleString("fa-IR");
      NumberInterest.innerText =
        currentUser.favorite.length.toLocaleString("fa-IR");

      let totalPrice = 0;
      currentUser.basket.forEach((product) => {
        totalPrice += product.price;
      });
      price.innerText = `${totalPrice.toLocaleString("fa-IR")} تومان`;
    } else {
      Numberbasket.innerText = (0).toLocaleString("fa-IR");
      NumberInterest.innerText = (0).toLocaleString("fa-IR");
      price.innerText = (0).toLocaleString("fa-IR") + " تومان";
    }
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

  const showProduct = $(".show__product");
  //این تابع برای نمایش سریع محصولات تعریف شده
  async function ShowDroductData(productId) {
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
  const productContainer = $(".product-container");
  const PurchasePayment = $(".Purchase__payment");
  const priceNotOff = $(".price__not__off");
  const price__off = $(".price__off");
  let basket = $(".basket");
  async function showProductsBasket() {
    let currentUser = await loadUserData();
    let templateHtml = "";
    let priceOff;
    let DiscountedPrice = 0;
    let PriceWithoutDiscount = 0;
    currentUser.basket.forEach((e) => {
      if (e.off > 0) {
        priceOff = e.price - (e.price * e.off) / 100;
      } else {
        priceOff = e.price;
      }
      DiscountedPrice += priceOff;
      PriceWithoutDiscount += e.price;
      templateHtml += `
      <div class="product__basket">
           <i class="fa-solid fa-xmark" aria-hidden="true" onclick="deleteProduct('${
             e.id
           }','basket')"></i>
            <div class="img__products__basket">
              <img
              class="w-100"
                src="${e.src}"
                alt=""
              />
            </div>
            <div class="Product__feature__basket">
              <h3>${e.title}</h3>
              <ul>
                <li>
                  <i class="fa-solid fa-award"></i> گارانتی 18 ماهه کسری پارس( 3
                  ماه تعویض طلایی)
                </li>
                <li><i class="fa-solid fa-shop"></i>اسمارت تکنولوژی</li>
                <li><i class="fa-solid fa-truck"></i>ارسال لومان</li>
                <li>
                  <i class="fa-solid fa-truck-fast"></i>ارسال سریع تا (تهران ،
                  کرج)
                </li>
              </ul>
              <div class="product__price__basket">
              <div class="Product__counter">
                <button><i class="fa-solid fa-minus"></i></button>
                <input type="number" value="1" />
                <button><i class="fa-solid fa-plus"></i></button>
              </div>
               <p class="price">${priceOff.toLocaleString("fa-IR")}تومان</p>
            </div>
            </div>
          </div>`;
    });

    productContainer.innerHTML = templateHtml;
    priceNotOff.innerHTML = `قیمت کالاها (${currentUser.basket.length.toLocaleString(
      "fa-IR"
    )})<span>${PriceWithoutDiscount.toLocaleString("fa-IR")}تومان</span>`;
    price__off.innerHTML = `مبلغ پرداختی <span>${DiscountedPrice.toLocaleString(
      "fa-IR"
    )}تومان</span`;
    containerFilter.classList.add("d-none");
    PurchasePayment.classList.remove("d-none");
    ProductCategoriesTitel.innerHTML = "سبدخرید";
    breadcrumb.innerHTML = "سبدخرید";
    toggleClass(containerBtns, "d-none", "add");
  }
  basket.addEventListener("click", showProductsBasket);
  //این تابع برای حذف محصول از سبد خرید هست
  async function deleteProduct(productId, removeLocation) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${userId}/${removeLocation}?productId=${productId}`,
        {
          method: "DELETE",
        }
      );
    } catch (err) {
      console.error("Error:", err);
    }
  }
  //این بخش برای نمایش محصولات داخل علاقه مندی هست
  const favorite = $(".favorite");
  const Interest = $(".Interest");
  Interest.addEventListener("click", showProductsFavorite);
  favorite.addEventListener("click", showProductsFavorite);
  function showProductsFavorite() {
    addSliderImages(
      `http://localhost:3000/api/users/${userId}`,
      ".product-container",
      templateProduct,
      "favorite"
    );
    ProductCategoriesTitel.innerHTML = "علاقه‌مندی ها";
    breadcrumb.innerHTML = "علاقه‌مندی ها";
  }
  //این فانکشن هارو global کردم تا onclick که برای elements تعریف کردم کار کنه
  window.ChangingProductSizes = ChangingProductSizes;
  window.addProductToList = addProductToList;
  window.addClass = addClass;
  window.ShowDroductData = ShowDroductData;
  window.deleteProduct = deleteProduct;

  async function Product(productId) {
    let data = await fetchJSON(
      `http://localhost:3000/api/products/filter?inStash=true&minPrice=10000000&maxPrice=40000000`
    );
    console.log(data);
  }
  Product();
})();
