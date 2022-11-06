// ------------------------------------------- JavaScript for CourseO_line - Admin SignIn Panel ---------------------------------------- //



// Function for setting the height of 'body' and 'article' according to the browser sizing --------------- //
const innerDimensionsChanger = () => {

    // Getting the article element of the current page
    let article = document.querySelector("main .login-menu")

    // ------------------ //

    // Setting the height of article element
    article.style.height = `${window.innerHeight}px`

    // Setting the height of the body relative to the browser height
    document.body.style.height = `${window.innerHeight}px`

}

innerDimensionsChanger()
//
window.addEventListener("resize", innerDimensionsChanger)
// --------------------------------------------------------------------------------------------------- //


// Function for validating the admin SignIn credentials ---------------------------------------- //
const adminSignIn = (e) => {

    // Preventing the page from reloading
    e.preventDefault()

    // Getting a 'error-message' element to show error message
    let autoHidMsg = document.querySelector(".login-menu .login-popup .login-form-container .error-message")

    // Disabling the submit button after clicked
    let button = adminSignInPanel.querySelector(".login-button")
    button.disabled = true

    // Checking the button is the correct one
    if (button.value == "Log In") {

        $.ajax({
            type: "POST",
            url: "/admin-login",
            data: {
                adminname: $(".admin_name").val(),
                password: $(".pass_word").val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {

                if (data.message[0] == "Success") {

                    // Redirecting back to the previous page
                    window.location.pathname = data.message[1]
                }
                else {

                    // Populating the error message's innerHTML with the value returned from the function and showing it on the screen
                    autoHidMsg.innerHTML = `${data.message[0]}`
                    autoHidMsg.classList.toggle("show")

                    if (data.message[0] != "Password Invalid, please check") {

                        // Clearing the UserId input box
                        adminSignInPanel.querySelector(".admin_name").value = ""
                    }

                    // Clearing the password input box
                    adminSignInPanel.querySelector(".pass_word").value = ""
                }

            }
        })
    }

    // Hiding the error message after 3 seconds
    setTimeout(() => {

        autoHidMsg.classList.toggle("show")
        button.disabled = false
    }, 3000)

}


// Getting the Admin SignIn Form
const adminSignInPanel = document.querySelector(".login-menu .login-popup .login-form-container .adminAuthentication_form")
//
if (adminSignInPanel != null) {

    adminSignInPanel.addEventListener("submit", adminSignIn)

    // Making the adminname field focused
    adminSignInPanel.querySelector(".admin_name").focus()
}
// -------------------------------------------------------------------------------- //


// Function for validating the admin SignUp credentials ---------------------------------------- //
const adminSignUp = (e) => {

    // Preventing the page from reloading
    e.preventDefault()

    // Getting a 'error-message' element to show error message
    let autoHidMsg = document.querySelector(".login-menu .login-popup .login-form-container .error-message")

    // Disabling the submit button after clicked
    let button = adminSignUpPanel.querySelector(".login-button")
    button.disabled = true

    // Checking the button is the correct one for signup
    if (button.value == "Sign UP") {

        $.ajax({
            type: "POST",
            url: "/admin-signup",
            data: {
                newadminname: $(".new_admin_name").val(),
                newemail: $(".new_email").val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {

                if (data.message[0] == "Fields can't be empty" || data.message[0] == "UserName already exists" || data.message[0] == "Email Id already exists") {

                    // Showing the Error message on the screen
                    autoHidMsg.innerHTML = `${data.message[0]}`
                    autoHidMsg.style.color = "rgba(252, 25, 25, 0.8)"
                    autoHidMsg.style.textAlign = "left"
                    autoHidMsg.classList.add("show")

                    if (data.message[0] == "UserName already exists") {

                        // Clearing the UserId input box
                        adminSignUpPanel.querySelector(".new_admin_name").value = ""
                    }
                    if (data.message[0] == "Email Id already exists") {

                        // Clearing the password input box
                        adminSignUpPanel.querySelector(".new_email").value = ""
                    }

                    // Hiding the error message after 3 seconds
                    setTimeout(() => {

                        autoHidMsg.classList.remove("show")
                        button.disabled = false
                    }, 3000)
                }

                else {

                    // Showing the Success message
                    autoHidMsg.innerHTML = `${data.message[0]}`
                    autoHidMsg.style.color = "rgb(0, 75, 35)"
                    autoHidMsg.style.textAlign = "right"
                    autoHidMsg.classList.add("show")

                    // Clearing the input boxes
                    adminSignUpPanel.querySelector(".new_admin_name").value = ""
                    adminSignUpPanel.querySelector(".new_email").value = ""

                    // Hiding the error message after 3 seconds
                    setTimeout(() => {

                        autoHidMsg.classList.remove("show")
                        button.disabled = false
                    }, 3000)
                }

            }
        })
    }
}

// Getting the Admin SignUp Form
const adminSignUpPanel = document.querySelector(".login-menu .login-popup .login-form-container .create_adminAuthentication_form")
//
if (adminSignUpPanel != null) {

    adminSignUpPanel.addEventListener("submit", adminSignUp)

    // Making the adminname field focused
    adminSignUpPanel.querySelector(".new_admin_name").focus()
}

// -------------------------------------------------------------------------------- //


// Function for showing the Forgot Password panel
const forgotPasswordPanelShow = () => {

    let loginPanel = forgotPasswordElement.parentElement.parentElement
    let resetPanel = loginPanel.nextElementSibling

    setTimeout(() => {

        // Showing the Admin Reset Password Panel
        resetPanel.classList.remove("hide")
        //
        resetPanel.querySelector(".reset_email").focus()

        // Adding a class to 'forgot-password' element
        if (forgotPasswordElement.classList[1] == "otp-validator") {
            forgotPasswordElement.classList.replace("otp-validator", "email-validator")
        }
        else {
            forgotPasswordElement.classList.add("email-validator")
        }

        // Hiding the Admin Login Panel
        loginPanel.classList.add("hide")
    }, 800)


    // Function for hiding the Forgot Password panel and Showing the Admin Login Panel
    let backToAdminPanel = () => {

        setTimeout(() => {

            if (forgotPasswordElement.classList[1] == "email-validator") {

                // Redirecting to the Admin Login Panel
                window.location.pathname = "/admin-login/check-email-otp"
            }

            if (forgotPasswordElement.classList[1] == "otp-validator") {

                // Showing the OTP Send Form in Admin Reset Password Panel
                let EmailForm = resetPanel.querySelector(".password_change_form")
                EmailForm.classList.remove("hide")

                // Clearing the EmailId input box
                EmailForm.querySelector(".reset_email").value = ""
                EmailForm.querySelector(".reset_email").focus()
                //
                forgotPasswordElement.classList.replace("otp-validator", "email-validator")

                // Removing the OTP Validate Form in Admin Reset Password Panel
                let OTPForm = resetPanel.querySelector(".otp_validate_form")
                OTPForm.classList.add("hide")

                // Getting the back button from the Admin Reset Password Panel
                let forgotPasswordPanelBackButton = resetPanel.querySelector(".forgot-password-abort")
                //
                forgotPasswordPanelBackButton.addEventListener("click", backToAdminPanel)
            }

        }, 600)
    }

    // Function for checking the password match and also update it
    const forgotPasswordUpdatePassword = (page) => {

        // Preventing the page from reloading
        page.preventDefault()

        // Getting a 'error-message' element to show error message
        let autoHidMsg = document.querySelector(".login-menu .login-popup .password-change-container .error-message")

        // Disabling the submit button after clicked
        let OTPForm = resetPanel.querySelector(".otp_validate_form")
        let button = OTPForm.querySelector(".update-button-container .update-button")
        button.disabled = true

        // Checking the button is the correct one
        if (button.value == "Update") {

            $.ajax({
                type: "POST",
                url: "/admin-login/update-password",
                data: {
                    newpassword: $(".new_password").val(),
                    confirmpassword: $(".confirm_password").val(),
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                },
                success: function (data) {

                    if (data.message[0] == "Password Changed") {

                        // Populating the error message's innerHTML with the value returned from the function and showing it on the screen
                        autoHidMsg.innerHTML = `${data.message[0]}`
                        autoHidMsg.style.color = "#10451D"
                        autoHidMsg.style.textAlign = "right"
                        autoHidMsg.classList.toggle("show")

                        // Showing the OTP validate panel which also updates the new password
                        setTimeout(() => {

                            // Redirecting to the Admin Login Panel
                            window.location.pathname = data.message[1]
                            // Enabling the send OTP button
                            button.disabled = false
                        }, 2500)
                    }
                    else {

                        // Populating the error message's innerHTML with the value returned from the function and showing it on the screen
                        autoHidMsg.innerHTML = `${data.message[0]}`
                        autoHidMsg.style.color = "rgba(252, 25, 25, 0.8)"
                        autoHidMsg.style.textAlign = "left"
                        autoHidMsg.classList.toggle("show")

                        // Getting the Password Changer Form
                        let OTPForm = resetPanel.querySelector(".otp_validate_form")

                        if (data.message[0] != "Passwords doesn't match") {

                            // Clearing the New Password input box
                            OTPForm.querySelector(".new_password").value = ""
                        }
                        // Clearing the Confirm Password input box
                        OTPForm.querySelector(".confirm_password").value = ""

                        // Enabling the form's submit after 3 seconds
                        button.disabled = false
                    }

                    // Hiding the error message after 3 seconds
                    setTimeout(() => {

                        if (autoHidMsg.classList[1] == "show") {
                            console.log("working2")
                            autoHidMsg.classList.remove("show")
                        }
                    }, 3000)

                }
            })
        }
    }


    // Function for Showing the OTP Validate Form and also hiding the OTP Send Form
    const forgotPasswordOTPValidator = (otpSent) => {

        // Showing the OTP Validate Form
        let OTPForm = resetPanel.querySelector(".otp_validate_form")
        OTPForm.classList.remove("hide")
        // Changing focus to otp input
        OTPForm.querySelector(".your_otp").focus()

        // Setting the values of input fields to none
        OTPForm.querySelector(".your_otp").value = ""
        OTPForm.querySelector(".new_password").value = ""
        OTPForm.querySelector(".confirm_password").value = ""

        // Hiding the OTP Send Form
        let EmailForm = resetPanel.querySelector(".password_change_form")
        EmailForm.classList.add("hide")

        // Disabling the new password inputs
        OTPForm.querySelector(".your_otp").disabled = false
        OTPForm.querySelector(".new_password").disabled = true
        OTPForm.querySelector(".confirm_password").disabled = true
        OTPForm.querySelector(".update-button-container .update-button").disabled = true

        // Replacing a class in 'forgot-password' element
        if (forgotPasswordElement.classList[1] == "email-validator") {
            forgotPasswordElement.classList.replace("email-validator", "otp-validator")
        }
        else {
            forgotPasswordElement.classList.add("otp-validator")
        }

        // Function for validating the OTP entered is the same as the OTP sent
        const OTPChecker = () => {

            // Getting th 'error-message' element to show a error message
            let autoHidMsg = document.querySelector(".login-menu .login-popup .password-change-container .error-message")


            // Getting the value typed by the user in the OTP input field
            let typedOTP = OTPinputElement.value

            // Getting last typed value and confirming it is a integer or not
            let lastValueIntypedOTP = typedOTP[((typedOTP).length) - 1]
            //
            if (Number.isInteger(parseInt(lastValueIntypedOTP))) {

                // Checking for the length of the user typedOTP
                if ((typedOTP).length >= 6) {

                    // Disabling the OTP input
                    OTPinputElement.disabled = true

                    if (typedOTP == otpSent) {

                        // Showing Success message only if not already visible
                        if (autoHidMsg.classList[1] != "show") {

                            autoHidMsg.innerHTML = "Great! OTP Matched"
                            autoHidMsg.style.color = "#10451D"
                            autoHidMsg.style.textAlign = "right"
                            autoHidMsg.classList.add("show")
                        }

                        // Enabling the new password inputs
                        OTPForm.querySelector(".new_password").disabled = false
                        OTPForm.querySelector(".confirm_password").disabled = false
                        OTPForm.querySelector(".update-button-container .update-button").disabled = false

                        // Changing focus to newpassword input
                        OTPForm.querySelector(".new_password").focus()

                        // Getting the update button
                        OTPForm.addEventListener("submit", forgotPasswordUpdatePassword)
                    }
                    else {
                        // Showing error message only if not already visible
                        if (autoHidMsg.classList[1] != "show") {

                            autoHidMsg.innerHTML = "OTP doesn't match"
                            autoHidMsg.style.color = "rgba(252, 25, 25, 0.8)"
                            autoHidMsg.style.textAlign = "left"
                            autoHidMsg.classList.add("show")
                        }

                        setTimeout(() => {
                            // Clearing the input when it doesn't match
                            OTPinputElement.value = ""

                            // Enabling back the OTP input again
                            OTPinputElement.disabled = false
                        }, 1500)

                    }
                    // Removing error message only if visible
                    if (autoHidMsg.classList[1] == "show") {

                        setTimeout(() => {
                            autoHidMsg.classList.remove("show")
                        }, 1500)
                    }
                }
            }
            else {
                // Clearing the input when it is not a number
                OTPinputElement.value = ""

                // Showing error message only if not already visible
                if (autoHidMsg.classList[1] != "show") {

                    autoHidMsg.innerHTML = "Oops! OTP has only numbers"
                    autoHidMsg.style.textAlign = "left"
                    autoHidMsg.style.color = "rgba(252, 25, 25, 0.8)"
                    autoHidMsg.classList.add("show")
                }
            }
        }
        // Getting the OTP input
        let OTPinputElement = OTPForm.querySelector(".your_otp")
        OTPinputElement.addEventListener("input", OTPChecker)
    }

    // Getting the back button from the Admin Reset Password Panel
    let forgotPasswordPanelBackButton = resetPanel.querySelector(".forgot-password-abort")
    //
    forgotPasswordPanelBackButton.addEventListener("click", backToAdminPanel)


    // Function for validating the email and also send OTP to a valid email
    const forgotPasswordEmailValidator = (page) => {

        // Preventing the page from reloading
        page.preventDefault()

        // Getting a 'error-message' element to show error message
        let autoHidMsg = document.querySelector(".login-menu .login-popup .password-change-container .error-message")

        // Disabling the submit button after clicked
        let button = forgotPasswordChangerForm.querySelector(".send-button")
        button.disabled = true

        // Checking the button is the correct one
        if (button.value == "Send OTP") {

            $.ajax({
                type: "POST",
                url: "/admin-login/check-email-otp",
                data: {
                    resetemail: $(".reset_email").val(),
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                },
                success: function (data) {

                    if (data.message[0] == "OTP sent successfully") {

                        // Populating the error message's innerHTML with the value returned from the function and showing it on the screen
                        autoHidMsg.innerHTML = `${data.message[0]}`
                        autoHidMsg.style.color = "#10451D"
                        autoHidMsg.style.textAlign = "right"
                        autoHidMsg.classList.toggle("show")

                        // Showing the OTP validate panel which also updates the new password
                        setTimeout(() => {

                            var otpSent = data.message[1]

                            forgotPasswordOTPValidator(otpSent)
                            // Enabling the send OTP button
                            button.disabled = false
                        }, 2500)
                    }
                    else {

                        // Populating the error message's innerHTML with the value returned from the function and showing it on the screen
                        autoHidMsg.innerHTML = `${data.message[0]}`
                        autoHidMsg.classList.toggle("show")

                        if (data.message[1] == "notexists") {

                            // Clearing the EmailId input box
                            forgotPasswordChangerForm.querySelector(".reset_email").value = ""
                        }
                        // Enabling the form after 3 seconds
                        button.disabled = false
                    }

                    // Hiding the error message after 3 seconds
                    setTimeout(() => {

                        autoHidMsg.classList.toggle("show")
                    }, 2000)

                }
            })
        }
    }

    // Linking a Email Validator function with Admin Reset Password Panel's password_change_form
    let forgotPasswordChangerForm = resetPanel.querySelector(".password_change_form")
    //
    forgotPasswordChangerForm.addEventListener("submit", forgotPasswordEmailValidator)

}

// Getting the forgot password 'a' tag next to the Admin SignIn Form
const forgotPasswordElement = document.querySelector(".login-menu .login-popup .login-form-container .options .forgot-password")
//
if (forgotPasswordElement != null) {

    forgotPasswordElement.addEventListener("click", forgotPasswordPanelShow)
}

