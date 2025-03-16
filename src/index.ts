$(document).ready(function () {
  const API_URL = "http://localhost:3001/materials"; // Your JSON Server endpoint

  // Fetch materials from JSON Server
  function fetchMaterials() {
    $.get(API_URL, function (materials) {
      $("#materialList").empty();
      materials.forEach((material) => {
        let materialItem = `<li class="list-group-item d-flex justify-content-between align-items-center">
                      <span class="material-text ${
                        material.purchased ? "purchased" : ""
                      }">${material.text}</span>
                      <div>
                          <button class="btn btn-sm btn-secondary editMaterial" data-id="${
                            material.id
                          }">Edit</button>
                          <button class="btn btn-sm btn-success toggleMaterial" data-id="${
                            material.id
                          }">
                              ${material.purchased ? "Buy" : "Purchased"}
                          </button>
                          <button class="btn btn-sm btn-danger deleteMaterial" data-id="${
                            material.id
                          }">Delete</button>
                      </div>
                  </li>`;
        $("#materialList").append(materialItem);
      });
    });
  }

  // Add Material
  $("form").submit(function (event) {
    event.preventDefault();
    let materialText = $("#addMaterial").val().trim();

    if (materialText !== "") {
      $.ajax({
        url: API_URL,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ text: materialText, purchased: false }),
        success: function () {
          $("#addMaterial").val(""); // Clear input field
          fetchMaterials(); // Refresh the list
        },
        error: function (xhr, status, error) {
          console.error("Failed to add material:", error);
        },
      });
    } else {
      alert("Please enter a material.");
    }
  });

  // Toggle Purchased Status
  $("#materialList").on("click", ".toggleMaterial", function () {
    let materialId = $(this).data("id");
    let textElement = $(this).closest("li").find(".material-text");
    let isPurchased = textElement.hasClass("purchased");

    $.ajax({
      url: `${API_URL}/${materialId}`,
      method: "PATCH",
      contentType: "application/json",
      data: JSON.stringify({ purchased: !isPurchased }),
      success: function () {
        fetchMaterials(); // Refresh list
      },
    });
  });

  // Delete Material
  $("#materialList").on("click", ".deleteMaterial", function () {
    let materialId = $(this).data("id");

    $.ajax({
      url: `${API_URL}/${materialId}`,
      method: "DELETE",
      success: function () {
        fetchMaterials(); // Refresh list
      },
    });
  });

  // Fetch materials on page load
  fetchMaterials();
});
