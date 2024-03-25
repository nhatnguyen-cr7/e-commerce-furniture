const apiRegister = "https://e-commerce-json-dgbc.onrender.com/register";

const registerUser = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const role = "user";

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    Toastify({
      text: "Please enter a valid email address!",
      backgroundColor: "rgb(201, 42, 42)",
    }).showToast();
    return;
  }

  // Validate phone number format (e.g., "0812345789")
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    Toastify({
      text: "Please enter a valid phone number (e.g., 0123456789)!",
      backgroundColor: "rgb(201, 42, 42)",
    }).showToast();
    return;
  }

  try {
    const response = await fetch(apiRegister, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
        phone: phone,
        address: address,
        role: role,
      }),
    });

    if (response.status === 200) {
      console.log("Success: ", response);
      window.location.href = "../Auth/verify.html";
    } else if (response.status === 400) {
      const responseData = await response.json();
      Toastify({
        text: responseData.error || "Error creating user",
        backgroundColor: "rgb(201, 42, 42)",
      }).showToast();
    } else {
      console.log("Unknown status code: " + response.status);
    }
  } catch (error) {
    console.error("Error registering user:", error);
  }
};
