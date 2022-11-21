
import formActivator from "./settingsActivator.js"


// Admin Settings Container
const adminSettings = document.querySelector("article.settings-page .settings-container")
const view = "preview"


// ------------- Admin Interface - Changer Script ------------------------- //

// ---- Function to change the admin interface ---- //
const adminInterfaceChanger = (active) => {

    let option = active.target
    if (option.tagName != "A") {
        option = option.parentElement
    }
    let optName = option.innerText
    option.removeEventListener("click", adminInterfaceChanger)

    // Sending Interface name as request through AJAX
    $.ajax({
        type: "POST",
        url: "/admin-settings/interface-changer",
        data: {
            whichform: optName,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        success: (data) => {
            if (data.message[0] == "Success") {

                // Changing Focus to selected option
                let previousoption = adminSettings.querySelector(`.navigation-panel a.${view}`)
                previousoption.classList.remove(view)
                previousoption.addEventListener("click", adminInterfaceChanger)
                option.classList.add(view)

                // Hiding and Showing the concurrent form
                let previousForm = adminSettings.querySelector(".setting-details form.preview")
                previousForm.classList.remove(view)
                formActivator(optName, previousoption.innerText.toLowerCase())
            }
        },
        error: () => {
            window.location.reload()
        }
    })
}
const adminInterfaceOptions = adminSettings.querySelectorAll(".navigation-panel a")
adminInterfaceOptions.forEach((option) => {
    if (option.classList[1] != view) {
        option.addEventListener("click", adminInterfaceChanger)
    }
    else {
        formActivator(option.innerText, null)
    }
})
// ------------------------------------------------------------------- //