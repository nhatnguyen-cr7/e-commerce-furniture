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
useAuthToken();
function logout() {
  localStorage.removeItem("admin");
  window.location.href = "/pages/Auth/logintration.html";
}
const urlParams = new URLSearchParams(window.location.search);
const urlOrderId = urlParams.get("id");
if (autoken != undefined || autoken != null) {
  function getOrderDetails() {
    fetch(
      `https://e-commerce-json-dgbc.onrender.com/admin/orders/${urlOrderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${autoken}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        return response.json();
      })
      .then((data) => {
        // Process or display the order details here
        document.getElementById("order_id_title").innerHTML =
          "Order ID:" + data.id;
        document.getElementById("created_at").innerHTML =
          "Created At:" + data.createdAt;
        document.getElementById(
          "select_status"
        ).innerHTML = `<select style="width: 10%;" class="statusSelector form-select" data-order-id="${
          data.id
        }">
                                                                                    <option value="" disabled>Select order status</option>
                                                                                    <option value="Progressing" data-color="yellow" ${
                                                                                      data.status ===
                                                                                      "In Progress"
                                                                                        ? "selected"
                                                                                        : ""
                                                                                    }>Progressing</option>
                                                                                    <option value="Shipping" data-color="blue" ${
                                                                                      data.status ===
                                                                                      "Shipping"
                                                                                        ? "selected"
                                                                                        : ""
                                                                                    }>Shipping</option>
                                                                                    <option value="Cancel" data-color="red" ${
                                                                                      data.status ===
                                                                                      "Cancel"
                                                                                        ? "selected"
                                                                                        : ""
                                                                                    }>Cancel</option>
                                                                                    <option value="Delivered" data-color="green" ${
                                                                                      data.status ===
                                                                                      "Delivered"
                                                                                        ? "selected"
                                                                                        : ""
                                                                                    }>Delivered</option>
                                                                                </select>`;
        document.getElementById("customer_name").innerHTML =
          data.userDetails.name;
        document.getElementById("customer_email").innerHTML =
          data.userDetails.email;
        document.getElementById("customer_phone").innerHTML =
          data.userDetails.phone;
        document.getElementById("address").innerHTML =
          data.userDetails.streetAddress;
        document.getElementById("billing_id").innerHTML = data.id;
        document.getElementById("order_date").innerHTML = data.createdAt;
        document.getElementById("total_price").innerHTML = data.totalPrice;

        let listProducts = "";
        let promises = data.products.map((item, index) => {
          return fetch(
            `https://e-commerce-json-dgbc.onrender.com/admin/products/${item.productId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${autoken}`,
              },
            }
          )
            .then((response) => response.json())
            .then((productData) => {
              // process data and add to listProducts
              let productName = productData.name;
              let productImage = productData.list_image[0];
              listProducts += `<tr>
                            <td>${index + 1}</td>
                            <td>${productName}</td>
                            <td><img src="${productImage}" style="width: 5%;"></img></td>
                            <td>${item.quantity}</td>
                            <td>${item.price}</td>
                        </tr>`;
            })
            .catch((error) => {
              // handle errors if any
              console.error("Error fetching product data:", error);
            });
        });

        Promise.all(promises).then(() => {
          // All data has been processed
          // Now you can use the listProducts variable or perform other operations
          // Add data to the table with ID 'get_data_products'
          let table = document.getElementById("get_data_products");
          if (table) {
            table.innerHTML = listProducts;
          }
        });
      });
    // ...

    // Add an event listener to listen for changes in the select dropdown
    document.addEventListener("change", function (event) {
      const { target } = event;

      // Check if the target element is a select element with class 'statusSelector'
      if (target.classList.contains("statusSelector")) {
        const selectedStatus = target.value; // Get the selected value from the dropdown
        const orderId = target.getAttribute("data-order-id"); // Get the order ID from the data attribute

        // Make a fetch request to update the order status
        fetch(
          `https://e-commerce-json-dgbc.onrender.com/admin/orders/${orderId}`,
          {
            method: "PUT", // Assuming your API endpoint uses PUT method for updating
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${autoken}`,
            },
            body: JSON.stringify({ status: selectedStatus }), // Sending the selected status in the request body
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to update order status");
            }
            // Perform actions after successful update if needed
            showSuccessToast("Updated Order Status successfully");
            // You might want to refresh the order details after updating the status
            getOrderDetails();
          })
          .catch((error) => {
            // Handle errors if any
            showFailToast("Failed to update order status");
          });
      }
    });

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
  }

  getOrderDetails();
} else {
  console.log("undefined error");
}
