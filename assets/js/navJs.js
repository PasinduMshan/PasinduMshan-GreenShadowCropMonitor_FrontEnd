const baseUrl = 'http://localhost:8080/CropMonitorSystem/api/v1/';

const token = getToken("token");
console.log(token)

if(!token || token == null || token == ""){
    console.log("if true")
    navigateSignInUpPage("#signInPage");
}

navigateSignInUpPage("#signInPage");

function navigateSignInUpPage(page) {
    $("#signInPage").css({display: 'none'});
    $("#allPageSidebar").css({display: 'none'});
    $("#mainContentOfPages").css({display: 'none'});
    $("#signUpPage").css({display: 'none'});
    $(page).css({display: 'block'});
}

function navigatePageSideBar(page) {
    $("#signInPage").css({display: 'none'});
    $("#signUpPage").css({display: 'none'});
    $("#fieldPage").css({display: 'none'});
    $("#staffPage").css({display: 'none'});
    $("#cropPage").css({display: 'none'});
    $("#equipmentPage").css({display: 'none'});
    $("#vehiclePage").css({display: 'none'});
    $("#monitoringLogPage").css({display: 'none'});
    $("#userPage").css({display: 'none'});
    $("#dashBoardPage").css({display: 'none'});

    $("#allPageSidebar").css({display: 'block'});
    $("#mainContentOfPages").css({display: 'block'});
    $("#Navbar").css({display: 'block'});
    $(page).css({display: 'block'});
}

function activeStyleInNavBar(button) {
    $('#dashboardNav').removeClass('active');
    $('#usersNav').removeClass('active');
    $('#cropsNav').removeClass('active');
    $('#fieldsNav').removeClass('active');
    $('#monitoringLogsNav').removeClass('active');
    $('#staffsNav').removeClass('active');
    $('#equipmentsNav').removeClass('active');
    $('#vehiclesNav').removeClass('active');

    $(button).addClass('active');
}

function updatePageTitle(title) {
    $("#pageTitle").text(title); // Update the text of the page title
}

$("#signUpNavInLoginPage").on('click', () => {
    navigateSignInUpPage("#signUpPage");
});


$("#signInNavInSignUpPage").on('click', () => {
    navigateSignInUpPage("#signInPage");
});


$("#btnSignIn").on('click', () => {
    navigatePageSideBar("#dashBoardPage");
    activeStyleInNavBar("#dashboardNav");
    updatePageTitle("Dashboard");
});

$("#btnSignUp").on('click', () => {
    navigatePageSideBar("#dashBoardPage");
    activeStyleInNavBar("#dashboardNav");
    updatePageTitle("Dashboard");
});

$("#dashboardNav").on('click', () => {
    navigatePageSideBar("#dashBoardPage");
    activeStyleInNavBar("#dashboardNav");
    updatePageTitle("Dashboard");
});

$("#usersNav").on('click', () => {
    navigatePageSideBar("#userPage");
    activeStyleInNavBar("#usersNav");
    updatePageTitle("User");
    loadUserTable();
});

$("#cropsNav").on('click', () => {
    navigatePageSideBar("#cropPage");
    activeStyleInNavBar("#cropsNav");
    updatePageTitle("Crops");
    loadAllFieldCodesInCrop();
    loadCropTable();
});

$("#fieldsNav").on('click', () => {
    navigatePageSideBar("#fieldPage");
    activeStyleInNavBar("#fieldsNav");
    updatePageTitle("Fields");
    loadFieldTable();
    clearFieldFields();
});

$("#monitoringLogsNav").on('click', () => {
    navigatePageSideBar("#monitoringLogPage");
    activeStyleInNavBar("#monitoringLogsNav");
    updatePageTitle("Monitoring Log Service");
    loadAllCropIdsInLog();
    loadAllFieldIdsInLog();
    loadAllStaffIdsInLog();
    loadLogTable();
    clearLogFields();
});

$("#staffsNav").on('click', () => {
    navigatePageSideBar("#staffPage");
    activeStyleInNavBar("#staffsNav");
    updatePageTitle("Staff");
    loadStaffTable();
    clearStaffFields();
});

$("#equipmentsNav").on('click', () => {
    navigatePageSideBar("#equipmentPage");
    activeStyleInNavBar("#equipmentsNav");
    updatePageTitle("Equipments");
    loadAllEquipmentStaffID();
    loadAllEquipmentFieldCode();
    loadEquipmentTable();
    clearEquipmentFields();
});

$("#vehiclesNav").on('click', () => {
    navigatePageSideBar("#vehiclePage");
    activeStyleInNavBar("#vehiclesNav");
    updatePageTitle("Vehicles");
    loadAllStaffID();
    loadVehicleTable();
    clearVehicleFields();
});

$("#logoutNav").on('click', () => {
    navigateSignInUpPage("#signInPage");
});

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('dateTime').textContent = now.toLocaleString('en-US', options);
}

// Update date and time every second
setInterval(updateDateTime, 1000);
updateDateTime();


function getToken(token){
    return document.cookie.split(token+"=").pop(0).trim();
}


$(document).ready(function () {
    'use strict';

    // Trigger file input click on image preview click
    $('.previewImage').on('click', function () {
        const inputId = $(this).next('input[type="file"]').attr('id');
        $('#' + inputId).click(); // Trigger the file input click
    });

    // Handle image selection and preview update
    $('.imagesOfInput').on('change', function (e) {
        const preview = $(this).prev('.previewImage'); // Get the corresponding preview image
        const file = e.target.files[0]; // Get the selected file
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.attr('src', e.target.result); // Set the image preview src
        };

        if (file) {
            reader.readAsDataURL(file); // Read the file as a data URL
        } else {
            // If no file is selected, clear the preview
            preview.attr('src', 'https://via.placeholder.com/200x200?text=Click+to+upload+Image');
        }
    });
});


// Function to convert Base64 string to File object
function base64ToFile(base64String, fileName) {
    const byteString = atob(base64String.split(',')[1]);
    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }
    return new File([byteArray], fileName, { type: mimeString });
}

// Function to convert ISO date to yyyy-MM-dd format
function formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Extract yyyy-MM-dd
}