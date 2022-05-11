import {utils} from "./scriptUtils.js"

export class sdwToolPopupCss extends HTMLElement {

    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.type = ""
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
        this.load()
    }

    async load () {

        this.type = this.getAttribute('type')

        this.elmRoot.addEventListener('click', (evt) => {
            evt.stopPropagation()
            evt.preventDefault()
            if (evt.target.classList.contains("root")) {
                this.hide()
            }
        })
    }

    show (ref) {
        let style = this.refs["popup"].style
        let stylePointer = this.refs["popupPointer"].style
        let rect = ref.getBoundingClientRect()
        let top = rect.y - 125
        let topPointer = rect.y + 7
        let left = rect.x - 400
        let height = 250

        if (top < 5) {
            top = 5
        }
        if (topPointer < 25) {
            topPointer = 25
        }

        this.elmRoot.style.display = "block"
        style.top = top + "px"
        style.left = left + "px"
        style.height = height + "px"
        stylePointer.top = topPointer + "px"
        stylePointer.left = (left + 395) + "px"

        let cssName = "css" + app.refSelected.appId
        let txt = app.refSelected.getStyleString(cssName, false)
        this.refs["popup"].innerHTML = "<pre style='margin: 0;'>" + txt + "</pre>"
    }

    hide () {
        let style = this.refs["popup"].style
        let stylePointer = this.refs["popupPointer"].style
        
        this.elmRoot.style.display = 'none'
        style.top = '-10px'
        style.left = '0'
        stylePointer.top = '-10px'
        stylePointer.left = '0'
    }
}