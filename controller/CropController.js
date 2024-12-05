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
$('#cropForm').on('submit', function (e) {
    e.preventDefault(); // Prevent form from submitting the traditional way

    const cropData = new FormData();
    cropData.append("cropCode", $('#cropCode').val());
    cropData.append("cropCommonName", $('#cropCommonName').val());
    cropData.append("cropScientificName", $('#cropScientificName').val());
    cropData.append("cropCategory", $('#cropCategory').val());
    cropData.append("cropSeason", $('#cropSeason').val());
    cropData.append("fieldCode", $('#cropFieldCode').val());
    cropData.append("cropImage", $('#cropImage01')[0].files[0]);

    console.log([...cropData.entries()]); // Debugging: Log all form data

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
        { field: formData.get("cropImage"), message: "Crop Image is required" },
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
