import {utils} from "./scriptUtils.js"

export class sdwToolSettings extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
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

        this.load()
    }

    async load () {

        this.refs = {}

        for (let cnt = 0; cnt < app.settingsList.length; cnt = cnt + 1) {
            let tag = app.settingsList[cnt]
            let nameTag = `sdw-${tag}`
            let nameClass = "sdw" + ((tag.split('-')).map((x) => { return (x.substring(0, 1)).toUpperCase() + x.substring(1) })).join('')
            try {
                eval(nameClass) // Will catch error if it does not exist
                let refNameClean = nameClass.replace('sdw', '')
                let refName = refNameClean.substring(0, 1).toLocaleLowerCase() + refNameClean.substring(1)
                this.refs[refName] = document.createElement(nameTag)
                this.refs[refName].setAttribute("data-ref", tag)
                this.elmRoot.appendChild(this.refs[refName])
            } catch (e) {
                console.warn(`${nameClass}: Not defined`)
            }
        }

        this.refs = utils.getRefs(this.elmRoot)
    }

    setVisualization () {

        app.visualizationPhase = true
        if (app.refSelected) {
            let tag = app.refSelected.tag
            for (let cnt = 0; cnt < app.settingsList.length; cnt = cnt + 1) {
                let setting = app.settingsList[cnt]
                if (!app.isCustomTag(tag)) {
                    if (app.tagsList[tag].settings.indexOf(setting) >= 0) {
                        this.refs[setting].style.display = "block"
                        this.refs[setting].setVisualization()
                    } else {
                        this.refs[setting].style.display = "none"
                    }
                } else {
                    if (setting == "custom-element" || app.tagsList["div"].settings.indexOf(setting) >= 0) {
                        this.refs[setting].style.display = "block"
                        this.refs[setting].setVisualization()
                    } else {
                        this.refs[setting].style.display = "none"
                    }
                }
            }
        } else {
            for (let cnt = 0; cnt < app.settingsList.length; cnt = cnt + 1) {
                let setting = app.settingsList[cnt]
                this.refs[setting].style.display = "none"
            }
        }
        app.visualizationPhase = false
    }

    eraseTextContent () {
        let refs = this.elmRoot.querySelectorAll('sdw-text-content')
        if (refs.length == 1) {
            refs[0].refs["text-content"].value = ""
        }
    }
}