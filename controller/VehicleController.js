// -------------------------load all staff Id--------------------

function loadAllStaffID() {
    $('#vehicleStaffId').empty();
    $.ajax({
        method: "GET",
        url: baseUrl +`staff`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(staff => {
                $('#vehicleStaffId').append(
                    `<option value="${staff.staffId}">${staff.staffId}</option>`
                );
            });
        },
        error: function (result) {
            console.log(result);
        }
    });
}

// -------------------------save Vehicle--------------------

$('#btnSaveVehicle').on('click', () => {
    const vehicleData = {
        vehicleCode: $('#vehicleCode').val(),
        licensePlateNumber: $('#licensePlateNumber').val(),
        vehicleCategory: $('#vehicleCategory').val(),
        fuelType: $('#fuelType').val(),
        status: $('#vehicleStatus').val(),
        remarks: $('#remarks').val(),
        staffId: $('#vehicleStaffId').val()
    };
    console.log(vehicleData);
    if (!validateVehicle(vehicleData)) {
        return;
    }
    $.ajax({
        method: "POST",
        url: baseUrl +`vehicle`,
        data: JSON.stringify(vehicleData),
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            clearVehicleFields();

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Vehicle saved successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.error("Error saving vehicle:", result);
        }
    });
});

// -------------------------Validate Vehicle data--------------------

function validateVehicle(vehicleData) {
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
        { field: vehicleData.vehicleCode, message: "Vehicle Code is required" },
        { field: vehicleData.licensePlateNumber, message: "License Plate Number is required" },
        { field: vehicleData.vehicleCategory, message: "Vehicle Category is required" },
        { field: vehicleData.fuelType, message: "Fuel Type is required" },
        { field: vehicleData.status, message: "Vehicle Status is required" },
        { field: vehicleData.staffId, message: "Staff ID is required" },
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


// -------------------------Clear Vehicle Input--------------------

function clearVehicleFields() {
    $('#vehicleCode').val('');
    $('#licensePlateNumber').val('');
    $('#vehicleCategory').val('');
    $('#fuelType').val('');
    $('#vehicleStatus').val('AVAILABLE'); // Default selection
    $('#remarks').val('');
    $('#vehicleStaffId').val('');
    loadAllStaffID();
}

// -------------------------get all vehicle--------------------

function loadVehicleTable() {
    $('#vehicleTableBody').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `vehicle`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(vehicle => {
                $('#vehicleTableBody').append(`
                    <tr data-vehicle-code="${vehicle.vehicleCode}">
                        <td>${vehicle.vehicleCode}</td>
                        <td>${vehicle.licensePlateNumber}</td>
                        <td>${vehicle.fuelType}</td>
                        <td>${vehicle.staffId}</td>
                        <td>
                            <button class="btn btn-danger btn-sm vehicle-delete-btn" title="Delete">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
            var vehicleCount = $('#vehicleTableBody tr').length;
            $('#vehicleCount').text(`${vehicleCount}`);
        },
        error: function (result) {
            console.error("Error loading vehicle data:", result);
        }
    });
}

// -------------------------vehicle table row action--------------------

$("#vehicleTableBody").on('click', 'tr', function () {
    var vehicleCode = $(this).closest('tr').find('td').first().text();
    console.log("Selected Vehicle Code:", vehicleCode);
    $.ajax({
        method: "GET",
        url: baseUrl + `vehicle/${vehicleCode}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        success: function (vehicle) {
            console.log(vehicle)
            $('#vehicleCode').val(vehicle.vehicleCode);
            $('#licensePlateNumber').val(vehicle.licensePlateNumber);
            $('#vehicleCategory').val(vehicle.vehicleCategory);
            $('#fuelType').val(vehicle.fuelType);
            $('#vehicleStatus').val(vehicle.status);
            $('#remarks').val(vehicle.remarks);
            $('#vehicleStaffId').val(vehicle.staffId);
        },
        error: function (error) {
            console.error("Error fetching Vehicle data:", error);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `Error fetching Vehicle data: ${error}`,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});

// -------------------------update vehicle--------------------

$('#btnUpdateVehicle').on('click' ,()=>{
    console.log("click update button")
    const vehicleData = {
        vehicleCode: $('#vehicleCode').val(),
        licensePlateNumber: $('#licensePlateNumber').val(),
        vehicleCategory: $('#vehicleCategory').val(),
        fuelType: $('#fuelType').val(),
        status: $('#vehicleStatus').val(),
        remarks: $('#remarks').val(),
        staffId: $('#vehicleStaffId').val()
    };
    console.log(vehicleData);
    if (!validateVehicle(vehicleData)) {
        return;
    }
    var vehicleCode = $('#vehicleCode').val();
    $.ajax({
        method: "PUT",
        url: baseUrl + `vehicle/${vehicleCode}`,
        data: JSON.stringify(vehicleData),
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            loadVehicleTable();
            clearVehicleFields();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Vehicle Update successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.log(result);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error Vehicle data:", result,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
})

// -----------------------------------search Vehicles by SearchBar using jQuery-------------------------
function searchVehicleFields() {
    // Get the search query
    var searchQuery = $('#searchVehicle').val().toLowerCase();

    // Get all the rows from the vehicle table (or list items) that you want to search
    $('#vehicleTableBody tr').each(function() {
        var $row = $(this);

        // Get the text content from the table cells
        var vehicleCode = $row.find('td:nth-child(1)').text().toLowerCase();
        var licensePlateNumber = $row.find('td:nth-child(2)').text().toLowerCase();
        var fuelType = $row.find('td:nth-child(3)').text().toLowerCase();
        var staffId = $row.find('td:nth-child(4)').text().toLowerCase();

        // Check if the search query matches any cell content (Field Code or Field Name)
        if (vehicleCode.includes(searchQuery) || licensePlateNumber.includes(searchQuery) ||
            fuelType.includes(searchQuery) || staffId.includes(searchQuery)) {
            $row.show();  // Show the row if it matches the query
        } else {
            $row.hide();  // Hide the row if it doesn't match the query
        }
    });
}

// -----------------------------------delete Vehicle-------------------------
$("#vehicleTableBody").on('click', '.vehicle-delete-btn', function () {
    // Get the vehicleCode from the row data attribute
    var vehicleCode = $(this).closest('tr').data('vehicle-code');
    console.log("Attempting to delete Vehicle with Code:", vehicleCode);
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
                url: baseUrl + `vehicle/${vehicleCode}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                success: function(response) {
                    console.log("Vehicle deleted successfully:", response);
                    $(`tr[data-vehicle-code='${vehicleCode}']`).remove();
                    clearVehicleFields();
                    loadVehicleTable();
                    Swal.fire(
                        'Deleted!',
                        'The vehicle has been deleted.',
                        'success'
                    );
                },
                error: function(error) {
                    console.error("Error deleting vehicle:", error);
                    Swal.fire(
                        'Error!',
                        'There was an issue deleting the vehicle.',
                        'error'
                    );
                }
            });
        } else {
            console.log("Deletion cancelled by user.");
        }
    });
});

