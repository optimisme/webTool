export class actions {
    
    constructor () {
        this.stack = []
        this.index = -1
    }

    init () {
        this.stack = []
        this.index = -1
    }

    setButtons () {

        if (this.index < 0) {
            app.refs["preview"].actionsDisable("undo")
        } else {
            app.refs["preview"].actionsEnable("undo")
        }
        if (this.index == (this.stack.length - 1)) {
            app.refs["preview"].actionsDisable("redo")
        } else {
            app.refs["preview"].actionsEnable("redo")
        }
        if (app.refSelected) {
            app.refs["preview"].childResizeSelect(app.refSelected.refPreview)
        }
    }

    push (obj) {

        // TODO: Limit stack size

        this.index = this.index + 1
        while (this.stack.length > this.index) {
            this.stack.pop()
        }

        this.stack.push(obj)
        this.setButtons()
    }

    undo () {
        if (this.index >= 0) {
            let refAction = this.stack[this.index]
            switch(refAction.action) {
                case 'listSelect':      this.actionListSelect("undo", refAction); break
                case 'listUnselect':    this.actionListUnselect("undo", refAction); break
                case 'setVisualization':this.actionSetVisualization("undo", refAction); break
                case 'remove':          this.actionRemove("undo", refAction); break
                case 'duplicate':       this.actionDuplicate("undo", refAction); break
                case 'addTag':          this.actionAddTag("undo", refAction); break
                case 'addTemplate':     this.actionAddTemplate("undo", refAction); break
                case 'moveAt':          this.actionMoveAt("undo", refAction); break
                case 'setDescription':  this.actionSetDescription("undo", refAction); break
                case 'setSiteName':     this.actionSetSiteName("undo", refAction); break
                case 'setSiteTitle':    this.actionSetSiteTitle("undo", refAction); break
                case 'addStylesheet':   this.actionAddStylesheet("undo", refAction); break
                case 'delStylesheet':   this.actionDelStylesheet("undo", refAction); break
                case 'addScript':       this.actionAddScript("undo", refAction); break
                case 'delScript':       this.actionDelScript("undo", refAction); break
                case 'addGoogleFont':   this.actionAddGoogleFont("undo", refAction); break
                case 'delGoogleFont':   this.actionDelGoogleFont("undo", refAction); break
                case 'setAttributes':   this.actionSetAttributes("undo", refAction); break
                case 'setCustomElement':this.actionSetCustomElement("undo", refAction); break
                case 'setStyle':        this.actionSetStyle("undo", refAction); break
            }
            this.index = this.index - 1
            this.setButtons()
        }
    }

    redo () {
        if (this.index < (this.stack.length - 1)) {
            this.index = this.index + 1
            let refAction = this.stack[this.index]
            switch(refAction.action) {
                case 'listSelect':      this.actionListSelect("redo", refAction); break
                case 'listUnselect':    this.actionListUnselect("redo", refAction); break
                case 'setVisualization':this.actionSetVisualization("redo", refAction); break
                case 'remove':          this.actionRemove("redo", refAction); break
                case 'duplicate':       this.actionDuplicate("redo", refAction); break
                case 'addTag':          this.actionAddTag("redo", refAction); break
                case 'addTemplate':     this.actionAddTemplate("redo", refAction); break
                case 'moveAt':          this.actionMoveAt("redo", refAction); break
                case 'setDescription':  this.actionSetDescription("redo", refAction); break
                case 'setSiteName':     this.actionSetSiteName("redo", refAction); break
                case 'setSiteTitle':    this.actionSetSiteTitle("redo", refAction); break
                case 'addStylesheet':   this.actionAddStylesheet("redo", refAction); break
                case 'delStylesheet':   this.actionDelStylesheet("redo", refAction); break
                case 'addScript':       this.actionAddScript("redo", refAction); break
                case 'delScript':       this.actionDelScript("redo", refAction); break
                case 'addGoogleFont':   this.actionAddGoogleFont("redo", refAction); break
                case 'delGoogleFont':   this.actionDelGoogleFont("redo", refAction); break
                case 'setAttributes':   this.actionSetAttributes("redo", refAction); break
                case 'setCustomElement':this.actionSetCustomElement("redo", refAction); break
                case 'setStyle':        this.actionSetStyle("redo", refAction); break
            }
            this.setButtons()
        }
    }
    
    actionListSelect (type, refAction) {
        let refNode = app.getRefById(refAction.newNode)
        if (type == "undo") {
            if (refAction.oldNode == -1) {
                app.unselect()
            } else {
                let refOld = app.getRefById(refAction.oldNode)
                app.select(refOld)
            }
        } else {
            app.select(refNode)
        }
    }

    actionListUnselect (type, refAction) {
        let refNode = app.getRefById(refAction.node)
        if (type == "undo") {
            app.select(refNode)
        } else {
            app.unselect()
        }
    }

    actionSetVisualization (type, refAction) {
        if (type == "undo") {
            app.refs["preview"].setVisualization(refAction.oldValue)
        } else {
            app.refs["preview"].setVisualization(refAction.newValue)
        }
        setTimeout(() => {
            if (app.refSelected) { app.select(app.refSelected) }
        }, 300)
    }

    actionRemove (type, refAction) {
        let refParent = app.getRefById(refAction.parent)
        let refChild = undefined

        if (type == "undo") {
            refChild = refParent.addWithKeepId(JSON.parse(refAction.obj), true)
            app.moveAt(refParent, refChild, refAction.position)
        } else {
            refChild = app.getRefById(refAction.child)
            refParent.remove(refChild)
            if (app.refSelected && app.refSelected.appId == refChild.appId) {
                app.unselect()
                app.refs["settings"].setVisualization()
            }
        }
    }

    actionAddTag (type, refAction) {
        let refParent = app.getRefById(refAction.parent)
        let refChild = undefined

        if (type == "undo") {
            refChild = app.getRefById(refAction.child)
            refParent.remove(refChild)
            if (app.refSelected && app.refSelected.appId == refChild.appId) {
                app.unselect()
                app.refs["settings"].setVisualization()
            }
        } else {
            refChild = refParent.addWithKeepId(JSON.parse(refAction.obj), true)
            app.moveAt(refParent, refChild, refAction.position)
        }
    }

    actionDuplicate (type, refAction) {
        let refParent = app.getRefById(refAction.parent)
        let refChild = undefined

        if (type == "undo") {
            refChild = app.getRefById(refAction.child)
            refParent.remove(refChild)
            if (app.refSelected && app.refSelected.appId == refChild.appId) {
                app.unselect()
                app.refs["settings"].setVisualization()
            }
        } else {
            refChild = refParent.addWithKeepId(JSON.parse(refAction.obj), true)
            app.moveAt(refParent, refChild, refAction.position)
        }
    }

    actionAddTemplate (type, refAction) {
        let refParent = app.getRefById(refAction.parent)
        let refChild = undefined
        let item = undefined

        if (type == "undo") {
            for (let cnt = 0; cnt < refAction.childs.length; cnt = cnt + 1) {
                item = refAction.childs[cnt]
                refChild = app.getRefById(item.child)
                refParent.remove(refChild)
                if (app.refSelected && app.refSelected.appId == refChild.appId) {
                    app.unselect()
                    app.refs["settings"].setVisualization()
                }
            }
            for (let cnt = 0; cnt < refAction.fonts.length; cnt = cnt + 1) {
                app.deleteFont(refAction.fonts[cnt])
            }
            for (let cnt = 0; cnt < refAction.styles.length; cnt = cnt + 1) {
                app.deleteStylesheet(refAction.styles[cnt])
            }
            for (let cnt = 0; cnt < refAction.scripts.length; cnt = cnt + 1) {
                app.deleteScript(refAction.scripts[cnt])
            }
            app.refs["settings"].refs["site-name"].refs["input"].value = refAction.oldName
            app.refs["settings"].refs["site-title"].refs["input"].value = refAction.oldTitle
            app.site.name = refAction.oldName
            app.site.title = refAction.oldTitle
        } else {
            for (let cnt = 0; cnt < refAction.childs.length; cnt = cnt + 1) {
                item = refAction.childs[cnt]
                refChild = refParent.addWithKeepId(JSON.parse(item.obj), true)
                app.moveAt(refParent, refChild, item.position)
            }
            for (let cnt = 0; cnt < refAction.fonts.length; cnt = cnt + 1) {
                app.addFont(refAction.fonts[cnt])
            }
            for (let cnt = 0; cnt < refAction.styles.length; cnt = cnt + 1) {
                app.addStylesheet(refAction.styles[cnt])
            }
            for (let cnt = 0; cnt < refAction.scripts.length; cnt = cnt + 1) {
                app.addScript(refAction.scripts[cnt])
            }
            app.refs["settings"].refs["site-name"].refs["input"].value = refAction.newName
            app.refs["settings"].refs["site-title"].refs["input"].value = refAction.newTitle
            app.site.name = refAction.newName
            app.site.title = refAction.newTitle
        }
    }

    actionMoveAt (type, refAction) {
        let refParentOrigin = undefined
        let refParentDestination = undefined
        let refChild = app.getRefById(refAction.child)

        if (type == "undo") {
            refParentOrigin = app.getRefById(refAction.parentOrigin)
            app.moveAt(refParentOrigin, refChild, refAction.positionOrigin)
        } else {
            refParentDestination = app.getRefById(refAction.parentDestination)
            app.moveAt(refParentDestination, refChild, refAction.positionDestination)
        }
    }

    actionSetDescription (type, refAction) {
        let refNode = app.getRefById(refAction.node)
        if (type == "undo") {
            refNode.setDescription(refAction.oldValue)
        } else {
            refNode.setDescription(refAction.newValue)
        } 
        if (app.refSelected && app.refSelected.appId == refNode.appId) {
            app.refs["settings"].refs["description"].setVisualization()
        }
    }

    actionSetSiteName (type, refAction) {
        if (type == "undo") {
            app.site.name = refAction.oldValue
            app.refs["settings"].refs["site-name"].refs["input"].value = refAction.oldValue
        } else {
            app.site.name = refAction.newValue
            app.refs["settings"].refs["site-name"].refs["input"].value = refAction.newValue
        } 
    }

    actionSetSiteTitle (type, refAction) {
        if (type == "undo") {
            app.site.title = refAction.oldValue
            app.refs["settings"].refs["site-title"].refs["input"].value = refAction.oldValue
        } else {
            app.site.title = refAction.newValue
            app.refs["settings"].refs["site-title"].refs["input"].value = refAction.newValue
        } 
    }

    actionAddStylesheet (type, refAction) {
        if (type == "undo") {
            app.deleteStylesheet(refAction.value, false)
        } else {
            app.addStylesheet(refAction.value, false)
        } 
    }

    actionDelStylesheet (type, refAction) {
        if (type == "undo") {
            app.addStylesheet(refAction.value, false)
        } else {
            app.deleteStylesheet(refAction.value, false)
        } 
    }

    actionAddScript (type, refAction) {
        if (type == "undo") {
            app.deleteScript(refAction.value, false)
        } else {
            app.addScript(refAction.value, false)
        } 
    }

    actionDelScript (type, refAction) {
        if (type == "undo") {
            app.addScript(refAction.value, false)
        } else {
            app.deleteScript(refAction.value, false)
        } 
    }

    actionAddGoogleFont (type, refAction) {
        if (type == "undo") {
            app.deleteFont(refAction.value, false)
        } else {
            app.addFont(refAction.value, false)
        } 
    }

    actionDelGoogleFont (type, refAction) {
        if (type == "undo") {
            app.addFont(refAction.value, false)
        } else {
            app.deleteFont(refAction.value, false)
        } 
    }

    actionSetAttributes (type, refAction) {
        let refNode = app.getRefById(refAction.node)
        if (type == "undo") {
            refNode.setAttributes(JSON.parse(refAction.oldValue))
        } else {
            refNode.setAttributes(JSON.parse(refAction.newValue))
        }
        if (app.refSelected && app.refSelected.appId == refNode.appId) {
            app.refs["settings"].refs["attributes"].setVisualization()
        }
    }

    actionSetCustomElement (type, refAction) {
        let refNode = app.getRefById(refAction.node)
        if (type == "undo") {
            refNode.setCustomElementTag(refAction.oldValue)
        } else {
            refNode.setCustomElementTag(refAction.newValue)
        } 
        if (app.refSelected && app.refSelected.appId == refNode.appId) {
            app.refs["settings"].refs["custom-element"].setVisualization()
        }
    }

    actionSetStyle (type, refAction) {
        let refNode = app.getRefById(refAction.node)
        if (type == "undo") {
            refNode.setStyleFromAction(refAction.name, refAction.oldDesktop, refAction.oldPhone)
        } else {
            refNode.setStyleFromAction(refAction.name, refAction.newDesktop, refAction.newPhone)
        }
        if (app.refSelected && app.refSelected.appId == refNode.appId) {
            app.visualizationPhase = true
            if (["display", "flex-direction", "align-items", "justify-content", "flex-wrap", "align-content"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["display"].setVisualization()
            else if (["margin", "margin-top", "margin-right", "margin-bottom", "margin-left"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["margin"].setVisualization()
            else if (["border", "border-top", "border-right", "border-bottom", "border-left"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["border"].setVisualization()
            else if (["border-radius", "border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["border-radius"].setVisualization()
            else if (["padding", "padding-top", "padding-right", "padding-bottom", "padding-left"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["padding"].setVisualization()
            else if (["box-sizing", "width", "min-width", "max-width", "height", "min-height", "max-height"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["size"].setVisualization()
            else if (["overflow", "overflow-x", "overflow-y"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["overflow"].setVisualization()
            else if (["box-shadow"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["shadows"].setVisualization()
            else if (["background-color", "background"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["background"].setVisualization()
            else if (["backdrop-filter", "background"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["backdrop-filters"].setVisualization()
            else if (["visibility", "opacity"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["opacity"].setVisualization()
            else if (["perspective", "transform"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["transform"].setVisualization()
            else if (["transition"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["transition"].setVisualization()
            else if (["filter"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["filter"].setVisualization()
            else if (["cursor", "pointer-events"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["cursor"].setVisualization()
            else if (["font-family", "font-weight", "font-size", "color", "text-align", "font-style", "text-transform", "text-decoration"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["typography"].setVisualization()
            else if (["user-select", "letter-spacing", "word-spacing", "line-height", "direction", "text-indent", "text-overflow", "word-break", "overflow-wrap", "white-space", "writing-mode"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["paragraph"].setVisualization()
            else if (["column-count", "column-width", "column-gap", "column-rule-style", "column-rule-width", "column-rule-color", "column-span"].indexOf(refAction.name) >= 0) 
                app.refs["settings"].refs["paragraph-columns"].setVisualization()
            app.visualizationPhase = false
        }
    }
}