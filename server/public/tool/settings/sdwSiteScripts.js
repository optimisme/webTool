import {utils} from "../scriptUtils.js"

export class sdwSiteScripts extends HTMLElement {
    
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

        this.refs = utils.getRefs(this.elmRoot)
        this.load()
    }

    async load () { }

    setVisualization () {
        
        this.refs["list"].innerHTML = ""

        for (let cnt = 0; cnt < app.site.scripts.length; cnt = cnt + 1) {
            let scriptRow = document.createElement('div')
            scriptRow.setAttribute('class', 'rowText')
            this.refs["list"].appendChild(scriptRow)

                let scriptName = document.createElement('div')
                scriptName.setAttribute('class', 'itemText')
                scriptName.innerText = app.site.scripts[cnt]
                scriptRow.appendChild(scriptName)

                let divTmp0 = document.createElement('div')
                scriptRow.appendChild(divTmp0)

                    let scriptRefresh = document.createElement('img')
                    scriptRefresh.setAttribute('src', './icons/iconRefresh.svg')
                    scriptRefresh.addEventListener('click', async (evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        scriptRefresh.style.animation = 'refreshRotate 0.5s linear normal'
                        await app.wait(500)
                        app.reloadScript(app.site.scripts[cnt])
                    })
                    divTmp0.appendChild(scriptRefresh)

                let divTmp1 = document.createElement('div')
                scriptRow.appendChild(divTmp1)

                    let scriptDelete = document.createElement('img')
                    scriptDelete.setAttribute('src', './icons/iconDelete.svg')
                    scriptDelete.addEventListener('click', (evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        app.deleteScript(app.site.scripts[cnt], true)
                    })
                    divTmp1.appendChild(scriptDelete)
        }

        this.refs["input"].addEventListener('change', (evt) => {
            evt.preventDefault()
            let value = this.refs["input"].value
            if (value != '') { 
                app.addScript(value, true)
            }
            this.refs["input"].value = ""
        })
    
        this.refs["addButton"].addEventListener('click', (evt) => {
            evt.preventDefault()
            let value = this.refs["input"].value
            if (value != '') { 
                app.addScript(value, true)
            }
            this.refs["input"].value = ""
        })
    }
}