import {utils} from "../scriptUtils.js"

export class sdwFlexChild extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.expanded = false
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
        utils.initModified(this)
        utils.initTooltips(this.elmRoot)
        utils.initExpandable(this)
    }

    setVisualization () {
        let parentDisplay = app.refSelected.parent.getStyle("display")

        if (parentDisplay != "flex") {
            this.elmRoot.style.display = "none"
        } else {
            this.elmRoot.style.display = "block"
        }
        
        utils.setVisualization(this)
    }
}