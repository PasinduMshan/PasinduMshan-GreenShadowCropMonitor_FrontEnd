// -----------------------------------save Staff-------------------------

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

// -----------------------------------clear field-------------------------

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

// -----------------------------------Staff validate-------------------------

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

// -----------------------------------Get All Staff-------------------------

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
                        <td>${staff.contactNo}</td>
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

// -----------------------------------Table Action-------------------------

$("#StaffTableBody").on('click', 'tr', function () {
    var staffId = $(this).closest('tr').find('td').first().text();
    console.log("Selected Staff ID:", staffId);
    $.ajax({
        method: "GET",
        url: baseUrl + `staff/${staffId}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        success: function (staff) {
            $('#staffId').val(staff.staffId);
            $('#firstName').val(staff.firstName);
            $('#lastName').val(staff.lastName);
            $('#designation').val(staff.designation);
            $('#gender').val(staff.gender);
            $('#StaffRole').val(staff.role);
            $('#joinDate').val(formatDate(staff.joinDate));
            $('#dateOfBirth').val(formatDate(staff.dateOfBirth));
            $('#contactNo').val(staff.contactNo);
            $('#email').val(staff.email);
            $('#address01').val(staff.address01);
            $('#address02').val(staff.address02);
            $('#address03').val(staff.address03);
            $('#address04').val(staff.address04);
            $('#address05').val(staff.address05);
        },
        error: function (error) {
            console.error("Error fetching Staff data:", error);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error fetching Staff data:", error,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});

// Function to convert ISO date to yyyy-MM-dd format
function formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Extract yyyy-MM-dd
}

// -----------------------------------update Staff-------------------------

$('#btnStaffUpdate').on('click' ,()=>{
    console.log("click update button")
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
    var staffId = $('#staffId').val();
    $.ajax({
        method: "PUT",
        url: baseUrl + `staff/${staffId}`,
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
                title: "Staff Update successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.log(result);  // Log any errors for debugging
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error Staff data:", result,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});

// -----------------------------------get Staff by SearchBar-------------------------

function searchFields() {
    // Get the search query
    var searchQuery = document.getElementById('searchStaff').value.toLowerCase();

    // Get all the rows from the table (or list items) that you want to search
    var rows = document.querySelectorAll('#StaffTable tbody tr');

    rows.forEach(function(row) {
        // Get the text content from the table cells
        var cells = row.querySelectorAll('td');
        var staffId = cells[0].textContent.toLowerCase();
        var firstName = cells[1].textContent.toLowerCase();
        var designation = cells[2].textContent.toLowerCase();
        var contactNo = cells[4].textContent.toLowerCase();

        // Check if the search query matches any cell content (Field Code or Field Name)
        if (staffId.includes(searchQuery) || firstName.includes(searchQuery) || designation.includes(searchQuery)
            || contactNo.includes(searchQuery)) {
            row.style.display = '';  // Show the row if it matches the query
        } else {
            row.style.display = 'none';  // Hide the row if it doesn't match the query
        }
    });
}

// -----------------------------------delete Staff-------------------------
$("#StaffTableBody").on('click', '.staff-delete-btn', function () {
    // Get the staffId from the row data attribute
    var staffId = $(this).closest('tr').data('staff-id');
    console.log("Attempting to delete Staff with ID:", staffId);
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
                url: baseUrl + `staff/${staffId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                success: function(response) {
                    console.log("Staff deleted successfully:", response);
                    $(`tr[data-staff-id='${staffId}']`).remove();
                    clearStaffFields();
                    loadStaffTable();
                    Swal.fire(
                        'Deleted!',
                        'The staff member has been deleted.',
                        'success'
                    );
                },
                error: function(error) {
                    console.error("Error deleting staff:", error);
                    Swal.fire(
                        'Error!',
                        'There was an issue deleting the staff.',
                        'error'
                    );
                }
            });
        } else {
            console.log("Deletion cancelled by user.");
        }
    });
});
