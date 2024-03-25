// Start render category infomation to screen

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
  let response = fetch(
    "https://e-commerce-json-dgbc.onrender.com/admin/categories",
    {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    }
  );
  response
    .then((res) => res.json())
    .then((data) => {
      let html2 = "";
      let count = 1;
      data.forEach((item) => {
        html2 += ` <tr>
                  <td>${count}</td>
                  <td class="name-category">${item.name}</td>
                  <td class="category-desc">${item.description}</td>
                  <td class="icon-action">
                    <button class="edit-icon" onclick="openEditPopup('${item.id}', '${item.name}', '${item.description}')">
                      <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="delete-icon" onclick="openDeletePopup('${item.id}')">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                    
                  </td>
                </tr>`;
        count++;
      });
      document.getElementById("category").innerHTML = html2;
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
      // Handle error
    });
  // End render category infomation to screen

  // <!-- Show add category popup action -->
  document.addEventListener("DOMContentLoaded", function () {
    const showFormButton = document.getElementById("show-form-button");
    const categoryPopup = document.getElementById("category-popup");
    const closePopup = document.getElementById("close-popup");

    showFormButton.addEventListener("click", function () {
      // Show the popup
      categoryPopup.style.display = "block";
    });

    closePopup.addEventListener("click", function () {
      // Close the popup
      categoryPopup.style.display = "none";
    });
  });

  let categoryNameInput = document.getElementById("category-name");
  let categoryDescInput = document.getElementById("category-desc");

  function addNewCategoryHandler(category) {
    addNewCategory();
  }
  function saveCategoryChangesHandle(category) {
    saveCategoryChanges();
  }

  // Add new category start here
  async function addNewCategory() {
    const categoryName = categoryNameInput.value;

    // Check if the category name is empty after trimming or contains spaces
    if (!categoryName || /^\s*$/.test(categoryName)) {
      showFailToast(
        "Category name cannot be empty or contain only spaces. Please enter a valid category name."
      );
      return;
    }
    // Check if the category already exists
    const existingCategories = await fetch(
      "https://e-commerce-json-dgbc.onrender.com/admin/categories",
      {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      }
    )
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    if (
      existingCategories &&
      existingCategories.some((category) => category.name === categoryName)
    ) {
      // Category already exists, show an error message or handle accordingly
      showFailToast(
        "Category already exists. Please choose a different category name."
      );
      return;
    }
    // Call api to add new category
    const apiUrl = "https://e-commerce-json-dgbc.onrender.com/admin/categories";

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({
        name: categoryNameInput.value,
        description: categoryDescInput.value,
      }),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setTimeout(() => {
            showFailToast(
              "Error while adding a new category. Please check again!"
            );
          }, 100);
        } else {
          setTimeout(() => {
            showSuccessToast("Added a new category successfully!");
          }, 100);
          closePopup();
        }
        return response.json();
      })
      .then(() => {
        fetchAndRenderCategories();
      })
      .catch((error) => {
        console.error("Error adding new category:", error);
      });
    // Function to close the popup
    function closePopup() {
      // Reset the input fields after successfully adding a new category
      categoryNameInput.value = "";
      categoryDescInput.value = "";
      const categoryPopup = document.getElementById("category-popup");
      categoryPopup.style.display = "none";
    }
  }

  // Update category function
  function openEditPopup(categoryId, categoryName, categoryDesc) {
    const editPopup = document.getElementById("edit-popup");
    const editCategoryNameInput = document.getElementById("edit-category-name");
    const editCategoryDescInput = document.getElementById("edit-category-desc");

    // Set the current category details in the edit popup
    editCategoryNameInput.value = categoryName;
    editCategoryDescInput.value = categoryDesc;
    // Show the edit popup
    editPopup.style.display = "block";
    editPopup.setAttribute("data-category-id", categoryId);
  }

  function closeEditPopup() {
    // Reset the input fields after successfully update category
    categoryNameInput.value = "";
    categoryDescInput.value = "";
    const editPopup = document.getElementById("edit-popup");
    editPopup.style.display = "none";
  }

  async function saveCategoryChanges() {
    const editPopup = document.getElementById("edit-popup");
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmYmIxMTAyLTI1M2ItNDNiMC0xMjEzMWN4engxMjQxNTY0Nzg5YyIsImlhdCI6MTY5OTYwNDgyN30.yJTZUReYAIYG9gJtPUH9x0QKincZIz-iUJL1nAQ_okg";

    const categoryId = editPopup.getAttribute("data-category-id");
    const editCategoryNameInput =
      document.getElementById("edit-category-name").value;
    const editCategoryDescInput =
      document.getElementById("edit-category-desc").value;

    // Validate inputs
    if (!editCategoryNameInput.trim()) {
      showFailToast("Please enter a category name.");
      return;
    }

    // Check if the category already exists
    const existingCategories = await fetch(
      "https://e-commerce-json-dgbc.onrender.com/admin/categories",
      {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      }
    )
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    if (
      existingCategories &&
      existingCategories.some(
        (category) => category.name === editCategoryNameInput
      )
    ) {
      // Category already exists, show an error message or handle accordingly
      showFailToast(
        "Category already exists. Please choose a different category name."
      );
      return;
    }

    // Create an object with the updated category information
    const updatedCategory = {
      id: categoryId,
      name: editCategoryNameInput,
      description: editCategoryDescInput,
    };

    // Send a PUT request to the server API to update the category
    fetch(
      `https://e-commerce-json-dgbc.onrender.com/admin/categories/${categoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
        body: JSON.stringify(updatedCategory),
      }
    )
      .then((response) => {
        if (response.ok) {
          setTimeout(() => {
            showFailToast("Error while update category. Please check again!");
          }, 100);
        } else {
          setTimeout(() => {
            showSuccessToast("Update cateogry successfully!");
          }, 100);
          fetchAndRenderCategories();
        }
        return response.json();
      })
      .then(() => {})
      .catch((error) => {
        console.error("Error updating category:", error.message);
      });
    closeEditPopup();
  }

  // <!-- Show delete category popup to detete category -->
  function openDeletePopup(categoryId) {
    const deletePopup = document.getElementById("delete-popup");
    deletePopup.style.display = "block";

    // Set the category ID in the delete popup (for retrieval when confirming deletion)
    const confirmDeleteButton = document.querySelector(
      ".confirm-delete-button"
    );
    confirmDeleteButton.setAttribute("data-category-id", categoryId);
  }

  function closeDeletePopup() {
    const deletePopup = document.getElementById("delete-popup");
    deletePopup.style.display = "none";
  }

  function deleteCategory() {
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmYmIxMTAyLTI1M2ItNDNiMC0xMjEzMWN4engxMjQxNTY0Nzg5YyIsImlhdCI6MTY5OTYwNDgyN30.yJTZUReYAIYG9gJtPUH9x0QKincZIz-iUJL1nAQ_okg";

    // Get the category ID to delete from the data attribute
    const categoryIdToDelete = document
      .querySelector(".confirm-delete-button")
      .getAttribute("data-category-id");

    if (!categoryIdToDelete) {
      alert("Category ID is missing.");
      closeDeletePopup();
      return;
    }
    // Send a DELETE request to the server API
    fetch(
      `https://e-commerce-json-dgbc.onrender.com/admin/categories/${categoryIdToDelete}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          setTimeout(() => {
            showFailToast("Error while delete category. Please check again!");
          }, 100);
        } else {
          setTimeout(() => {
            showSuccessToast("Delete cateogry successfully!");
          }, 100);
        }

        return response.json();
      })
      .then(() => {
        closeDeletePopup();
        fetchAndRenderCategories();
      })
      .catch((error) => {
        console.error("Error deleting category:", error.message);
      });
  }

  function renderCategories(categories) {
    let html2 = "";
    let count = 1;
    categories.forEach((item) => {
      html2 += `<tr>
                <td>${count}</td>
                <td class="name-category">${item.name}</td>
                <td class="category-desc">${item.description}</td>
                <td class="icon-action">
                  <button class="edit-icon" onclick="openEditPopup('${item.id}', '${item.name}', '${item.description}')">
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button class="delete-icon" onclick="openDeletePopup('${item.id}')">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>`;
      count++;
    });
    document.getElementById("category").innerHTML = html2;
  }

  // Fetch categories and render on page load
  function fetchAndRenderCategories() {
    fetch("https://e-commerce-json-dgbc.onrender.com/admin/categories", {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        renderCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        // Handle error
      });
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
