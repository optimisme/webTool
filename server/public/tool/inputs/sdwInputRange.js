import { utils } from "../scriptUtils.js"

export class sdwInputRange extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.input = undefined
        this.change = undefined
        this.setAction = true
        this.attr = ""
        this.oldValue = "initial"
    }

    static get observedAttributes() { return ["disabled"]; }

    attributeChangedCallback(name, oldValue, newValue) { 

        if (name == "disabled") {
            if (newValue == "true") {
                this.refs["range"].setAttribute("disabled", "true")
            } else {
                this.refs["range"].removeAttribute("disabled")
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
            if (this.change) {
                this.change()
            }
        })
            let imgInitial = document.createElement("img")
            imgInitial.setAttribute("src", "./icons/initial.svg")
            divInitial.appendChild(imgInitial)
        row.appendChild(divInitial)

        let refInput = document.createElement("input")
        refInput.setAttribute("data-ref", "range")
        refInput.setAttribute("type", "range")
        refInput.setAttribute("min", this.getAttribute("data-min"))
        refInput.setAttribute("max", this.getAttribute("data-max"))
        refInput.setAttribute("step", this.getAttribute("data-step"))
        refInput.value = "0"
        refInput.addEventListener("focus", () => {
            this.oldValue = this.value
        })
        refInput.addEventListener("input", () => {
            let refRange = this.refs["range"]
            let refText = this.refs["text"]
            this.setValueWithParams(refRange.value, false, true)
            refText.innerHTML = refRange.value
        })
        refInput.addEventListener("change", () => {
            let refRange = this.refs["range"]
            let refText = this.refs["text"]
            let newValue = refRange.value
            this.setValueWithParams(this.oldValue, false, true)
            this.setValueWithParams(newValue, this.setAction, true)
            refText.innerHTML = newValue
            if (this.change) {
                this.change()
            }
        })
        row.appendChild(refInput)

        let refText = document.createElement("div")
        refText.setAttribute("data-ref", "text")
        refText.setAttribute("class", "text")
        refText.innerHTML = "0"
        row.appendChild(refText)

        let divIcon = document.createElement("div")
        divIcon.setAttribute("class", "icon")
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

    setValueWithParams (value, action, input) {
        let refRange = this.refs["range"]
        let refText = this.refs["text"]
        let refInitial = this.refs["buttonInitial"]
        let classes = {
            "inputInherited":   { ref: refRange,    name: "inheritedRange",  added: false },
            "initialInherited": { ref: refInitial,  name: "buttonInherited", added: false },
            "initialSelected":  { ref: refInitial,  name: "buttonSelected",  added: false },
        }

        if (value == "") {
            value = "initial"
        }

        if (value == "initial") {

            app.refSelected.setStyle(this.attr, "initial", action)
            let inheritedStyle = app.refSelected.isInheritedStyle(this.attr)

            if (inheritedStyle) {
                classes["initialInherited"].added = true
                classes["inputInherited"].added = true
                let style = app.refSelected.getStyle(this.attr)
                refRange.value = style
                refText.innerHTML = style
            } else {
                classes["initialSelected"].added = true
                refRange.value = 0
                refText.innerHTML = ""
            }

        } else {

            app.refSelected.setStyle(this.attr, value, action)
            let inheritedStyle = app.refSelected.isInheritedStyle(this.attr)

            if (inheritedStyle) {
                classes["initialInherited"].added = true
                classes["inputInherited"].added = true
                let style = app.refSelected.getStyle(this.attr)
                refRange.value = style
                refText.innerHTML = style
            } else {
                refRange.value = value
                refText.innerHTML = value
            }
        }

        utils.setInputClasses(classes)

        if (input && typeof this.input == "function") {
            this.input(refRange.value, action)
        }
    }
}