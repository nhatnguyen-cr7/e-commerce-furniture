let autoken;

function useAuthToken() {
  const storedData = localStorage.getItem("admin");

  if (storedData) {
    const data = JSON.parse(storedData);
    if (data && data.token) {
      autoken = data.token;
      document.getElementById("userName").innerHTML = data.user.name;
    }
  }
}

function logout() {
  localStorage.removeItem("admin");
  window.location.href = "/pages/Auth/logintration.html";
}

const orderList = document.getElementById("get_order_list");

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
  console.log(item.id);
  row.innerHTML = `<tr>
        <td>${index + 1}</td>
        <td>${item.userDetails.name}</td>
        <td>${item.userDetails.email}</td>
        <td>${item.totalPrice}</td>
        <td class="status-container">
            <select class="statusSelector form-select" data-order-id="${
              item.id
            }">
                <option value="" disabled>Select order status</option>
                <option value="In Progress" data-color="yellow" ${
                  item.status === "In Progress" ? "selected" : ""
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
        <td>${item.userDetails.phone}</td>
        <td class="text-center">
            <button class="view-icon" data-order-id="${
              item.id
            }"><i class="fa fa-info-circle" aria-hidden="true"></i></button>
        </td>
    </tr>`;
  return row;
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
      showSuccessToast("Updated Status Successfully!");
    } else {
      showFailToast("Failed to update order status");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function initializeEventListeners() {
  document.querySelectorAll(".statusSelector").forEach((select) => {
    select.addEventListener("change", function () {
      const orderId = this.dataset.orderId;
      const newStatus = this.value;
      updateOrderStatus(orderId, newStatus);
    });
  });

  document.querySelectorAll(".view-icon").forEach((viewButton) => {
    viewButton.addEventListener("click", function () {
      const orderId = this.dataset.orderId;
      navigateToOrderDetailPage(orderId);
    });
  });
}

async function navigateToOrderDetailPage(orderId) {
  window.location.href =
    `/pages/Admin/order_detail/order_detail.html?id=` + orderId;
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

// Gọi các hàm khi trang được tải
useAuthToken();
displayOrderList();
