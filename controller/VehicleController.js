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
        vehicleStatus: $('#vehicleStatus').val(),
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
        { field: vehicleData.vehicleStatus, message: "Vehicle Status is required" },
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

function clearVehicleFields() {
    $('#vehicleCode').val('');
    $('#licensePlateNumber').val('');
    $('#vehicleCategory').val('');
    $('#fuelType').val('');
    $('#vehicleStatus').val('ACTIVE'); // Default selection
    $('#remarks').val('');
    $('#vehicleStaffId').val('');
}

