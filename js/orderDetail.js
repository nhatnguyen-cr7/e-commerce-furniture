let authToken = JSON.parse(localStorage.getItem("user"));
let userToken = authToken?.token;

const params = new URLSearchParams(window.location.search);

// Lấy giá trị của tham số 'id'
const orderId = params.get("id");

fetch(`https://e-commerce-json-dgbc.onrender.com/orders/${orderId}`)
  .then((response) => response.json())
  .then((order) => {
    // Tạo một mảng các promise, mỗi promise là một yêu cầu API để lấy thông tin sản phẩm
    const productPromises = order.products.map((product) => {
      return fetch(
        `https://e-commerce-json-dgbc.onrender.com/products/${product.productId}`
      )
        .then((response) => response.json())
        .then((productDetails) => {
          // Kết hợp thông tin sản phẩm từ API với số lượng từ đơn hàng gốc
          return {
            ...productDetails,
            quantity: product.quantity,
            orderPrice: product.price,
          };
        });
    });

    // Chờ tất cả các promise hoàn thành
    return Promise.all(productPromises).then((products) => {
      // `products` là một mảng các đối tượng sản phẩm
      // Bạn có thể sử dụng thông tin này để cập nhật giao diện người dùng

      // Tạo một chuỗi HTML từ mảng sản phẩm
      const productRows = products
        .map((product, index) => {
          return `
            <tr>
              <td class="py-2 px-4 text-center border-b">${index + 1}</td>
              <td style="display: flex; justify-content: center" class="py-2 px-4 text-center border-b">
                <img src="${product.list_image[0]}" style="width: 40px;"></img>
              </td>
              <td class="py-2 px-4 text-center border-b">${product.name}</td>
              <td class="py-2 px-4 text-center border-b">${
                product.quantity
              }</td>
              <td class="py-2 px-4 text-center border-b">${
                product.orderPrice
              }</td>
            </tr>
          `;
        })
        .join("");

      // Chèn chuỗi HTML vào một phần tử table body
      document.querySelector("tbody").innerHTML = productRows;
    });
  })
  .catch((error) => {});
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
}
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
