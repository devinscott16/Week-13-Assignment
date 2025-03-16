$(document).ready(function () {
  const API_URL = "http://localhost:3001/materials"; // JSON Server

  // Fetch materials from JSON Server
  function fetchMaterials(): void {
    $.get(
      API_URL,
      function (materials: { id: number; text: string; purchased: boolean }[]) {
        $("#materialList").empty();
        materials.forEach((material) => {
          let materialItem = `<li class="list-group-item d-flex justify-content-between align-items-center">
                          <span class="material-text ${
                            material.purchased ? "purchased" : ""
                          }">
                              ${material.text}
                          </span>
                          <div>
                              <button class="btn btn-sm btn-secondary editMaterial" data-id="${
                                material.id
                              }">
                                  Edit
                              </button>
                              <button class="btn btn-sm btn-success toggleMaterial" data-id="${
                                material.id
                              }">
                                  ${material.purchased ? "Buy" : "Purchased"}
                              </button>
                              <button class="btn btn-sm btn-danger deleteMaterial" data-id="${
                                material.id
                              }">
                                  Delete
                              </button>
                          </div>
                      </li>`;
          $("#materialList").append(materialItem);
        });
      }
    ).fail((jqXHR, textStatus, errorThrown) => {
      console.error("Error fetching materials:", textStatus, errorThrown);
    });
  }

  // Add Material
  $("form").submit(function (event: JQuery.SubmitEvent) {
    event.preventDefault();
    let materialText: string = ($("#addMaterial").val() as string).trim();

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
  $("#materialList").on(
    "click",
    ".toggleMaterial",
    function (event: JQuery.ClickEvent) {
      let button = $(event.currentTarget);
      let materialId = button.data("id") as number;
      let textElement = button.closest("li").find(".material-text");
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
    }
  );

  // Delete Material
  $("#materialList").on(
    "click",
    ".deleteMaterial",
    function (event: JQuery.ClickEvent) {
      let button = $(event.currentTarget);
      let materialId = button.data("id") as number;

      $.ajax({
        url: `${API_URL}/${materialId}`,
        method: "DELETE",
        success: function () {
          fetchMaterials(); // Refresh list
        },
      });
    }
  );

  // Edit Material
  $("#materialList").on(
    "click",
    ".editMaterial",
    function (event: JQuery.ClickEvent) {
      let button = $(event.currentTarget);
      let materialId = button.data("id") as number;
      let materialTextElement = button.closest("li").find(".material-text");
      let currentText = materialTextElement.text().trim();

      // Prompt the user for new text
      const newText = prompt("Edit the material:", currentText);

      if (newText && newText.trim() !== "" && newText !== currentText) {
        // Send the update to the server
        $.ajax({
          url: `${API_URL}/${materialId}`,
          method: "PATCH",
          contentType: "application/json",
          data: JSON.stringify({ text: newText.trim() }),
          success: function () {
            fetchMaterials(); // Refresh list
          },
          error: function (xhr, status, error) {
            console.error("Failed to update material:", error);
          },
        });
      }
    }
  );

  // Fetch materials on page load
  fetchMaterials();
});
