import {utils} from "./scriptUtils.js"

export class sdwToolTooltip extends HTMLElement {

    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.showing = false
    }

    static get observedAttributes() { return []; }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback () {

        this.elmStyle = document.createElement("style")
        this.shadow.appendChild(this.elmStyle)

        this.elmRoot = document.createElement("div")
        this.elmRoot.className = "root"
        this.shadow.appendChild(this.elmRoot)

        this.elmStyle.textContent = files[this.constructor.name].css
        this.elmRoot.innerHTML = files[this.constructor.name].html

        this.refs = utils.getRefs(this.elmRoot)
    }

    show (ref) {
        let boundsRef = ref.getBoundingClientRect()
        let boundsThis = undefined
        let left = 0
        let top = 0

        this.refs["text"].innerHTML = ref.getAttribute("data-tooltip")
        boundsThis = (this.refs["text"]).getBoundingClientRect()

        left = (boundsRef.x - boundsThis.width + 15 + (boundsRef.width / 2))
        if (left < 10) {
            left = boundsRef.x
        }

        top = (boundsRef.y - boundsThis.height - 5)
        if (top < 10) {
            top = boundsRef.y + boundsRef.height + 10
        }

        this.elmRoot.style.left = left + "px"
        this.elmRoot.style.top = top + "px"
        this.refs["text"].style.visibility = "visible"
        this.refs["text"].style.opacity = "1"

        this.showing = true
    }

    async hide () {
        this.refs["text"].style.opacity = "0"
        await app.wait(250)
        if (!this.showing) {
            this.refs["text"].style.visibility = "hidden"
            this.elmRoot.style.top = "-500px"
        }
    }
}