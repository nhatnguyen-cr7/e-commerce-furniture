// reset_password.js
const resetpassword = async () => {
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  try {
    const response = await fetch(
      "https://e-commerce-json-dgbc.onrender.com/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: parseInt(otp),
          newPassword: newPassword,
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();

      Toastify({
        text: "Reset Password Success !",
        backgroundColor: "rgb(32, 172, 90)",
      }).showToast();
      setTimeout(() => {
        window.location.href = "../Auth/logintration.html";
      }, 2000);
    } else {
      const errorResult = await response.json();
      alertify.error(errorResult.error);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};
