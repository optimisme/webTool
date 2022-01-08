import { utils } from "../scriptUtils.js"

export class sdwInputSelect extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.change = undefined
        this.setAction = true
        this.attr = ""
        this.options = []
    }

    static get observedAttributes() { return ["disabled"]; }

    attributeChangedCallback(name, oldValue, newValue) { 

        if (name == "disabled") {
            if (newValue == "true") {
                this.refs["type"].setAttribute("disabled", "true")
            } else {
                this.refs["type"].removeAttribute("disabled")
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
        this.options = JSON.parse(this.getAttribute("data-options"))

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

        let refSelect = document.createElement("select")
        refSelect.setAttribute("data-ref", "type")
        refSelect.value = "initial"

            for (let cnt = 0; cnt < this.options.length; cnt = cnt + 1) {
                let value = this.options[cnt]
                let refOption = document.createElement("option")
                refOption.innerText = value
                refOption.value = value
                refSelect.appendChild(refOption)
            }

        refSelect.addEventListener("change", () => {
            this.changeSelect()
        })
        row.appendChild(refSelect)

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
        let refSelect = this.refs["type"]
        let refInitial = this.refs["buttonInitial"]
        let classes = {
            "inputInherited":   { ref: refSelect,   name: "inheritedInput",  added: false },
            "initialInherited": { ref: refInitial,  name: "buttonInherited", added: false },
            "initialSelected":  { ref: refInitial,  name: "buttonSelected",  added: false },
        }

        if (value == "") {
            value = "initial"
        }

        if (value == "initial") {

            app.refSelected.setStyle(this.attr, "initial", action && this.setAction)
            let inheritedStyle = app.refSelected.isInheritedStyle(this.attr)

            if (inheritedStyle) {
                classes["initialInherited"].added = true
                classes["inputInherited"].added = true
                let style = app.refSelected.getStyle(this.attr)
                refSelect.value = style
            } else {
                classes["initialSelected"].added = true
                refSelect.value = ""
            }

        } else {

            app.refSelected.setStyle(this.attr, value, action && this.setAction)
            let inheritedStyle = app.refSelected.isInheritedStyle(this.attr)

            if (inheritedStyle) {
                classes["initialInherited"].added = true
                classes["inputInherited"].added = true
                let style = app.refSelected.getStyle(this.attr)
                refSelect.value = style
            } else {
                refSelect.value = value
            }
        }

        utils.setInputClasses(classes)

        if (change && typeof this.change == "function") {
            this.change(refSelect.value, action)
        }
    }

    changeSelect () {
        let refSelect = this.refs["type"]
        this.value = refSelect.value
    }

    setList (arr) {
        let refSelect = this.refs["type"]
        refSelect.innerHTML = ""
        refSelect.value = "initial"

        for (let cnt = 0; cnt < arr.length; cnt = cnt + 1) {
            let value = arr[cnt]
            let refOption = document.createElement("option")
            refOption.innerText = value
            refOption.value = value
            refSelect.appendChild(refOption)
        }
    }
}