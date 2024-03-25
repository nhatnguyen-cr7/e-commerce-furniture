// render product list

// render product list
let currentPage = 1;
let totalPages = 1; // Add this line
const productsContainer = document.getElementById("products");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNumbers = document.getElementById("pageNumbers");
const limitSelect = document.getElementById("limitSelect");
const sortSelect = document.getElementById("sortSelect");
let arrr = [];

let authToken = JSON.parse(localStorage.getItem("user"));

let userToken = authToken?.token;

// Show message
function showSuccessToast() {
  var successToast = new bootstrap.Toast(
    document.getElementById("successToast")
  );
  successToast.show();
}
function showFailToast() {
  var failToast = new bootstrap.Toast(document.getElementById("failToast"));
  failToast.show();
}

const fetchProducts = async () => {
  const limit = limitSelect.value;
  const sort = sortSelect.value.split("Asc").length > 1 ? "asc" : "desc";
  const field =
    sortSelect.value.split("Asc").length > 1
      ? sortSelect.value.split("Asc")[0]
      : sortSelect.value.split("Desc")[0];

  const response = await fetch(
    `https://e-commerce-json-dgbc.onrender.com/products?_page=${currentPage}&_limit=${limit}&_sort=${field}&_order=${sort}`
  );
  const data = await response.json();

  totalPages = data.totalPages; // Update totalPages here

  // Disable or enable prevBtn and nextBtn based on the current page
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Clear products container
  productsContainer.innerHTML = "";

  // Add products to the products container
  data.data.forEach((item) => {
    productsContainer.innerHTML += `
      <div class="product-item">
        <div class="product-overlay">
          <div class="product-overlay__container">
            <div class="product-overlay__cart">
              <button class="add-to-cart-button" data-product-id="${item.id}"
              data-product-title="${item.title}"
              data-product-name="${item.name}"
              data-product-avatar="${item.list_image[0]}"
              data-product-price="${item.price}"
              data-product-createAt="${item.createAt}">Add to cart</button>
              <button class="view-product" data-product-id="${
                item.id
              }">View Product</button>
            </div>
          </div>
        </div>
        <img src=${item.list_image[0]} alt="" />
        <div class="product-content">
          <h1 class="product-item__title">${item.title}</h1>
          <p class="product-item__text">${item.name}</p>
          <span class="product-item__price">
            <span>${Intl.NumberFormat().format(item.price)} VND</span>
          </span>
        </div>
      </div>
    `;
  });

  // Update page numbers
  pageNumbers.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageNumberElement = document.createElement("button");
    pageNumberElement.textContent = i;
    pageNumberElement.classList.add("pagination-item");
    if (i === currentPage) {
      pageNumberElement.classList.add("active-page");
    }
    pageNumberElement.addEventListener("click", () => {
      currentPage = i;
      fetchProducts();
    });
    pageNumbers.appendChild(pageNumberElement);
  }
};
limitSelect.addEventListener("change", () => {
  currentPage = 1; // Reset currentPage to 1
  fetchProducts();
});

sortSelect.addEventListener("change", fetchProducts);

// Update page numbers
// active paginate button

const buttons = document.querySelectorAll(".page-button");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    button.forEach((btn) => {
      btn.classList.remove("active");
    });
    btn.classList.add("active");
  });
});
prevBtn.addEventListener("click", () => {
  currentPage = Math.max(currentPage - 1, 1);
  fetchProducts();
});
nextBtn.addEventListener("click", () => {
  currentPage = Math.min(currentPage + 1, totalPages); // Use totalPages here
  fetchProducts();
});

fetchProducts();

// // filter

const filterSelect = document.getElementById("productFilter");
// const filterButton = document.getElementById("filterButton");
const filterResults = document.getElementById("filterResults");

// Fetch categories
fetch("https://e-commerce-json-dgbc.onrender.com/categories")
  .then((res) => res.json())
  .then((categoriesData) => {
    const categories = categoriesData;
    populateFilterSelect(categories);
  })
  .catch((error) => {
    console.error("Error fetching categories:", error);
    // Handle error appropriately, such as displaying an error message or notifying the user
  });

// Create option elements for filter select
function populateFilterSelect(categories) {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    filterSelect.appendChild(option);
  });
}

