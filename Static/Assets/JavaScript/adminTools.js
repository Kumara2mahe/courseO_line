// ------------------------------------------- JavaScript for CourseO_line - Admin Tools ---------------------------------------- //





// Function for Showing and Hiding ---------------------------------------( Admin Tools Dropdown )------------------------------------------ //

const showAdminTools = () => {

    // Function for loading the correct functions related to the buttons text ---------------------------------- //
    const loadAdminpages = (active) => {

        let button = active.target

        setTimeout(() => {

            // Redirecting to Admin-Settings function
            if (button.innerHTML == "Settings") {
                window.location.pathname = "/admin-settings"
            }

            // Redirecting to Admin-SignUp function
            if (button.innerHTML == "Create Admin") {
                window.location.pathname = "/admin-signup"
            }

            // Redirecting to Admin-logout function
            if (button.innerHTML == "log out") {
                window.location.pathname = "/admin-logout"
            }

        }, 1000)
    }
    // ----------------------------------------------------------------------------------------------------- //


    setTimeout(() => {

        // Getting the 'li' elements inside admin-tools
        let links = toolsElement.nextElementSibling.querySelectorAll("li")

        // Showing the Admin Tools
        if (toolsElement.nextElementSibling.classList[1] == "hide") {

            toolsElement.nextElementSibling.classList.remove("hide")
            //
            links.forEach((link) => {
                link.classList.remove("hide")
            })

            // Adding the 'li' tags with concurrent functions
            links[0].addEventListener("click", loadAdminpages)
            links[1].addEventListener("click", loadAdminpages)
            links[2].addEventListener("click", loadAdminpages)

            // Hiding the dropdown after 4 seconds
            window.addEventListener("click", () => {

                if (toolsElement.nextElementSibling.classList[1] != "hide") {
                    setTimeout(() => {

                        toolsElement.nextElementSibling.classList.add("hide")
                        //
                        links.forEach((link) => {
                            link.classList.add("hide")
                        })
                    }, 1000)
                }
            })
        }

        // Hiding the Admin Tools
        else {
            toolsElement.nextElementSibling.classList.add("hide")
            //
            links.forEach((link) => {
                link.classList.add("hide")
            })
        }

    }, 500)

}

// Getting the Tools element from the NavBar
const toolsElement = document.querySelector(".navigation-bar .nav-wrapper .page-options .tools")
//
if (toolsElement != null) {
    toolsElement.addEventListener("click", showAdminTools)
}
// ----------------------------------------------------------------------------------------------------------------------------------------- //



// Function for toggling -----------------------------------------------------( Admin's Interface )------------------------------------------ //

