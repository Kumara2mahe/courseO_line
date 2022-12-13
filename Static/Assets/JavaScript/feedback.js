
import Status from "./status.js"

// -------------- Send Feedback to Mail - Script ---------------- //

// ---- Function to send user feedback to backend ---- //
const sendFeedBack = (e) => {
    e.preventDefault()

    // Collecting fields values and Disabling it
    let form = e.target, formdata = new FormData(form),
        fields = feedbackForm.querySelectorAll(".field")
    fields.forEach((element) => {
        element.disabled = true
    })
    form.classList.add("processing")

    // Creating Status Message
    let status = new Status(), info, millisec
    $.ajax({
        type: "POST",
        url: "/contact",
        data: formdata,
        contentType: false,
        processData: false,
        success: (data) => {

            // Populating & Showing status
            status.message(data.message)
            millisec = status.show("article", info = (data.info == "sent"), 2500)
            setTimeout(() => {
                status.remove()
                fields.forEach((element) => {
                    if (info && element.type != "submit") {
                        element.value = ""
                    }
                    element.disabled = false
                })
                form.classList.remove("processing")
            }, millisec)
        },
        error: () => {
            window.location.reload()
        }
    })
}
const feedbackForm = document.querySelector(".contact-page .feedback-container .contact-form")
feedbackForm.addEventListener("submit", sendFeedBack)
// --------------------------------------------------------- //