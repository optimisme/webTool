import {utils} from "../scriptUtils.js"

export class sdwDisplay extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.type = "row"
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

        let refDisplay = this.elmRoot.querySelectorAll("*[data-attr='display']")[0]
        refDisplay.change =(value) => {
            this.selectOptionDisplay(value)
            if (value != "flex") {
                // Do not use a bucle here!
                this.refs["flex-direction"].setValueWithParams("initial", false)
                this.refs["align-items-row"].setValueWithParams("initial", false)
                this.refs["align-items-column"].setValueWithParams("initial", false)
                this.refs["justify-content-row"].setValueWithParams("initial", false)
                this.refs["justify-content-column"].setValueWithParams("initial", false)
                this.refs["flex-wrap-row"].setValueWithParams("initial", false)
                this.refs["flex-wrap-column"].setValueWithParams("initial", false)
                this.refs["align-content-row"].setValueWithParams("initial", false)
                this.refs["align-content-column"].setValueWithParams("initial", false)
            }
            utils.setModified(this)
        }

        let refDirection = this.elmRoot.querySelectorAll("*[data-attr='flex-direction']")[0]
        refDirection.change =(value) => {
            if (value.indexOf("column") >= 0) {
                this.selectOptionFlexDirection("column")
            } else {
                // Includes 'initial' & 'row'
                this.selectOptionFlexDirection("row")
            }
            utils.setModified(this)
        }
    }

    setVisualization () {
        utils.setVisualization(this)

        let display = app.refSelected.getStyle('display')
        let direction = app.refSelected.getStyle('flex-direction')
        
        this.selectOptionDisplay(display)

        if (direction.indexOf("column") >= 0) {
            this.selectOptionFlexDirection("column")
        } else { 
            // Includes 'initial' & 'row'
            this.selectOptionFlexDirection("row")
        }
    }

    selectOptionDisplay (value) {
        if (value == "flex") {
            this.refs["viewFlex"].style.display = "block"
        } else {
            if (value == "initial") {
                let inheritedStyle = app.refSelected.getStyle("display")
                if (inheritedStyle == "flex") {
                    this.refs["viewFlex"].style.display = "block"
                } else {
                    this.refs["viewFlex"].style.display = "none"
                }
            } else {
                this.refs["viewFlex"].style.display = "none"
            }
        }

        if (this.expanded) {
            utils.setExpandable(this, true)
        }
    }

    selectOptionFlexDirection (value) {
        let imgAlignRows =  this.elmRoot.getElementsByClassName('imgAlignRow')
        let imgAlignColumns =  this.elmRoot.getElementsByClassName('imgAlignColumn')
        let newType = "row"

        if (value.indexOf("column") >= 0) {
            newType = "column"
        }

        if (newType != this.type) {
            this.type = newType
            for (let cnt = 0; cnt < imgAlignRows.length; cnt = cnt + 1) {
                if (this.type == "column") {
                    imgAlignRows[cnt].setAttribute("style", "display: none !important;")
                    imgAlignColumns[cnt].setAttribute("style", "display: flex !important;")
                } else {
                    imgAlignRows[cnt].setAttribute("style", "display: flex !important;")
                    imgAlignColumns[cnt].setAttribute("style", "display: none !important;")
                }
            }
        }
    }
}