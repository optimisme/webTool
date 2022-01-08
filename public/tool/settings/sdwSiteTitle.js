import {utils} from "../scriptUtils.js"

export class sdwSiteTitle extends HTMLElement {
    
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

        this.refs["input"].value = app.site.title
        this.refs["input"].addEventListener('change', (evt) => {
            let value = this.refs["input"].value

            app.actions.push( { 
                action: "setSiteTitle", 
                oldValue: app.site.name,
                newValue: value
            } )

            app.site.title = value
        })
    }

    setVisualization () {
        this.refs["input"].value = app.site.title
    }
}