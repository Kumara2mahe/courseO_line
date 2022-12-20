
// --------------- Body Size Resizer - Script ---------------------------------------- //

// ---- Function to change body height ---- //
const dimensionChanger = () => {
    let articlePopUp = document.querySelector("article .auth-menu:not(.hide)"),
        windowHeight, popUpHeight = Number(window.getComputedStyle(articlePopUp).height.replace("px", ""))
    if (popUpHeight < (windowHeight = window.innerHeight)) {
        document.body.style.height = `${windowHeight}px`
    }
    else {
        document.body.removeAttribute("style")
    }
}
dimensionChanger()
window.addEventListener("resize", dimensionChanger)
// -------------------------------------------------------------------------------- //

export default dimensionChanger