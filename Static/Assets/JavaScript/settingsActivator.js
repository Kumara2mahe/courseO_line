
import Status from "./status.js"


// ------------- Admin-Settings Form - Activator Script ----------------------- //

const defaultAddLabels = [], defaultUpdateLabels = [], defaultBoxValues = [],
    allowedFiles = ["png", "jpeg", "jpg"], parentPath = window.location.pathname

const adminSettingsActivator = (settingname, preSetting) => {

    let settingForm = document.querySelector(`.settings-container form.${settingname}`)
    if (settingForm && (preSetting == null || deactivateSetting(preSetting))) {
        if (settingForm.classList[0] == "add") {

            // Clear & Upload-Image buttons
            resetAddForm(null, settingForm)
            settingForm.querySelector(".clear-button").addEventListener("click", resetAddForm)
            settingForm.querySelector(".image_upload_btn").addEventListener("click", triggerFileUpload)

            // Pdf & Form
            let checkbox = settingForm.querySelector(".show_pdf")
            checkbox.addEventListener("change", togglePdfUpload)
            settingForm.addEventListener("submit", addNewCourse)
        }
        else {
            // Collecting the default SelectBox values
            if (defaultBoxValues.length == 0) {
                settingForm.querySelectorAll("select .placeholder").forEach((box) => {
                    defaultBoxValues.push(box.value)
                })
            }
            if (settingForm.classList[0] == "update") {
                resetUpdateForm(settingForm)
            }
            else {
                resetSelectBox(settingForm)
                settingForm.querySelector("input[type=submit]").disabled = true
            }
            // Activating the Category SelectBox
            settingForm.querySelector(".course_category").addEventListener("change", optionPopulator)
        }
        // Showing the concurrent form
        settingForm.classList.add("preview")
    }
    else {
        window.location.reload()
    }
}
// ----------------------------------------------------------------------- //


// ------------------ Form Deactivator - Script ----------------------------- //
const deactivateSetting = (name) => {

    let form = document.querySelector(`.settings-container form.${name}`)
    if (form) {
        if (name == "add") {
            form.querySelector(".clear-button").removeEventListener("click", resetAddForm)
            form.querySelector(".image_upload_btn").removeEventListener("click", triggerFileUpload)
            form.querySelector(".show_pdf").removeEventListener("change", togglePdfUpload)
            form.querySelector(".pdf_upload_btn").removeEventListener("click", triggerFileUpload)
            form.removeEventListener("submit", addNewCourse)
        }
        else {
            form.querySelector(".course_category").removeEventListener("change", optionPopulator)
            form.querySelector(".course_name").removeEventListener("change", activateCourseModification)
            if (name == "update") {
                form.querySelector(".pdf_upload_btn").removeEventListener("click", triggerFileUpload)
                form.removeEventListener("submit", updateOldCourse)
            }
            else if (name == "delete") {
                form.removeEventListener("submit", deleteOldCourse)
            }
        }
        return true
    }
    return
}
// ----------------------------------------------------------------------- //


// ---------------- Form Submitting - Scripts -------------------------------- //

// ---- Function to validate and submit Add Form ---- //
const addNewCourse = (event) => {

    // Disabling Submit button
    event.preventDefault()
    let form = event.target,
        button = form.querySelector("input[type=submit]")
    button.disabled = true
    form.classList.add("processing")

    // Creating Status Message and collecting formdata
    let status = new Status(), formData = new FormData(form)

    // Sending the formdata as request through AJAX
    $.ajax({
        type: "POST",
        url: `${parentPath}add-course`,
        enctype: "multipart/form-data",
        data: formData,
        contentType: false,
        processData: false,
        success: (data) => {

            // Populating status
            status.message(data.message)
            if (data.info == "added") {

                // Clearing form & showing status
                resetAddForm(null, form)
                status.show("article", true)
            }
            else {
                // Showing status
                status.show("article")

                let exceptions = []
                if (data.info == "exists") {
                    exceptions.push(form.querySelector(".course_category"))
                }
                else if (data.info == "noimage") {
                    exceptions.push(form.querySelector(".course_title"), form.querySelector(".course_category"))
                }
                resetAddForm(null, form, ...exceptions)
            }
            setTimeout(() => {
                status.remove()
                button.disabled = false
                form.classList.remove("processing")
            }, 3000)
        },
        error: pageReload
    })
}

