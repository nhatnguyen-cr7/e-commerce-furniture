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
// ---------------------------------------- GET LIST PRODUCT ---------------------------- //
// Lấy dữ liệu sản phẩm từ API
if (authToken != undefined || authToken != null) {
  function fetchProducts() {
    fetch(`https://e-commerce-json-dgbc.onrender.com/admin/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Xử lý dữ liệu sản phẩm nhận được từ API
        let listProducts = ""; // Tạo chuỗi HTML để chứa nội dung sản phẩm
        data.forEach((product, index) => {
          listProducts += `<tr>
          <td scope="row" class="text-center table-data justify-content-center" style="vertical-align: middle;">${
            index + 1
          }</td>
          <td data-product-avatar class="table-img">
            <img class="product-image" style="vertical-align: middle;" src="${
              product.list_image[0]
            }" />
          </td>
          <td class="text-center text-truncate table-data-description" style="vertical-align: middle;">${
            product.name
          }</td>
          <td class="text-center text-truncate table-data-description" style="vertical-align: middle;">${
            product.title
          }</td>
          <td class="text-center text-truncate table-data-description" style="vertical-align: middle;">${
            product.price
          }</td>
          <td class="text-center text-truncate" style="vertical-align: middle;">
            <div class="icon-action">
            <button class="view-icon" onclick="viewProductHandler('${
              product.id
            }')">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </button>
            <button class="edit-icon" onclick="editProductHandler('${
              product.id
            }')">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="delete-icon" onclick="openDeletePopup('${
              product.id
            }')">
              <i class="fa-regular fa-trash-can"></i>
            </button>
            </div>
          </td>
        </tr>`;
        });

        // Cập nhật nội dung danh sách sản phẩm trong bảng HTML
        document.getElementById("productManagement").innerHTML = listProducts;
      });
  }

  // Gọi hàm lấy dữ liệu sản phẩm khi khởi động trang
  fetchProducts();

  // Get list category
  let getListCategory = fetch(
    `https://e-commerce-json-dgbc.onrender.com/admin/categories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    }
  );
  getListCategory
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      let categories = "";
      res.forEach((item) => {
        categories += `<option value="${item.id}">${item.name}</option>`;
      });
      document.getElementById("categoryId").innerHTML = categories;
      document.getElementById("editProductCategory").innerHTML = categories;
    });

  // ------------------------------------ CREATE ------------------------- //
  async function addProduct() {
    // Get Add product button
    const addProductBtn = document.getElementById("addProductBtn");
    const addProductBtnText = document.getElementById("addProductBtnText");

    // Disable the button and show the loading spinner
    addProductBtn.disabled = true;
    addProductBtnText.innerText = "Loading...";
    addProductBtn.querySelector(".spinner-border").classList.remove("d-none");

    // Get data from form input
    const addProductForm = document.getElementById("addProductForm");
    const formData = new FormData(addProductForm);

    // Check if any field is empty
    let isFormValid = true;
    let imageCount = 0;

    formData.forEach((value, key) => {
      if (String(value).trim() === "" || value === NaN) {
        isFormValid = false;
      }

      // Check if the field is an image input
      if (key === "list_image") {
        // Assuming value is a File object or an array of File objects
        if (Array.isArray(value)) {
          imageCount += value.length;
        } else {
          imageCount += 1;
        }
      }
    });

    if (!isFormValid || imageCount < 2) {
      showFailToast("Please fill in all fields and upload at least 2 images");
      closeAddProduct();
      // Enable the button and hide the loading spinner
      addProductBtn.disabled = false;
      addProductBtnText.innerText = "Add Product";
      addProductBtn.querySelector(".spinner-border").classList.add("d-none");
      return;
    }

    try {
      const response = await fetch(
        "https://e-commerce-json-dgbc.onrender.com/admin/products",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + authToken,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const newProduct = await response.json();
        showSuccessToast("Product added successfully: " + newProduct.name);
      } else {
        showFailToast("Failed to add product, please check again!");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      showFailToast("Failed to add product, please check again!");
    } finally {
      // Enable the button and hide the loading spinner regardless of success or failure
      addProductBtn.disabled = false;
      addProductBtnText.innerText = "Add Product";
      addProductBtn.querySelector(".spinner-border").classList.add("d-none");
      document.getElementById("addProductForm").reset();
      fetchProducts();
      const productPopup = document.getElementById("product-popup");
      productPopup.style.display = "none";
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  }

  document.getElementById("addProductBtn").onclick = addProduct;
  function viewProductHandler(id) {
    openViewPopup(id);
  }
  function editProductHandler(id) {
    openEditPopup(id);
  }
  // ------------------------------------------------------------------------------------ //

  // document.addEventListener("DOMContentLoaded", function () {
  //   const showFormButton = document.getElementById("show-add-product-form");
  // const productPopup = document.getElementById("product-popup");
  // const closePopup = document.getElementById("close-popup");

  //   showFormButton.addEventListener("click", function () {
  //     // Show the popup
  //     productPopup.style.display = "block";
  //   });

  //   closePopup.addEventListener("click", function () {
  //     // Close the popup
  //     productPopup.style.display = "none";
  //   });
  // });

  const showFormButton = document.getElementById("show-add-product-form");
  const productPopup = document.getElementById("product-popup");
  showFormButton.addEventListener("click", function () {
    // Show the popup
    productPopup.style.display = "block";
  });
  const closePopup = document.getElementById("close-popup");
  closePopup.addEventListener("click", function () {
    // Close the popup
    productPopup.style.display = "none";
  });

  function showAddProduct() {
    const productPopup = document.getElementById("product-popup");
    productPopup.style.display = "block";
  }
  function closeAddProduct() {
    const productPopup = document.getElementById("product-popup");
    productPopup.style.display = "none";
  }

  // -------------------------------- VIEW ----------------------------------------------- //
  async function openViewPopup(id) {
    const editPopup = document.getElementById("view-popup");
    editPopup.style.display = "block";

    // Fetch data of product which is editting
    try {
      const response = await fetch(
        `https://e-commerce-json-dgbc.onrender.com/admin/products/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response data
      const productViewData = await response.json();
      let getProductCategoryName = fetch(
        `https://e-commerce-json-dgbc.onrender.com/admin/categories/${productViewData.categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
        }
      );
      getProductCategoryName
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          document.getElementById("viewProductCategory").innerHTML = res.name;
        });

      let productImages = "";
      productViewData.list_image.forEach((item) => {
        productImages += `<img src="${item}" class="show-edit-image" />`;
      });

      // Populate the input fields with the fetched data
      document.getElementById("viewProductName").innerHTML =
        productViewData.name;
      document.getElementById("viewProductTitle").innerHTML =
        productViewData.title;
      document.getElementById("viewProductDescription").innerHTML =
        productViewData.description;
      document.getElementById("viewProductPrice").innerHTML =
        productViewData.price;
      document.getElementById("listProductImages").innerHTML = productImages;
      const openEditPopupInView = document.getElementById("openEditViewPopup");
      openEditPopupInView.onclick = function () {
        openEditPopup(productViewData.id);
      };
    } catch (error) {
      console.error("Error fetching product data:", error.message);
    }
  }

  function closeViewPopup() {
    const viewPopup = document.getElementById("view-popup");
    viewPopup.style.display = "none";
  }

  // -------------------------- EDIT ------------------------------------------------------- //
  // <!-- Show edit popup action -->
  async function openEditPopup(id) {
    const editPopup = document.getElementById("edit-popup");
    editPopup.style.display = "block";

    // Fetch data of product which is editting
    try {
      const response = await fetch(
        `https://e-commerce-json-dgbc.onrender.com/admin/products/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response data
      const productData = await response.json();
      let images = "";
      productData.list_image.forEach((item) => {
        images += `<img src="${item}" class="show-edit-image" />`;
      });
      // Populate the input fields with the fetched data
      document.getElementById("editProductName").value = productData.name;
      document.getElementById("editProductCategory").value =
        productData.categoryId;
      document.getElementById("editTitle").value = productData.title;
      document.getElementById("editProductDescription").value =
        productData.description;
      document.getElementById("editProductPrice").value = productData.price;
      document.getElementById("listEditImage").innerHTML = images;
    } catch (error) {
      console.error("Error fetching product data:", error.message);
    }

    const editConfirm = document.getElementById("confirmEditProduct");
    editConfirm.onclick = function () {
      editProduct(id);
    };
  }

  function closeEditPopup() {
    const editPopup = document.getElementById("edit-popup");
    editPopup.style.display = "none";
  }

  // EDIT CONFIRM
  async function editProduct(id) {
    // Get Add product button
    const editProductBtn = document.getElementById("confirmEditProduct");
    const editProductBtnText = document.getElementById("editProductBtnText");

    // Disable the button and show the loading spinner
    editProductBtn.disabled = true;
    editProductBtnText.innerText = "Updating...";
    editProductBtn.querySelector(".spinner-border").classList.remove("d-none");

    // Get data from form input
    const productName = document.getElementById("editProductName").value;
    const productCategory = document.getElementById(
      "editProductCategory"
    ).value;
    const productTitle = document.getElementById("editTitle").value;
    const productDescription = document.getElementById(
      "editProductDescription"
    ).value;
    const productPrice = document.getElementById("editProductPrice").value;

    if (
      !productName.trim() ||
      !productCategory.trim() ||
      !productTitle.trim() ||
      !productDescription.trim() ||
      !productPrice.trim()
    ) {
      showFailToast("Please fill in all fields");
      closeEditPopup();
      closeViewPopup();
      // Enable the button and hide the loading spinner
      editProductBtn.disabled = false;
      editProductBtnText.innerText = "Update";
      editProductBtn.querySelector(".spinner-border").classList.add("d-none");
      return;
    }

    const imageUploadInput = document.getElementById("editImageUpload");
    const imageFiles = imageUploadInput.files;

    // Check if list_image is provided and has a length greater than 2
    if (imageFiles.length > 0 && imageFiles.length < 2) {
      showFailToast("Please provide at least 2 images");
      closeEditPopup();
      closeViewPopup();
      // Enable the button and hide the loading spinner
      editProductBtn.disabled = false;
      editProductBtnText.innerText = "Update";
      editProductBtn.querySelector(".spinner-border").classList.add("d-none");
      return;
    }

    const formDataProduct = new FormData();
    formDataProduct.append("name", productName);
    formDataProduct.append("title", productTitle);
    formDataProduct.append("description", productDescription);
    formDataProduct.append("categoryId", productCategory);
    formDataProduct.append("price", productPrice);

    // Append each image file to the FormData
    imageFiles.forEach((file) => {
      formDataProduct.append(`list_image`, file);
    });

    try {
      const response = await fetch(
        `https://e-commerce-json-dgbc.onrender.com/admin/products/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + authToken,
          },
          body: formDataProduct,
        }
      );

      if (response.ok) {
        setTimeout(() => {
          showSuccessToast("Product update successfully!");
        }, 1500);
      } else {
        showFailToast("Error update product. Please check again!");
      }
    } catch (error) {
      showFailToast("Error update product. Please check again!");
    } finally {
      setTimeout(() => {
        // Enable the button and hide the loading spinner regardless of success or failure
        editProductBtn.disabled = false;
        editProductBtnText.innerText = "Update";
        editProductBtn.querySelector(".spinner-border").classList.add("d-none");
        closeViewPopup();
        fetchProducts();
        const editProductPopup = document.getElementById("edit-popup");
        editProductPopup.style.display = "none";
      }, 1500);
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  }

  // ----------------------------------------- DELETE ------------------------------------------ //
  // <!-- Show delete popup action -->
  function openDeletePopup(id) {
    const deletePopup = document.getElementById("delete-popup");
    deletePopup.style.display = "block";

    const deleteConfirm = document.getElementById("confirmDeleteProduct");
    deleteConfirm.onclick = function () {
      deleteProduct(id);
    };
  }

  // DELETE CONFIRM
  function deleteProduct(id) {
    // Implement your code to save changes here
    fetch(`https://e-commerce-json-dgbc.onrender.com/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    })
      .then((res) => {
        if (!res.ok) {
          showFailToast("Fail to delete the product!");
        } else {
          showSuccessToast("Successfully delete product!");
        }
        return res.json();
      })
      .then((data) => {
        closeDeletePopup(); // Close the popup after saving changes
        fetchProducts();
        setTimeout(() => {
          location.reload();
        }, 1500);
      });
  }

  function closeDeletePopup() {
    const deletePopup = document.getElementById("delete-popup");
    deletePopup.style.display = "none";
  }

  // -------------------------------- SHOW MESSAGE -----------------------------------------
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
  window.location.href = "/pages/Auth/logintration.html";
}
