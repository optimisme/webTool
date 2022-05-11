import {utils} from "../scriptUtils.js"

export class sdwCustomElement extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.expanded = false

        this.oldValue = ""
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

        utils.initTooltips(this.elmRoot)

        let refInput = this.refs["input"]

        refInput.addEventListener("input", () => {
            app.refSelected.setCustomElementTag(this.refs["input"].value)
        })

        refInput.addEventListener("change", () => {
            let value = this.refs["input"].value
            if (value == "") {
                if (!app.isCustomTag(app.refSelected.tag)) {
                    value = app.tagsList[app.refSelected.tag].description
                } else {
                    value = "custom"
                }
            }
            app.actions.push( { 
                action: "setCustomElement", 
                node: app.refSelected.appId, 
                oldValue: this.oldValue,
                newValue: value
            } )
            app.refSelected.setCustomElementTag(value)
            this.oldValue = value
        })
    }

    setVisualization () {
        let value = app.refSelected.tag
        this.oldValue = value
        this.refs["input"].value = value
    }
}