
import formActivator from "./settingsActivator.js"


// Admin Settings Container
const adminSettings = document.querySelector("article.settings-page .settings-container"), view = "preview"


// ------------- Admin Interface - Changer Script ------------------------- //

// ---- Function to change the admin interface ---- //
const adminInterfaceChanger = (active) => {

    let option = active.target
    if (option.tagName != "A") {
        option = option.parentElement
    }
    let optName = option.innerText.toLowerCase()
    option.removeEventListener("click", adminInterfaceChanger)

    // Sending Interface name as request through AJAX
    $.ajax({
        type: "POST",
        url: "/administrator/settings/interface-changer",
        data: {
            interface: optName,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        success: (data) => {
            if (data.message == "Success") {

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
            else {
                window.location.reload()
            }
        },
        error: () => {
            window.location.reload()
        }
    })
}
const whichInterface = adminSettings.querySelector(".navigation-panel input.whichI").value,
    adminInterfaceOptions = adminSettings.querySelectorAll(".navigation-panel a")
adminInterfaceOptions.forEach((option) => {
    if (option.classList[0] != whichInterface) {
        option.addEventListener("click", adminInterfaceChanger)
    }
    else {
        option.classList.add(view)
        formActivator(option.innerText.toLowerCase(), null)
    }
})
// ------------------------------------------------------------------- //