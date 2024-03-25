let authToken = JSON.parse(localStorage.getItem("user"));

let userToken = authToken?.token;

async function updateQuantity(input) {
  // Lấy giá và số lượng từ HTML
  var row = input.closest(".cart-item");
  var priceElement = row.querySelector(".price");
  var subtotalElement = row.querySelector(".subtotal");

  var productId = row.dataset.productId;
  var quantity = parseInt(input.value);

  try {
    // Retrieve the original price from the server
    const productDetails = await getProductDetailsFromServer(productId);
    const originalPrice = productDetails.price;

    // Update the price element in the UI (if needed)
    priceElement.innerText = formatCurrency(originalPrice);

    // Calculate the new subtotal without changing the original price
    var subtotal = originalPrice * quantity;
    subtotalElement.innerText = formatCurrency(subtotal);

    // Update the cart total
    updateCartTotal();

    // Update the cart on the server with the new quantity
    updateCartOnServer(productId, quantity, row);

    getCountCart();

    // Get the updated count and update header-count
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
}

async function getProductDetailsFromServer(productId) {
  try {
    const response = await fetch(
      `https://e-commerce-json-dgbc.onrender.com/products/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Product not found");
    }

    const productDetails = await response.json();
    return productDetails;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
}

function updateCartTotal(cartData) {
  var cartItems = document.querySelectorAll(".cart-item");
  var cartSubtotal = 0;

  // Lặp qua từng sản phẩm trong giỏ hàng
  cartItems.forEach(function (item) {
    var subtotalElement = item.querySelector(".subtotal");
    var subtotal = parseFloat(
      subtotalElement.innerText.replace("VNĐ", "").replace(",", "")
    );
    cartSubtotal += subtotal;
  });

  // Hiển thị tổng giá cả và hiển thị
  var cartSubtotalElement = document.getElementById("cartSubtotal");
  cartSubtotalElement.innerText = formatCurrency(cartSubtotal);

  var cartTotalElement = document.getElementById("cartTotal");
  cartTotalElement.innerText = formatCurrency(cartSubtotal);
}

// Function to update cart total on the server
function updateCartOnServer(productId, quantity, row) {
  // Gửi yêu cầu PUT để cập nhật giỏ hàng trên server
  fetch(`https://e-commerce-json-dgbc.onrender.com/cart/update/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + userToken,
    },
    body: JSON.stringify({ quantity: quantity }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Cart updated on server:", data);
    })
    .catch((error) => {
      console.error("There was a problem updating the cart:", error);
    });
}

// Function to retrieve cart data from the server

// Gửi yêu cầu GET để lấy thông tin giỏ hàng từ server
fetch("https://e-commerce-json-dgbc.onrender.com/cart", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  },
})
  .then((res) => {
    return res.json();
  })
  .then(async (res) => {
    let html = "";

    for (const item of res.cart) {
      try {
        const productDetails = await getProductDetailsFromServer(
          item.productId
        );
        const formattedPrice = productDetails.price;
        const list_image = productDetails.list_image;
        const name = productDetails.name;

        html += `<tr class="cart-item" data-product-id="${item.productId}">
            <td>
              <div class="sofat">
                <img src="${list_image[0]}" alt="" class="sofa" />
              </div>
            </td>
            <td class="text2-1">${name}</td>
            <td class="price">${formattedPrice} VNĐ</td>
            <td class="text3">
              <input
                type="number"
                id="quantity"
                value="${item.quantity}"
                min="1"
                class="quantity quantity-input"
                onchange="updateQuantity(this)"
              />
            </td>
            <td><p class="subtotal">${item.price} VNĐ</p></td>
            <td>
              <button class="delete-item" onclick="deleteCartItem('${item.productId}')">
                <img src="../../assets/cart/imgs/delete-filled .png" />
              </button>
            </td>
          </tr>`;
      } catch (error) {
        console.error("Error processing cart item:", error);
      }
    }

    document.getElementById("carts").innerHTML = html;
    updateCartTotal();
  })
  .catch((error) => {
    console.error("There was an error fetching cart data:", error);
  });

function deleteCartItem(productId) {
  var deletedItem = document.querySelector(
    `.cart-item[data-product-id="${productId}"]`
  );

  if (!deletedItem) {
    console.error("Item not found in the cart.");
    return;
  }
  // Send a DELETE request to the server to delete the item
  fetch(`https://e-commerce-json-dgbc.onrender.com/cart/remove/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Item deleted from cart:", data);

      deletedItem.remove();

      // Update the total after modifying the UI
      updateCartTotal();
      getCountCart();
    })
    .catch((error) => {
      console.error("There was a problem deleting the item:", error);
    });
}

function updateCartUI(cartData, updatedProductId, updatedQuantity) {
  var cartItems = document.querySelectorAll(".cart-item");

  // Loop through cart items
  cartItems.forEach(function (item) {
    var productId = item.dataset.productId;

    // Check if the current item matches the updated product
    if (productId === updatedProductId) {
      // Update the quantity for the specific item
      var quantityInput = item.querySelector(".quantity-input");
      quantityInput.value = updatedQuantity;
    }
  });

  // Update the total after modifying the UI
  updateCartTotal(cartData);

  // Update header-count
  getCountCart();
}

// Gọi hàm updateCartTotal khi trang được tải
window.onload = function () {
  updateCartTotal();
};

function formatCurrency(amount) {
  // Làm tròn số và định dạng thành chuỗi
  var formattedAmount = Math.round(amount).toString();

  // Chia chuỗi thành từng đoạn hàng nghìn
  var thousands = formattedAmount.slice(0, -3);
  var remainder = formattedAmount.slice(-3);

  // Kết hợp các đoạn với dấu phân cách hàng nghìn
  var result = thousands.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + remainder;

  // Thêm ký tự đồng
  return result + " VNĐ";
}

// show count of item in cart
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
      document.getElementById("cart-item-count-hidden").innerHTML =
        totalProduct;
    });
};
getCountCart();
//   add to cart
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-cart-button")) {
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

let loginCart = document.getElementById("linkCart");
let loginCart2 = document.getElementById("cartLinkHidden");
const userProfile = document.getElementById("user-profile");
const userProfile2 = document.getElementById("user-profile-hidden");

if (userToken && authToken) {
  let loginBtn = document.getElementById("login-button");
  let loginBtn2 = document.getElementById("login-button-hidden");

  // show and hide user name
  let loginUser = document.getElementById("userName");
  let loginUser2 = document.getElementById("userNameHidden");

  loginUser.innerHTML = authToken?.user?.name;
  loginUser2.innerHTML = authToken?.user?.name;

  loginBtn.style.display = "none";
  loginBtn2.style.display = "none";
  loginCart.href = "../cart/cart.html";
} else {
  userProfile.style.display = "none";
  userProfile2.style.display = "none";
  loginCart.href = "/pages/cart/cart.html";
  loginCart2.href = "/pages/cart/cart.html";
}

// change to login page

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/pages/Auth/logintration.html";
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

function handleCheckout() {
  // Lấy đối tượng form và action trang checkout
  var checkoutUrl = "/pages/checkout/checkout.html"; // Thay đổi thành đường dẫn thực tế

  window.location.href = checkoutUrl;
}
