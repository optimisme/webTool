import {utils} from "../scriptUtils.js"

export class sdwTransition extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.transitionElements = ["-ts-delay", "-ts-duration", "-ts-transition", "-ts-ease"]
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

        this.refs["transition"].change = () => {
            let refList = this.refs["transition-list"]
            let value = this.refs["transition"].value
            if (value == "initial" || value == "") {
                refList.clean()
            }
            utils.setModified(this)
        }

        let refList = this.refs["transition-list"]
        refList.attribute = "transition"
        refList.toForm = () => { this.transitionToForm() }
        refList.toValue = () => { return this.transitionToValue() }
        refList.refParent = this
        refList.sizeName = "menu-effects-transition"
        refList.formElements = this.transitionElements
        refList.separator = ", "

        for (let cnt = 0; cnt < this.transitionElements.length; cnt = cnt + 1) {
            let attr = this.transitionElements[cnt]
            this.refs[attr].setAction = false
            this.refs[attr].change = () => { 
                refList.crtlElementChanged(true)
            }
        }
    }

    setVisualization () {
        let refList = this.refs["transition-list"]
        let transition = app.refSelected.getStyle("transition")

        this.transitionsShowForm("initial")

        if (transition == "" || transition == "initial") {
            this.refs["transition"].setValueWithParams("initial", false, false)
            refList.crtlSetVisualization([])
        } else {
            let arr = transition.split(", ")
            refList.crtlSetVisualization(arr)
        }

        utils.setVisualization(this)
        utils.setExpandable(this, this.expanded)
    }

    transitionToForm () {
        let refList = this.refs["transition-list"]
        let selectedValue = refList.getSelectedText()
        let arr = selectedValue.split(" ")
        let transition = arr[0]
        let duration = (parseFloat(arr[1])).toString()
        let delay = (parseFloat(arr[2])).toString()
        let ease = arr[3]

        this.refs["-ts-transition"].setValueWithParams(transition, false, false)
        this.refs["-ts-duration"].setValueWithParams(duration, false, false)
        this.refs["-ts-delay"].setValueWithParams(delay, false, false)
        this.refs["-ts-ease"].setValueWithParams(ease, false, false)

        this.transitionsShowForm("form")
        if (this.expanded) {
            utils.setExpandable(this, true)
        }
    }

    transitionToValue () {
        let value = "initial"
        let transition = this.refs["-ts-transition"].value
        let duration = this.refs["-ts-duration"].value
        let delay = this.refs["-ts-delay"].value
        let ease = this.refs["-ts-ease"].value

        this.transitionsShowForm("form")

        if (transition == "initial"){ transition = "opacity" }
        if (duration == "initial")  { duration = "0" }
        if (delay == "initial")     { delay = "0" }
        if (ease == "initial")      { ease = "linear" }

        if(delay.indexOf("ms") == -1) delay = delay + "ms"
        if(duration.indexOf("ms") == -1) duration = duration + "ms"

        value = `${transition} ${duration} ${delay} ${ease}`

        return value
    }

    transitionsShowForm (type) {

        if (type == "initial") {
            
            for (let cnt = 0; cnt < this.transitionElements.length; cnt = cnt + 1) {
                let attr = this.transitionElements[cnt]
                this.refs[attr].style.display = "none"
            }

        } else {
            for (let cnt = 0; cnt < this.transitionElements.length; cnt = cnt + 1) {
                let attr = this.transitionElements[cnt]
                this.refs[attr].style.display = "block"
            }
        }

        utils.setModified(this)
    }
}