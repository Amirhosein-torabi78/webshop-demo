/** @format */
let minPriceProduct = Infinity;
let maxPriceProduct = -Infinity;
function templateProduct(e, i, isFavorite, currentUser) {
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
        <button title="مشاهده سریع" class="slider-view d-none d-md-block" onclick="showProductData('${
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
       ${
         isFavorite
           ? `<button class="delete__car" title="" onclick="deleteProduct('${e.id}', 'favorite')"><i class="fa-solid fa-trash-can"></i></button>`
           : ""
       }
    </div>
  </div>
`;
}

export default templateProduct;
