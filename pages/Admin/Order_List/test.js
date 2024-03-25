// const autoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmYmIxMTAyLTI1M2ItNDNiMC0xMjEzMWN4engxMjQxNTY0Nzg5YyIsImlhdCI6MTY5OTk0NjEyN30.YsxJkckb1oVimpUO9TZniUlUcSBQZdBsVkt5tx9uoUQ"

let autoken;
function useAuthToken() {
  const storedData = localStorage.getItem("admin");

  if (storedData) {
    const data = JSON.parse(storedData);

    // Check if the token exists in the user object
    if (data && data.token) {
      autoken = data.token;
      document.getElementById("userName").innerHTML = data.user.name;
    }
  }
}

// Call the function
useAuthToken();

function logout() {
  localStorage.removeItem("admin");
  window.location.href = "/pages/Auth/logintration.html";
}
const orderList = document.getElementById("get_order_list");

// Gọi hàm để hiển thị danh sách đơn hàng khi trang được tải
displayOrderList();

async function displayOrderList() {
  try {
    const response = await fetch(
      "https://e-commerce-json-dgbc.onrender.com/admin/orders",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${autoken}`,
        },
      }
    );

    if (response.ok) {
      const orders = await response.json();
      console.log("Orders:", orders);
      renderOrders(orders);
    } else {
      showFailToast("Failed to get orders");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderOrders(orders) {
  orderList.innerHTML = "";

  orders.forEach((item, index) => {
    const row = createOrderRow(item, index);
    orderList.appendChild(row);
  });

  initializeEventListeners();
}

function createOrderRow(item, index) {
  const row = document.createElement("tr");
  row.id = `row-${item.id}`;
  row.innerHTML = `<tr><td>${index + 1}</td>
                         <td>${item.customerName}</td>
                         <td>${item.email}</td>
                         <td>${item.totalPrice}</td>
                         <td class="status-container">
                            <select class="statusSelector form-select" data-order-id="${
                              item.id
                            }">
                                <option value="" disabled>Select order status</option>
                                <option value="In Progress" data-color="yellow" ${
                                  item.status === "In Progress"
                                    ? "selected"
                                    : ""
                                }>In Progress</option>
                                <option value="Shipping" data-color="blue" ${
                                  item.status === "Shipping" ? "selected" : ""
                                }>Shipping</option>
                                <option value="Cancel" data-color="red" ${
                                  item.status === "Cancel" ? "selected" : ""
                                }>Cancel</option>
                                <option value="Delivered" data-color="green" ${
                                  item.status === "Delivered" ? "selected" : ""
                                }>Delivered</option>
                            </select>
                        </td>

                         <td>${item.phone}</td>
                         <td class="text-center">
                             <button class="view-icon view-btn" data-order-id="${
                               item.id
                             }"><i class="fa fa-info-circle" aria-hidden="true"></i></button>
                         </td></tr>`;
  return row;
}

function initializeEventListeners() {
  document.querySelectorAll(".statusSelector").forEach((select) => {
    select.addEventListener("change", function () {
      const orderId = this.dataset.orderId;
      const newStatus = this.value;
      updateOrderStatus(orderId, newStatus);
      showSuccessToast("Updated Status Successfully!");
    });
  });

  document.querySelectorAll(".view-btn").forEach((viewButton) => {
    viewButton.addEventListener("click", function () {
      const orderId = this.dataset.orderId;
      viewOrder(orderId);
    });
  });
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(
      `https://e-commerce-json-dgbc.onrender.com/admin/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${autoken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (response.ok) {
      console.log(`Order with ID ${orderId} status updated to ${newStatus}.`);
    } else {
      showFailToast("Failed to update order status");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function viewOrder(orderId) {
  try {
    const response = await fetch(
      `https://e-commerce-json-dgbc.onrender.com/admin/orders/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${autoken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch order with ID ${orderId}.`);
      return;
    }

    const order = await response.json();

    // Hiển thị thông tin chi tiết của đơn hàng trong modal
    const orderDetailsModal = document.getElementById("orderDetailsModal");
    const modalBody = orderDetailsModal.querySelector(".modal-body");
    modalBody.innerHTML = "";

    // Hiển thị danh sách sản phẩm trong đơn hàng
    const productList = document.createElement("div");
    productList.innerHTML = `<h5>Products:</h5>`;
    const productPromises = order.products.map((product, index) => {
      return fetch(
        `https://e-commerce-json-dgbc.onrender.com/admin/products/${product.productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${autoken}`,
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          const productName = response.name;
          const productHTML = `<p><strong>#${index + 1}</strong></p>
                             <p><strong>Product Name:</strong> ${productName}</p>
                             <p><strong>Quantity:</strong> ${
                               product.quantity
                             }</p>
                             <p><strong>Price:</strong> ${product.price}</p>
                             <hr>`;
          productList.innerHTML += productHTML;
        });
    });
    modalBody.appendChild(productList);

    // Hiển thị modal
    $("#orderDetailsModal").modal("show");
  } catch (error) {
    console.error("Error:", error);
  }
  // Lấy tất cả các thẻ select có class là statusSelector
  const statusSelectors = document.querySelectorAll(".statusSelector");

  // Lặp qua từng select và thêm sự kiện change
  statusSelectors.forEach((selector) => {
    selector.addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      const color = selectedOption.getAttribute("data-color");
      this.style.setProperty("--selected-color", color); // Thay đổi màu sắc của option được chọn
    });
  });
}
function showSuccessToast(message) {
  document.getElementById("successMessage").innerText = message;
  var successToast = new bootstrap.Toast(
    document.getElementById("successToast")
  );
  successToast.show();
}
function showFailToast(message) {
  document.getElementById("warnMessage").innerText = message;
  var failToast = new bootstrap.Toast(document.getElementById("failToast"));
  failToast.show();
}
