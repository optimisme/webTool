import { utils } from "../scriptUtils.js"

export class sdwInputSize extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.change = undefined
        this.setAction = true
        this.attr = ""
    }

    static get observedAttributes() { return ["disabled"]; }

    attributeChangedCallback(name, oldValue, newValue) { 

        if (name == "disabled") {
            if (newValue == "true") {
                this.refs["value"].setAttribute("disabled", "true")
            } else {
                this.refs["value"].removeAttribute("disabled")
            }
        }
    }

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
        let row = document.createElement("div")
        let name = document.createElement("div")
        
        this.attr = this.getAttribute("data-attr")

        row.setAttribute("class", "row")
        this.elmRoot.appendChild(row)

        name.setAttribute("class", "name")
        if (this.hasAttribute("data-help")) {
            let refHelp = document.createElement("a")
            refHelp.setAttribute("href", this.getAttribute("data-help"))
            refHelp.setAttribute("target", "_blank")
            refHelp.innerHTML = this.attr
            name.appendChild(refHelp)
        } else {
            name.innerHTML = this.attr
        }
        row.appendChild(name)

        let divInitial = document.createElement("div")
        divInitial.setAttribute("class", "button buttonSelected")
        divInitial.setAttribute("data-ref", "buttonInitial")
        divInitial.setAttribute("data-value", "initial")
        divInitial.setAttribute("data-tooltip", "Initial, removes this property")
        divInitial.addEventListener("click", () => {
            this.value = "initial"
        })
            let imgInitial = document.createElement("img")
            imgInitial.setAttribute("src", "./icons/initial.svg")
            divInitial.appendChild(imgInitial)
        row.appendChild(divInitial)

        let refInput = document.createElement("input")
        refInput.setAttribute("data-ref", "value")
        if (this.hasAttribute("data-auto") && this.getAttribute("data-auto") == "true") {
            refInput.setAttribute("placeholder", "Ex: 2px, auto")
        } else {
            refInput.setAttribute("placeholder", "Ex: 2px, 1.2em")
        }        
        refInput.value = ""
        refInput.addEventListener("change", () => {
            this.changeInput()
        })
        row.appendChild(refInput)

        let divIcon = document.createElement("div")
        divIcon.setAttribute("class", "icon")
        if (this.hasAttribute("data-icon-tooltip")) {
            divIcon.setAttribute("data-tooltip", this.getAttribute("data-icon-tooltip"))
        }
            let imgIcon = document.createElement("img")
            if (this.hasAttribute("data-img")) {
                imgIcon.setAttribute("src", this.getAttribute("data-img"))
            } else {
                imgIcon.setAttribute("src", "./icons/empty.svg")
            }
            divIcon.appendChild(imgIcon)
        row.appendChild(divIcon)

        utils.initTooltips(this.elmRoot)
        this.refs = utils.getRefs(this.elmRoot)
    }

    get value () {
        return app.refSelected.getStyle(this.attr)
    }

    set value (value) {
        this.setValueWithParams(value, true, true)
    }

    setValueWithParams (value, action, change) {
        let refInput = this.refs["value"]
        let refInitial = this.refs["buttonInitial"]
        let classes = {
            "inputInherited":   { ref: refInput,    name: "inheritedInput",  added: false },
            "initialInherited": { ref: refInitial,  name: "buttonInherited", added: false },
            "initialSelected":  { ref: refInitial,  name: "buttonSelected",  added: false },
        }

        if (value == "") {
            value = "initial"
        }

        if (value == "initial") {
            value = "initial"
        } else if (value == "auto" && (!this.hasAttribute("data-auto") || this.getAttribute("data-auto") != "true")) {
            value = "initial"
        }

        if (value == "initial") {

            app.refSelected.setStyle(this.attr, "initial", action && this.setAction)
            let inheritedStyle = app.refSelected.isInheritedStyle(this.attr)

            if (inheritedStyle) {
                classes["initialInherited"].added = true
                classes["inputInherited"].added = true
                let style = app.refSelected.getStyle(this.attr)
                refInput.value = style
            } else {
                classes["initialSelected"].added = true
                refInput.value = ""
            }

        } else {

            app.refSelected.setStyle(this.attr, value, action && this.setAction)
            let inheritedStyle = app.refSelected.isInheritedStyle(this.attr)

            if (inheritedStyle) {
                classes["initialInherited"].added = true
                classes["inputInherited"].added = true
                let style = app.refSelected.getStyle(this.attr)
                refInput.value = style
            } else {
                refInput.value = value
            }
        }

        utils.setInputClasses(classes)

        if (change && typeof this.change == "function") {
            this.change(refInput.value, action)
        }
    }

    changeInput () {
        let refInput = this.refs["value"]
        if (refInput.value == "initial" || refInput.value == "") {
            if (refInput.value == "auto") {
                this.value = "auto"
            } else {
                this.value = "initial"
            }
        } else {
            this.value = refInput.value
        }
    }

    changeSelect () {
        let refInput = this.refs["value"]
        if (refSelect.value == "initial") {
            this.value = refSelect.value
        } else if (refInput.value == "") {    
            this.value = "0"
        } else {
            this.value = refInput.value
        }
    }
}