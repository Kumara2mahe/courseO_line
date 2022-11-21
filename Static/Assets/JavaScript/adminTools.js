
// ---------------- Admin Tools - Dropdown Script -------------------------------------- //

// ---- Function for showing Admin Tools Dropdown ---- //
const showAdminTools = () => {
    adminTools.nextElementSibling.classList.add("show")
    setTimeout(() => {
        adminTools.removeEventListener("click", showAdminTools)
        window.addEventListener("click", closeAdminTools)
    }, 100)
}
// ---- Function for closing Admin Tools Dropdown ---- //
const closeAdminTools = (event) => {
    let element = event.target
    let isElementActive = (element.tagName == "A" && element.parentElement.classList[0] == "admin-tools")
        || (element.classList[0] == "admin-tools" && element.parentElement.classList[0] == "nav-links")

    if (!isElementActive) {
        adminTools.nextElementSibling.classList.remove("show")
        window.removeEventListener("click", closeAdminTools)
        adminTools.addEventListener("click", showAdminTools)
    }
}
const adminTools = document.querySelector(".navigation-bar .nav-links .tools")
if (adminTools) {
    adminTools.addEventListener("click", showAdminTools)
}
// ---------------------------------------------------------------------- //