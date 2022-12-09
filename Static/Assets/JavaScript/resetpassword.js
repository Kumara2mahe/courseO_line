import dimensionChanger from "./admin.js"
import Status from "./status.js"


// ------------------ Send OTP to Mail - Script --------------- //

const article = document.querySelector("article.reset-password"),
    emailOtpForm = article.querySelector("form.email_otp"),
    passwordForm = article.querySelector("form.change_password"),
    HID = "hide", parentPath = window.location.pathname,
    hasEmail = new URLSearchParams(window.location.search).get("email")

// ---- Function to validate entered OTP ---- //
const OTPValidator = (otpInput, sentemail) => {

    let typedOTP = otpInput.value
    if (isNaN(+typedOTP) == false) {
        if (otpInput.textLength >= 6) {
            otpInput.disabled = true

            // Sending request through AJAX for checking OTP is correct
            $.ajax({
                type: "POST",
                url: `${parentPath}/checkotp`,
                data: {
                    email: sentemail,
                    enteredotp: typedOTP,
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                },
                success: (data) => {
                    if (data.info == "matched") {
                        otpInput.classList.add("success")
                        setTimeout(() => {
                            otpInput.parentElement.querySelectorAll("input:not([type=hidden]):not([type=text])").forEach((input) => {
                                input.disabled = false
                                if (input.classList[0] == "new_password") {
                                    input.focus()
                                }
                            })
                            otpInput.parentElement.addEventListener("submit", (e) => {
                                e.preventDefault()
                                validateUpdateNewPassword(e.target, sentemail)
                            })
                        }, 1000)
                    }
                    else if (data.info == "nomatch") {
                        clearOTPInput(otpInput, data.message)
                    }
                    else window.location.href = window.location.origin + parentPath
                },
                error: () => {
                    window.location.reload()
                }
            })
        }
    }
    else clearOTPInput(otpInput, "Oops! OTP has only numbers")
}

// ---- Function to open & setup Change-Password Form ---- //
const showChangePasswordForm = (sentemail) => {

    // Showing & focusing Change-Password Form
    passwordForm.classList.remove(HID)
    setTimeout(() => {
        passwordForm.querySelector(".your_otp").focus()
    }, 600)

    // Disabling the Change-Password Form
    passwordForm.querySelectorAll("input:not([type=hidden])").forEach((input) => {
        if (input.type != "text") {
            input.disabled = true
        }
        else {
            input.addEventListener("input", () => {
                OTPValidator(input, sentemail)
            })
        }
        if (input.type != "submit") {
            input.value = ""
        }
    })
    // Changing Abort button's action
    article.querySelector(".more-options .abort-button").setAttribute("href", parentPath)
    dimensionChanger()
}

// ---- Function to validate and send OTP to Admin email ---- //
const validateEmailandSendOtp = (e) => {

    // Disabling Submit button
    e.preventDefault()
    let form = e.target,
        button = form.querySelector("input[type=submit]")
    button.disabled = true
    form.classList.add("processing")

    // Creating Status Message
    let status = new Status(), millisec = 2500,
        emailInput = form.querySelector(".registered_email"), enteredemail = emailInput.value

    // Sending request through AJAX for Generating and Sending OTP to email
    $.ajax({
        type: "POST",
        url: `${parentPath}/sendotp`,
        data: {
            registeredemail: enteredemail,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        },
        success: (data) => {

            // Populating status
            status.message(data.message)
            if (data.info == "sent") {

                // Showing status
                status.show(article, true)
                setTimeout(() => {
                    form.classList.add(HID) // Hiding Email-otp Form & Activating Change Password Form
                    form.removeEventListener("submit", validateEmailandSendOtp)
                    showChangePasswordForm(enteredemail)
                }, millisec)
            }
            else {
                // Showing status as error
                status.show(article)
                if (data.info == "failed") {
                    window.location.reload()
                }
                millisec = 3500
            }
            // Clearing Email input
            emailInput.value = ""
            setTimeout(() => {
                status.remove()
                form.classList.remove("processing")
                button.disabled = false
                emailInput.focus()
            }, millisec - 500)
        },
        error: () => {
            window.location.reload()
        }
    })
}
if (hasEmail) {
    showChangePasswordForm(hasEmail)
}
else {
    // Show and Activate email-otp form
    emailOtpForm.classList.remove(HID)
    emailOtpForm.addEventListener("submit", validateEmailandSendOtp)
    dimensionChanger()
}
// --------------------------------------------------------------- //



// ------------------ OTP Validate and Password Update - Script --------------- //

// ---- Function to clear and show error, when OTP is not valid ---- //
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
const validateUpdateNewPassword = (form, emailId) => {

    // Disabling Submit button
    let button = form.querySelector("input[type=submit]")
    button.disabled = true
    form.classList.add("processing")

    // Creating Status Message
    let status = new Status(), millisec = 2000,
        confirmpassword = form.querySelector(".confirm_password"),
        newpassword = form.querySelector(".new_password")

    // Sending formdata as request through AJAX for Validating and Updating password
    $.ajax({
        type: "POST",
        url: `${parentPath}/update`,
        data: {
            newpassword: newpassword.value,
            confirmpassword: confirmpassword.value,
            email: emailId,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        },
        success: (data) => {

            // Populating status
            status.message(data.message)
            if (data.info == "updated") {

                // Showing status
                status.show(article, true)
                setTimeout(() => {
                    form.classList.remove("processing")
                    window.location.href = window.location.origin + data.url
                }, millisec)
            }
            else {
                // Showing status as error
                status.show(article)

                // Clearing Password Inputs
                confirmpassword.value = ""
                confirmpassword.focus()

                if (data.message != "Passwords doesn't match") {
                    newpassword.value = ""
                    newpassword.focus()
                }
                setTimeout(() => {
                    status.remove()
                    form.classList.remove("processing")
                    button.disabled = false
                }, millisec + 500)
            }
        },
        error: () => {
            window.location.reload()
        }
    })
}
// --------------------------------------------------------------- //