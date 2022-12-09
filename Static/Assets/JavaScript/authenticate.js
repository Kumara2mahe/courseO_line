
import Status from "./status.js"

// ------------------- Admin SignIn/SignUp - Script ---------------------------------------- //

const article = document.querySelector("article")

// ---- Function to validate Admin Credentials ---- //
const authFormValidation = (e) => {

    // Disabling Submit button
    e.preventDefault()
    let form = e.target,
        button = form.querySelector("input[type=submit]")
    button.disabled = true

    // Creating Status Message
    let status = new Status(), formData

    if (button.value == "Log In") {
        formData = {
            adminname: form.querySelector(".admin_name").value,
            password: form.querySelector(".pass_word").value,
            csrfmiddlewaretoken: form.querySelector("input[name=csrfmiddlewaretoken]").value
        }
        adminAuthentication("/administrator/login", formData, status, form)
    }
    else if (button.value == "Sign Up") {
        formData = {
            adminname: form.querySelector(".admin_name").value,
            email: form.querySelector(".email").value,
            csrfmiddlewaretoken: form.querySelector("input[name=csrfmiddlewaretoken]").value
        }
        adminAuthentication("/administrator/signup", formData, status, form)
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
            if (data.info == "logged") {

                let nexturl = new URLSearchParams(window.location.search).get("next")
                if (!nexturl) {
                    nexturl = data.url
                }
                // Redirecting to the URL return
                window.location.href = window.location.origin + nexturl
            }
            else {
                // Populating status & clearing fields
                if (data.info == "sent") {
                    status.message(data.message)
                    status.show(article, true)
                }
                else {
                    status.message(data.message)
                    status.show(article)
                }

                form.querySelectorAll("input:not([type=hidden]):not([type=submit])").forEach((input) => {
                    input.value = ""
                })
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