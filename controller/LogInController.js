$("#btnSignIn").on('click' , function () {
    var email = $('#signInEmail').val();
    var password = $('#signInPassword').val();

    console.log(email);
    console.log(password);

    const formData ={
        email:email,
        password:password
    }

    console.log(formData);

    var url = "http://localhost:8080/CropMonitorSystem/api/v1/auth/signIn";

    console.log(url);

    if(validate(email,password)){
        $.ajax({
            method:"POST",
            url:url,
            contentType:"application/json",
            data:JSON.stringify(formData),
            success:function(response){
                console.log(response.token);
                document.cookie = "token= "+response.token;
                navigatePageSideBar("#dashBoardPage");
            },error:function(token){
                console.log(token)
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Invalid User Name or Password",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigateSignInUpPage("#signInPage");
            }
        })
    } else {
        navigateSignInUpPage("#signInPage");
    }

    function validate(email, password) {
        if(email == "" || password == ""){
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "email name and password required",
                showConfirmButton: false,
                timer: 1500
            });
            return false;
        }
        return true;
    }
});