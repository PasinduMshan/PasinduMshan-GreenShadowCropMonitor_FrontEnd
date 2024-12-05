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
