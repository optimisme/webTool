import {utils} from "../scriptUtils.js"

export class sdwBackdropFilters extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.filterElements     = ["-ts-f", "-ts-f-size", "-ts-f-angle", "-ts-f-percent", "-ts-f-percent2", "-ts-f-amount"]
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

        this.refs["backdrop-filter"].change = () => {
            let refList = this.refs["filter-list"]
            let value = this.refs["backdrop-filter"].value
            if (value == "initial" || value == "") {
                refList.clean()
            }
            utils.setModified(this)
        }

        let refList = this.refs["filter-list"]
        refList.attribute = "backdrop-filter"
        refList.toForm = () => { this.filterToForm() }
        refList.toValue = () => { return this.filterToValue() }
        refList.refParent = this
        refList.formElements = this.filterElements
        refList.separator = " "

        for (let cnt = 0; cnt < this.filterElements.length; cnt = cnt + 1) {
            let attr = this.filterElements[cnt]
            this.refs[attr].setAction = false
            if (attr.indexOf("angle") >= 0 || attr.indexOf("percent") >= 0) {
                this.refs[attr].input = () => { refList.crtlElementChanged(false) }
                this.refs[attr].change = () => { 
                    refList.crtlElementChanged(true)
                }
            } else {
                this.refs[attr].change = () => { 
                    refList.crtlElementChanged(true)
                    if (attr == "-ts-tr" && this.expanded) {
                        utils.setExpandable(this, true)
                    }
                }
            }
        }
    }

    setVisualization () {
        let refList = this.refs["filter-list"]
        let filter = app.refSelected.getStyle("backdrop-filter")

        this.filterShowForm("initial")

        if (filter == "" || filter == "initial") {
            this.refs["backdrop-filter"].setValueWithParams("initial", false, false)
            refList.crtlSetVisualization([])
        } else {
            let arr = filter.split(") ")
            for (let cnt = 0; cnt < (arr.length - 1); cnt = cnt + 1) {
                arr[cnt] = arr[cnt] +")"
            }
            refList.crtlSetVisualization(arr)
        }

        utils.setVisualization(this)
    }

    filterToForm () {   
        let refList = this.refs["filter-list"]
        let selectedValue = refList.getSelectedText()
        let cleanValue = ((selectedValue.substring(selectedValue.indexOf("(") + 1, selectedValue.indexOf(")"))).replace(/ /g, "").replace("%","")).replace("deg", "")
        let type = ""

        if (selectedValue == "") {

            this.refs["-ts-f-size"].setValueWithParams("initial", false, false)
            this.refs["-ts-f-amount"].setValueWithParams("initial", false, false)
            this.refs["-ts-f-percent"].setValueWithParams("initial", false, false)
            this.refs["-ts-f-percent2"].setValueWithParams("initial", false, false)
            this.refs["-ts-f-angle"].setValueWithParams("initial", false, false)
            
        } else {
            if (selectedValue.indexOf("blur") >= 0) {
                type = "blur"
                this.refs["-ts-f"].setValueWithParams(type, false, false)
                this.refs["-ts-f-size"].setValueWithParams(cleanValue, false, false)
            } else if (selectedValue.indexOf("brightness") >= 0) {
                type = "brightness"
                this.refs["-ts-f"].setValueWithParams(type, false, false)
                this.refs["-ts-f-percent2"].setValueWithParams(cleanValue, false, false)
            } else if (selectedValue.indexOf("contrast") >= 0) {
                type = "contrast"
                this.refs["-ts-f"].setValueWithParams(type, false, false)
                this.refs["-ts-f-percent"].setValueWithParams(cleanValue, false, false)
            } else if (selectedValue.indexOf("grayscale") >= 0) {
                type = "grayscale"
                this.refs["-ts-f"].setValueWithParams(type, false, false)
                this.refs["-ts-f-percent"].setValueWithParams(cleanValue, false, false)
            } else if (selectedValue.indexOf("hue-rotate") >= 0) {
                type = "hue-rotate"
                this.refs["-ts-f"].setValueWithParams(type, false, false)
                this.refs["-ts-f-angle"].setValueWithParams(cleanValue, false, false)
            } else if (selectedValue.indexOf("invert") >= 0) {
                type = "invert"
                this.refs["-ts-f"].setValueWithParams(type, false, false)
                this.refs["-ts-f-percent"].setValueWithParams(cleanValue, false, false)
            } else if (selectedValue.indexOf("opacity") >= 0) {
                type = "opacity"
                this.refs["-ts-f"].setValueWithParams(type, false, false)
                this.refs["-ts-f-percent"].setValueWithParams(cleanValue, false, false)
            } else if (selectedValue.indexOf("saturate") >= 0) {
                type = "saturate"
                this.refs["-ts-f"].setValueWithParams(type, false, false)
                this.refs["-ts-f-percent2"].setValueWithParams(cleanValue, false, false)
            } else if (selectedValue.indexOf("sepia") >= 0) {
                type = "sepia"
                this.refs["-ts-f"].setValueWithParams(type, false, false)
                this.refs["-ts-f-percent"].setValueWithParams(cleanValue, false, false)
            }
        }

        this.filterShowForm(type)
    }

    filterToValue () {
        let type = this.refs["-ts-f"].value
        let value = "initial"
        let x = ""

        this.filterShowForm(type)

        if (type.indexOf("initial") >= 0) {

            this.refs["filter-list"].itemSelect("")

        } else if (type.indexOf("blur") >= 0) {

            x = this.refs["-ts-f-size"].value

        } else if (type.indexOf("brightness") >= 0) {

            x = this.refs["-ts-f-percent2"].value

        } else if (type.indexOf("contrast") >= 0) {

            x = this.refs["-ts-f-percent"].value

        } else if (type.indexOf("grayscale") >= 0) {

            x = this.refs["-ts-f-percent"].value

        } else if (type.indexOf("hue-rotate") >= 0) {

            x = this.refs["-ts-f-angle"].value

        } else if (type.indexOf("invert") >= 0) {

            x = this.refs["-ts-f-percent"].value

        } else if (type.indexOf("opacity") >= 0) {

            x = this.refs["-ts-f-percent"].value

        } else if (type.indexOf("saturate") >= 0) {

            x = this.refs["-ts-f-percent2"].value

        } else if (type.indexOf("sepia") >= 0) {

            x = this.refs["-ts-f-percent"].value
        }

        if (type != "initial") {
            if (x == "initial") {
                x = "0"
            }
            if (["brightness", "contrast", "grayscale", "invert", "opacity", "saturate", "sepia"].indexOf(type) >= 0) {
                if(x.indexOf("%") == -1) x = x + "%"
            } else if (type.indexOf("hue-rotate") >= 0) {
                if(x.indexOf("deg") == -1) x = x + "deg"
            }
            value = `${type}(${x})`
        }

        if (value == "initial") {
            value = "blur(0px)"
        }

        return value
    }

    filterShowForm (type) {

        for (let cnt = 0; cnt < this.filterElements.length; cnt = cnt + 1) {
            let attr = this.filterElements[cnt]
            this.refs[attr].style.display = "none"
        }

        this.refs["-ts-f"].style.display = "block"

        if (type.indexOf("initial") >= 0) {

            this.refs["filter-list"].itemSelect("")

        } else if (type.indexOf("blur") >= 0) {

            this.refs["-ts-f-size"].style.display = "block"

        } else if (type.indexOf("brightness") >= 0) {

            this.refs["-ts-f-percent2"].style.display = "block"

        } else if (type.indexOf("contrast") >= 0) {

            this.refs["-ts-f-percent"].style.display = "block"

        } else if (type.indexOf("grayscale") >= 0) {

            this.refs["-ts-f-percent"].style.display = "block"

        } else if (type.indexOf("hue-rotate") >= 0) {

            this.refs["-ts-f-angle"].style.display = "block"

        } else if (type.indexOf("invert") >= 0) {

            this.refs["-ts-f-percent"].style.display = "block"

        } else if (type.indexOf("opacity") >= 0) {

            this.refs["-ts-f-percent"].style.display = "block"

        } else if (type.indexOf("saturate") >= 0) {

            this.refs["-ts-f-percent2"].style.display = "block"

        } else if (type.indexOf("sepia") >= 0) {

            this.refs["-ts-f-percent"].style.display = "block"
        }

        utils.setModified(this)
    }
}