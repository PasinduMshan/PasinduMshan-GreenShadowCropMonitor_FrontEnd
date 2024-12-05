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
    $('#vehicleStatus').val('ACTIVE'); // Default selection
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


