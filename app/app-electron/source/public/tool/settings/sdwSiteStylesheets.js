import {utils} from "../scriptUtils.js"

export class sdwSiteStylesheets extends HTMLElement {
    
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

        for (let cnt = 0; cnt < app.site.stylesheets.length; cnt = cnt + 1) {
            let styleRow = document.createElement('div')
            styleRow.setAttribute('class', 'rowText')
            this.refs["list"].appendChild(styleRow)

                let styleName = document.createElement('div')
                styleName.setAttribute('class', 'itemText')
                styleName.innerText = app.site.stylesheets[cnt]
                styleRow.appendChild(styleName)

                let divTmp0 = document.createElement('div')
                styleRow.appendChild(divTmp0)

                    let styleRefresh = document.createElement('img')
                    styleRefresh.setAttribute('src', './icons/iconRefresh.svg')
                    styleRefresh.addEventListener('click', async (evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        styleRefresh.style.animation = 'refreshRotate 0.5s linear normal'
                        await app.wait(500)
                        app.reloadStylesheet(app.site.stylesheets[cnt])
                    })
                    divTmp0.appendChild(styleRefresh)

                let divTmp1 = document.createElement('div')
                styleRow.appendChild(divTmp1)

                    let styleDelete = document.createElement('img')
                    styleDelete.setAttribute('src', './icons/iconDelete.svg')
                    styleDelete.innerText = app.site.stylesheets[cnt]
                    styleDelete.addEventListener('click', (evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        app.deleteStylesheet(app.site.stylesheets[cnt], true)
                    })
                    divTmp1.appendChild(styleDelete)
        }

        this.refs["input"].addEventListener('change', (evt) => {
            evt.preventDefault()
            let value = this.refs["input"].value
            if (value != '') { 
                app.addStylesheet(value, true)
            }
            this.refs["input"].value = ""
        })
    
        this.refs["addButton"].addEventListener('click', (evt) => {
            evt.preventDefault()
            let value = this.refs["input"].value
            if (value != '') { 
                app.addStylesheet(value, true)
            }
            this.refs["input"].value = ""
        })
    }
}