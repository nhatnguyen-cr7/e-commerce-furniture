// Retrieve user token from local storage
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
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    return response.json();
  })
  .then((data) => {
    document.getElementById("name").innerText = data.name || "";
    document.getElementById("email").innerText = data.email || "";
    document.getElementById("phone").innerText = data.phone || "";
    document.getElementById("address").innerText = data.address || "";
  })
  .catch((error) => console.error("Error fetching user profile:", error));

fetch("https://e-commerce-json-dgbc.onrender.com/orders", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + userToken,
  },
})
  .then((response) => response.json())
  .then((data) => {
    const tableBody = document
      .getElementById("ordersTable")
      .querySelector("tbody");
    data.forEach((order, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
    <td class=" text-center border-b">${index + 1}</td>
    <td class=" text-center border-b">${order.userDetails.name}</td>
    <td class=" text-center border-b">${order.totalPrice}</td>
    <td class=" text-center border-b">${order.status}</td>
    <td class=" text-center border-b"><button class="view-icon" style="margin: 0" onclick="window.location.href='orderDetails.html?id=${
      order.id
    }'"><i class="fa fa-info-circle" aria-hidden="true"></i></button></td>
    `;
      tableBody.appendChild(row);
    });
  });

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
