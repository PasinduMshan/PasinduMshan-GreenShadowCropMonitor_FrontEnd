// -----------------------------------Load all Crop Id-------------------------

function loadAllCropIdsInLog() {
    $('#logeCropCode').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `crop`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(result) {
            result.forEach(crop => {
                $('#logeCropCode').append(
                    `<option value="${crop.cropCode}">${crop.cropCode}</option>`
                );
            });
        },
        error: function(error) {
            console.error("Error fetching Crop data:", error);
        }
    });
}

// -----------------------------------Load all Field Id-------------------------

function loadAllFieldIdsInLog() {
    $('#logeFieldCode').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `fields`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(result) {
            result.forEach(field => {
                $('#logeFieldCode').append(
                    `<option value="${field.fieldCode}">${field.fieldCode}</option>`
                );
            });
        },
        error: function(error) {
            console.error("Error fetching field data:", error);
        }
    });
}

// -----------------------------------Load all Field Id-------------------------

function loadAllStaffIdsInLog() {
    $('#logStaffId').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `staff`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(result) {
            result.forEach(staff => {
                $('#logStaffId').append(
                    `<option value="${staff.staffId}">${staff.staffId}</option>`
                );
            });
        },
        error: function(error) {
            console.error("Error fetching staff data:", error);
        }
    });
}
