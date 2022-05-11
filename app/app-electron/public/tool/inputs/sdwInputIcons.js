import { utils } from "../scriptUtils.js"

export class sdwInputIcons extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.change = undefined
        this.setAction = true
        this.attr = ""
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
        let items = this.getElementsByTagName("item")
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

        for (let cnt = 0; cnt < items.length; cnt = cnt + 1) {
            let item = items[cnt]
            let div = document.createElement("div")
            let value = item.getAttribute("data-value")

            if (value == 'initial') {
                div.setAttribute("class", "button buttonSelected")
            } else {
                div.setAttribute("class", "button")
            }
            div.setAttribute("data-ref", this.attr + "-" + value)
            div.setAttribute("data-value", value)
            div.setAttribute("data-tooltip", item.getAttribute("data-tooltip"))
            div.addEventListener("click", () => {
                this.value = value
            })

                let img = document.createElement("img")
                img.setAttribute("src", item.getAttribute("data-img"))
                div.appendChild(img)

            row.appendChild(div)
        }

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

    setValueWithParams (value, action, change) {
        let refKeys = Object.keys(this.refs)

        if (value != "" && value != "initial") {
            app.refSelected.setStyle(this.attr, value, action && this.setAction)
        } else {
            app.refSelected.setStyle(this.attr, "initial", action && this.setAction)
        }   

        let style = app.refSelected.getStyle(this.attr)
        let inheritedStyle = app.refSelected.isInheritedStyle(this.attr)
        let classes = {}
        let ref = undefined

        for (let cnt = 0; cnt < refKeys.length; cnt = cnt + 1) {
            ref = this.refs[refKeys[cnt]]
            if (ref.getAttribute("class").indexOf("button") >= 0) {
                classes["selected" + cnt] = { ref: ref, name: "buttonSelected", added: false }
                classes["inherited" + cnt] = { ref: ref, name: "buttonInherited", added: false }
                if (refKeys[cnt].indexOf("-initial") >= 0 && inheritedStyle) {
                    classes["inherited" + cnt].added = true
                }
                if (ref.getAttribute("data-value") == value) {
                    classes["selected" + cnt].added = true
                }
                if (ref.getAttribute("data-value") == style && inheritedStyle) {
                    classes["inherited" + cnt].added = true
                }
            }
        }     

        utils.setInputClasses(classes)

        if (change && typeof this.change == "function") {
            this.change(value)
        }
    }
}