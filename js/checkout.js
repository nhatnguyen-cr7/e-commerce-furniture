let authToken = JSON.parse(localStorage.getItem("user"));
let userToken = authToken?.token;

// Fetch user profile
fetch("https://e-commerce-json-dgbc.onrender.com/profile", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + userToken,
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data, "data");
    // Fill in user details in the form
    document.getElementById("first-name").value = data.name;
    document.getElementById("email-address").value = data.email;
    document.getElementById("phone-no").value = data.phone;
    document.getElementById("street-address").value = data.address;

    // Fill in order summary
    let orderSummary = "";
    let total = 0;

    // Function to fetch product details
    const fetchProductDetails = async (productId) => {
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

      return response.json();
    };

    // Fetch product details and update order summary
    const updateOrderSummary = async () => {
      for (const item of data.cart) {
        try {
          const productDetails = await fetchProductDetails(item.productId);
          total += productDetails.price * item.quantity;
          orderSummary += `<tr data-product-id="${item.productId}">
                              <td>
                                <img src="${productDetails.list_image[0]}" alt="" class="sofa"">
                              </td>
                              <td class="text2-1">${productDetails.name}</td>
                              <td class="price">${productDetails.price} VNĐ</td>
                              <td class="text3">${item.quantity}</td>
                              <td><span class="subtotal">${item.price} VNĐ</span></td>
                            </tr>`;
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }

      document.getElementById("checkouts").innerHTML = orderSummary;
      document.getElementById("cartTotal").textContent = total + " VNĐ";
    };

    // Update order summary
    updateOrderSummary();

    // Get cart count
    getCountCart();
  });

// Handle place order button click
document.getElementById("place-order").addEventListener("click", () => {
  console.log("place order");
  // Get user details from the form
  const userDetails = {
    name: document.getElementById("first-name").value,
    email: document.getElementById("email-address").value,
    phone: document.getElementById("phone-no").value,
    streetAddress: document.getElementById("street-address").value,
  };

  // Get order details from the order summary
  const listProducts = Array.from(
    document.getElementById("checkouts").children
  ).map((row) => ({
    productId: row.dataset.productId,
    price: parseFloat(row.children[2].textContent),
    quantity: parseInt(row.children[3].textContent),
  }));

  // Calculate total price
  const totalPrice = listProducts.reduce(
    (total, product) => total + product.price,
    0
  );

  // Create order
  fetch("https://e-commerce-json-dgbc.onrender.com/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + userToken,
    },
    body: JSON.stringify({
      userId: getUserId(),
      products: listProducts,
      userDetails,
      totalPrice,
      status: "Processing",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Order placed successfully!");
      // Redirect to home page after successful order
      window.location.href = "/";
    });
});

function getUserId() {
  // Thay thế điều này với logic để lấy ID của người dùng
  return authToken?.user?.id;
}
// Get cart count
function getCountCart() {
  let user = fetch("https://e-commerce-json-dgbc.onrender.com/cart", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  user
    .then((res) => res.json())
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
}

// Login Cart
const loginCart = document.getElementById("linkCart");
const loginCart2 = document.getElementById("cartLinkHidden");
const userProfile = document.getElementById("user-profile");
const userProfile2 = document.getElementById("user-profile-hidden");

if (userToken && authToken) {
  const loginBtn = document.getElementById("login-button");
  const loginBtn2 = document.getElementById("login-button-hidden");

  const loginUser = document.getElementById("userName");
  const loginUser2 = document.getElementById("userNameHidden");

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

// Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "/pages/Auth/logintration.html";
}
