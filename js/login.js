let apiUser = "https://e-commerce-json-dgbc.onrender.com/login";

const getUser = async () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  var bodyData = JSON.stringify({
    email: email.value,
    password: password.value,
  });

  try {
    const response = await fetch(apiUser, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyData,
    });

    if (response.status === 200) {
      const userData = await response.json();

      if (userData.user.verified === true) {
        if (userData.user.role === "user") {
          window.localStorage.setItem("user", JSON.stringify(userData));
          window.location.href = "/index.html";
        } else if (userData.user.role === "admin") {
          window.localStorage.setItem("admin", JSON.stringify(userData));
          window.location.href =
            "../Admin/Category/ecommerce-products-categories.html";
        }
      } else {
        // User is not verified or other conditions not met
        Toastify({
          text: "Login unsuccessful. Please check your credentials!",
          backgroundColor: "rgb(201, 42, 42)",
        }).showToast();
      }
    } else if (response.status === 401) {
      // Unauthorized - wrong password
      Toastify({
        text: "Incorrect user account. Please try again",
        backgroundColor: "rgb(201, 42, 42)",
      }).showToast();
    } else if (response.status === 400) {
      // Bad Request - Wrong email format
      Toastify({
        text: "Login unsuccessful. Please enter a valid email address!",
        backgroundColor: "rgb(201, 42, 42)",
      }).showToast();
    } else if (response.status === 404) {
      // Not Found - User account doesn't exist
      Toastify({
        text: "Incorrect user account. Please try again",
        backgroundColor: "rgb(201, 42, 42)",
      }).showToast();
    } else {
      // Handle other response statuses if needed
      console.log("Unknown status code: " + response.status);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    Toastify({
      text: "Login unsuccessful, please try again!",
      backgroundColor: "rgb(201, 42, 42)",
    }).showToast();
  }
};
