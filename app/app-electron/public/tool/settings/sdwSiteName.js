import {utils} from "../scriptUtils.js"

export class sdwSiteName extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
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

        this.refs["input"].value = app.site.name

        this.refs["input"].addEventListener('focus', (evt) => {
            app.site.name = this.refs["input"].value
        })

        this.refs["input"].addEventListener('change', (evt) => {
            let value = this.refs["input"].value
            if (value == "") {
                value = "siteName"
            }
            app.actions.push( { 
                action: "setSiteName", 
                node: app.refSelected.appId, 
                oldValue: app.site.name,
                newValue: value
            } )
            app.site.name = value
        })
    }

    setVisualization () { }
}