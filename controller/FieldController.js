
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
            clearFieldFields()
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

function loadFieldTable() {
    $('#fieldTable tbody').empty();
    $.ajax({
        method:"GET",
        url:baseUrl+`fields`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success:function(result){
            result.forEach(field => {
                $('#fieldTableBody').append(`
                    <tr data-field-id="${field.fieldCode}">                                 
                        <td>${field.fieldCode}</td>
                        <td>${field.fieldName}</td>
                        <td>${field.fieldLocation}</td>
                        <td>${field.fieldSize}</td>
                        <td>
                            <button class="btn btn-danger btn-sm field-delete-btn" title="Delete">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
            var fieldCount = $('#fieldTableBody tr').length;
            $('#fieldCount').text(`${fieldCount}`);
        },
        error:function(result){
            console.log(result);
        }
    });
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

// -----------------------------------get Field by table action-------------------------


$("#fieldTableBody").on('click', 'tr', function () {
    var fieldId = $(this).closest('tr').find('td').first().text();
    console.log("Selected Field ID:", fieldId);
    $.ajax({
        method: "GET",
        url: baseUrl + `fields/${fieldId}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        success: function (field) {
            // Set text fields
            $('#fieldCode').val(field.fieldCode);
            $('#fieldName').val(field.fieldName);
            $('#fieldLocation').val(field.fieldLocation);
            $('#fieldSize').val(field.fieldSize);
            // Handle Image 01
            if (field.fieldImage01) {
                // Convert Base64 to File object
                const file1 = base64ToFile(`data:image/png;base64,${field.fieldImage01}`, "image01.png");
                // Use DataTransfer to simulate file input
                const dataTransfer1 = new DataTransfer();
                dataTransfer1.items.add(file1);
                // Assign to input field
                document.querySelector("#fieldImage01").files = dataTransfer1.files;
                // Set preview
                $("#previewFieldImage01").attr("src", `data:image/png;base64,${field.fieldImage01}`);
            }
            // Handle Image 02
            if (field.fieldImage02) {
                // Convert Base64 to File object
                const file2 = base64ToFile(`data:image/png;base64,${field.fieldImage02}`, "image02.png");
                // Use DataTransfer to simulate file input
                const dataTransfer2 = new DataTransfer();
                dataTransfer2.items.add(file2);
                // Assign to input field
                document.querySelector("#fieldImage02").files = dataTransfer2.files;
                // Set preview
                $("#previewFieldImage02").attr("src", `data:image/png;base64,${field.fieldImage02}`);
            }
        },
        error: function (error) {
            console.error("Error fetching field data:", error);
        }
    });
});

//-------------update Field-----------------

$('#btnFieldUpdate').on('click' ,()=>{
    console.log("click update button")
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
    var fieldId = $('#fieldCode').val();
    $.ajax({
        method: "PUT",
        url: baseUrl + `fields/${fieldId}`,
        data: formData,
        contentType: false, // Required for FormData
        processData: false, // Prevent jQuery from serializing FormData
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            loadFieldTable();
            clearFieldFields()
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
})

// -----------------------------------get Field by SearchBar-------------------------

function searchFields() {
    // Get the search query
    var searchQuery = $('#searchField').val().toLowerCase();
    // Get all the rows from the table that you want to search
    $('#fieldTable tbody tr').each(function() {
        var row = $(this);
        // Get the text content from the table cells
        var fieldCode = row.find('td').eq(0).text().toLowerCase();
        var fieldName = row.find('td').eq(1).text().toLowerCase();
        var fieldLocation = row.find('td').eq(2).text().toLowerCase();
        var fieldSize = row.find('td').eq(3).text().toLowerCase();
        // Check if the search query matches any cell content (Field Code, Field Name, Field Location, or Field Size)
        if (fieldCode.includes(searchQuery) || fieldName.includes(searchQuery) || fieldLocation.includes(searchQuery)
            || fieldSize.includes(searchQuery)) {
            row.show();  // Show the row if it matches the query
        } else {
            row.hide();  // Hide the row if it doesn't match the query
        }
    });
}

// -----------------------------------clear field method-------------------------

function clearFieldFields(){
    $('#fieldCode').val('');
    $('#fieldName').val('');
    $('#fieldLocation').val('');
    $('#fieldSize').val('');
    $('#fieldImage01').val('');
    $('#fieldImage02').val('');
    $('#previewFieldImage01').attr('src', 'https://via.placeholder.com/200x200?text=Click+to+upload+Image+1');
    $('#previewFieldImage02').attr('src', 'https://via.placeholder.com/200x200?text=Click+to+upload+Image+2');
}

// -----------------------------------delete Field-------------------------
$("#fieldTableBody").on('click', '.field-delete-btn', function () {
    var fieldId = $(this).closest('tr').data('field-id');
    console.log("Attempting to delete Field with ID:", fieldId);
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
                url: baseUrl + `fields/${fieldId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                success: function(response) {
                    console.log("Field deleted successfully:", response);
                    $(`tr[data-field-id='${fieldId}']`).remove();
                    clearFieldFields();
                    loadFieldTable();
                    Swal.fire(
                        'Deleted!',
                        'The field has been deleted.',
                        'success'
                    );
                },
                error: function(error) {
                    console.error("Error deleting field:", error);
                    Swal.fire(
                        'Error!',
                        'There was an issue deleting the field.',
                        'error'
                    );
                }
            });
        } else {
            console.log("Deletion cancelled by user.");
        }
    });
});