// Filter products based on selected category
filterSelect.addEventListener("change", () => {
  const selectedCategoryId = filterSelect.value;
  if (selectedCategoryId === "all") {
    fetch("https://e-commerce-json-dgbc.onrender.com/products?_limit=20")
      .then((res) => res.json())
      .then((data) => {
        let html5 = "";
        data.data.forEach((item) => {
          html5 += `<div class="product-item">
          <div class="product-overlay">
            <div class="product-overlay__container">
              <div class="product-overlay__cart">
                 <button class="add-to-cart-button" data-product-id="${item.id}"
                 data-product-title="${item.title}"
                 data-product-name="${item.name}"
                 data-product-avatar="${item.list_image[0]}"
                 data-product-price="${item.price}"
                 data-product-createAt="${item.createAt}">Add to cart</button>
                 <button class="view-product" data-product-id="${
                   item.id
                 }">View Product</button>
                
              </div>
            </div>
          </div>

          <img src=${item.list_image[0]} alt="" />
          <div class="product-content">
            <h1 class="product-item__title">${item.title}</h1>
            <p class="product-item__text">${item.name}</p>
            <span class="product-item__price">
              <span>${Intl.NumberFormat().format(item.price)} VND</span>
            </span>
          </div>
        </div>`;
        });
        document.getElementById("products").innerHTML = html5;
      });
  } else {
    fetch("https://e-commerce-json-dgbc.onrender.com/products?_limit=20")
      .then((res) => res.json())
      .then((productsData) => {
        const products = productsData.data;
        const filteredProducts = products.filter(
          // so sánh id
          (product) => product.categoryId === selectedCategoryId
        );
        displayFilterResults(filteredProducts);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        // Handle error appropriately, such as displaying an error message or notifying the user
      });
  }
});

// Display filtered products
function displayFilterResults(products) {
  filterResults.innerHTML = "";

  let html4 = "";
  products.forEach((product) => {
    html4 += `<div class="product-item">
          <div class="product-overlay">
            <div class="product-overlay__container">
              <div class="product-overlay__cart">
                 <button class="add-to-cart-button" data-product-id="${
                   product.id
                 }"
                 data-product-title="${product.title}"
                 data-product-name="${product.name}"
                 data-product-avatar="${product.list_image[0]}"
                 data-product-price="${product.price}"
                 data-product-createAt="${
                   product.createAt
                 }">Add to cart</button>
                 <button class="view-product" data-product-id="${
                   product.id
                 }">View Product</button>
              </div>
            </div>
          </div>

          <img src=${product.list_image[0]} alt="" />
          <div class="product-content">
            <h1 class="product-item__title">${product.title}</h1>
            <p class="product-item__text">${product.name}</p>
            <span class="product-item__price">
              <span>${Intl.NumberFormat().format(product.price)} VND</span>
            </span>
          </div>
        </div>`;
  });

  document.getElementById("products").innerHTML = html4;

  if (products.length === 0) {
    let noProducts = (filterResults.textContent =
      "No products found in this category.");
    document.getElementById("filterResults").innerHTML = noProducts;
    document.getElementById("paginate-hide").style.display = "none";
    return;
  } else {
    document.getElementById("paginate-hide").style.display = "flex";
  }
}
// lắng nghe sự kiện tiến hành filter
// search

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

