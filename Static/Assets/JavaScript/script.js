// ------------------------------------------- JavaScript for CourseO_line - online courses project ---------------------------------------- //


// Function for Showing and Removing Navbar Hover Effect ---------------------------------------- //
const navBarOptionsAddHover = (active) => {

    let option = active.target

    // Showing the border
    option.childNodes[0].classList.add("show")

    // Moving the border
    setTimeout(() => {
        option.childNodes[0].classList.add("showborder")

    }, 100)
}

const navBarOptionsRemoveHover = (active) => {

    let option = active.target

    // Removing the border
    option.childNodes[0].classList.remove("show")
    setTimeout(() => {
        option.childNodes[0].classList.remove("showborder")

    }, 100)
}

// Getting the navigation bar 'a' tags
const navBarOptions = document.querySelectorAll(".navigation-bar .nav-wrapper .page-options a")
//
navBarOptions.forEach((link) => {
    link.addEventListener("mouseenter", navBarOptionsAddHover)
    link.addEventListener("mouseleave", navBarOptionsRemoveHover)
})
// -------------------------------------------------------------------------------- //



// Function for Showing and Removing Navbar Hover Effect ---------------------------------------- //
const watchButtonAddHover = (active) => {

    let button = active.target

    setTimeout(() => {
        button.childNodes[1].classList.add("show")
    }, 200)
}

const watchButtonRemoveHover = (active) => {

    let button = active.target

    setTimeout(() => {
        button.childNodes[1].classList.remove("show")
    }, 200)
}

// Getting the Watch Button from the homepage top-content
const watchButtonTopContent = document.querySelector(".home-page .top-content-container .top-content .top-content-wrapper a")
//
if (watchButtonTopContent != null) {
    watchButtonTopContent.addEventListener("mouseenter", watchButtonAddHover)
    watchButtonTopContent.addEventListener("mouseleave", watchButtonRemoveHover)
}
// -------------------------------------------------------------------------------- //



// Function for Showing and Removing Learn-Button Hover Effect ---------------------------------------- //
const learnButtonAddHover = (active) => {

    let button = active.target
    button.classList.add("spin")

    setTimeout(() => {
        button.removeEventListener("mouseenter", learnButtonAddHover)
        button.addEventListener("mouseleave", learnButtonRemoveHover)
    }, 200)
}

const learnButtonRemoveHover = (active) => {

    let button = active.target
    button.classList.remove("spin")

    setTimeout(() => {
        button.removeEventListener("mouseleave", learnButtonRemoveHover)
        button.addEventListener("mouseenter", learnButtonAddHover)
    }, 200)
}

// Getting the Learn-Button from the homepage fourth-content
const learnButtonFourthContent = document.querySelector(".home-page .fourth-content-container .fourth-content .fourth-content-wrapper a")
//
if (learnButtonFourthContent != null) {
    learnButtonFourthContent.addEventListener("mouseenter", learnButtonAddHover)
}
// -------------------------------------------------------------------------------- //



// Function for Showing and Removing Scroll to Top Button ---------------------------------------- //
const scrollToTopButtonShow = () => {

    if (window.scrollY > 0) {

        // Showing the scrollButton
        scrollToTopButton.classList.remove("hide")
    }
    if (window.scrollY == 0) {

        // Removing the scrollButton
        scrollToTopButton.classList.add("hide")
    }
}

// Getting the scrolltoTop Button
const scrollToTopButton = document.querySelector(".scroll-top-button")
//
window.addEventListener("scroll", scrollToTopButtonShow)
// -------------------------------------------------------------------------------- //
