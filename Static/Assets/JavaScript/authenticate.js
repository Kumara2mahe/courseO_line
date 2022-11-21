
import Status from "./status.js"

// ------------------- Admin SignIn/SignUp - Script ---------------------------------------- //

const article = document.querySelector("article")

// ---- Function to validate Admin Credentials ---- //
const authFormValidation = (e) => {

    // Disabling Submit button
    e.preventDefault()
    let form = e.target
    let button = form.querySelector("input[type=submit]")
    button.disabled = true

    // Creating Status Message
    let status = new Status()

    let url, formData
    if (button.value == "Log In") {
        url = "/admin-login"
        formData = {
            adminname: form.querySelector(".admin_name").value,
            password: form.querySelector(".pass_word").value,
            csrfmiddlewaretoken: form.querySelector("input[name=csrfmiddlewaretoken]").value
        }
        adminAuthentication(url, formData, status, form)
    }
    else if (button.value == "Sign Up") {
        url = "/admin-signup"
        formData = {
            newadminname: form.querySelector(".admin_name").value,
            newemail: form.querySelector(".email").value,
            csrfmiddlewaretoken: form.querySelector("input[name=csrfmiddlewaretoken]").value
        }
        adminAuthentication(url, formData, status, form)
    }
    else {
        status.message("Forbidden Request: 403")
        status.show(article)
        setTimeout(() => {
            status.remove()
            window.location.reload()
        }, 2000)
    }
}

// ---- Function to Authenticate Admin using Credentials ---- //
const adminAuthentication = (tourl, formData, status, form) => {

    // Sending formdata as request through AJAX
    $.ajax({
        type: "POST",
        url: tourl,
        data: formData,
        success: (data) => {
            let whichform = form.classList[0]
            if (data.message[0] == "Success") {

                // Redirecting to the URL return
                window.location.pathname = data.message[1]
            }
            else {
                // Populating status
                status.message(data.message[0])

                if (whichform == "create" && data.message[0] != "Fields can't be empty" && data.message[0] != "UserName already exists" && data.message[0] != "Email Id already exists") {
                    // Showing status
                    status.show(article, true)
                    form.querySelectorAll("input:not([type=hidden]):not([type=submit])").forEach((input) => {
                        input.value = ""
                    })
                }
                else {
                    // Showing status
                    status.show(article)

                    if (whichform == "login") {
                        if (data.message[0] != "Password Invalid, please check") {
                            form.querySelector(".admin_name").value = ""
                        }
                        form.querySelector(".pass_word").value = ""
                    }
                    else if (data.message[0] == "Email Id already exists") {
                        form.querySelector(".email").value = ""
                    }
                    else if (data.message[0] == "UserName already exists") {
                        form.querySelector(".admin_name").value = ""
                    }
                }
                setTimeout(() => {
                    status.remove()
                    form.querySelector("input[type=submit]").disabled = false
                }, 3000)
            }
        },
        error: () => {
            window.location.reload()
        }
    })
}
const authForm = article.querySelector(".auth-menu form")
if (authForm) {
    authForm.addEventListener("submit", authFormValidation)
    setTimeout(() => {
        authForm.querySelector(".admin_name").focus()
    }, 800)
}
// ----------------------------------------------------------------------------- //


// --------------- Body Size Resizer - Script ---------------------------------------- //

// ---- Function to change body height ---- //
const dimensionChanger = () => {
    let articlePopUp = document.querySelector("article .auth-menu:not(.hide)")
    let windowHeight, popUpHeight = Number(window.getComputedStyle(articlePopUp).height.replace("px", ""))
    if (popUpHeight < (windowHeight = window.innerHeight)) {
        document.body.style.height = `${windowHeight}px`
    }
}
dimensionChanger()
window.addEventListener("resize", dimensionChanger)
// -------------------------------------------------------------------------------- //