searchButton.addEventListener("click", () => {
  const productName = searchInput.value.trim();
  if (productName !== "") {
    // tiến hành search
    seachProduct(productName);

    searchInput.focus();
  } else {
    fetch("https://e-commerce-json-dgbc.onrender.com/products?_limit=20")
      .then((res) => res.json())
      .then((data) => {
        let html12 = "";
        data.data.forEach((item) => {
          html12 += `<div class="product-item">
          <div class="product-overlay">
            <div class="product-overlay__container">
              <div class="product-overlay__cart">
                 <button class="add-to-cart-button" data-product-id="${item.id}"
                 data-product-title="${item.title}"
                 data-product-name="${item.name}"
                 data-product-avatar="${item.list_image[0]}"
                 data-product-price="${item.price}"
                 data-product-createAt="${item.createAt}">Add to cart</button>
                 <button class="view-product" data-product-id="${
                   item.id
                 }">View Product</button>
                
              </div>
            </div>
          </div>

          <img src=${item.list_image[0]} alt="" />
          <div class="product-content">
            <h1 class="product-item__title">${item.title}</h1>
            <p class="product-item__text">${item.name}</p>
            <span class="product-item__price">
              <span>${Intl.NumberFormat().format(item.price)} VND</span>
            </span>
          </div>
        </div>`;
        });
        document.getElementById("products").innerHTML = html12;
      });
  }
});
function seachProduct(productName) {
  const apiUrl = `https://e-commerce-json-dgbc.onrender.com/products?_limit=20`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const products = data.data;
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(productName.toLowerCase())
      );
      displaySearchResults(filteredProducts);
    })
    .catch((err) => {
      console.error("Error", err);
    });
}
// hiển thị list sản phẩm đã search
function displaySearchResults(products) {
  searchResults.innerHTML = "";
  if (products.length === 0) {
    let noSearch = (seachProduct.textContent = "No result found");

    document.getElementById("searchResults").innerHTML = noSearch;
    document.getElementById("paginate-hide").style.display = "none";
    document.getElementById("products").style.display = "none";
    // searchResults.textContent = "No results found.";
    return;
  } else {
    document.getElementById("paginate-hide").style.display = "flex";
    document.getElementById("products").style.display = "grid";
  }
  let html3 = "";
  products.forEach((item) => {
    html3 += `<div class="product-item">
          <div class="product-overlay">
            <div class="product-overlay__container">
              <div class="product-overlay__cart">
                 <button class="add-to-cart-button" data-product-id="${item.id}"
                 data-product-title="${item.title}"
                 data-product-name="${item.name}"
                 data-product-avatar="${item.list_image[0]}"
                 data-product-price="${item.price}"
                 data-product-createAt="${item.createAt}">Add to cart</button>
                 <button class="view-product" data-product-id="${
                   item.id
                 }">View Product</button>
              </div>
            </div>
          </div>

          <img src=${item.list_image[0]} alt="" />
          <div class="product-content">
            <h1 class="product-item__title">${item.title}</h1>
            <p class="product-item__text">${item.name}</p>
            <span class="product-item__price">
              <span>${Intl.NumberFormat().format(item.price)} VND</span>
            </span>
          </div>
        </div>`;
  });
  document.getElementById("products").innerHTML = html3;
}

// show count of item in cart
if (userToken && authToken) {
  const getCountCart = () => {
    let user = fetch("https://e-commerce-json-dgbc.onrender.com/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    user
      .then((res) => {
        return res.json();
      })
      .then((cartData) => {
        const cartItems = cartData.cart;
        let totalProduct = 0;
        for (let i = 0; i < cartItems.length; i++) {
          totalProduct += cartItems[i].quantity;
        }
        document.getElementById("header-count").innerHTML = totalProduct;
        document.getElementById("header-count2").innerHTML = totalProduct;
      });
  };
  getCountCart();
  //   add to cart
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-button")) {
      // xử lí token
      // const authToken =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmYmIxMTAyLTI1M2ItNDNiMC1hYTAwLTlhYWIyMTk0NGFlOCIsImlhdCI6MTcwMDA0MDI0MX0.Lb4ASNjBc4tn5JJJ7Cc_YnVZSSr2HC3rIEgdBzLxRYM";

      // https://e-commerce-json-dgbc.onrender.com/cart/add
      const id = event.target.dataset.productId;
      fetch("https://e-commerce-json-dgbc.onrender.com/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          showSuccessToast();
          getCountCart();
        })
        .catch((error) => {
          console.error("Error adding product to cart:", error);
        });
    }
  });
} else {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-button")) {
      alert("Login first please");
      window.location.href = "/pages/Auth/logintration.html";
    }
  });
}
let loginCart = document.getElementById("linkCart");
const userProfile = document.getElementById("user-profile");
const userProfile2 = document.getElementById("user-profile2");
if (userToken && authToken) {
  let loginBtn = document.getElementById("login-button");
  let loginBtn2 = document.getElementById("login-button2");
  // show and hide user name
  let loginUser = document.getElementById("userName");
  let loginUser2 = document.getElementById("userName2");

  loginUser.innerHTML = authToken?.user?.name;
  loginUser2.innerHTML = authToken?.user?.name;

  loginBtn.style.display = "none";
  loginBtn2.style.display = "none";
  loginCart.href = "../cart/cart.html";
} else {
  userProfile.style.display = "none";
  userProfile2.style.display = "none";
  loginCart.href = "../Auth/logintration.html";
}

// change to login page

function logout() {
  localStorage.removeItem("user");
  window.location.href = "../Auth/logintration.html";
}

// localStorage
// menu
function getMenu() {
  var x = document.getElementById("headerMenu");
  var button = document.getElementById("menuButton");

  button.onclick = function () {
    // x.style.display === "none" ? "block" : "none";
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };
}
getMenu();

// change to single product page
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("view-product")) {
    const productId = event.target.dataset.productId;
    window.location.href = `../single-product/single-product.html?id=${productId}`;
  }
});
