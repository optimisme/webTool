import {utils} from "./scriptUtils.js"

export class sdwToolListItem extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.refApp = null

        this.itemHeight = 24
        this.itemIdent = 8
        this.expanded = false

        this.listIndex = 0
        this.listIdent = 0

        this.dragImage = new Image()
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
        this.draggable = true // TODO: Check if true!

        this.setDragImage()
        this.elmRoot.setAttribute('draggable', `true`)
        this.elmRoot.addEventListener('dragstart', (e) => {
            e.stopPropagation()
            app.drag.refDragElement = this.refApp
            e.dataTransfer.setDragImage(this.dragImage, 10, 10)
        })
        
        this.elmRoot.addEventListener('dragend', (e) => {
            app.drag.refDragElement = null
            this.removeDragLine()
        })

        this.elmRoot.addEventListener('dragenter', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (app.drag.refDragElement == null) return
            this.setDragLine(e)
        })

        this.elmRoot.addEventListener('dragover', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (app.drag.refDragElement == null) return
            this.setDragLine(e)
        })
/*
        this.elmRoot.addEventListener('dragleave', (e) => {
            e.preventDefault()
            e.stopPropagation()
        })
*/
        this.elmRoot.addEventListener('drop', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (app.drag.allowed) {
                let position = app.drag.position

                let parentOrigin = app.drag.refDragElement.parent
                let parentDestination = app.drag.refDropElement

                let positionOrigin = app.drag.refDragElement.getPosition()
                if (parentOrigin == parentDestination && position > positionOrigin) {
                    // Moving bigger possition of the same parent, array will be sliced
                    position = position - 1;
                }

                let ref = app.moveAt(app.drag.refDropElement, app.drag.refDragElement , position)
                let positionDestination = ref.getPosition()

                app.actions.push( { 
                    action: "moveAt", 
                    parentOrigin: parentOrigin.appId, 
                    parentDestination: parentDestination.appId, 
                    child: ref.appId,
                    positionOrigin: positionOrigin,
                    positionDestination: positionDestination
                } )
            }
            this.removeDragLine()
        })

        this.refs["main"].addEventListener('click', (evt) => { 
            evt.stopPropagation()
            if (app.refSelected != null && app.refSelected == this.refApp) {
                /*
                app.actions.push( { 
                    action: "listUnselect", 
                    node: app.refSelected.appId
                } )
                */
                app.unselect()
            } else {
                let oldNode = -1
                if (app.refSelected) {
                    oldNode = app.refSelected.appId
                }
                app.select(this.refApp)
                /*
                app.actions.push( { 
                    action: "listSelect", 
                    newNode: this.refApp.appId,
                    oldNode: oldNode
                } )*/
            }
        })

        if (this.refApp && this.refApp.expanded) {
            this.refs["arrow"].setAttribute('class', 'expanded')
        }

        this.refs["arrow"].addEventListener('click', (evt) => { 
            evt.stopPropagation()
            if (this.expanded) {
                this.collapse()
            } else {
                this.expand()
            }
            app.refs["list"].setChildsPositions()
        })

        if (this.refApp == null) {
            this.refs["tag"].innerText = '<html>'
            this.refs["description"].innerText = 'Html'
        } else {
            this.refs["tag"].innerText = "<" + this.refApp.tag + ">"
            this.refs["description"].innerText = this.refApp.description
        }
    }

    setDragLine (e) {
        let bounds = this.elmRoot.getBoundingClientRect()
        let halfHeight = bounds.height / 2
        let sectionHeight = bounds.height / 3
        let prevY = bounds.y + sectionHeight - 1
        let nextY = bounds.y + bounds.height - sectionHeight + 1
        let position = this.refApp.getPosition()
        let refParent = this.refApp.parent ? this.refApp.parent : app.elementsRoot
        let isLastChild = (position == (refParent.childs.length - 1))
        let canDropFirstChild = app.canDrop(this.refApp, app.drag.refDragElement)
        let contracted = false
        let noChildsOrContracted = false
        let type = ""

        if (this.refApp.childs.length > 0 && !this.refApp.refList.expanded) {
            canDropFirstChild = false
            contracted = true
        }

        if (this.refApp.childs.length == 0 || contracted) {
            noChildsOrContracted = true
        }

        if (e.clientY < prevY && position != 0) {
            type = "previous"
            app.drag.refDropElement = refParent
            app.drag.position = position
        } else if (e.clientY < prevY && position == 0) {
            type = "firstChildParent"
            app.drag.refDropElement = refParent
            app.drag.position = 0
        } else if (canDropFirstChild && e.clientY < nextY) {
            type = "firstChild"
            app.drag.refDropElement = this.refApp
            app.drag.position = 0
        } else if (canDropFirstChild && this.refApp.childs.length > 0) {
            type = "firstChild"
            app.drag.refDropElement = this.refApp
            app.drag.position = 0
        } else if (!isLastChild && noChildsOrContracted) {
            type = "next"
            app.drag.refDropElement = refParent
            app.drag.position = position + 1
        } else if(isLastChild && noChildsOrContracted) {
            type = "nextOfParent"
            app.drag.refDropElement = this.refApp.parent.parent ? this.refApp.parent.parent : app.elementsRoot
            app.drag.position = this.refApp.parent.getPosition() + 1
        }

        // console.log(type, app.drag.refDropElement.tag, app.drag.refDropElement.description, app.drag.position)
        
        if (type == "") {
            app.drag.allowed = false
        } else {
            app.drag.allowed = app.canDrop(app.drag.refDropElement, app.drag.refDragElement)
        }

        let color = app.drag.allowed ? "rgb(50,140,230)" : "red"
        let ident = app.drag.allowed ? app.drag.refDropElement.refList.listIdent : this.refApp.refList.listIdent
        let top = bounds.y + halfHeight
        let left = ident * this.itemIdent + 17.5
        let rotate = "rotate(-45deg)"

        if (type == "previous" || type == "firstChildParent") {
            top = top - halfHeight
        } else {
            top = top + halfHeight
        }
        if (type.indexOf("firstChild") >= 0) {
            left = left + (this.itemIdent * 2)
            rotate = "rotate(-135deg)"
        }

        let refDropArrow = app.refs["list"].refs["dropArrow"]
        refDropArrow.style.borderColor = color
        refDropArrow.style.top = top + "px"
        refDropArrow.style.left = left + "px"
        refDropArrow.style.opacity = app.drag.allowed ? "1" : "0"
        refDropArrow.style.transform = rotate

        let refDropLine = app.refs["list"].refs["dropLine"]
        refDropLine.style.backgroundColor = color
        refDropLine.style.top = (top + 2.5) + "px"
        refDropLine.style.left = (left + 15) + "px"
        refDropLine.style.opacity = "1"

        let refDropCross0 = app.refs["list"].refs["dropCross0"]
        refDropCross0.style.top = top + "px"
        refDropCross0.style.left = left + "px"
        refDropCross0.style.opacity = app.drag.allowed ? "0" : "1"

        let refDropCross1 = app.refs["list"].refs["dropCross1"]
        refDropCross1.style.top = top + "px"
        refDropCross1.style.left = (left + 7) + "px"
        refDropCross1.style.opacity = app.drag.allowed ? "0" : "1"
    }

    removeDragLine () {
        app.drag.index = Infinity
        app.drag.refDropElement = null
        app.drag.allowed = false
        app.refs["list"].refs["dropArrow"].style.opacity = "0"
        app.refs["list"].refs["dropLine"].style.opacity = "0"
        app.refs["list"].refs["dropCross0"].style.opacity = "0"
        app.refs["list"].refs["dropCross1"].style.opacity = "0"

        app.refs["list"].setChildsPositions()
    }

    select () {
        this.refs["main"].classList.add('selected')
    }

    unselect () {
        this.refs["main"].classList.remove('selected')
    }

    expand () {
        this.expanded = true
        this.refs["arrow"].classList.add('expanded')
    }

    collapse () {
        this.expanded = false
        this.refs["arrow"].classList.remove('expanded')

        if (app.refSelected && app.refSelected.isChildOf(this.refApp)) {
            app.unselect()
        }
    }

    show () {
        this.style.height = (this.itemHeight * 2) + "px"
    }

    hide () {
        this.style.height = "0px"
    }

    setPosition (position, ident) {
        this.listIndex = position
        this.listIdent = ident

        let top = position * this.itemHeight
        let left = ident * this.itemIdent

        if (position > app.drag.index) top = top + this.itemHeight

        this.style.top = top + "px"
        this.style.zIndex = position
        this.elmRoot.style.setProperty('--itemLeft', left + "px");
        this.elmRoot.style.setProperty('--itemMax', (left + 16) + "px");
    }

    setDescription () {
        if (this.refApp.tag == "text") {
            this.refs["text"].innerText = "(Text)"
            this.refs["tag"].innerText = ""
            this.refs["description"].innerText = this.refApp.text.substring(0, 50).replace(/\r?\n|\r/g, " ")
        } else {
            this.refs["text"].innerText = ""
            this.refs["tag"].innerText = "<" + this.refApp.tag + ">"
            this.refs["description"].innerText = this.refApp.description
        }
        this.setDragImage()
    }

    setDragImage () {
        let cnv = document.createElement('canvas')
        cnv.setAttribute('height', 25)
        cnv.setAttribute('width', '175')
        let ctx = cnv.getContext("2d", { alpha: true })
        ctx.clearRect(0, 0, 175, 25)
        ctx.fillStyle = 'white'
        ctx.fillRect(25, 0, 150, 25)
        ctx.fillStyle = 'grey'
        ctx.font = "12px 'Open Sans', Arial"
        let txt = "<html> Html"
        if (this.refApp != null) {
            if (this.refApp.tag == "text") {
                txt = "(Text) " + this.refApp.text.substring(0, 50).replace(/\r?\n|\r/g, " ")
            } else {
                txt = "<" + this.refApp.tag + "> " + this.refApp.description
            }
        }
        let width = ctx.measureText(txt).width
        let ellipsis = false
        while (width > 100) {
            txt = txt.slice(0, -1)
            width = ctx.measureText(txt).width
            ellipsis = true
        }
        if (ellipsis) {
            ctx.fillText(txt + '...', 50, 16)
        } else {
            ctx.fillText(txt, 50, 16)
        }
        
        ctx.lineWidth = 2
        ctx.strokeStyle = 'lightgrey'
        ctx.strokeRect(25, 0, 150, 25)

        this.dragImage = new Image()
        this.dragImage.src = cnv.toDataURL('image/png', 1)
    }
}