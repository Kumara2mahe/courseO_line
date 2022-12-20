
// -------- Navigation Link - Highlight & Deactivate Script ------------------------------------------------- //

const pathname = window.location.pathname.slice(1),
    navlinks = document.querySelectorAll(".navigation-bar .nav-links a")
navlinks.forEach((link) => {

    // Converting the link name to lowercase
    let linkname = link.innerText.toLowerCase()
    if (pathname == linkname || pathname == "" && linkname == "home" || pathname.includes(linkname)) {
        link.classList.add("activepage")
        link.removeAttribute("href")
    }
})
// ---------------------------------------------------------------------------------- //


// -------- Course Topics - Activator Script ------------------------------------------- //

// ---- Function to check the current page is Course-Page ---- //
const isThisPath = (path) => {
    let currenturl = window.location.origin + path
    return window.location.href.includes(currenturl)
}
const topics = document.querySelectorAll("section .topic-link")
topics.forEach((topic) => {
    topic.addEventListener("click", () => {

        let name = encodeURIComponent(topic.innerText.replace(" ", ""))
        if (isThisPath("/courses")) {

            // Navigating to the Topic
            let topic = document.querySelector(`#topic-${name}`)
            if (topic) {
                document.documentElement.scrollTop = topic.offsetTop
            }
        }
        else {
            window.location.assign(`/courses?topic=${name}`)
        }
    })
})
// -------------------------------------------------------------------------------- //


// -------- SmallScreen Hamburger Menu - Toggle Script ---------------------------------------- //

// ---- Function for showing Hamburger Menu ---- //
const showHamMenu = () => {
    hamIcon.classList.add("active")
    hamIcon.nextElementSibling.classList.add("float")
    setTimeout(() => {
        hamIcon.removeEventListener("click", showHamMenu)
        window.addEventListener("click", closeHamMenu)
    }, 100)
}
// ---- Function for closing Hamburger Menu ---- //
const closeHamMenu = (event) => {
    let element = event.target,
        isElementActive = (element.tagName == "SPAN" && element.parentElement.tagName == "A" && element.parentElement.parentElement.classList[0] == "nav-links")
            || (element.tagName == "A" && element.parentElement.classList[0] == "nav-links")
            || (element.classList[0] == "nav-links" && element.parentElement.tagName == "DIV")
            || (element.tagName == "A" && element.parentElement.classList[0] == "admin-tools")
            || (element.classList[0] == "admin-tools" && element.parentElement.classList[0] == "nav-links")

    if (!isElementActive) {
        hamIcon.classList.remove("active")
        hamIcon.nextElementSibling.classList.remove("float")
        window.removeEventListener("click", closeHamMenu)
        hamIcon.addEventListener("click", showHamMenu)
    }
}
const hamIcon = document.querySelector(".navigation-bar .ham-icon")
hamIcon.addEventListener("click", showHamMenu)
// ---------------------------------------------------------------------------------- //



// -------- Scroll to Top - Button Script ---------------------------------------------- //

// ---- Function for creating Scroll to Top Button ---- //
const toggleScrolltoTop = () => {

    let scrollTopBtn = document.querySelector(".scroll-to-top")
    if (scrollTopBtn) {
        scrollTopBtn.hidden = window.scrollY < scrollPos
    }
    else if (window.scrollY > scrollPos) {

        // Creating Scroll-to-Top button
        scrollTopBtn = document.createElement("a")
        scrollTopBtn.classList.add("scroll-to-top")
        scrollTopBtn.innerHTML = `&#11165;`
        scrollTopBtn.addEventListener("click", () => {
            document.documentElement.scrollTop = 0
        })
        // Showing on screen
        document.querySelector("footer").before(scrollTopBtn)
    }
}
const scrollPos = 400
window.addEventListener("scroll", toggleScrolltoTop)
// ---------------------------------------------------------------------------------- //
