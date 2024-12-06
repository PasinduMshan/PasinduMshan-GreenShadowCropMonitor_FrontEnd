// -------------------------load all Field Id--------------------

function loadAllFieldCodesInCrop() {
    $('#cropFieldCode').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `fields`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(result) {
            result.forEach(field => {
                $('#cropFieldCode').append(
                    `<option value="${field.fieldCode}">${field.fieldCode}</option>`
                );
            });
        },
        error: function(error) {
            console.error("Error fetching field data:", error);
        }
    });
}

// -----------------------------------save Crop-------------------------

$('#btnSaveCrop').on('click', () => {
    const cropData = new FormData();
    cropData.append("cropCode", $('#cropCode').val());
    cropData.append("cropCommonName", $('#cropCommonName').val());
    cropData.append("cropScientificName", $('#cropScientificName').val());
    cropData.append("cropCategory", $('#cropCategory').val());
    cropData.append("cropSeason", $('#cropSeason').val());
    cropData.append("fieldCode", $('#cropFieldCode').val());
    cropData.append("cropImage01", $('#cropImage01')[0].files[0]);
    console.log([...cropData.entries()]);
    if (!validateCrop(cropData)) {
        return;
    }
    $.ajax({
        method: "POST",
        url: baseUrl + `crop`,
        data: cropData,
        contentType: false,
        processData: false,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            loadCropTable();
            clearCropFields()
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Crop saved successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (error) {
            console.error("Error saving crop:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to save crop",
                text: error.responseJSON?.message || "An error occurred while saving the crop.",
                showConfirmButton: true
            });
        }
    });
});

// -------------------------Validate Crop data--------------------

function validateCrop(formData) {
    const showError = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500,
        });
        console.log(message);
    };
    const requiredFields = [
        { field: formData.get("cropCode"), message: "Crop Code is required" },
        { field: formData.get("cropCommonName"), message: "Common Name is required" },
        { field: formData.get("cropScientificName"), message: "Scientific Name is required" },
        { field: formData.get("cropCategory"), message: "Category is required" },
        { field: formData.get("cropSeason"), message: "Season is required" },
        { field: formData.get("fieldCode"), message: "Field Code is required" },
        { field: formData.get("cropImage01"), message: "Crop Image is required" },
    ];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i].field;
        if (!field || (typeof field === "string" && field.trim() === "")) {
            showError(requiredFields[i].message);
            return false;
        }
    }
    return true;
}

// -------------------------load all Crop--------------------

function loadCropTable() {
    $('#CropTableBody').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `crop`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(crop => {
                $('#CropTableBody').append(`
                    <tr data-crop-code="${crop.cropCode}">
                        <td>${crop.cropCode}</td>
                        <td>${crop.cropCommonName}</td>
                        <td>${crop.cropScientificName}</td>
                        <td>${crop.cropCategory}</td>
                        <td>
                            <button class="btn btn-danger btn-sm crop-delete-btn" title="Delete">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function (result) {
            console.log(result);
        }
    });
}

// -----------------------------------clear Crop Fields-------------------------
function clearCropFields() {
    $('#cropCode').val("");
    $('#cropCommonName').val("");
    $('#cropScientificName').val("");
    $('#cropCategory').val("");
    $('#cropSeason').val("");
    $('#cropFieldCode').val("");
    $('#cropImage01').val("");
    $('#previewCropImage01').attr("src", "https://via.placeholder.com/200x200?text=Click+to+upload+Image+1");
}

// -----------------------------------get Crop by table action-------------------------

$("#CropTableBody").on('click', 'tr', function () {
    console.log("clicked")
    var cropCode = $(this).closest('tr').find('td').first().text();
    console.log("Selected Crop Code:", cropCode);
    $.ajax({
        method: "GET",
        url: baseUrl + `crop/${cropCode}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        success: function (crop) {
            $('#cropCode').val(crop.cropCode);
            $('#cropCommonName').val(crop.cropCommonName);
            $('#cropScientificName').val(crop.cropScientificName);
            $('#cropCategory').val(crop.cropCategory);
            $('#cropSeason').val(crop.cropSeason);
            $('#cropFieldCode').val(crop.fieldCode);
            if (crop.cropImage01) {
                // Convert Base64 to File object
                const file1 = base64ToFile(`data:image/png;base64,${crop.cropImage01}`, "image01.png");
                // Use DataTransfer to simulate file input
                const dataTransfer1 = new DataTransfer();
                dataTransfer1.items.add(file1);
                // Assign to input field
                document.querySelector("#cropImage01").files = dataTransfer1.files;
                // Set preview
                $("#previewCropImage01").attr("src", `data:image/png;base64,${crop.cropImage01}`);
            }
        },
        error: function (error) {
            console.error("Error fetching crop data:", error);
        }
    });
});

// -------------Update Crop-----------------

$('#btnUpdateCrop').on('click', () => {
    console.log("Click update button");
    const formData = new FormData();
    formData.append("cropCode", $('#cropCode').val());
    formData.append("cropCommonName", $('#cropCommonName').val());
    formData.append("cropScientificName", $('#cropScientificName').val());
    formData.append("cropCategory", $('#cropCategory').val());
    formData.append("cropSeason", $('#cropSeason').val());
    formData.append("fieldCode", $('#cropFieldCode').val());
    formData.append("cropImage01", $('#cropImage01')[0].files[0]);
    console.log([...formData.entries()]);
    if (!validateCrop(formData)) {
        return;
    }
    var cropCode = $('#cropCode').val();
    $.ajax({
        method: "PUT",
        url: baseUrl + `crop/${cropCode}`,
        data: formData,
        contentType: false,
        processData: false,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            loadCropTable();
            clearCropFields();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Crop updated successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.log(result);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to update crop",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
});

// -------------Search Crop-----------------

function searchCrops() {
    // Get the search query
    var searchQuery = $('#searchCrop').val().toLowerCase();
    // Iterate through each row in the crop table body
    $('#cropTable tbody tr').each(function() {
        var row = $(this);
        // Get the text content of each cell in the row
        var cropCode = row.find('td').eq(0).text().toLowerCase();
        var commonName = row.find('td').eq(1).text().toLowerCase();
        var scientificName = row.find('td').eq(2).text().toLowerCase();
        var category = row.find('td').eq(3).text().toLowerCase();
        // Check if the search query matches any cell content
        if (cropCode.includes(searchQuery) || commonName.includes(searchQuery) || scientificName.includes(searchQuery)
            || category.includes(searchQuery)) {
            row.show(); // Show the row if it matches
        } else {
            row.hide(); // Hide the row if it doesn't match
        }
    });
}

// -----------------------------------delete Crop-------------------------

$("#CropTableBody").on('click', '.crop-delete-btn', function () {
    var cropCode = $(this).closest('tr').data('crop-code'); // Consistent attribute
    console.log("Attempting to delete Crop with Code:", cropCode);
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "DELETE",
                url: baseUrl + `crop/${cropCode}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                success: function(response) {
                    console.log("Crop deleted successfully:", response);
                    $(`tr[data-crop-code='${cropCode}']`).remove();
                    clearCropFields();
                    Swal.fire(
                        'Deleted!',
                        'The crop has been deleted.',
                        'success'
                    );
                },
                error: function(error) {
                    console.error("Error deleting crop:", error);
                    Swal.fire(
                        'Error!',
                        'There was an issue deleting the crop.',
                        'error'
                    );
                }
            });
        } else {
            console.log("Deletion cancelled by user.");
        }
    });
});