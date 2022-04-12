import {utils} from "../scriptUtils.js"

export class sdwTextShadows extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.shadowElements = ["-ts-horizontal", "-ts-vertical", "-ts-blur", "-ts-color"]
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

        this.refs["text-shadow"].change = () => {
            let refList = this.refs["shadows-list"]
            let value = this.refs["text-shadow"].value
            if (value == "initial" || value == "") {
                refList.clean()
            }
        }

        let refList = this.refs["shadows-list"]
        refList.attribute = "text-shadow"
        refList.toForm = () => { this.shadowToForm() }
        refList.toValue = () => { return this.shadowToValue() }
        refList.refParent = this
        refList.sizeName = "menu-text-shadows"
        refList.formElements = this.shadowElements
        refList.separator = " , "

        for (let cnt = 0; cnt < this.shadowElements.length; cnt = cnt + 1) {
            let attr = this.shadowElements[cnt]
            this.refs[attr].setAction = false
            if (attr == "-ts-set") {
                this.refs[attr].change = () => { 
                    refList.crtlElementChanged(true)
                }
            } else {
                this.refs[attr].input = () => { refList.crtlElementChanged(false) }
                this.refs[attr].change = () => { 
                    refList.crtlElementChanged(true)
                }
            }
        }
    }

    setVisualization () {
        let refList = this.refs["shadows-list"]
        let shadow = app.refSelected.getStyle("text-shadow")

        this.shadowsShowForm("initial")

        if (shadow == "" || shadow == "initial") {
            this.refs["text-shadow"].setValueWithParams("initial", false, false)
            refList.crtlSetVisualization([])
        } else {
            let arr = shadow.split(" , ")
            refList.crtlSetVisualization(arr)
        }

        utils.setVisualization(this)
        utils.setExpandable(this, this.expanded)
    }

    shadowToForm () {   
        let refList = this.refs["shadows-list"]
        let selectedValue = refList.getSelectedText()
        let cleanValue = selectedValue.replace("inset ", "")
        let arr = cleanValue.split(" ")
        let set = "initial"

        if (selectedValue.indexOf("inset") >= 0) {
            set = "inset"
        }

        if (selectedValue == "") {
            this.refs["-ts-horizontal"].setValueWithParams("initial", false, false)
            this.refs["-ts-vertical"].setValueWithParams("initial", false, false)
            this.refs["-ts-blur"].setValueWithParams("initial", false, false)
            this.refs["-ts-color"].setValueWithParams("initial", false, false)
        } else {
            this.refs["-ts-horizontal"].setValueWithParams(parseInt(arr[0]), false, false)
            this.refs["-ts-vertical"].setValueWithParams(parseInt(arr[1]), false, false)
            this.refs["-ts-blur"].setValueWithParams(parseInt(arr[2]), false, false)
            this.refs["-ts-color"].setValueWithParams(arr[3], false, false)
        }

        this.shadowsShowForm("form")
        if (this.expanded) {
            utils.setExpandable(this, true)
        }
    }

    shadowToValue () {
        let value = ""
        let tmp = ""

        this.shadowsShowForm("form")

        tmp = "-ts-horizontal"
        if (this.refs[tmp].value == "initial") { value = value + "0px " } else { value = value + this.refs[tmp].value + "px " }

        tmp = "-ts-vertical"
        if (this.refs[tmp].value == "initial") { value = value + "0px " } else { value = value + this.refs[tmp].value + "px " }

        tmp = "-ts-blur"
        if (this.refs[tmp].value == "initial") { value = value + "0px " } else { value = value + this.refs[tmp].value + "px " }

        tmp = "-ts-color"
        if (this.refs[tmp].value == "initial") { value = value + "#000" } else { value = value + this.refs[tmp].value }

        return value
    }

    shadowsShowForm (type) {

        if (type == "initial") {
            
            for (let cnt = 0; cnt < this.shadowElements.length; cnt = cnt + 1) {
                let attr = this.shadowElements[cnt]
                this.refs[attr].style.display = "none"
            }

        } else {
            for (let cnt = 0; cnt < this.shadowElements.length; cnt = cnt + 1) {
                let attr = this.shadowElements[cnt]
                this.refs[attr].style.display = "block"
            }
        }

        utils.setModified(this)
    }
}