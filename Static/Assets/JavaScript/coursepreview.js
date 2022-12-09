
// -------- Course Topics - Navigator Script ------------------------------------------- //

// ---- Function to navigate to the Topic
const navigateToTopic = () => {

    let topic, topicName = new URLSearchParams(window.location.search).get("topic")
    if (topic = document.querySelector(`#topic-${topicName}`)) {
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



// -------- Horizontal Text - Scrolling Script ------------------------------------------- //

// ---- Function to get the element width ---- //
const getWidth = (element) => {
    let width = window.getComputedStyle(element).width
    return Number(width.replace("px", ""))
}
// Getting the elements of all the courses
const allCourses = document.querySelectorAll(".playlist .course")
allCourses.forEach((course) => {
    let title = course.querySelector(".title span"),
        titleContainer = title.parentElement

    // Adding the horizontal text-scrolling effect
    if (getWidth(title) > getWidth(titleContainer)) {
        titleContainer.classList.add("scroll")
    }
})
// -------------------------------------------------------------------------------- //

export default navigateToTopic