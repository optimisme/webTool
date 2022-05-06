import {utils} from "./scriptUtils.js"

export class sdwToolPopup extends HTMLElement {

    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.type = ""
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

        this.type = this.getAttribute('type')

        this.elmRoot.addEventListener('click', (evt) => {
            evt.stopPropagation()
            this.hide()
        })

        this.set()
    }

    show (ref) {
        switch (this.type) {
            case "all": this.showAll(ref); break;
            case "templates": this.showTemplates(ref); break;
            case "examples": this.showTemplates(ref); break;
        }
    }

    showAll (ref) {
        let items = 0
        let allowedTags = []

        if (!app.isCustomTag(app.refSelected.tag)) {
            allowedTags = app.tagsList[app.refSelected.tag].childs
        } else {
            allowedTags = app.tagsList["div"].childs
        }

        for (let cnt = 0; cnt < this.refs["popup"].childNodes.length; cnt = cnt + 1) {
            let item = this.refs["popup"].childNodes[cnt]
            let tag = item.getAttribute('data-tag')
            if (allowedTags.indexOf(tag) >= 0) {
                item.style.display = 'inherit'
                items = items + 1
            } else {
                item.style.display = 'none'
            }
        }

        let half = 150;
        let style = this.refs["popup"].style
        let stylePointer = this.refs["popupPointer"].style
        let rect = ref.getBoundingClientRect()
        let left = rect.x + (rect.width /2) - half
        let height = (19 * items) + 10
        if (height > 400) height = 400
        let top = rect.y - height

        this.elmRoot.style.display = "block"
        style.top = top + "px"
        style.left = left + "px"
        style.height = height + "px"
        stylePointer.top = rect.y + "px"
        stylePointer.left = (left + half - 10) + "px"
    }

    showTemplates (ref) {
        let items = 0
        for (let cnt = 0; cnt < this.refs["popup"].childNodes.length; cnt = cnt + 1) {
            let item = this.refs["popup"].childNodes[cnt]
            //item.style.display = 'inherit'
            items = items + 1
        }

        let half = 200;
        let style = this.refs["popup"].style
        let stylePointer = this.refs["popupPointer"].style
        let rect = ref.getBoundingClientRect()
        let left = rect.x + (rect.width /2) - half
        let height = (54 * items)
        if (height > 400) height = 400
        let top = rect.y - height

        this.elmRoot.style.display = 'block'
        style.top = top + 'px'
        style.left = left + 'px'
        style.width = "400px";
        stylePointer.top = rect.y + 'px'
        stylePointer.left = (left + half - 10) + 'px'
    }

    hide () {
        let style = this.refs["popup"].style
        let stylePointer = this.refs["popupPointer"].style
        
        this.elmRoot.style.display = 'none'
        style.top = '-10px'
        style.left = '0'
        stylePointer.top = '-10px'
        stylePointer.left = '0'
    }

    set () {
        switch (this.type) {
            case 'all': this.setAll(); break;
            case 'list': this.setList(); break;
            case 'table': this.setTable(); break;
            case 'tableRow': this.setTableRow(); break;
            case 'templates': this.setTemplates('templates'); break;
            case 'examples': this.setTemplates('examples'); break;
        }
    }

    setAll () {
        let keys = Object.keys(app.tagsList)

        this.refs["popup"].style.width = '300px'

        for (let cnt = 1; cnt < keys.length; cnt = cnt + 1) {
            let divItem = document.createElement('div')
            let tag = keys[cnt]
            let obj = app.tagsList[tag]
            divItem.setAttribute('class', `item`)
            divItem.setAttribute('data-tag', tag)
            divItem.addEventListener('click', (evt) => {
                evt.stopPropagation()
                app.addTag(tag)
                this.hide()
            })

            this.refs["popup"].appendChild(divItem)

            if (tag == "text") {
                let divItemTag = document.createElement('div')
                divItemTag.setAttribute('class', "text")
                divItemTag.innerText = "(" + tag + ")"
                divItem.appendChild(divItemTag)
            } else {
                let divItemTag = document.createElement('div')
                divItemTag.setAttribute('class', "tag")
                divItemTag.innerText = "<" + tag + ">"
                divItem.appendChild(divItemTag)
            }


            let divItemText = document.createElement('div')
            divItemText.setAttribute('class', "description")
            divItemText.innerText = obj.description
            divItem.appendChild(divItemText)
        }
    }

    setTemplates (type) {
        let list = (type == 'templates') ? app.templatesList : app.examplesList
        let keys = Object.keys(list)

        this.refs["popup"].style.width = '300px'

        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let divItem = document.createElement('div')
            let key = keys[cnt]
            divItem.setAttribute('class', `item`)
            if (this.type == "templates") {
                divItem.addEventListener('click', (evt) => {
                    evt.stopPropagation()
                    app.appendTemplate(key)
                    this.hide()
                })
            } else {
                divItem.addEventListener('click', (evt) => {
                    evt.stopPropagation()
                    app.appendExample(key)
                    this.hide()
                })
            }

            this.refs["popup"].appendChild(divItem)

            let divItemImage = document.createElement('img')
            if (this.type == "templates") {
                divItemImage.setAttribute('src', `./templates/${key}.png`)
            } else {
                divItemImage.setAttribute('src', `./examples/${key}.png`)
            }
            divItemImage.setAttribute('width', `75`)
            divItem.appendChild(divItemImage)

            let divItemText = document.createElement('div')
            divItemText.setAttribute('class', "description")
            divItemText.innerText = list[key]
            divItem.appendChild(divItemText)
        }
    }
}