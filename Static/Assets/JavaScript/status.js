
// ------------------- Status Message - Creator Script ---------------------------------------- //

const STATUS_CLS = "statuscontainer", M_CLS = "message", S_CLS = "success"


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
            element.classList.add(STATUS_CLS)
            element.innerHTML = `<span class="${M_CLS}"></span>`
            if (hasClose) {
                element.innerHTML += `<span class="close" onclick="this.parentElement.remove()">&times;</span>`
            }
            return element
        })()
        this._parent = document
        this._message = this._element.querySelector(`.${M_CLS}`).innerHTML = "Error 404 - Check your Internet Connection and Try Again!"
    }

    /**
     * Show Status
     * @param {string | HTMLElement} selectors one or more valid CSS selector string
     * @param {boolean} noerror defines the status message visually as a error or success, default is false
     * @param {number} millisecs minimum duration to show status message (in milliseconds), default is 3000ms
     * @returns {number} calculated maximum duration to show status message in (in milliseconds)
     */
    show(selectors, noerror = false, millisecs = 3000) {
        if (selectors != null) {

            let oldstatus, parentElement = selectors, className = selectors.constructor.name
            if (className == "String") {
                parentElement = document.querySelector(selectors)
            }

            // Confirming element not null
            if (parentElement) {
                if (noerror) {
                    this._element.classList.add(S_CLS)
                }
                this._parent = parentElement
                if (oldstatus = parentElement.querySelector(`.${STATUS_CLS}:not(.${S_CLS})`)) {
                    oldstatus.remove()
                    parentElement.append(this._element)
                }
                else parentElement.prepend(this._element)
                return this.after(millisecs)
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
        this._message = this._element.querySelector(`.${M_CLS}`).innerHTML = info || this._message
    }

    /**
     * Calculating Max Visible time,
     * from the existing counting of Status message
     * @param {number} millisecs minimum duration to show status message (in milliseconds), default is 3000ms
     * @returns {number} calculated maximum duration to show status message in (in milliseconds)
     */
    after(millisec) {
        this._after = millisec
        let previous = this._parent.querySelectorAll(`.${STATUS_CLS}`)
        return this._after = this._after * (previous.length || 1)
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