// Slide img inspiration
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs((slideIndex += n));
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("img_slide");
  if (n > x.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = x.length;
  }
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex - 1].style.display = "block";
}

let authToken;
function useAuthToken() {
  const storedData = localStorage.getItem("user");

  if (storedData) {
    const data = JSON.parse(storedData);

    // Check if the token exists in the user object
    if (data && data.token) {
      authToken = data.token;
      document.getElementById("userName").innerHTML = data.user.name;
      document.getElementById("userNameHidden").innerHTML = data.user.name;
    }
  }
}

// Call the function
useAuthToken();

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/pages/Auth/logintration.html";
}

const cartLink = document.getElementById("cartLink");
const cartLinkHidden = document.getElementById("cartLinkHidden");
const loginButton = document.getElementById("login-button");
const userProfile = document.getElementById("user-profile");
const loginButtonHidden = document.getElementById("login-button-hidden");
const userProfileHidden = document.getElementById("user-profile-hidden");
// Check if authToken is null and set the appropriate link
if (authToken === undefined || authToken === null) {
  cartLink.href = "/pages/Auth/logintration.html";
  cartLinkHidden.href = "/pages/Auth/logintration.html";
  userProfile.style.display = "none";
  loginButton.style.display = "block";
  userProfileHidden.style.display = "none";
  loginButtonHidden.style.display = "block";
} else {
  cartLink.href = "/pages/cart/cart.html";
  cartLinkHidden.href = "/pages/cart/cart.html";
  userProfile.style.display = "block";
  loginButton.style.display = "none";
  userProfileHidden.style.display = "block";
  loginButtonHidden.style.display = "none";
}

// Add click event listener
cartLink.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default link behavior
  window.location.href = cartLink.href;
});

// Menu display
function displayMenuFunction() {
  var x = document.getElementById("headerMenu");
  var button = document.getElementById("menuButton");

  button.onclick = function () {
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };
}

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

// Render product list in hompage
let response = fetch("https://e-commerce-json-dgbc.onrender.com/products");
response
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    let html = "";
    res.data.slice(0, 8).forEach((item) => {
      html += `<div class="product">
            <div class="img-container">            
              <img src= ${item.list_image[0]} class="product-image">
              <div class="middle">
                
                  <button href="" class="add-to-cart-button" data-product-id="${item.id}">Add To Cart</button>
                
                <button class="view-detail-button" data-product-id="${item.id}">Details</button>
              </div>
            </div>
            <div class="product-content">
              <p class="product-name mb-2">${item.name}</p>
              <p class="product-describe mb-1">${item.title}</p>
              <div class="d-flex justify-content-lg-between align-items-xl-center flex-column flex-xl-row">
                <p class="product-price">${item.price} VND</p>
              </div>
            </div>
          </div>`;
    });
    document.getElementById("products").innerHTML = html;
  });

// Check if user login or not
if (authToken != undefined || authToken != null) {
  updateCartCount();
  // Count item in cart of user
  function updateCartCount() {
    fetch("https://e-commerce-json-dgbc.onrender.com/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((cartData) => {
        const cartItems = cartData.cart;
        let totalQuantity = 0;

        // Loop through each item in the cart and sum up the quantities
        for (let i = 0; i < cartItems.length; i++) {
          totalQuantity += cartItems[i].quantity;
        }
        document.getElementById("cart-item-count").innerHTML = totalQuantity;
        document.getElementById("cart-item-count-hidden").innerHTML =
          totalQuantity;
      })
      .catch((error) => {});
  }

  //   Add to cart
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-button")) {
      const id = event.target.dataset.productId;
      fetch("https://e-commerce-json-dgbc.onrender.com/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          // On successful addition to cart, show message and update the cart count
          showSuccessToast();
          updateCartCount();
        })
        .catch((error) => {});
    }
    updateCartCount();
  });
} else {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-button")) {
      window.location.href = "/pages/Auth/logintration.html";
    }
  });
}

// view product details
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("view-detail-button")) {
    const productId = event.target.dataset.productId;
    window.location.href =
      "../pages/single-product/single-product.html?id=" + productId;
  }
});

function redirectToShopPage() {
  // Navigate to the shop page
  window.location.href = "/pages/shop/shop.html";
}

// Back to top function
window.onscroll = function () {
  var backToTopButton = document.getElementById("backToTop");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};
document.getElementById("backToTop").addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // This makes the scroll smooth
  });
});
