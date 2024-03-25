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

// Description Tabs
function descriptionTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Input quantity
function increment() {
  document.getElementById("quantityInput").stepUp();
}

function decrement() {
  document.getElementById("quantityInput").stepDown();
}

// Get Product ID
const urlParams = new URLSearchParams(window.location.search);
const urlProductId = urlParams.get("id");

// Get product Detail
let productDetail = fetch(
  `https://e-commerce-json-dgbc.onrender.com/products/${urlProductId}`
);
productDetail
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    // Render list small image of slider
    const getListImages = data.list_image;
    let list = "";
    getListImages.forEach((item, index) => {
      list += `<div class="indicator-image-border p-1">
              <img
                src="${item}"
                class="indicator-image"
              />
            </div>`;

      if (index === 0) {
        // Set the first image as the source for MainImg1 and MainImg2
        var MainImg1 = document.getElementById("MainImg1");
        var MainImg2 = document.getElementById("MainImg2");
        MainImg1.src = item;
        MainImg2.src = item;
      }
    });

    document.getElementById("list-small-image").innerHTML = list;

    var smallImages = document.getElementsByClassName("indicator-image");
    for (let i = 0; i < smallImages.length; i++) {
      smallImages[i].addEventListener("click", function () {
        MainImg1.src = this.src;
        MainImg2.src = this.src;
      });
    }
    // Product Detail
    const title = data.title;
    const name = data.name;
    const price = Intl.NumberFormat().format(data.price);
    const id = data.id;
    const description = data.description;
    // Call API to get category name base on id
    const categoryId = data.categoryId;
    fetch("https://e-commerce-json-dgbc.onrender.com/categories/" + categoryId)
      .then((res) => res.json())
      .then((data) => {
        const category = data.name;
        document.getElementById("product-category").innerText = category;
      })
      .catch((error) => {});

    // Display the product details
    document.getElementById("page-title").innerText = name;
    document.getElementById("product-header").innerText = name;
    document.getElementById("product-title").innerText = title;
    document.getElementById("product-name").innerText = name;
    document.getElementById("product-price").innerText = price;
    document.getElementById("product-description").innerText = description;

    // Set the product ID for the Add to Cart button
    const addToCartButton = document.querySelector(".add-to-cart");
    addToCartButton.setAttribute("data-product-id", id); // Set the product ID as a data attribute
  });

// Related Product
// Get product category
let getProductCategory = fetch(
  `https://e-commerce-json-dgbc.onrender.com/products/${urlProductId}`
);
getProductCategory
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    const relatedId = data.categoryId;
    let response = fetch(
      `https://e-commerce-json-dgbc.onrender.com/products?categoryId=${relatedId}`
    );
    response
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const shuffledProducts = shuffle(res.data);
        const randomProducts = shuffledProducts.slice(0, 4);

        let listRelatedProduct = "";
        randomProducts.forEach((item) => {
          listRelatedProduct += `<div class="product">
                    <div class="img-container">
                      <img
                        src="${item.list_image[0]}"
                        class="product-image"
                      />
                      <div class="middle">
                          <button href="" class="add-to-cart-img" data-product-id="${
                            item.id
                          }">Add To Cart</button>
                        <button class="detail-button" data-product-id="${
                          item.id
                        }">Details</button>
                      </div>
                      <div class="product-content">
                        <p class="product-name mb-3">${item.name}</p>
                        <p class="product-describe mb-2">${item.title}</p>
                        <div
                          class="d-flex flex-column "
                        >
                          <p class="product-price">${Intl.NumberFormat().format(
                            item.price
                          )} VND</p>
                        </div>
                      </div>
                    </div>
                  </div>`;
        });
        document.getElementById("products").innerHTML = listRelatedProduct;
      });
    // Function to shuffle an array
    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }
  });

// Detail button
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("detail-button")) {
    const id = event.target.dataset.productId;
    window.location.href = "../single-product/single-product.html?id=" + id;
  }
});
// Show more button
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("show-more")) {
    window.location.href = "/pages/shop/shop.html";
  }
});

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

// Check if user login or not
if (authToken != undefined || authToken != null) {
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

  //   Add to cart with quantity
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart")) {
      const id = event.target.dataset.productId;
      const quantityInput = document.getElementById("quantityInput");
      const quantity = parseInt(quantityInput.value);

      if (!isNaN(quantity) && quantity > 0) {
        fetch("https://e-commerce-json-dgbc.onrender.com/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            productId: id,
            quantity: quantity,
          }),
        })
          .then((response) => response.json())
          .then(() => {
            // On successful addition to cart, show message and update the cart count
            showSuccessToast();
            updateCartCount();
          })
          .catch((error) => {});
      } else {
        showFailToast();
      }
    }
  });

  //   Add to cart
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-to-cart-img")) {
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
  });
  updateCartCount();
} else {
  document.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("add-to-cart") ||
      event.target.classList.contains("add-to-cart-img")
    ) {
      window.location.href = "/pages/Auth/logintration.html";
    }
  });
}
