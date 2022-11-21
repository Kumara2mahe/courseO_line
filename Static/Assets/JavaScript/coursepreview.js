
// -------- Course Topics - Navigator Script ------------------------------------------- //

// ---- Function to navigate to the Topic
const navigateToTopic = (topicName = null) => {

    if (topicName == null) {
        topicName = new URLSearchParams(window.location.search).get("topic")
    }
    // Navigating to the Topic
    let topic = document.querySelector(`#topic-${topicName}`)
    if (topic) {
        document.documentElement.scrollTop = topic.offsetTop
    }
}
const coursesPage = document.querySelector("article.courses-page")
if (coursesPage) {

    // Setting the Category name as ID
    const playlists = coursesPage.querySelectorAll(".course-container .category")
    playlists.forEach((item) => {
        let idname = item.querySelector(".category-heading").innerText.replace(" ", "")
        item.id = `topic-${idname}`
    })
    navigateToTopic()
}
// -------------------------------------------------------------------------------- //



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
            navigateToTopic(name)
        }
        else {
            window.location.assign(`/courses?topic=${name}`)
        }
    })
})
// -------------------------------------------------------------------------------- //



// -------- Horizontal Text - Scrolling Script ------------------------------------------- //

// ---- Function to get the element width ---- //
const getWidth = (element) => {
    let width = window.getComputedStyle(element).width
    return Number(width.replace("px", ""))
}
// Getting the elements of all the courses
const allCourses = document.querySelectorAll(".playlist .course")
allCourses.forEach((course) => {
    let title = course.querySelector(".title span")
    let titleContainer = title.parentElement

    // Adding the horizontal text-scrolling effect
    if (getWidth(title) > getWidth(titleContainer)) {
        titleContainer.classList.add("scroll")
    }
})
// -------------------------------------------------------------------------------- //