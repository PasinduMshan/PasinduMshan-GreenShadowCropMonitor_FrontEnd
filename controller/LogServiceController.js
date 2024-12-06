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

// -----------------------------------save Log service-------------------------

$('#btnSaveLogService').on('click', () => {
    const logData = new FormData();
    logData.append("logCode", $('#logCode').val());
    logData.append("logDate", $('#logDate').val());
    logData.append("logDetails", $('#logDetails').val());
    logData.append("staffId", $('#logStaffId').val());
    logData.append("fieldCode", $('#logeFieldCode').val());
    logData.append("cropCode", $('#logeCropCode').val());
    logData.append("observedImage", $('#observedImage')[0].files[0]);
    console.log([...logData.entries()]);
    if (!validateLog(logData)) {
        return;
    }
    $.ajax({
        method: "POST",
        url: baseUrl + `monitoring_log`,
        data: logData,
        contentType: false,
        processData: false,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            loadLogTable();
            clearLogFields();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Log saved successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (error) {
            console.error("Error saving log:", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to save log",
                text: error.responseJSON?.message || "An error occurred while saving the log.",
                showConfirmButton: true
            });
        }
    });
});

// -----------------------------------validate Log service-------------------------

function validateLog(formData) {
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
        { field: formData.get("logCode"), message: "Log Code is required" },
        { field: formData.get("logDate"), message: "Log Date is required" },
        { field: formData.get("logDetails"), message: "Log Details are required" },
        { field: formData.get("staffId"), message: "Staff ID is required" },
        { field: formData.get("fieldCode"), message: "Field Code is required" },
        { field: formData.get("cropCode"), message: "Crop Code is required" },
        { field: formData.get("observedImage"), message: "Observed Image is required" }
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

// -----------------------------------LoadAll Log service-------------------------

function loadLogTable() {
    $('#logTableBody').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `monitoring_log`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(log => {
                $('#logTableBody').append(`
                    <tr data-log-code="${log.logCode}">
                        <td>${log.logCode}</td>
                        <td>${formatDate(log.logDate)}</td>
                        <td>${log.fieldCode}</td>
                        <td>${log.cropCode}</td>
                        <td>${log.staffId}</td>
                        <td>
                            <button class="btn btn-danger btn-sm log-delete-btn" title="Delete">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function (error) {
            console.error("Error loading logs:", error);
        }
    });
}

// -----------------------------------clear Log service-------------------------

function clearLogFields() {
    $('#logCode').val("");
    $('#logDate').val("");
    $('#logDetails').val("");
    $('#logStaffId').val("");
    $('#logeFieldCode').val("");
    $('#logeCropCode').val("");
    $('#observedImage').val("");
    $('#previewImage01').attr("src", "https://via.placeholder.com/200x200?text=Click+to+upload+Image+1");
}


// ----------------------------------- Get Log by Table Action -------------------------

$("#logTableBody").on('click', 'tr', function () {
    console.log("clicked");
    var logCode = $(this).closest('tr').find('td').first().text();
    console.log("Selected Log Code:", logCode);
    $.ajax({
        method: "GET",
        url: baseUrl + `monitoring_log/${logCode}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        success: function (log) {
            $('#logCode').val(log.logCode);
            $('#logDate').val(formatDate(log.logDate));
            $('#logDetails').val(log.logDetails);
            $('#logStaffId').val(log.staffId);
            $('#logeFieldCode').val(log.fieldCode);
            $('#logeCropCode').val(log.cropCode);
            if (log.observedImage) {
                // Convert Base64 to File object
                const file1 = base64ToFile(`data:image/png;base64,${log.observedImage}`, "observedImage.png");
                // Use DataTransfer to simulate file input
                const dataTransfer1 = new DataTransfer();
                dataTransfer1.items.add(file1);
                // Assign to input field
                document.querySelector("#observedImage").files = dataTransfer1.files;
                // Set preview
                $("#previewImage01").attr("src", `data:image/png;base64,${log.observedImage}`);
            }
        },
        error: function (error) {
            console.error("Error fetching log data:", error);
        }
    });
});