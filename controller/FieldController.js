
// -----------------------------------save Field-------------------------

$('#btnFieldSave').on('click', () => {
    const formData = new FormData();
    formData.append("fieldCode", $('#fieldCode').val());
    formData.append("fieldName", $('#fieldName').val());
    formData.append("fieldLocation", $('#fieldLocation').val());
    formData.append("fieldSize", $('#fieldSize').val());
    formData.append("fieldImage01", $('#fieldImage01')[0].files[0]);
    formData.append("fieldImage02", $('#fieldImage02')[0].files[0]);

    console.log([...formData.entries()]); // For debugging purposes

    if (!validateField(formData)) {
        return;
    }
    console.log(token)

    $.ajax({
        method: "POST",
        url: `http://localhost:8080/CropMonitorSystem/api/v1/fields`,
        data: formData,
        contentType: false, // Required for FormData
        processData: false, // Prevent jQuery from serializing FormData
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            loadFieldTable();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Save Field successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.log(result);
        }
    });
});

// -----------------------------------Get All Field-------------------------

function loadFieldTable(){
    $('#fieldTable tbody').empty();

    $.ajax({
        method:"GET",
        url:baseUrl+`fields`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },success:function(result){

            result.forEach(field => {

                $('#fieldTable tbody').append(`<tr>
                                        
                                        <td>${field.fieldCode}</td>
                                        <td>${field.fieldName}</td>
                                        <td>${field.fieldLocation}</td>
                                        <td>${field.fieldSize}</td>
                                        <td>
                                            <button class="btn btn-danger btn-sm" title="Delete" id="field_delete">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>`)
            });
        },
        error:function(result){
            console.log(result);
        }
    })

}

// -----------------------------------Validate From Data-------------------------

function validateField(formData) {
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
        { field: formData.get("fieldImage01"), message: "Field Image 1 is required" },
        { field: formData.get("fieldImage02"), message: "Field Image 2 is required" },
        { field: formData.get("fieldCode"), message: "Field Code is required" },
        { field: formData.get("fieldName"), message: "Field Name is required" },
        { field: formData.get("fieldLocation"), message: "Field Location is required" },
        { field: formData.get("fieldSize"), message: "Field Size is required" },
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

// -----------------------------------update Field-------------------------


$("#fieldTableBody").on('click', 'tr', function () {
    var fieldId = $(this).closest('tr').find('td').first().text();
    console.log("Selected Field ID:", fieldId);

    $.ajax({
        method: "GET",
        url: baseUrl + `fields/${fieldId}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (field) {
            console.log("Field Data:", field);

            // Populate text fields
            $('#fieldCode').val(field.fieldCode);
            $('#fieldName').val(field.fieldName);
            $('#fieldLocation').val(field.fieldLocation);
            $('#fieldSize').val(field.fieldSize);

            // Handle images
            if (field.fieldImage01) {
                $("#previewFieldImage01").attr("src", "data:image/png;base64," + field.fieldImage01);
            } else {
                $("#previewFieldImage01").attr("src", "https://via.placeholder.com/200x200?text=Click+to+upload+Image+1");
            }

            if (field.fieldImage02) {
                $("#previewFieldImage02").attr("src", "data:image/png;base64," + field.fieldImage02);
            } else {
                $("#previewFieldImage02").attr("src", "https://via.placeholder.com/200x200?text=Click+to+upload+Image+2");
            }
        },
        error: function (error) {
            console.error("Error fetching field data:", error);
        }
    });
});


