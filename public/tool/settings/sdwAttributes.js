import {utils} from "../scriptUtils.js"

export class sdwAttributes extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.expanded = false

        this.attributesElements = ["inputName", "inputValue"]
        this.allowSetAction = true
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

        let refInput = this.refs["-attributes-input"]
        refInput.setAction = false
        refInput.change =  () => {
            let refList = this.refs["attributes-list"]
            if (refInput.value == "initial") {
                refList.clean()
            }
            if (this.allowSetAction) {
                this.attributesUpdateElement()
            }
        }

        let refList = this.refs["attributes-list"]
        refList.attribute = "-attributes-input"
        this.setAction = false
        refList.toForm = () => { this.attributesToForm() }
        refList.toValue = () => { return this.attributesToValue() }
        refList.refParent = this
        refList.sizeName = ""
        refList.formElements = this.attributesElements
        refList.separator = ":;"

        for (let cnt = 0; cnt < this.attributesElements.length; cnt = cnt + 1) {
            let attr = this.attributesElements[cnt]
            this.refs[attr].addEventListener("change", () => { 
                if (this.allowSetAction) {
                    refList.crtlElementChanged(false) 
                }
            })
        }
    }

    setVisualization () {
        let refAttrsList = this.refs["attributes-list"]
        let obj = app.refSelected.attributes
        let keys = Object.keys(obj)
        let refLink = this.refs["link"]

        refLink.innerHTML = `&lt;${app.refSelected.tag}&gt;`
        
        if (!app.isCustomTag(app.refSelected.tag)) {
            refLink.setAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/' + app.refSelected.tag)
            refLink.style.textDecoration = "underline"
            refLink.style.pointerEvents = "unset"
        } else {
            refLink.style.textDecoration = "none"
            refLink.style.pointerEvents = "none"
        }

        this.allowSetAction = false

        this.refs["inputName"].value = ""
        this.refs["inputValue"].value = ""
        this.refs["inputName"].setAttribute("disabled", true)
        this.refs["inputValue"].setAttribute("disabled", true)

        if (keys.length == 0) {
            this.refs["-attributes-input"].value = "initial"
            refAttrsList.crtlSetVisualization([])
        } else {
            let arr = []
            for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
                arr.push(`${keys[cnt]}="${obj[keys[cnt]]}"`)
            }
            this.refs["-attributes-input"].value = arr.join(":;")
            refAttrsList.crtlSetVisualization(arr)
        }
        
        this.allowSetAction = true
    }

    attributesToForm () {   
        let refList = this.refs["attributes-list"]
        let selectedValue = refList.getSelectedText()
        let name = selectedValue.substring(0, selectedValue.indexOf("="))
        let value = selectedValue.substring(selectedValue.indexOf("=") + 1)

        this.refs["inputName"].removeAttribute("disabled")
        this.refs["inputValue"].removeAttribute("disabled")

        if (selectedValue == "") {
            this.refs["inputName"].value = ""
            this.refs["inputValue"].value = ""
        } else {
            this.refs["inputName"].value = name
            this.refs["inputValue"].value = value.substring(1, value.length - 1)
        }
    }

    attributesToValue () {
        let name = this.refs["inputName"].value
        let value = this.refs["inputValue"].value

        if (name == "") name = "data-"
        if (value == "") value = ""

        return `${name}="${value}"`
    }

    attributesUpdateElement () {
        let obj = this.attributesStrToObj(this.refs["-attributes-input"].value)

        app.actions.push( { 
            action: "setAttributes", 
            node: app.refSelected.appId, 
            oldValue: JSON.stringify(app.refSelected.attributes),
            newValue: JSON.stringify(obj)
        } )

        app.refSelected.setAttributes(obj)
    }

    attributesStrToObj (str) {
        let arrList = []
        let obj = {}

        if (str != "initial") {
            arrList = str.split(":;")
        }

        for (let cnt = 0; cnt < arrList.length; cnt = cnt + 1) {
            let item = arrList[cnt]
            let name = item.substring(0, item.indexOf("="))
            let value = item.substring(item.indexOf("=") + 1)
            obj[name] = value.substring(1, value.length - 1)
        }

        return obj
    }
}