const adminInterfaceChanger = (active) => {

    let button = active.target

    if (button.classList[0] == "addcourse") {

        // Adding the click function and Removing the focus from the current focused sibling
        if (button.nextElementSibling.classList[1] == "active") {

            button.nextElementSibling.classList.remove("active")
            button.nextElementSibling.addEventListener("click", adminInterfaceChanger)
        }
        if (button.nextElementSibling.nextElementSibling.classList[1] == "active") {

            button.nextElementSibling.nextElementSibling.classList.remove("active")
            button.nextElementSibling.nextElementSibling.addEventListener("click", adminInterfaceChanger)
        }

        // Sending the form name as value to python function
        document.querySelector(".which_form").value = "Add"

        $.ajax({
            type: "POST",
            url: "/admin-settings/interface-changer",
            data: {
                whichform: $(".which_form").val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {

                if (data.message[0] == "Success") {

                    // Removing the click function and Showing the focus on it
                    button.classList.add("active")
                    button.removeEventListener("click", adminInterfaceChanger)

                    // Getting the form concurrent to the interface button
                    let addForm = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .add_course_form")

                    // Hiding the visible form
                    if (addForm.nextElementSibling.classList[1] == "active") {

                        addForm.nextElementSibling.classList.remove("active")
                    }
                    if (addForm.nextElementSibling.nextElementSibling.classList[1] == "active") {

                        addForm.nextElementSibling.nextElementSibling.classList.remove("active")
                    }

                    // Showing the AddForm
                    addForm.classList.add("active")

                    // Reloading the page to load the changes
                    window.location.reload()
                }

            }
        })
    }

    if (button.classList[0] == "updatecourse") {

        // Adding the click function and Removing the focus from the current focused sibling
        if (button.previousElementSibling.classList[1] == "active") {

            button.previousElementSibling.classList.remove("active")
            button.previousElementSibling.addEventListener("click", adminInterfaceChanger)
        }
        if (button.nextElementSibling.classList[1] == "active") {

            button.nextElementSibling.classList.remove("active")
            button.nextElementSibling.addEventListener("click", adminInterfaceChanger)
        }

        // Sending the form name as value to python function
        document.querySelector(".which_form").value = "Update"

        $.ajax({
            type: "POST",
            url: "/admin-settings/interface-changer",
            data: {
                whichform: $(".which_form").val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {

                if (data.message[0] == "Success") {

                    // Removing the click function and Showing the focus on it
                    button.classList.add("active")
                    button.removeEventListener("click", adminInterfaceChanger)

                    // Getting the form concurrent to the interface button
                    let updateForm = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .update_course_form")

                    // Hiding the visible form
                    if (updateForm.previousElementSibling.classList[1] == "active") {

                        updateForm.previousElementSibling.classList.remove("active")
                    }
                    if (updateForm.nextElementSibling.classList[1] == "active") {

                        updateForm.nextElementSibling.classList.remove("active")
                    }

                    // Showing the UpdateForm
                    updateForm.classList.add("active")

                    // Reloading the page to load the changes
                    window.location.reload()
                }

            }
        })
    }

    if (button.classList[0] == "deletecourse") {

        // Adding the click function and Removing the focus from the current focused sibling
        if (button.previousElementSibling.previousElementSibling.classList[1] == "active") {

            button.previousElementSibling.previousElementSibling.classList.remove("active")
            button.previousElementSibling.previousElementSibling.addEventListener("click", adminInterfaceChanger)
        }
        if (button.previousElementSibling.classList[1] == "active") {

            button.previousElementSibling.classList.remove("active")
            button.previousElementSibling.addEventListener("click", adminInterfaceChanger)
        }

        // Sending the form name as value to python function
        document.querySelector(".which_form").value = "Delete"

        $.ajax({
            type: "POST",
            url: "/admin-settings/interface-changer",
            data: {
                whichform: $(".which_form").val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {

                if (data.message[0] == "Success") {

                    // Removing the click function and Showing the focus on it
                    button.classList.add("active")
                    button.removeEventListener("click", adminInterfaceChanger)

                    // Getting the form concurrent to the interface button
                    let deleteForm = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .delete_course_form")

                    // Hiding the visible form
                    if (deleteForm.previousElementSibling.previousElementSibling.classList[1] == "active") {

                        deleteForm.previousElementSibling.previousElementSibling.classList.remove("active")
                    }
                    if (deleteForm.previousElementSibling.classList[1] == "active") {

                        deleteForm.previousElementSibling.classList.remove("active")
                    }

                    // Showing the DeleteForm
                    deleteForm.classList.add("active")

                    // Reloading the page to load the changes
                    window.location.reload()
                }

            }
        })
    }
}

// Getting the Admin Interface Elements
const adminInterfaceElements = document.querySelectorAll(".settings-page .admin-interface-container .admin-interface .admin-interface-wrapper a")
//
if (adminInterfaceElements != null) {

    adminInterfaceElements.forEach((button) => {

        if (button.classList[1] != "active") {
            button.addEventListener("click", adminInterfaceChanger)
        }
    })
}
// ----------------------------------------------------------------------------------------------------------------------------------------- //



// Function for submiting the data to the database and belongs to ----------------- ( Add Course Form )----------------------------------- //

const addingNewCourse = (page) => {

    // Preventing the page from reloading
    page.preventDefault()

    // Getting the element of popup message
    let popUpMsg = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .add_course_form .popup-message")

    // Disabling the submit button after clicked
    let button = addCourseForm.querySelector(".add_course_buttons .new_add_button")
    button.disabled = true

    // Checking the button is the correct one
    if (button.value == "Add") {

        // Sending the form name as value to python function
        addCourseForm.previousElementSibling.querySelector(".which_form").value = "Add"

        // Getting the form's input value and sending it to through AJAX
        var addFormData = new FormData(addCourseForm)
        addFormData.append("whichform", $(".which_form").val())

        $.ajax({
            type: "POST",
            url: "/admin-settings",
            enctype: "multipart/form-data",
            data: addFormData,
            contentType: false,
            processData: false,
            success: function (data) {

                if (data.message[0] == "Course Added Successfully") {

                    // Showing the success status on the popup message
                    popUpMsg.innerHTML = `${data.message[0]}`
                    popUpMsg.style.color = "rgb(22, 100, 43)"
                    popUpMsg.classList.toggle("hide")

                    // Deleting the values of the form
                    addCourseForm.querySelector(".new_course_title").value = ""
                    addCourseForm.querySelector(".new_course_category").value = ""
                    addCourseForm.querySelector(".new_course_category_image").value = ""
                    addCourseForm.querySelector(".new_course_link").value = ""
                    addCourseForm.querySelector(".new_course_pdf").value = ""

                    // Reseting the text visible on files pickers
                    let imageText = addCourseForm.querySelector(".new_course_category_image").nextElementSibling
                    imageText.innerHTML = "&ensp;a Category Image"
                    imageText.style.color = "rgba(0, 18, 25, 0.6)"
                    let pdfText = addCourseForm.querySelector(".new_course_pdf").nextElementSibling
                    pdfText.innerHTML = "&ensp;a Pdf Course Material"
                    pdfText.style.color = "rgba(0, 18, 25, 0.6)"

                    // Hiding the error message after 3 seconds
                    setTimeout(() => {

                        popUpMsg.classList.toggle("hide")
                        button.disabled = false
                    }, 3000)
                }
                else {

                    // Showing the error status on the popup message
                    popUpMsg.innerHTML = `${data.message[0]}`
                    popUpMsg.style.color = "rgba(252, 25, 25, 0.8)"
                    popUpMsg.classList.toggle("hide")

                    if (data.message[0] == "Sorry! Course Already Available") {

                        // Deleting the values of the form except category
                        addCourseForm.querySelector(".new_course_title").value = ""
                        addCourseForm.querySelector(".new_course_category_image").value = ""
                        addCourseForm.querySelector(".new_course_link").value = ""
                        addCourseForm.querySelector(".new_course_pdf").value = ""
                    }
                    if (data.message[0] == "You forgot to add Category Image") {

                        // Deleting the values of the form except category
                        addCourseForm.querySelector(".new_course_category_image").value = ""
                        addCourseForm.querySelector(".new_course_link").value = ""
                        addCourseForm.querySelector(".new_course_pdf").value = ""
                    }
                    else {
                        // Deleting the value of the form
                        addCourseForm.querySelector(".new_course_title").value = ""
                        addCourseForm.querySelector(".new_course_category").value = ""
                        addCourseForm.querySelector(".new_course_category_image").value = ""
                        addCourseForm.querySelector(".new_course_link").value = ""
                        addCourseForm.querySelector(".new_course_pdf").value = ""
                    }
                    // Reseting the text visible on files pickers
                    let imageText = addCourseForm.querySelector(".new_course_category_image").nextElementSibling
                    imageText.innerHTML = "&ensp;a Category Image"
                    imageText.style.color = "rgba(0, 18, 25, 0.6)"
                    let pdfText = addCourseForm.querySelector(".new_course_pdf").nextElementSibling
                    pdfText.innerHTML = "&ensp;a Pdf Course Material"
                    pdfText.style.color = "rgba(0, 18, 25, 0.6)"

                    // Hiding the error message after 3 seconds
                    setTimeout(() => {

                        popUpMsg.classList.toggle("hide")
                        button.disabled = false
                    }, 3000)
                }

            }
        })
    }
}
// ---------------------------------------------------------------------------- //


// Function for opening a file upload dialog box for pdf only ------------------------------------------------- //
const addCoursePdfUploader = () => {

    // Function for uploading Pdf
    const pdfUploader = () => {

        // Removing the Function associated with 'pdfPicker'
        pdfPicker.removeEventListener("change", pdfUploader)

        // Getting the element of popup message
        let popUpMsg = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .add_course_form .popup-message")

        // Getting only the extension from the selected 
        let extension = (pdfPicker.value).split(".")[1].toLowerCase()


        if (extension == "pdf") {

            // Getting only the file name with extension from the pdf path
            let fileName = (pdfPicker.value).split("\\")[2]
            pdfPicker.nextElementSibling.innerHTML = `&ensp;${fileName}`
            pdfPicker.nextElementSibling.style.color = "black"
        }
        else {
            pdfPicker.previousElementSibling.disabled = true

            // Showing the error on popup message
            popUpMsg.innerHTML = "Only pdf files are allowed"
            popUpMsg.style.color = "rgba(252, 25, 25, 0.8)"
            popUpMsg.classList.remove("hide")

            // Reseting the values
            pdfPicker.value = ""
            pdfPicker.nextElementSibling.innerHTML = "&ensp;a Pdf Course Material"
            pdfPicker.nextElementSibling.style.color = "rgba(0, 18, 25, 0.6)"

            setTimeout(() => {
                if (popUpMsg.classList[1] != "hide") {

                    // Hiding the error popup message
                    popUpMsg.classList.add("hide")
                    pdfPicker.previousElementSibling.disabled = false
                }
            }, 3000)
        }
    }

    // Getting the File Input Element
    const pdfPicker = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .add_course_form .new_pdf_container .new_course_pdf")

    // Triggering the File Picker Dialog box
    pdfPicker.click()
    pdfPicker.addEventListener("change", pdfUploader)
}
// ---------------------------------------------------------------------------- //


// Function for opening a file upload dialog box for image ------------------------------------------------- //
const addCourseImageUploader = () => {

    // Function for uploading Image
    const imageUploader = () => {

        // Removing the Function associated with 'imagePicker'
        imagePicker.removeEventListener("change", imageUploader)

        // Getting the element of popup message
        let popUpMsg = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .add_course_form .popup-message")

        // Getting only the extension from the selected 
        let extension = (imagePicker.value).split(".")[1].toLowerCase()


        if (extension == "jpg" || extension == "png" || extension == "jpeg") {

            // Getting only the file name with extension from the image path
            let fileName = (imagePicker.value).split("\\")[2]
            imagePicker.nextElementSibling.innerHTML = `&ensp;${fileName}`
            imagePicker.nextElementSibling.style.color = "black"
        }
        else {
            imagePicker.previousElementSibling.disabled = true

            // Showing the error on popup message
            popUpMsg.innerHTML = "Only image files are allowed"
            popUpMsg.style.color = "rgba(252, 25, 25, 0.8)"
            popUpMsg.classList.remove("hide")

            // Reseting the values
            imagePicker.value = ""
            imagePicker.nextElementSibling.innerHTML = "&ensp;a Category Image"
            imagePicker.nextElementSibling.style.color = "rgba(0, 18, 25, 0.6)"

            setTimeout(() => {
                if (popUpMsg.classList[1] != "hide") {

                    // Hiding the error popup message
                    popUpMsg.classList.add("hide")
                    imagePicker.previousElementSibling.disabled = false
                }
            }, 3000)
        }
    }

    // Getting the File Input Element
    const imagePicker = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .add_course_form .new_image_container .new_course_category_image")

    // Triggering the File Picker Dialog box
    imagePicker.click()
    imagePicker.addEventListener("change", imageUploader)
}
// ---------------------------------------------------------------------------- //


// ----------------------------------- Getting the Add Course Form  ------------------------------------------------- //
const addCourseForm = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .add_course_form")
//
if (addCourseForm != null) {

    // Adding a submit function to the Add Course Form
    addCourseForm.addEventListener("submit", addingNewCourse)

    // Getting the Clear button in the Add Course Form
    addCourseForm.querySelector(".add_course_buttons .new_clear_button").addEventListener("click", () => {

        // Deleting the values of the form except category
        addCourseForm.querySelector(".new_course_title").value = ""
        addCourseForm.querySelector(".new_course_category").value = ""
        addCourseForm.querySelector(".new_course_category_image").value = ""
        addCourseForm.querySelector(".new_course_link").value = ""
        addCourseForm.querySelector(".new_course_pdf").value = ""

        // Reseting the text visible on files pickers
        let imageText = addCourseForm.querySelector(".new_course_category_image").nextElementSibling
        imageText.innerHTML = "&ensp;a Category Image"
        imageText.style.color = "rgba(0, 18, 25, 0.6)"
        let pdfText = addCourseForm.querySelector(".new_course_pdf").nextElementSibling
        pdfText.innerHTML = "&ensp;a Pdf Course Material"
        pdfText.style.color = "rgba(0, 18, 25, 0.6)"
    })

    // Getting the category image uploader field from Add Course Form
    const addCourseImageButton = addCourseForm.querySelector(".new_image_container .new_course_image_upload")
    addCourseImageButton.addEventListener("click", addCourseImageUploader)

    // Getting the checkbutton
    const showCourseMaterialElement = addCourseForm.querySelector(".show-pdf")
    showCourseMaterialElement.addEventListener("click", () => {

        showCourseMaterialElement.disabled = true

        const addCourseMaterial = showCourseMaterialElement.parentElement.nextElementSibling
        addCourseMaterial.childNodes[3].addEventListener("click", addCoursePdfUploader)

        setTimeout(() => {

            showCourseMaterialElement.disabled = false

            if (showCourseMaterialElement.checked) {

                addCourseMaterial.classList.remove("hide")
            }
            else {
                addCourseMaterial.classList.add("hide")
            }
        }, 300)
    })
}
// ----------------------------------------------------------------------------------------------------------------------------------------- //




// Function for submiting the data to the database and belongs to ----------------- ( Update Course Form )------------------------------- //

const updatingOldCourse = (page) => {

    // Preventing the page from reloading
    page.preventDefault()

    // Getting the element of popup message
    let popUpMsg = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .update_course_form .popup-message")

    // Disabling the submit button after clicked
    let button = updateCourseForm.querySelector(".update_course_button .update_edit_button")
    button.disabled = true

    // Checking the button is the correct one
    if (button.value == "Update") {

        // Sending the form name as value to python function
        updateCourseForm.previousElementSibling.previousElementSibling.querySelector(".which_form").value = "Update"

        // Getting the form's input value and sending it to through AJAX
        var updateFormData = new FormData(updateCourseForm)
        updateFormData.append("whichform", $(".which_form").val())

        $.ajax({
            type: "POST",
            url: "/admin-settings",
            enctype: "multipart/form-data",
            data: updateFormData,
            contentType: false,
            processData: false,
            success: function (data) {
                // console.log(data.message[0])
                if (data.message[0] == "Fields can't be empty") {

                    // Showing the error status on the popup message
                    popUpMsg.innerHTML = `${data.message[0]}`
                    popUpMsg.style.color = "rgba(252, 25, 25, 0.8)"
                    popUpMsg.classList.toggle("hide")
                }

                else {

                    if (data.message[0] == "Please, enter a valid Youtube Link") {

                        // Showing the error status on the popup message
                        popUpMsg.innerHTML = `${data.message[0]}`
                        popUpMsg.style.color = "rgba(252, 25, 25, 0.8)"
                        popUpMsg.classList.toggle("hide")

                        updateCourseForm.querySelector(".update_course_link").value = ""

                        // Hiding the error message after 3 seconds
                        setTimeout(() => {

                            popUpMsg.classList.toggle("hide")
                            button.disabled = false
                        }, 3000)
                    }

                    else {

                        // Showing the success status on the popup message
                        popUpMsg.innerHTML = `${data.message[0]}`
                        popUpMsg.style.color = "rgb(22, 100, 43)"
                        popUpMsg.classList.toggle("hide")

                        // Deleting all the values of the form
                        updateCourseForm.querySelector(".update_course_title").value = ""
                        updateCourseForm.querySelector(".update_course_link").value = ""
                        updateCourseForm.querySelector(".update_course_pdf").value = ""

                        // Reseting the selcted option on the select elements
                        updateCourseForm.querySelector(".update_course_category .invisible-option").selected = true
                        updateCourseForm.querySelector(".update_course_name .invisible-option").selected = true
                        updateCourseForm.querySelector(".update_course_category").style.color = "rgba(0, 18, 25, 0.6)"
                        updateCourseForm.querySelector(".update_course_name").style.color = "rgba(0, 18, 25, 0.6)"

                        // Reseting the text visible on pdf picker
                        let pdfText = updateCourseForm.querySelector(".update_course_pdf").nextElementSibling
                        pdfText.innerHTML = "&ensp;a Pdf Course Material"
                        pdfText.style.color = "rgba(0, 18, 25, 0.6)"

                        // Disabling the Edit Section Again
                        let editSectionElements = updateCourseForm.querySelector(".update_course_editer")
                        //
                        editSectionElements.querySelector(".update_course_title").disabled = true
                        editSectionElements.querySelector(".update_course_link").disabled = true
                        editSectionElements.querySelector(".update_course_pdf_upload").disabled = true
                        editSectionElements.querySelector("label").style.color = "rgba(0, 18, 25, 0.4)"
                        updateCourseForm.querySelector(".update_course_button .update_edit_button").disabled = true

                        // Hiding the error message after 3 seconds
                        setTimeout(() => {

                            popUpMsg.classList.toggle("hide")
                            button.disabled = false
                        }, 3000)
                    }
                }
            }
        })
    }
}
// ---------------------------------------------------------------------------- //


// Function for opening a file upload dialog box for pdf only ------------------------------------------------- //
const editCoursePdfUploader = () => {

    // Function for uploading Pdf
    const editPdfUploader = () => {

        // Removing the Function associated with 'editPdfPicker'
        editPdfPicker.removeEventListener("change", editPdfUploader)

        // Getting the element of popup message
        let popUpMsg = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .update_course_form .popup-message")

        // Getting only the extension from the selected 
        let extension = (editPdfPicker.value).split(".")[1].toLowerCase()


        if (extension == "pdf") {

            // Getting only the file name with extension from the pdf path
            let fileName = (editPdfPicker.value).split("\\")[2]
            editPdfPicker.nextElementSibling.innerHTML = `&ensp;${fileName}`
            editPdfPicker.nextElementSibling.style.color = "black"
        }
        else {
            editPdfPicker.previousElementSibling.disabled = true

            // Showing the error on popup message
            popUpMsg.innerHTML = "Only pdf files are allowed"
            popUpMsg.style.color = "rgba(252, 25, 25, 0.8)"
            popUpMsg.classList.remove("hide")

            // Reseting the values
            editPdfPicker.value = ""
            editPdfPicker.nextElementSibling.innerHTML = "&ensp;a Pdf Course Material"
            editPdfPicker.nextElementSibling.style.color = "rgba(0, 18, 25, 0.6)"

            setTimeout(() => {
                if (popUpMsg.classList[1] != "hide") {

                    // Hiding the error popup message
                    popUpMsg.classList.add("hide")
                    editPdfPicker.previousElementSibling.disabled = false
                }
            }, 3000)
        }
    }

    // Getting the File Input Element
    const editPdfPicker = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .update_course_form .update_pdf_container .update_course_pdf")

    // Triggering the File Picker Dialog box
    editPdfPicker.click()
    editPdfPicker.addEventListener("change", editPdfUploader)
}
// ---------------------------------------------------------------------------- //


// Function for picking the course names according to the Category ------------------------------------------------------ //
const coursePicker = () => {

    // Getting the Category Select element from the Update Course Form
    let categorySelectOption = updateCourseForm.querySelector(".update_course_picker .update_course_category")
    //
    categorySelectOption.disabled = true

    // Changing color of the selected Category
    if (categorySelectOption.value != "Category*") {
        categorySelectOption.style.color = "black"
    }

    // Sending the form name as value to python function
    updateCourseForm.previousElementSibling.previousElementSibling.querySelector(".which_form").value = "Update"

    // Getting the element of popup message
    let popUpMsg = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .update_course_form .popup-message")


    $.ajax({
        type: "POST",
        url: "/admin-settings/update-courses",
        data: {
            whichform: $(".which_form").val(),
            updatecoursecategory: $(".update_course_category").val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        },
        success: function (data) {

            if (data.message[0] == "Success") {

                // Enabling Back the Category Select Element
                setTimeout(() => {

                    categorySelectOption.disabled = false
                }, 3000)

                // Getting the Course Select Box Options
                let courseOption = updateCourseForm.querySelector(".update_course_picker .update_course_name .course_option")
                if (courseOption != null) {

                    let courseSelectOptions = updateCourseForm.querySelectorAll(".update_course_picker .update_course_name .course_option")
                    courseSelectOptions.forEach((option) => {

                        // Deleting the Previous Options
                        option.remove()
                    })
                }

                // Filling the Course Select Box with values return from AJAX
                data.message[1].forEach((title) => {

                    // Creating new Course option
                    let newCourseOption = document.createElement("option")
                    newCourseOption.classList.add("course_option")

                    // Filling it up with values
                    newCourseOption.value = `${title}`
                    newCourseOption.innerHTML = `${title}`

                    // Placing it on the select container
                    let courseSelectOption = updateCourseForm.querySelector(".update_course_picker .update_course_name")
                    courseSelectOption.append(newCourseOption)
                })

                // Enabling the Course Select Element
                updateCourseForm.querySelector(".update_course_picker .update_course_name").disabled = false
            }
            else {

                // Showing the error status on the popup message
                popUpMsg.innerHTML = `Oops! try again`
                popUpMsg.style.color = "rgba(252, 25, 25, 0.8)"
                popUpMsg.classList.remove("hide")

                // Hiding the error message after 3 seconds
                setTimeout(() => {

                    popUpMsg.classList.add("hide")
                    categorySelectOption.disabled = false
                }, 3000)
            }

        }
    })
}
// ---------------------------------------------------------------------------- //


// --------------------------- Getting the Update Course Form  ----------------------------------------------------- //
const updateCourseForm = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .update_course_form")
//
if (updateCourseForm != null) {

    // Disabling the Edit Section
    let editSectionElements = updateCourseForm.querySelector(".update_course_editer")
    //
    editSectionElements.querySelector(".update_course_title").disabled = true
    editSectionElements.querySelector(".update_course_link").disabled = true
    editSectionElements.querySelector(".update_course_pdf_upload").disabled = true
    editSectionElements.querySelector("label").style.color = "rgba(0, 18, 25, 0.4)"
    updateCourseForm.querySelector(".update_course_button .update_edit_button").disabled = true


    // Getting the Category Select element from the Update Course Form
    let categorySelectOption = updateCourseForm.querySelector(".update_course_picker .update_course_category")
    categorySelectOption.addEventListener("change", coursePicker)

    // Getting the Course Title Option
    let courseSelectOption = updateCourseForm.querySelector(".update_course_picker .update_course_name")
    // Disabling
    courseSelectOption.disabled = true

    // Changing color of the selected Course and also enabling the Edit Section
    courseSelectOption.addEventListener("change", () => {

        if (courseSelectOption.value != "Course Title*") {
            courseSelectOption.style.color = "black"
        }

        // Enabling back the Edit Section
        let editSectionElements = updateCourseForm.querySelector(".update_course_editer")
        //
        editSectionElements.querySelector(".update_course_title").disabled = false
        editSectionElements.querySelector(".update_course_link").disabled = false
        editSectionElements.querySelector(".update_course_pdf_upload").disabled = false
        editSectionElements.querySelector("label").style.color = "rgba(0, 18, 25, 0.6)"
        updateCourseForm.querySelector(".update_course_button .update_edit_button").disabled = false

        // Getting the Upload button
        let editCourseUploadButton = editSectionElements.querySelector(".update_course_pdf_upload")
        //
        editCourseUploadButton.addEventListener("click", editCoursePdfUploader)

        // Adding a submit function to the Update Course Form
        updateCourseForm.addEventListener("submit", updatingOldCourse)
    })
}
// --------------------------------------------------------------------------------------------------------------------------------------- //



// Function for submiting the data to the database and belongs to ----------------- ( Delete Course Form )------------------------------- //
const deletingOldCourse = (page) => {

    // Preventing the page from reloading
    page.preventDefault()

    // Getting the element of popup message
    let popUpMsg = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .delete_course_form .popup-message")

    // Disabling the submit button after clicked
    let button = deleteCourseForm.querySelector(".delete_course_button .delete_button")
    button.disabled = true
    //
    // Disabling the Course Category & Title Select Options
    deleteCourseForm.querySelector(".delete_course_category").disabled = true
    deleteCourseForm.querySelector(".delete_course_name").disabled = true

    // Checking the button is the correct one
    if (button.value == "Delete") {

        // Sending the form name as value to python function
        deleteCourseForm.previousElementSibling.previousElementSibling.previousElementSibling.querySelector(".which_form").value = "Delete"

        // Getting the form's input value and sending it to through AJAX
        $.ajax({
            type: "POST",
            url: "/admin-settings",
            enctype: "multipart/form-data",
            data: {
                whichform: $(".which_form").val(),
                deletecoursecategory: $(".delete_course_category").val(),
                deletecoursename: $(".delete_course_name").val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // console.log(data.message[0])
                if (data.message[0] == "Fields can't be empty") {

                    // Showing the error status on the popup message
                    popUpMsg.innerHTML = `${data.message[0]}`
                    popUpMsg.style.color = "rgba(252, 25, 25, 0.8)"
                    popUpMsg.classList.toggle("hide")

                    // Hiding the error message after 3 seconds
                    setTimeout(() => {

                        popUpMsg.classList.toggle("hide")
                        deleteCourseForm.querySelector(".delete_course_category").disabled = false

                        // Reloading the page to load the changes
                        window.location.reload()
                    }, 3000)
                }

                else {

                    // Showing the success status on the popup message
                    popUpMsg.innerHTML = `${data.message[0]}`
                    popUpMsg.style.color = "rgb(22, 100, 43)"
                    popUpMsg.classList.toggle("hide")

                    // Reseting the selcted option on the select elements
                    deleteCourseForm.querySelector(".delete_course_category .invisible-option").selected = true
                    deleteCourseForm.querySelector(".delete_course_name .invisible-option").selected = true
                    deleteCourseForm.querySelector(".delete_course_category").style.color = "rgba(0, 18, 25, 0.6)"
                    deleteCourseForm.querySelector(".delete_course_name").style.color = "rgba(0, 18, 25, 0.6)"

                    // Hiding the error message after 3 seconds
                    setTimeout(() => {

                        popUpMsg.classList.toggle("hide")
                        deleteCourseForm.querySelector(".delete_course_category").disabled = false

                        // Reloading the page to load the changes
                        window.location.reload()
                    }, 3000)
                }
            }
        })
    }
}
// ---------------------------------------------------------------------------- //


// Function for picking the course names according to the Category in Delete Form ------------------------------------------------------ //
const deleteCoursePicker = () => {

    // Getting the Category Select element from the Update Course Form
    let deleteCategorySelectOption = deleteCourseForm.querySelector(".delete_course_category")
    //
    deleteCategorySelectOption.disabled = true

    // Changing color of the selected Category
    if (deleteCategorySelectOption.value != "Category*") {
        deleteCategorySelectOption.style.color = "black"
    }

    // Sending the form name as value to python function
    deleteCourseForm.previousElementSibling.previousElementSibling.previousElementSibling.querySelector(".which_form").value = "Delete"

    // Getting the element of popup message
    let popUpMsg = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .delete_course_form .popup-message")


    $.ajax({
        type: "POST",
        url: "/admin-settings/update-courses",
        data: {
            whichform: $(".which_form").val(),
            deletecoursecategory: $(".delete_course_category").val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        },
        success: function (data) {

            if (data.message[0] == "Success") {

                // Enabling Back the Category Select Element
                setTimeout(() => {

                    deleteCategorySelectOption.disabled = false
                }, 3000)

                // Getting the Course Select Box Options
                let courseOption = deleteCourseForm.querySelector(".delete_course_name .course_option")
                if (courseOption != null) {

                    let courseSelectOptions = deleteCourseForm.querySelectorAll(".delete_course_name .course_option")
                    courseSelectOptions.forEach((option) => {

                        // Deleting the Previous Options
                        option.remove()
                    })
                }

                // Filling the Course Select Box with values return from AJAX
                data.message[1].forEach((title) => {

                    // Creating new Course option
                    let newCourseOption = document.createElement("option")
                    newCourseOption.classList.add("course_option")

                    // Filling it up with values
                    newCourseOption.value = `${title}`
                    newCourseOption.innerHTML = `${title}`

                    // Placing it on the select container
                    let courseSelectOption = deleteCourseForm.querySelector(".delete_course_name")
                    courseSelectOption.append(newCourseOption)
                })

                // Enabling the Course Select Element
                deleteCourseForm.querySelector(".delete_course_name").disabled = false
            }
            else {

                // Showing the error status on the popup message
                popUpMsg.innerHTML = `Oops! try again`
                popUpMsg.style.color = "rgba(252, 25, 25, 0.8)"
                popUpMsg.classList.remove("hide")

                // Hiding the error message after 3 seconds
                setTimeout(() => {

                    popUpMsg.classList.add("hide")
                    deleteCategorySelectOption.disabled = false
                }, 3000)
            }

        }
    })
}
// ---------------------------------------------------------------------------- //


// --------------------------- Getting the Delete Course Form  ----------------------------------------------------- //
const deleteCourseForm = document.querySelector(".settings-page .admin-interface-container .admin-interface-content .delete_course_form")
//
if (deleteCourseForm != null) {

    // Disabling the Delete Button
    deleteCourseForm.querySelector(".delete_course_button .delete_button").disabled = true

    // Getting the Category Select element from the Delete Course Form
    let deleteCategorySelectOption = deleteCourseForm.querySelector(".delete_course_category")
    deleteCategorySelectOption.addEventListener("change", deleteCoursePicker)

    // Getting the Course Title Select Option
    let deletecourseSelectOption = deleteCourseForm.querySelector(".delete_course_name")
    // Disabling
    deletecourseSelectOption.disabled = true

    // Changing color of the selected Course and also enabling the Delete button
    deletecourseSelectOption.addEventListener("change", () => {

        if (deletecourseSelectOption.value != "Course Title*") {
            deletecourseSelectOption.style.color = "black"
        }

        // Enabling back the Delete button
        deleteCourseForm.querySelector(".delete_course_button .delete_button").disabled = false

        // Adding a submit function to the Delete Course Form
        deleteCourseForm.addEventListener("submit", deletingOldCourse)
    })
}