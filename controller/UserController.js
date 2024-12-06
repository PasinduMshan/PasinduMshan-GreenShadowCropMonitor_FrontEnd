var oldUserPassword = ""

// -------------------------Save User--------------------

$('#btnSaveUser').on('click', () => {
    const userData = {
        email: $('#userEmail').val(),
        password: $('#userPassword').val(),
        role: $('#userRole').val(),
    };
    console.log(userData);
    if (!validateUser(userData)) {
        return;
    }
    $.ajax({
        method: "POST",
        url: baseUrl + `user`,
        data: JSON.stringify(userData),
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        success: function (result) {
            clearUserFields();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "User saved successfully",
                showConfirmButton: false,
                timer: 1500
            });
            loadUserTable();
        },
        error: function (result) {
            console.error("Error saving user:", result);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error saving user",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
});


// -------------------------Validate User Data--------------------

function validateUser(userData) {
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
        { field: userData.email, message: "Email is required" },
        { field: userData.password, message: "Password is required" },
        { field: userData.role, message: "Role is required" },
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

// ----------------------------------- Clear User Fields -----------------------------------

function clearUserFields() {
    $('#userEmail').val('');
    $('#userPassword').val('');
    $('#userRole').val('MANAGER'); // Default role
}

// ----------------------------------- load all User Fields -----------------------------------

function loadUserTable() {
    $('#UserTableBody').empty();
    $.ajax({
        method: "GET",
        url: baseUrl + `user`, // Assuming `user` is the endpoint for fetching users
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function (result) {
            result.forEach(user => {
                $('#UserTableBody').append(`
                    <tr data-user-email="${user.email}">
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button class="btn btn-danger btn-sm user-delete-btn" title="Delete">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function (result) {
            console.error("Error loading user data:", result);
        }
    });
}


// -------------------------User Table Row Action--------------------

$("#UserTableBody").on('click', 'tr', function () {
    var email = $(this).closest('tr').find('td').first().text();
    console.log("Selected User Email:", userEmail);
    $.ajax({
        method: "GET",
        url: baseUrl + `user/${email}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        success: function (user) {
            console.log(user);
            $('#userEmail').val(user.email);
            $('#userPassword').val('');
            $('#userRole').val(user.role);
            oldUserPassword = user.password;
        },
        error: function (error) {
            console.error("Error fetching user data:", error);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `Error fetching user data`,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});

// -------------------------Update User--------------------

$('#btnUpdateUser').on('click', () => {
    console.log("Clicked Update User button");
    let password = oldUserPassword;
    if ($('#userPassword').val().trim() !== "") {
        password = $('#userPassword').val().trim();
    }
    const userData = {
        email: $('#userEmail').val(),
        password: password,
        role: $('#userRole').val()
    };
    console.log(userData);
    if (!validateUser(userData)) {
        return;
    }
    var userEmail = $('#userEmail').val();
    $.ajax({
        method: "PUT",
        url: baseUrl + `user/${userEmail}`,
        data: JSON.stringify(userData),
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            loadUserTable();
            clearUserFields();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "User updated successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (result) {
            console.error("Error updating user:", result);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error updating user",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
});

// -----------------------------------Search Users by SearchBar-------------------------

function searchUser() {
    var searchQuery = $('#searchUser').val().toLowerCase();
    $('#UserTableBody tr').each(function () {
        var $row = $(this);
        var email = $row.find('td:nth-child(1)').text().toLowerCase();
        var role = $row.find('td:nth-child(2)').text().toLowerCase();
        if (email.includes(searchQuery) || role.includes(searchQuery)) {
            $row.show();
        } else {
            $row.hide();
        }
    });
}

// -----------------------------------Delete User-------------------------
$("#UserTableBody").on('click', '.user-delete-btn', function () {
    var userEmail = $(this).closest('tr').data('user-email');
    console.log("Attempting to delete user with email:", userEmail);
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
                url: baseUrl + `user/${userEmail}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                success: function (response) {
                    console.log("User deleted successfully:", response);
                    $(`tr[data-user-email='${userEmail}']`).remove();
                    Swal.fire(
                        'Deleted!',
                        'The user has been deleted successfully.',
                        'success'
                    );
                },
                error: function (error) {
                    console.error("Error deleting user:", error);
                    Swal.fire(
                        'Error!',
                        'There was an issue deleting the user. Please try again.',
                        'error'
                    );
                }
            });
        } else {
            console.log("Deletion cancelled by the user.");
        }
    });
});
