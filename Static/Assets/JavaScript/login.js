
import Status from "./status.js"


// ------------------ Forgot Password Window - Script --------------- //

const article = document.querySelector("article")
const HID = "hide", href = ["href", window.location.pathname]
let otpSent = ""

// ---- Function to show Forgot-Password Window ---- //
const showForgotPassword = () => {

    let loginMenu = article.querySelector(".login-form-container")
    let forgotPasswordMenu = article.querySelector(".password-change-container")
    forgotPasswordMenu.classList.toggle(HID)
    loginMenu.classList.toggle(HID)
    setTimeout(() => {
        forgotPasswordMenu.querySelector(".registered_email").focus()
    }, 1000)

    // Activating Send OTP Form
    forgotPasswordMenu.querySelector("form.email_otp").addEventListener("submit", validateEmailandSendOtp)
}

// ---- Function to validate and send OTP to Admin email ---- //
const validateEmailandSendOtp = (e) => {

    // Disabling Submit button
    e.preventDefault()
    let form = e.target
    let button = form.querySelector("input[type=submit]")
    button.disabled = true

    // Creating Status Message
    let status = new Status(), millisec = 2500

    // Sending request through AJAX for Generating and Sending OTP to email
    $.ajax({
        type: "POST",
        url: "/admin-login/check-email-otp",
        data: {
            resetemail: $(".registered_email").val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        },
        success: (data) => {

            // Populating status
            status.message(data.message[0])
            if (data.message[0] == "OTP sent successfully") {

                // Showing status
                status.show(article, true)
                setTimeout(() => {
                    form.querySelector(".registered_email").value = ""
                    form.classList.add(HID)

                    // Redirecting to Change Password Form
                    otpSent = data.message[1]
                    showChangePasswordForm()
                }, millisec)
            }
            else {
                // Showing status as error
                status.show(article)

                // Clearing Email input
                let emailInput = form.querySelector(".registered_email")
                if (data.message[1] == "notexists") {
                    emailInput.value = ""
                }
                emailInput.focus()
                millisec = 3500
            }
            setTimeout(() => {
                status.remove()
                button.disabled = false
            }, millisec - 500)
        },
        error: () => {
            window.location.reload()
        }
    })
}

// ---- Function to open & setup Change-Password Form ---- //
const showChangePasswordForm = () => {

    let otpForm = article.querySelector(".password-change-container form.change_password")
    let otpInput = otpForm.querySelector(".your_otp")
    otpForm.classList.remove(HID)
    setTimeout(() => {
        otpInput.focus()
    }, 600)

    // Disabling the Change-Password Form
    otpForm.querySelectorAll("input:not([type=hidden])").forEach((input) => {
        if (input.type != "text") {
            input.disabled = true
        }
        else {
            input.addEventListener("input", OTPValidator)
        }
        if (input.type != "submit") {
            input.value = ""
        }
    })
    // Changing Abort button's action
    let abortBtn = article.querySelector(".password-change-container .more-options .abort-button")
    abortBtn.removeAttribute(href[0])
    abortBtn.addEventListener("click", abortToEmailOtp)
}

// ---- Function to validate entered OTP ---- //
const OTPValidator = (event) => {

    let otpInput = event.target
    let typedOTP = otpInput.value
    if (isNaN(+typedOTP) == false) {

        if (typedOTP.length >= 6) {

            otpInput.disabled = true
            if (otpSent == typedOTP) {

                otpInput.classList.add("success")
                setTimeout(() => {
                    otpInput.parentElement.querySelectorAll("input:not([type=hidden]):not([type=text])").forEach((input) => {
                        input.disabled = false
                        if (input.classList[0] == "new_password") {
                            input.focus()
                        }
                    })
                    otpInput.parentElement.addEventListener("submit", validateUpdateNewPassword)
                }, 1000)
            }
            else clearOTPInput(otpInput, "OTP doesn't match")
        }
    }
    else clearOTPInput(otpInput, "Oops! OTP has only numbers")
}

// ---- Function to go back to Email-Otp Form ---- //
const abortToEmailOtp = (event) => {

    let otpForm = article.querySelector(".password-change-container form.change_password")
    otpForm.classList.add(HID)
    otpForm.previousElementSibling.classList.remove(HID)

    // Removing events in Change-Password Form
    otpForm.querySelector(".your_otp").removeEventListener("input", OTPValidator)
    otpForm.removeEventListener("submit", validateUpdateNewPassword)
    setTimeout(() => {
        otpForm.previousElementSibling.querySelector(".registered_email").focus()

        // Re-setting Abort button's action
        let abort = event.target
        abort.setAttribute(href[0], href[1])
        abort.removeEventListener("click", abortToEmailOtp)
    }, 600)
}

// ---- Function to clear and show error OTP is not valid ---- //
const clearOTPInput = (input, text) => {

    // Creating Status Message
    let status = new Status()
    status.message(text)
    status.show(article)

    // Clearing Input
    input.value = ""
    input.classList.add("error")
    input.disabled = true
    setTimeout(() => {
        status.remove()
        input.classList.remove("error")
        input.disabled = false
    }, 3000)
}

// ---- Function to validate and update new password ---- //
const validateUpdateNewPassword = (e) => {

    // Disabling Submit button
    e.preventDefault()
    let form = e.target
    let button = form.querySelector("input[type=submit]")
    button.disabled = true

    // Creating Status Message
    let status = new Status(), millisec = 2000

    // Sending formdata as request through AJAX for Validating and Updating password
    $.ajax({
        type: "POST",
        url: "/admin-login/update-password",
        data: {
            newpassword: $(".new_password").val(),
            confirmpassword: $(".confirm_password").val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        },
        success: (data) => {

            // Populating status
            status.message(data.message[0])
            if (data.message[0] == "Password Changed") {

                // Showing status
                status.show(article, true)
                setTimeout(() => {
                    window.location.pathname = data.message[1]
                }, millisec)
            }
            else {
                // Showing status as error
                status.show(article)

                // Clearing Password Inputs
                let confirmpassword = form.querySelector(".confirm_password")
                confirmpassword.value = ""
                confirmpassword.focus()

                if (data.message[0] != "Passwords doesn't match") {
                    let newpassword = form.querySelector(".new_password")
                    newpassword.value = ""
                    newpassword.focus()
                }
                setTimeout(() => {
                    status.remove()
                    button.disabled = false
                }, millisec + 500)
            }
        },
        error: () => {
            window.location.reload()
        }
    })
}

const forgotPasswordLink = article.querySelector(".login-form-container .more-options .forgot-password")
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", showForgotPassword)
}
// --------------------------------------------------------------- //