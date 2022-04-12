import {utils} from "../scriptUtils.js"

export class sdwTransform extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.transformElements  = ["-ts-tr", "-ts-trans-x", "-ts-trans-y", "-ts-trans-z", "-ts-rotate-x", "-ts-rotate-y", "-ts-rotate-z", "-ts-rotate-a", "-ts-scale-x", "-ts-scale-y", "-ts-scale-z", "-ts-skew-x", "-ts-skew-y"]
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

        this.refs["transform"].change = () => {
            let refList = this.refs["transform-list"]
            let value = this.refs["transform"].value
            if (value == "initial" || value == "") {
                refList.clean()
            }
            utils.setModified(this)
        }

        let refList = this.refs["transform-list"]
        refList.attribute = "transform"
        refList.toForm = () => { this.transformToForm() }
        refList.toValue = () => { return this.transformToValue() }
        refList.refParent = this
        refList.formElements = this.transformElements
        refList.separator = " "

        for (let cnt = 0; cnt < this.transformElements.length; cnt = cnt + 1) {
            let attr = this.transformElements[cnt]
            this.refs[attr].setAction = false
            if (attr.indexOf("rotate") >= 0) {
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
        let refList = this.refs["transform-list"]
        let transform = app.refSelected.getStyle("transform")

        this.transformShowForm("initial")

        if (transform == "" || transform == "initial") {
            this.refs["transform"].setValueWithParams("initial", false, false)
            refList.crtlSetVisualization([])
        } else {
            let arr = transform.split(") ")
            for (let cnt = 0; cnt < (arr.length - 1); cnt = cnt + 1) {
                arr[cnt] = arr[cnt] +")"
            }
            refList.crtlSetVisualization(arr)
        }

        utils.setVisualization(this)
        if (this.expanded) {
            utils.setExpandable(this, true)
        }
    }

    transformToForm () {   
        let refList = this.refs["transform-list"]
        let selectedValue = refList.getSelectedText()
        let cleanValue = ((selectedValue.substring(selectedValue.indexOf("(") + 1, selectedValue.indexOf(")"))).replace(/ /g, "").replace("%","")).replace("deg", "")
        let arr = cleanValue.split(",")
        let type = "translate3d"

        if (selectedValue == "") {
            this.refs["-ts-tr"].setValueWithParams("initial", false, false)
            this.refs["-ts-trans-x"].setValueWithParams("initial", false, false)
            this.refs["-ts-trans-y"].setValueWithParams("initial", false, false)
            this.refs["-ts-trans-z"].setValueWithParams("initial", false, false)
            this.refs["-ts-rotate-x"].setValueWithParams("initial", false, false)
            this.refs["-ts-rotate-y"].setValueWithParams("initial", false, false)
            this.refs["-ts-rotate-z"].setValueWithParams("initial", false, false)
            this.refs["-ts-rotate-a"].setValueWithParams("initial", false, false)
            this.refs["-ts-scale-x"].setValueWithParams("initial", false, false)
            this.refs["-ts-scale-y"].setValueWithParams("initial", false, false)
            this.refs["-ts-scale-z"].setValueWithParams("initial", false, false)
            this.refs["-ts-skew-x"].setValueWithParams("initial", false, false)
            this.refs["-ts-skew-y"].setValueWithParams("initial", false, false)
        } else {
            let x = (arr[0] == "initial") ? 0 : arr[0]
            let y = (arr[1] == "initial") ? 0 : arr[1]
            let z = (arr[2] == "initial") ? 0 : arr[2]
            let a = "0"

            if (selectedValue.indexOf("translate3d") >= 0) {
                type = "translate3d"
                this.refs["-ts-tr"].setValueWithParams(type, false, false)
                this.refs["-ts-trans-x"].setValueWithParams(x, false, false)
                this.refs["-ts-trans-y"].setValueWithParams(y, false, false)
                this.refs["-ts-trans-z"].setValueWithParams(z, false, false)
            } else if (selectedValue.indexOf("rotate3d") >= 0) {
                a = (arr[3] == "initial") ? 0 : arr[3]
                type = "rotate3d"
                this.refs["-ts-tr"].setValueWithParams(type, false, false)
                this.refs["-ts-rotate-x"].setValueWithParams(x, false, false)
                this.refs["-ts-rotate-y"].setValueWithParams(y, false, false)
                this.refs["-ts-rotate-z"].setValueWithParams(z, false, false)
                this.refs["-ts-rotate-a"].setValueWithParams((parseFloat(a)).toString(), false, false)
            } else if (selectedValue.indexOf("scale3d") >= 0) {
                type = "scale3d"
                this.refs["-ts-tr"].setValueWithParams(type, false, false)
                this.refs["-ts-scale-x"].setValueWithParams(x, false, false)
                this.refs["-ts-scale-y"].setValueWithParams(y, false, false)
                this.refs["-ts-scale-z"].setValueWithParams(z, false, false)
            } else if (selectedValue.indexOf("skew") >= 0) {
                console.log(0, selectedValue, x, y)
                type = "skew"
                this.refs["-ts-tr"].setValueWithParams(type, false, false)
                this.refs["-ts-skew-x"].setValueWithParams((parseFloat(x)).toString(), false, false)
                this.refs["-ts-skew-y"].setValueWithParams((parseFloat(y)).toString(), false, false)
            }
        }

        this.transformShowForm(type)
        utils.setExpandable(this, true)
    }

    transformToValue () {
        let type = this.refs["-ts-tr"].value
        let value = "initial"
        let x = ""
        let y = ""
        let z = ""
        let a = ""

        this.transformShowForm(type)

        if (type == "translate3d") {
            x = this.refs["-ts-trans-x"].value
            y = this.refs["-ts-trans-y"].value
            z = this.refs["-ts-trans-z"].value
        } else if (type == "rotate3d") {
            x = this.refs["-ts-rotate-x"].value
            y = this.refs["-ts-rotate-y"].value
            z = this.refs["-ts-rotate-z"].value
            a = this.refs["-ts-rotate-a"].value
        } else if (type == "scale3d") {
            x = this.refs["-ts-scale-x"].value
            y = this.refs["-ts-scale-y"].value
            z = this.refs["-ts-scale-z"].value
        } else if (type == "skew") {
            x = this.refs["-ts-skew-x"].value
            y = this.refs["-ts-skew-y"].value
        }

        if (x == "initial") { x = "0" }
        if (y == "initial") { y = "0" }
        if (z == "initial") { z = "0" }
        if (a == "initial") { a = "0" }

        if (type != "initial") {
            if (type == "translate3d" || type == "scale3d") {
                value = `${type}(${x}, ${y}, ${z})`
            } else if (type == "rotate3d") {
                if(a.indexOf("deg") == -1) a = a + "deg"
                value = `${type}(${x}, ${y}, ${z}, ${a})`
            } else if (type == "skew") {
                if(x.indexOf("deg") == -1) x = x + "deg"
                if(y.indexOf("deg") == -1) y = y + "deg"
                value = `${type}(${x}, ${y})`
            }            
        }

        if (value == "initial") {
            value = "translate3d(0px, 0px, 0px)"
        }

        return value
    }

    transformShowForm (type) {

        for (let cnt = 0; cnt < this.transformElements.length; cnt = cnt + 1) {
            let attr = this.transformElements[cnt]
            this.refs[attr].style.display = "none"
        }

        this.refs["-ts-tr"].style.display = "block"

        if (type == "initial") {
            
            this.refs["transform-list"].itemSelect("")

        } else if (type.indexOf("translate3d") >= 0) {
            this.refs["-ts-trans-x"].style.display = "block"
            this.refs["-ts-trans-y"].style.display = "block"
            this.refs["-ts-trans-z"].style.display = "block"
        } else if (type.indexOf("rotate3d") >= 0) {
            type = "rotate3d"
            this.refs["-ts-rotate-x"].style.display = "block"
            this.refs["-ts-rotate-y"].style.display = "block"
            this.refs["-ts-rotate-z"].style.display = "block"
            this.refs["-ts-rotate-a"].style.display = "block"
        } else if (type.indexOf("scale3d") >= 0) {
            type = "scale3d"
            this.refs["-ts-scale-x"].style.display = "block"
            this.refs["-ts-scale-y"].style.display = "block"
            this.refs["-ts-scale-z"].style.display = "block"
        } else if (type.indexOf("skew") >= 0) {
            type = "skew"
            this.refs["-ts-skew-x"].style.display = "block"
            this.refs["-ts-skew-y"].style.display = "block"
        }

        utils.setModified(this)
    }
}