// ---- Function to validate and submit Update Form ---- //
const updateOldCourse = (event) => {

    // Preventing defaults
    event.preventDefault()
    let form = event.target,
        button = form.querySelector("input[type=submit]")
    form.classList.add("processing")

    // Creating Status Message and collecting formdata
    let status = new Status(), formData = new FormData(form), disablebtn = false

    // Sending the formdata as request through AJAX
    $.ajax({
        type: "POST",
        url: `${parentPath}update-course`,
        enctype: "multipart/form-data",
        data: formData,
        contentType: false,
        processData: false,
        success: (data) => {

            // Populating status
            status.message(data.message)
            if (data.info == "empty") {

                // Clearing form edit section & showing status
                resetUpdateForm(form, true, form.querySelector(".course_name"))
                status.show("article")
            }
            else if (data.info == "invalidlink") {

                // Showing status
                status.show("article")
                form.querySelector(".course_link").value = ""
            }
            else {
                // Clearing form & showing status
                status.show("article", data.info == "updated")
                resetUpdateForm(form)
                disablebtn = true
                form.removeEventListener("submit", updateOldCourse)
            }
            button.disabled = true
            setTimeout(() => {
                status.remove()
                button.disabled = disablebtn
                form.classList.remove("processing")
            }, 3000)
        },
        error: pageReload
    })
}

// ---- Function to validate and submit Delete Form ---- //
const deleteOldCourse = (event) => {

    // Preventing defaults
    event.preventDefault()
    let form = event.target,
        button = form.querySelector("input[type=submit]")
    button.disabled = true
    form.classList.add("processing")

    // Creating Status Message
    let status = new Status()

    // Sending the formdata as request through AJAX
    $.ajax({
        type: "POST",
        url: `${parentPath}delete-course`,
        enctype: "multipart/form-data",
        data: {
            coursecategory: form.querySelector(".course_category").value,
            coursename: form.querySelector(".course_name").value,
            csrfmiddlewaretoken: form.querySelector("input[name=csrfmiddlewaretoken]").value,
        },
        success: (data) => {

            // Clearing form & showing status
            resetUpdateForm(form)
            status.message(data.message)
            status.show("article", data.info == "deleted")

            setTimeout(() => {
                status.remove()
                form.querySelector(".course_name").removeEventListener("change", activateCourseModification)
                form.removeEventListener("submit", deleteOldCourse)
                form.classList.remove("processing")
            }, 3000)
        },
        error: pageReload
    })
}
// ------------------------------------------------------------------------ //


// --------------- SelectBox value - Picker Script ------------------------- //

// ---- Function to change the color of picked value ---- //
const highlightSelected = (box, defaultBoxValue) => {
    if (box.value != defaultBoxValue) {
        box.classList.add("choosen")
    }
    else {
        box.classList.remove("choosen")
    }
}

// ----- Function to update the select box values ---- //
const optionPopulator = (event, selectBox, fieldname = "course_name") => {

    let formData = { csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(), }
    if (event) {
        // Highlighting & Disabling selected value
        selectBox = event.target
        highlightSelected(selectBox, defaultBoxValues[0])
        formData["category"] = selectBox.value
    }
    selectBox.disabled = true

    // Sending request through AJAX
    $.ajax({
        type: "POST",
        url: `${parentPath}collect-course`,
        data: formData,
        success: (data) => {
            if (data.titles && data.titles.length > 0) {

                // Removing the old options
                let courseBox = selectBox.parentElement.querySelector(`.${fieldname}`),
                    oldOptions = courseBox.querySelectorAll("option:not(.placeholder)")
                if (oldOptions.length > 0) {
                    oldOptions.forEach((title) => { title.remove() })
                }
                // Filling the new option in the Selectbox
                data.titles.forEach((title) => {
                    let newoption = document.createElement("option")
                    newoption.value = newoption.innerHTML = title
                    courseBox.append(newoption)
                })
                selectBox.disabled = false
                if (event) {
                    // Resetting Form except Category Selectbox
                    resetUpdateForm(selectBox.parentElement, true)

                    // Enabling course box
                    courseBox.disabled = false
                    courseBox.addEventListener("change", activateCourseModification)
                }
            }
            else {
                // Creating Status Message
                let status = new Status(), msgs = ["Oops! Something went wrong try again",
                    `No Course available to ${selectBox.parentElement.classList[0]}, why can't you add one.`]

                // Populating and Showing the Status message
                status.message(event ? msgs[0] : msgs[1])
                status.show("article")
                setTimeout(() => {
                    status.remove()
                    if (event) window.location.reload()
                }, 3000)
            }
        },
        error: pageReload
    })
}
// ------------------------------------------------------------------- //


// -------------- Form Values - Resetter Scripts ----------------------- //

// ---- Function to reset Upload button labels ---- //
const resetUploadLabels = (defaultLabels, form, rgbcolor) => {
    if (defaultLabels.length == 0) {
        form.querySelectorAll(".file-container label").forEach((label) => {
            let labelColor = window.getComputedStyle(label).color
            defaultLabels.push({
                text: label.innerHTML,
                color: rgbcolor || labelColor,
                defaultColor: labelColor
            })
            label.style.color = rgbcolor || labelColor
        })
    }
    else {
        form.querySelectorAll(".file-container label").forEach((label, index) => {
            label.innerHTML = defaultLabels[index].text
            label.style.color = defaultLabels[index].color
        })
    }
}

