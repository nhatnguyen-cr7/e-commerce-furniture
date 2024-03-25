const apiVerify = "https://e-commerce-json-dgbc.onrender.com/verify-otp";
const verifyUser = async () => {
  const otp = document.getElementById("otp").value;
  const email = document.getElementById("email").value;
  try {
    const response = await fetch(apiVerify, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp: parseInt(otp),
      }),
    });

    if (response.status != 401) {
      // window.location.href = "../Auth/logintration.html";
      Toastify({
        text: "You have successfully created your account!",
        backgroundColor: "rgb(32, 172, 90)",
      }).showToast();
      setTimeout(() => {
        window.location.href = "../Auth/logintration.html";
      }, 1000);
    } else {
      alert("Xac thuc khong thanh cong!!!!!");
    }
  } catch (error) {
    console.error("Error verifying user:", error);
  }
};
