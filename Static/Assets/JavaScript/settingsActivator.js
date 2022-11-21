
import Status from "./status.js"


// ------------- Admin-Settings Form - Activator Script ----------------------- //

const defaultAddLabels = [], defaultUpdateLabels = [], defaultBoxValues = [], allowedFiles = ["png", "jpeg", "jpg"]
const adminSettingsActivator = (settingname, preSetting) => {

    let settingForm = document.querySelector(`.settings-container form.${settingname.toLowerCase()}`)
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
            settingForm.querySelector(".course_category").addEventListener("change", coursePicker)
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
            form.querySelector(".course_category").removeEventListener("change", coursePicker)
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
    let form = event.target
    let button = form.querySelector("input[type=submit]")
    button.disabled = true

    // Creating Status Message
    let status = new Status()

    // Collecting the submmited form data
    let formData = new FormData(form)

    let uniqueKeys = ["csrfmiddlewaretoken", "newcoursetitle", "newcoursecategory", "newcoursecategoryimage", "newcourselink", "newcoursepdf"]
    let newFormData = new FormData, count = 0
    formData.forEach((value) => {
        newFormData.set(uniqueKeys[count], value)
        count++
    })
    newFormData.append("whichform", button.value)

    // Sending the formdata as request through AJAX
    $.ajax({
        type: "POST",
        url: "/admin-settings",
        enctype: "multipart/form-data",
        data: newFormData,
        contentType: false,
        processData: false,
        success: (data) => {

            // Populating status
            status.message(data.message[0])
            if (data.message[0] == "Course Added Successfully") {

                // Clearing form & showing status
                resetAddForm(null, form)
                status.show("article", true)
            }
            else {
                // Showing status
                status.show("article")

                let exceptions = []
                if (data.message[0] == "Sorry! Course Already Available") {
                    exceptions.push(form.querySelector(".course_category"))
                }
                else if (data.message[0] == "You forgot to add Category Image") {
                    exceptions.push(form.querySelector(".course_title"), form.querySelector(".course_category"))
                }
                resetAddForm(null, form, ...exceptions)
            }
            setTimeout(() => {
                status.remove()
                button.disabled = false
            }, 3000)
        },
        error: pageReload
    })
}

// ---- Function to validate and submit Update Form ---- //
const updateOldCourse = (event) => {

    // Preventing defaults
    event.preventDefault()
    let form = event.target
    let button = form.querySelector("input[type=submit]")

    // Creating Status Message
    let status = new Status(), disablebtn = false

    // Collecting the submmited form data
    let formData = new FormData(form)

    let uniqueKeys = ["csrfmiddlewaretoken", "updatecoursecategory", "updatecoursename", "updatecoursetitle", "updatecourselink", "updatecoursepdf"]
    let newFormData = new FormData, count = 0
    formData.forEach((value) => {
        newFormData.set(uniqueKeys[count], value)
        count++
    })
    newFormData.append("whichform", button.value)

    // Sending the formdata as request through AJAX
    $.ajax({
        type: "POST",
        url: "/admin-settings",
        enctype: "multipart/form-data",
        data: newFormData,
        contentType: false,
        processData: false,
        success: (data) => {

            // Populating status
            status.message(data.message[0])
            if (data.message[0] == "Fields can't be empty") {

                // Clearing form edit section & showing status
                resetUpdateForm(form, true, form.querySelector(".course_name"))
                status.show("article")
            }
            else if (data.message[0] == "Please, enter a valid Youtube Link") {

                // Showing status
                status.show("article")
                form.querySelector(".course_link").value = ""
            }
            else {
                // Clearing form & showing status
                status.show("article", true)
                resetUpdateForm(form)
                disablebtn = true
                form.removeEventListener("submit", updateOldCourse)
            }
            button.disabled = true
            setTimeout(() => {
                status.remove()
                button.disabled = disablebtn
            }, 3000)
        },
        error: pageReload
    })
}

// ---- Function to validate and submit Delete Form ---- //
const deleteOldCourse = (event) => {

    // Preventing defaults
    event.preventDefault()
    let form = event.target
    let button = form.querySelector("input[type=submit]")
    button.disabled = true

    // Creating Status Message
    let status = new Status()

    // Collecting the submmited form data
    let formData = new FormData(form)

    let uniqueKeys = ["csrfmiddlewaretoken", "deletecoursecategory", "deletecoursename"]
    let newFormData = new FormData, count = 0
    formData.forEach((value) => {
        newFormData.set(uniqueKeys[count], value)
        count++
    })
    newFormData.append("whichform", button.value)

    // Sending the formdata as request through AJAX
    $.ajax({
        type: "POST",
        url: "/admin-settings",
        enctype: "multipart/form-data",
        data: {
            whichform: button.value,
            deletecoursecategory: form.querySelector(".course_category").value,
            deletecoursename: form.querySelector(".course_name").value,
            csrfmiddlewaretoken: form.querySelector("input[name=csrfmiddlewaretoken]").value,
        },
        success: (data) => {

            // Clearing form & showing status
            resetUpdateForm(form)
            status.message(data.message[0])
            status.show("article", true)

            setTimeout(() => {
                status.remove()
                form.querySelector(".course_name").removeEventListener("change", activateCourseModification)
                form.removeEventListener("submit", deleteOldCourse)
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

// ----- Function to collect the course names under the picked Category ---- //
const coursePicker = (event) => {

    // Disabling & Highlighting selected value
    let selectBox = event.target
    selectBox.disabled = true
    highlightSelected(selectBox, defaultBoxValues[0])

    let formData, whichform = $(".navigation-panel a.preview span").text()
    if (whichform == "Update") {
        formData = {
            whichform: whichform,
            updatecoursecategory: selectBox.value,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        }
    }
    else {
        formData = {
            whichform: whichform,
            deletecoursecategory: selectBox.value,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        }
    }

    // Sending Category name as request through AJAX
    $.ajax({
        type: "POST",
        url: "/admin-settings/update-courses",
        data: formData,
        success: (data) => {
            if (data.message[0] && data.message[1] && data.message[1].length > 0) {

                // Removing the old titles
                let courseBox = selectBox.parentElement.querySelector(".course_name")
                let courseTitles = courseBox.querySelectorAll("option:not(.placeholder)")
                if (courseTitles.length > 0) {
                    courseTitles.forEach((title) => {
                        title.remove()
                    })
                }
                // Resetting Form except Category Selectbox
                resetUpdateForm(selectBox.parentElement, true)

                // Filling the Title Selectbox with new titles
                data.message[1].forEach((title) => {
                    let newoption = document.createElement("option")
                    newoption.value = newoption.innerHTML = title
                    courseBox.append(newoption)
                })

                // Enabling both Selectboxes
                selectBox.disabled = false
                courseBox.disabled = false
                courseBox.addEventListener("change", activateCourseModification)
            }
            else {
                // Resetting the Selectbox value
                highlightSelected(selectBox, selectBox.value = defaultBoxValues[0])

                // Creating Status Message
                let status = new Status()

                // Populating and Showing the Status message
                status.message("Oops! Something went wrong try again")
                status.show("article")
                setTimeout(() => {
                    status.remove()
                    selectBox.disabled = false
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

        // Creating Status Message
        let status = new Status()

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
            // Showing the error status
            status.message(`Only ${filetype} files are allowed`)
            status.show("article")

            // Disabling and Enabling the upload button
            fileField.previousElementSibling.disabled = true
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