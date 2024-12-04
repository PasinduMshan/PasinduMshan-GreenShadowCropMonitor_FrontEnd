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
});

$("#cropsNav").on('click', () => {
    navigatePageSideBar("#cropPage");
    activeStyleInNavBar("#cropsNav");
    updatePageTitle("Crops");
});

$("#fieldsNav").on('click', () => {
    navigatePageSideBar("#fieldPage");
    activeStyleInNavBar("#fieldsNav");
    updatePageTitle("Fields");
});

$("#monitoringLogsNav").on('click', () => {
    navigatePageSideBar("#monitoringLogPage");
    activeStyleInNavBar("#monitoringLogsNav");
    updatePageTitle("Monitoring Log Service");
});

$("#staffsNav").on('click', () => {
    navigatePageSideBar("#staffPage");
    activeStyleInNavBar("#staffsNav");
    updatePageTitle("Staff");
});

$("#equipmentsNav").on('click', () => {
    navigatePageSideBar("#equipmentPage");
    activeStyleInNavBar("#equipmentsNav");
    updatePageTitle("Equipments");
});

$("#vehiclesNav").on('click', () => {
    navigatePageSideBar("#vehiclePage");
    activeStyleInNavBar("#vehiclesNav");
    updatePageTitle("Vehicles");
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
