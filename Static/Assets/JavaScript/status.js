
// ------------------- Status Message - Creator Script ---------------------------------------- //

class Status {
    /** 
     * Class for creating and working with Status message
     * @param {boolean} hasClose whether to add a close button with the status message
     * @param {string} tagName name of HTML element
     */
    constructor(
        hasClose = true,
        tagName = "h5"
    ) {
        this._tagName = tagName
        this._element = (() => {
            let element = document.createElement(this._tagName)
            element.classList.add("statuscontainer")
            element.innerHTML = `<span class="message"></span>`
            if (hasClose) {
                element.innerHTML += `<span class="close" onclick="this.parentElement.remove()">&times;</span>`
            }
            return element
        })()
        this._parent = document
        this._message = this._element.querySelector(".message").innerHTML = "Error 404 - Check your Internet Connection and Try Again!"
    }

    /**
     * Show Status
     * @param {string | HTMLElement} selectors one or more valid CSS selector string
     * @param {boolean} noerror defines the status message visually as a error or success
     */
    show(selectors, noerror = false) {
        if (selectors != null) {

            let parentElement = selectors, className = selectors.constructor.name
            if (className == "String") {
                parentElement = document.querySelector(selectors)
            }

            // Confirming element not null
            if (parentElement) {
                if (noerror) {
                    this._element.classList.add("success")
                }
                this._parent = parentElement
                parentElement.prepend(this._element)
            }
            else throw Error(`"${selectors}" is not a valid selector`)
        }
        else throw TypeError(`Expected String or a HTMLElement object, but got ${selectors}`)
    }

    /**
     * Populate Message
     * @param {string} info string to show inside Status
     */
    message(info) {
        this._message = this._element.querySelector(".message").innerHTML = info || this._message
    }

    /**
     * Remove Status
     */
    remove() {
        if (this._parent.contains(this._element)) {
            this._element.remove()
        }
    }
}
// ----------------------------------------------------------------------------- //



export default Status