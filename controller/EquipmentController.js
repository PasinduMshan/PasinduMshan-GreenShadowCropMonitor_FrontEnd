function loadAllEquipmentStaffID() {
    $('#equipmentStaffId').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `staff`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(result) {
            result.forEach(staff => {
                $('#equipmentStaffId').append(
                    `<option value="${staff.staffId}">${staff.staffId}</option>`
                );
            });
        },
        error: function(error) {
            console.error("Error fetching staff data:", error);
        }
    });
}

function loadAllEquipmentFieldCode() {
    $('#equipmentFieldCode').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `fields`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(result) {
            result.forEach(field => {
                $('#equipmentFieldCode').append(
                    `<option value="${field.fieldCode}">${field.fieldCode}</option>`
                );
            });
        },
        error: function(error) {
            console.error("Error fetching field data:", error);
        }
    });
}

// -----------------------------------save Equipment-------------------------

$('#btnSaveEquipment').on('click', () => {
    const equipmentData = {
        equipmentId: $('#equipmentId').val(),
        equipmentName: $('#equipmentName').val(),
        equipmentType: $('#equipmentType').val(),
        status: $('#status').val(),
        staffId: $('#equipmentStaffId').val(),
        fieldCode: $('#equipmentFieldCode').val()
    };
    console.log("Saving Equipment Data: ", equipmentData);
    if (!validateEquipment(equipmentData)) {
        return;
    }
    $.ajax({
        method: "POST",
        url: baseUrl + `equipment`,
        data: JSON.stringify(equipmentData),
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(result) {
            clearEquipmentFields();
            loadEquipmentTable();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Equipment saved successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function(error) {
            console.error("Error saving equipment:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to save equipment",
                text: "Please try again later.",
                showConfirmButton: true
            });
        }
    });
});

// -------------------------Clear Equipment Input--------------------

function clearEquipmentFields() {
    $('#equipmentId').val('');
    $('#equipmentName').val('');
    $('#equipmentType').val('');
    $('#status').val('AVAILABLE');
    $('#equipmentStaffId').val('');
    $('#equipmentFieldCode').val('');
    loadAllEquipmentFieldCode();
    loadAllEquipmentStaffID();
}

// -------------------------Validate Equipment data--------------------

function validateEquipment(equipmentData) {
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
        { field: equipmentData.equipmentId, message: "Equipment ID is required" },
        { field: equipmentData.equipmentName, message: "Equipment Name is required" },
        { field: equipmentData.equipmentType, message: "Equipment Type is required" },
        { field: equipmentData.status, message: "Equipment Status is required" },
        { field: equipmentData.staffId, message: "Staff ID is required" },
        { field: equipmentData.fieldCode, message: "Field Code is required" },
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

// -------------------------get all equipment--------------------

function loadEquipmentTable() {
    $('#EquipmentTableBody').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `equipment`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(equipment => {
                $('#EquipmentTableBody').append(`
                    <tr data-equipment-id="${equipment.equipmentId}">
                        <td>${equipment.equipmentId}</td>
                        <td>${equipment.equipmentName}</td>
                        <td>${equipment.equipmentType}</td>
                        <td>${equipment.status}</td>
                        <td>
                            <button class="btn btn-danger btn-sm equipment-delete-btn" title="Delete">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
            var equipmentsCount = $('#EquipmentTableBody tr').length;
            $('#equipmentCount').text(`${equipmentsCount}`);
        },
        error: function (result) {
            console.error("Error loading equipment data:", result);
        }
    });
}

// -------------------------equipment table row action--------------------

$("#EquipmentTableBody").on('click', 'tr', function () {
    var equipmentId = $(this).closest('tr').find('td').first().text();
    console.log("Selected Equipment ID:", equipmentId);
    $.ajax({
        method: "GET",
        url: baseUrl + `equipment/${equipmentId}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        success: function (equipment) {
            console.log(equipment);
            $('#equipmentId').val(equipment.equipmentId);
            $('#equipmentName').val(equipment.equipmentName);
            $('#equipmentType').val(equipment.equipmentType);
            $('#status').val(equipment.status);
            $('#equipmentStaffId').val(equipment.staffId);
            $('#equipmentFieldCode').val(equipment.fieldCode);
        },
        error: function (error) {
            console.error("Error fetching Equipment data:", error);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `Error fetching Equipment data: ${error.responseJSON?.message || error.statusText}`,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});

// -------------------------update Equipment--------------------

$('#btnUpdateEquipment').on('click', () => {
    console.log("Clicked update button for Equipment");
    const equipmentData = {
        equipmentId: $('#equipmentId').val(),
        equipmentName: $('#equipmentName').val(),
        equipmentType: $('#equipmentType').val(),
        status: $('#status').val(),
        staffId: $('#equipmentStaffId').val(),
        fieldCode: $('#equipmentFieldCode').val()
    };
    console.log(equipmentData);
    if (!validateEquipment(equipmentData)) {
        return;
    }
    var equipmentId = $('#equipmentId').val();
    $.ajax({
        method: "PUT",
        url: baseUrl + `equipment/${equipmentId}`,
        data: JSON.stringify(equipmentData),
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            loadEquipmentTable();
            clearEquipmentFields();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Equipment updated successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.error("Error updating Equipment:", result);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `Error updating Equipment: ${result.responseText}`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
});


// -----------------------------------search Equipments by SearchBar using jQuery-------------------------

function searchEquipments() {
    var searchQuery = $('#searchEquipment').val().toLowerCase();
    $('#EquipmentTableBody tr').each(function() {
        var $row = $(this);
        var equipmentId = $row.find('td:nth-child(1)').text().toLowerCase();
        var equipmentName = $row.find('td:nth-child(2)').text().toLowerCase();
        var equipmentType = $row.find('td:nth-child(3)').text().toLowerCase();
        var status = $row.find('td:nth-child(4)').text().toLowerCase();
        if (equipmentId.includes(searchQuery) || equipmentName.includes(searchQuery) ||
            equipmentType.includes(searchQuery) || status.includes(searchQuery)) {
            $row.show();
        } else {
            $row.hide();
        }
    });
}

// -----------------------------------delete Equipment-------------------------

$("#EquipmentTableBody").on('click', '.equipment-delete-btn', function () {
    var equipmentId = $(this).closest('tr').data('equipment-id');
    console.log("Attempting to delete Equipment with ID:", equipmentId);
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
                url: baseUrl + `equipment/${equipmentId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                success: function(response) {
                    console.log("Equipment deleted successfully:", response);
                    $(`tr[data-equipment-id='${equipmentId}']`).remove();
                    clearEquipmentFields();
                    loadEquipmentTable();
                    Swal.fire(
                        'Deleted!',
                        'The equipment has been deleted.',
                        'success'
                    );
                },
                error: function(error) {
                    console.error("Error deleting equipment:", error);
                    Swal.fire(
                        'Error!',
                        'There was an issue deleting the equipment.',
                        'error'
                    );
                }
            });
        } else {
            console.log("Deletion cancelled by user.");
        }
    });
});




