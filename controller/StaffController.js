$('#btnStaffSave').on('click', () => {
    const staffData = {
        staffId: $('#staffId').val(),
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        designation: $('#designation').val(),
        gender: $('#gender').val(),
        role: $('#StaffRole').val(),
        joinDate: $('#joinDate').val(),
        dateOfBirth: $('#dateOfBirth').val(),
        contactNo: $('#contactNo').val(),
        email: $('#email').val(),
        address01: $('#address01').val(),
        address02: $('#address02').val(),
        address03: $('#address03').val(),
        address04: $('#address04').val(),
        address05: $('#address05').val()
    };

    console.log(staffData);

    if (!validateStaff(staffData)) {
        return;
    }

    $.ajax({
        method: "POST",
        url: `http://localhost:8080/CropMonitorSystem/api/v1/staff`,
        data: JSON.stringify(staffData),  // Send the data as JSON
        contentType: "application/json",  // Set content type to JSON
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            clearStaffFields();
            loadStaffTable();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Staff saved successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.log(result);  // Log any errors for debugging
        }
    });
});


function clearStaffFields() {
    $('#staffId').val('');
    $('#firstName').val('');
    $('#lastName').val('');
    $('#designation').val('');
    $('#gender').val('MALE');
    $('#StaffRole').val('EMPLOYEE');
    $('#joinDate').val('');
    $('#dateOfBirth').val('');
    $('#contactNo').val('');
    $('#email').val('');
    $('#address01').val('');
    $('#address02').val('');
    $('#address03').val('');
    $('#address04').val('');
    $('#address05').val('');
}


function validateStaff(staffData) {
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
        { field: staffData.staffId, message: "Staff ID is required" },
        { field: staffData.firstName, message: "First Name is required" },
        { field: staffData.lastName, message: "Last Name is required" },
        { field: staffData.designation, message: "Designation is required" },
        { field: staffData.gender, message: "Gender is required" },
        { field: staffData.role, message: "Role is required" },
        { field: staffData.joinDate, message: "Join Date is required" },
        { field: staffData.dateOfBirth, message: "Date of Birth is required" },
        { field: staffData.contactNo, message: "Contact Number is required" },
        { field: staffData.email, message: "Email is required" },
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

function loadStaffTable() {
    $('#StaffTableBody').empty();
    $.ajax({
        method: "GET",
        url: `http://localhost:8080/CropMonitorSystem/api/v1/staff`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(staff => {
                $('#StaffTableBody').append(`
                    <tr data-staff-id="${staff.staffId}">
                        <td>${staff.staffId}</td>
                        <td>${staff.firstName}</td>
                        <td>${staff.designation}</td>
                        <td>${staff.email}</td>
                        <td>
                            <button class="btn btn-danger btn-sm staff-delete-btn" title="Delete">
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