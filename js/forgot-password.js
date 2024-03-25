const apiForgot = "https://e-commerce-json-dgbc.onrender.com/forgot-password";

const forgotPassword = async () => {
  const email = document.getElementById("email").value;
  try {
    const response = await fetch(apiForgot, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      Toastify({
        text: "The OTP code has been successfully sent !",
        backgroundColor: "rgb(32, 172, 90)",
      }).showToast();
      setTimeout(() => {
        window.location.href = "../Auth/reset_password.html";
      }, 2000);
    } else {
      const errorData = await response.json();
      console.error(errorData.error);
    }
  } catch (error) {
    console.error("Error registering user:", error);
  }
};
