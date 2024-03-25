let authToken;
function useAuthToken() {
  const storedData = localStorage.getItem("admin");

  if (storedData) {
    const data = JSON.parse(storedData);

    // Check if the token exists in the user object
    if (data && data.token) {
      authToken = data.token;
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

if (authToken != undefined || authToken != null) {
  function updateButtonAppearance(button, isVerified) {
    const icon = button.querySelector("i");
    icon.className = `fa-solid fa-${isVerified ? "unlock" : "lock"}`;
    button.innerHTML = `<i class="fa-solid fa-${
      isVerified ? "unlock" : "lock"
    }"></i> ${isVerified ? "Unlock" : "Lock"}`;
  }

  /// Hàm để thực hiện chức năng toggleLock
  async function toggleLock(userId, data) {
    // Tìm người dùng trong mảng data
    const user = data.find((user) => user.id === userId);

    if (user) {
      // Cập nhật giá trị verified của người dùng
      user.verified = !user.verified;

      // Cập nhật giao diện button
      const button = document.querySelector(`button[data-user-id="${userId}"]`);
      updateButtonAppearance(button, user.verified);

      // In ra trạng thái hiện tại
      console.log(`User ${userId} - Verified status: ${user.verified}`);

      // Gửi yêu cầu cập nhật lên server
      try {
        await updateVerifiedStatus(userId, user.verified);
        // Hiển thị toast thành công
        showSuccessToast(
          `${user.verified ? "Unlock" : "Lock"} user successfully`
        );
      } catch (error) {
        console.error(
          `Error updating verified status for user ${userId}:`,
          error.message
        );
        // Hiển thị toast lỗi
        showFailToast(`Failed to ${user.verified ? "lock" : "unlock"} user`);
      }
    } else {
      console.error(`User with id ${userId} not found.`);
    }
  }

  // Hàm để thiết lập giao diện ban đầu với dữ liệu từ server
  function setupUserButtons(data) {
    let html2 = "";
    let count = 1; // Biến đếm

    data.forEach((item) => {
      // Kiểm tra xem người dùng có role là "user" hay không
      if (item.role === "user") {
        html2 += `<tr>
      <th scope="row">${count}</th>
      <td>${item.email}</td>
      <td>${item.name}</td>
      <td>${item.phone}</td>
      <td>${item.address}</td>
      <td class="text-center">
      <button type="button" 
          class="btn btn-outline-dark btn-sm user-button" 
          data-user-id="${item.id}">
          <i class="fa-solid fa-${
            item.verified ? "unlock" : "lock"
          } fa-lg"></i> ${item.verified ? "Unlock" : "Lock"}
      </button>
  </td>
    </tr>`;
        count++; // Tăng giá trị của biến đếm
      }
    });

    document.getElementById("userManage").innerHTML = html2;

    // Thêm sự kiện cho từng button
    const userButtons = document.querySelectorAll(".user-button");
    userButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const userId = button.getAttribute("data-user-id");
        toggleLock(userId, data);
      });
    });
  }

  // Gọi fetch để lấy dữ liệu từ server và sau đó thiết lập giao diện
  function fetchData() {
    fetch("https://e-commerce-json-dgbc.onrender.com/admin/users", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setupUserButtons(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }

  // Gọi hàm fetch dữ liệu
  fetchData();

  async function updateVerifiedStatus(userId, newStatus) {
    try {
      const response = await fetch(
        `https://e-commerce-json-dgbc.onrender.com/admin/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            verified: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update verified status.");
      }

      console.log(
        `User ${userId} - Verified status updated on the server: ${newStatus}`
      );
    } catch (error) {
      console.error(
        "Error updating verified status on the server:",
        error.message
      );
    }
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
} else {
  window.location.href = "../../Auth/logintration.html";
}
