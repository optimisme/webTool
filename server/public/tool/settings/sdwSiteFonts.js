import {utils} from "../scriptUtils.js"

export class sdwSiteFonts extends HTMLElement {
    
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

        for (let cnt = 0; cnt < app.site.googleFonts.length; cnt = cnt + 1) {
            let fontRow = document.createElement('div')
            fontRow.setAttribute('class', 'rowText')
            this.refs["list"].appendChild(fontRow)

                let fontType = document.createElement('div')
                fontType.setAttribute('class', 'itemText')
                fontType.setAttribute('style', 'font-family:"' + app.site.googleFonts[cnt] + '";')
                fontType.innerText = app.site.googleFonts[cnt]
                fontRow.appendChild(fontType)

                let divTmp = document.createElement('div')
                fontRow.appendChild(divTmp)

                    let fontDelete = document.createElement('img')
                    fontDelete.setAttribute('src', './icons/iconDelete.svg')
                    fontDelete.addEventListener('click', (evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        app.deleteFont(app.site.googleFonts[cnt], true)
                    })
                    divTmp.appendChild(fontDelete)
        }

        this.refs["input"].addEventListener('change', (evt) => {
            evt.preventDefault()
            let value = this.refs["input"].value
            if (value != '') { 
                app.addFont(value, true)
            }
            this.refs["input"].value = ""
        })
    
        this.refs["addButton"].addEventListener('click', (evt) => {
            evt.preventDefault()
            let value = this.refs["input"].value
            if (value != '') { 
                app.addFont(value, true)
            }
            this.refs["input"].value = ""
        })
    }
}