// ---- Function to reset Add Form ---- //
const resetAddForm = (event, form = null, ...except) => {
    if (event) {
        form = event.target.parentElement.parentElement
    }
    // Hiding Pdf Material
    let checkbox = form.querySelector(".show_pdf")
    if (except.length == 0 && checkbox.checked) {
        checkbox.click()
    }
    let inputFields = form.querySelectorAll("input:not([type=button]):not([type=submit]):not([type=hidden])")
    inputFields.forEach((input) => {
        if (!except.includes(input)) {
            input.value = ""
        }
    })
    // Resetting labels
    resetUploadLabels(defaultAddLabels, form)
}

// ---- Function to reset Update Form ---- //
const resetUpdateForm = (form, onlyEdit = false, ...except) => {

    // Inputs
    form.querySelectorAll("input").forEach((input) => {
        if (input.type == "text" || input.type == "file") {
            input.value = ""
        }
        if (except.length == 0) {
            input.disabled = true
        }
        else {
            input.disabled = false
        }
    })
    // Select-Boxes and Labels
    resetUploadLabels(defaultUpdateLabels, form, "rgba(0, 18, 25, 0.35)")
    if (except.length == 0) {
        resetSelectBox(form, onlyEdit)
    }
    else if (onlyEdit) {
        form.querySelectorAll(".file-container label").forEach((label, index) => {
            label.style.color = defaultUpdateLabels[index].defaultColor
        })
    }
}

// ---- Function to reset Select Boxes ---- //
const resetSelectBox = (form, onlycourse = false) => {
    form.querySelectorAll("select").forEach((box, index) => {

        if (onlycourse && box.classList[0] == "course_name" || onlycourse == false) {
            if (onlycourse == false && box.classList[0] == "course_name") {
                box.disabled = true
            }
            else if (onlycourse == false) {
                optionPopulator(null, box, box.classList[0])
            }
            // Resetting the Selectbox value
            highlightSelected(box, box.value = defaultBoxValues[index])
        }
    })
}
// ----------------------------------------------------------------- //


// ------------------ Course Edit - Activate Script ----------------- //
const activateCourseModification = (event) => {

    // Highlighting Selected Course
    let courseBox = event.target
    highlightSelected(courseBox, defaultBoxValues[1])

    // Resetting Form except Category Selectbox & Labels
    let form = courseBox.parentElement
    if (form.classList[0] == "update") {
        resetUpdateForm(form, true, form.querySelector(".course_name"))
        form.querySelector(".pdf_upload_btn").addEventListener("click", triggerFileUpload)
        form.addEventListener("submit", updateOldCourse)
    }
    else {
        form.querySelector("input[type=submit]").disabled = false
        form.addEventListener("submit", deleteOldCourse)
    }
}
// ------------------------------------------------------------ //

// ------------------ Pdf Uploader - Show/Hide Script ------------------- //
const togglePdfUpload = (event) => {
    let checkbox = event.target
    checkbox.disabled = true

    // Activating the Upload-Pdf button
    let pdfMaterial = checkbox.parentElement.parentElement.querySelector(".file-container.pdf")
    pdfMaterial.querySelector(".pdf_upload_btn").addEventListener("click", triggerFileUpload)

    setTimeout(() => {
        checkbox.disabled = false
        checkbox.checked ? pdfMaterial.classList.add("show") : pdfMaterial.classList.remove("show")
    }, 200)
}
// ------------------------------------------------------------------- //


// ------------------ File Uploader - Script ------------------------- //

const triggerFileUpload = (event) => {

    // ---- Function to validate and upload file ---- //
    const fileUploader = () => {
        fileField.removeEventListener("change", fileUploader)
        let filetype = fileField.parentElement.classList[1].toLowerCase()

        // Separating file name from path
        let filename = fileField.value.split("\\")
        filename = filename[filename.length - 1].toLowerCase()

        // Separating extention from file name
        let extension = filename.split(".")
        extension = extension[extension.length - 1]
        if (filetype == "image" && allowedFiles.includes(extension) || filetype == extension) {
            fileField.nextElementSibling.innerHTML = `&ensp;${filename}`
            fileField.nextElementSibling.style.color = "#000000"
        }
        else {
            // Creating & Showing Status Message
            let status = new Status()
            status.message(`Only ${filetype} files are allowed`)
            status.show("article")

            // Disabling and Enabling the upload button
            fileField.previousElementSibling.disabled = true
            fileField.value = ""
            setTimeout(() => {
                status.remove()
                fileField.previousElementSibling.disabled = false
            }, 3000)
        }
    }
    let fileField = event.target.nextElementSibling
    fileField.click()
    fileField.addEventListener("change", fileUploader)
}
// ----------------------------------------------------------------- //


// ----------------- Page Reloader - Script ---------------------- //
const pageReload = (millisec = 100) => {
    setTimeout(() => {
        window.location.reload()
    }, millisec)
}
// ----------------------------------------------------------- //



export default adminSettingsActivator