import {utils} from "./scriptUtils.js"

export class sdwToolList extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.updateText = true
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

        this.refs["buttonAdd"].addEventListener('click', (evt) => {
            evt.stopPropagation()
            app.showPopup('add')
        })

        this.refs["buttonDuplicate"].addEventListener('click', (evt) => {
            evt.stopPropagation()
            app.duplicate()
        })

        this.refs["buttonTemplates"].addEventListener('click', (evt) => {
            evt.stopPropagation()
            app.showPopup('templates')
        })

        this.refs["buttonExamples"].addEventListener('click', (evt) => {
            evt.stopPropagation()
            app.showPopup('examples')
        })

        this.refs["buttonRemove"].addEventListener('click', (evt) => {
            evt.stopPropagation()
            app.remove()
        })

        utils.initTooltips(this.elmRoot)
    }

    setButtonAdd (activate) {
        
        if (activate) {
            this.refs["buttonAdd"].classList.remove('disabled')
        } else {
            this.refs["buttonAdd"].classList.add('disabled')
        }
    }

    setButtonDuplicate (activate) {
        if (activate) {
            this.refs["buttonDuplicate"].classList.remove('disabled')
        } else {
            this.refs["buttonDuplicate"].classList.add('disabled')
        }
    }

    setButtonTemplates (activate) {

        if (activate) {
            this.refs["buttonTemplates"].classList.remove('disabled')
        } else {
            this.refs["buttonTemplates"].classList.add('disabled')
        }
    }

    setButtonExamples (activate) {

        if (activate) {
            this.refs["buttonExamples"].classList.remove('disabled')
        } else {
            this.refs["buttonExamples"].classList.add('disabled')
        }
    }

    setButtonRemove (activate) {
        
        if (activate) {
            this.refs["buttonRemove"].classList.remove('disabled')
        } else {
            this.refs["buttonRemove"].classList.add('disabled')
        }
    }

    addChild (ref) {
        let newItem = document.createElement('sdw-tool-list-item')
        newItem.refApp = ref
        
        this.refs["list"].appendChild(newItem)
        newItem.setDescription()

        return newItem
    }

    setChildsPositions () {
        this.showChilds(app.elementsRoot, 0, 0)
    }

    showChilds (ref, position, ident) {

        ref.refList.setPosition(position, ident)

        if (ref.childs.length == 0) {
            ref.refList.refs["arrow"].style.display = 'none'
            ref.refList.refs["empty"].style.display = 'initial'
        } else {
            ref.refList.refs["arrow"].style.display = 'initial'
            ref.refList.refs["empty"].style.display = 'none'
        }

        if (ref.refList.expanded) {
            for (let cnt = 0; cnt < ref.childs.length; cnt = cnt + 1) {
                ref.childs[cnt].refList.show()
                position = this.showChilds(ref.childs[cnt], position + 1, ident + 1)
            }
        } else {
            for (let cnt = 0; cnt < ref.childs.length; cnt = cnt + 1) {
                this.hideChilds(ref.childs[cnt])
            }
        }

        return position
    }

    hideChilds (ref) {
        ref.refList.hide()
        for (let cnt = 0; cnt < ref.childs.length; cnt = cnt + 1) {
            this.hideChilds(ref.childs[cnt])
        }
    }

    remove (ref) {
        let list = this.refs["list"].querySelectorAll('sdw-tool-list-item')
        for (let cnt = 0; cnt < list.length; cnt = cnt + 1) {
            if (list[cnt] == ref) {
                this.refs["list"].removeChild(ref)
                break
            }
        }
    }
}