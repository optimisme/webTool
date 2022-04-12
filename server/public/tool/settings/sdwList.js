import { utils } from "../scriptUtils.js"

export class sdwList extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.counter = 0
        this.selected = ""
        this.defaultText = ""

        this.attribute = ""
        this.formFixed = false
        this.toValue = undefined
        this.toForm = undefined
        this.refParent = undefined
        this.formElements = []
        this.separator = " "
        this.oldValue = "initial"
        this.setAction = true
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
        let refSubtitle = this.refs["subtitle"]
        let refAdd = this.refs["add"]

        if (this.hasAttribute("data-default")) {
            this.defaultText = this.getAttribute("data-default")
        } else {
            this.defaultText = ""
        }

        refSubtitle.innerHTML = this.getAttribute("data-subtitle") + ":" 
        refAdd.innerHTML = "+ " + this.getAttribute("data-add")

        refAdd.addEventListener("click", () => {
            if (this.defaultText == "") {
                this.itemAdd(`item-${this.counter}="x"`, this.setAction)
            } else {
                this.itemAdd(this.defaultText, this.setAction)
            }
        })      
    }

    clean () {
        this.counter = 0
        this.selected = ""
        this.refs["list"].innerHTML = ""
        this.refs = utils.getRefs(this.elmRoot)
    }

    itemAdd (text, action) {
        let refList = this.refs["list"]
        let name = "item-" + this.counter++
        let row = document.createElement("div")

        row.setAttribute("data-ref", name)
        row.setAttribute("class", "row")
        
            let divText = document.createElement("div")
            divText.setAttribute("class", "text")
            divText.innerHTML = text
            divText.addEventListener("click", () => {
                this.itemSelect(name)
            })
            row.appendChild(divText)

            let img = document.createElement("img")
            img.setAttribute("src", "./icons/delete.svg")
            img.addEventListener("click", () => {
                this.itemRemove(name)
            })
            row.appendChild(img)
        
        refList.appendChild(row)

        this.refs = utils.getRefs(this.elmRoot)

        this.itemSelect(name)

        this.crtlListChanged(action)

        return name
    }

    itemRemove (name) {
        let refList = this.refs["list"]
        let ref = this.refs[name]

        refList.removeChild(ref)
        delete this.refs[name]

        if (name == this.selected) {
            this.selected = ""
        }

        this.refs = utils.getRefs(this.elmRoot)

        this.crtlListChanged(this.setAction)
    }

    itemSelect (name) {

        if (this.selected != "") {
            this.refs[this.selected].classList.remove("selected")
        }

        if (name == this.selected || name == "") {
            this.selected = ""
        } else {
            this.selected = name
            this.refs[name].classList.add("selected")
        }

        this.crtlListSelected(name)
    }

    getList () {
        let keys = Object.keys(this.refs)
        let arr = []

        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let key = keys[cnt]
            if (key.indexOf("item-") >= 0) {
                arr.push((this.refs[key]).querySelectorAll(".text")[0].innerHTML)
            }
        }

        return arr
    }

    setSelectedText (text) {
        if (this.selected != "") {
            this.refs[this.selected].querySelectorAll(".text")[0].innerHTML = text
        }
    }

    getSelectedText () {
        if (this.selected != "") {
            return this.refs[this.selected].querySelectorAll(".text")[0].innerHTML
        }
        return ""
    }

    crtlSetVisualization (arr) {
        this.formFixed = true
        this.clean()
        for (let cnt = 0; cnt < arr.length; cnt = cnt + 1) {
            this.itemAdd(arr[cnt], false)
        }
        this.formFixed = false
    }

    crtlListSelected () {
        if (this.selected == "") {
            for (let cnt = 0; cnt < this.formElements.length; cnt = cnt + 1) {
                let attr = this.formElements[cnt]
                this.refParent.refs[attr].setAttribute("disabled", "true")
            }
        } else {
            for (let cnt = 0; cnt < this.formElements.length; cnt = cnt + 1) {
                let attr = this.formElements[cnt]
                this.refParent.refs[attr].removeAttribute("disabled")
            }
            if (typeof this.toForm == "function") {
                this.toForm()
            }
        }
    }

    crtlListChanged (action) {
        this.crtlSetList(action)
        this.crtlListSelected()
        if (this.refParent.expanded) {
            utils.setExpandable(this.refParent, true)
        }
    }

    crtlElementChanged (action) {
        if (!this.formFixed && typeof this.toValue == "function") {
            this.setSelectedText(this.toValue())
            this.crtlSetList(action)
        }
    }

    crtlSetList (action) {
        let arr = this.getList()
        let value = arr.join(this.separator)
        if (action) {
            this.refParent.refs[this.attribute].setValueWithParams(this.oldValue, false, false)
            this.oldValue = value
        }
        this.refParent.refs[this.attribute].setValueWithParams(value, action, true)
    }
}