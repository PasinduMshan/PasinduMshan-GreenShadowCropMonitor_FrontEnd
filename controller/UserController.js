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
            Swal.fire({
                position: "center",
                icon: "success",
                title: "User saved successfully",
                showConfirmButton: false,
                timer: 1500
            });
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