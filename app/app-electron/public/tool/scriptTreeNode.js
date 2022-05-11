export class treeNode {

    constructor (parent, appId) {

        this.selected = false
        this.parent = parent

        this.appId = appId

        this.tag = ''
        this.description = ''
        this.text = ''
        this.style = {}
        this.phone = {}
        this.attributes = {}
        this.childs = []

        this.refList = null
        this.refPreview = null
    }

    initAsHtml (refHtml) {
        this.description = 'Html'
        this.refList = app.refs["list"].elmRoot.querySelectorAll('sdw-tool-list-item')[0]
        this.refList.refApp = this
        this.refPreview = refHtml
    }

    getRefById (id) {
        if (this.appId == id) return this
        for (let cnt = 0; cnt < this.childs.length; cnt = cnt + 1) {
            let rst = this.childs[cnt].getRefById(id)
            if (rst && rst.appId == id) return rst
        }
    }

    toString () {
        let obj = {
            appId: this.appId,
            tag: this.tag,
            description: this.description,
            text: this.text,
            style: JSON.parse(JSON.stringify(this.style)),
            phone: JSON.parse(JSON.stringify(this.phone)),
            attributes: JSON.parse(JSON.stringify(this.attributes)),
            childs: this.childs.map((x)=>{ return JSON.parse(x.toString()) })
        }
        return JSON.stringify(obj)
    }

    add (obj) {
        return this.addWithKeepId(obj, false)
    }

    addWithKeepId (obj, keepId) {
        let appId = keepId ? obj.appId : ++app.counter
        let pos = this.childs.push(new treeNode(this, appId)) - 1
        let child = this.childs[pos]

        if (keepId && obj.appId > app.counter) {
            app.counter = obj.appId
        }

        child.parent = this
        child.description = obj.description

        child.appId = appId
        child.tag = obj.tag
        child.text = obj.text
        child.style = JSON.parse(JSON.stringify(obj.style))
        child.phone = JSON.parse(JSON.stringify(obj.phone))

        child.refList = app.refs["list"].addChild(child)
        child.refPreview = app.refs["preview"].addChild(this, child)

        // setAttributes needs child.refPreview to be setted
        child.setAttributes(JSON.parse(JSON.stringify(obj.attributes)))

        for (let cnt = 0; cnt < obj.childs.length; cnt = cnt + 1) {
            child.addWithKeepId(obj.childs[cnt], keepId)
        }

        this.setDescription(this.description)
        this.refList.expand()
        app.refs["list"].setChildsPositions()

        if (app.refSelected) {
            //app.refs["preview"].childResizeSelect(app.refSelected.refPreview)
        }

        return child
    }

    addTag (tag) {
        // TODO: Set default texts and styles for tags
        let refTag = app.tagsList[tag]

        let child = this.add({
            tag: tag,
            description: refTag.description,
            text: (tag == "text") ? refTag.defaultText : "",
            style: {},
            phone: {},
            attributes: {},
            childs: []
        })

        if (refTag.defaultText != "" && tag != "text") {
            child.add({
                tag: 'text',
                description: "",
                text: refTag.defaultText,
                style: {},
                phone: {},
                attributes: {},
                childs: []
            })
        }

        return child
    }

    remove (ref) {
        while (ref.childs.length > 0) {
            ref.remove(ref.childs[0])
        }
        app.refs["list"].remove(ref.refList)
        app.refs["preview"].remove(ref.parent.refPreview, ref.refPreview)
        this.childs.splice(this.childs.indexOf(ref), 1)
        app.refs["list"].setChildsPositions()
    }

    select () {
        this.selected = true
        this.refList.select()
        app.refs["preview"].childSelect(this)
    }

    unselect () {
        this.selected = false
        this.refList.unselect()
        app.refs["preview"].childUnselect(this)
    }

    setDescription (value) {
        this.description = value
        this.refList.setDescription()
    }

    setCustomElementTag (value) {
        app.refs["preview"].setCustomElementTag(this, value)
        this.tag = value
        this.refList.setDescription()
    }

    setText (value) {
        while (this.childs.length > 0) {
            this.remove(this.childs[0])
        }
        this.text = value
        this.refList.setDescription()
        app.refs["preview"].setText(this, value)
        app.refs["preview"].childResizeSelect(app.refSelected.refPreview)
    }

    getText () {
        return this.text
    }

    setStyle (name, value, setAction) {

        let cssName = "css" + this.appId
        let refStyle = app.refs["preview"].previewHead.querySelector(`style[data-css="${cssName}"]`)
        let oldDesktop = 'initial'
        let oldPhone = 'initial'
        let newDesktop = 'initial'
        let newPhone = 'initial'

        if (this.style[name]) {
            oldDesktop = this.style[name]
        }

        if (this.phone[name]) {
            oldPhone = this.phone[name]
        }

        if (value != "" && value != "initial") {
            if (app.refs["preview"].visualization != "phone") {
                this.style[name] = value
                newDesktop = value
            } else {
                if (this.style[name]) {
                    if (this.style[name] != value) {
                        this.phone[name] = value
                        newPhone = value
                    } else {
                        delete this.phone[name]
                    }  
                } else {
                    this.phone[name] = value
                    newPhone = value
                }
            }
        } else {
            if (app.refs["preview"].visualization != "phone") {
                delete this.style[name]
            } else {
                delete this.phone[name]
            }
        }

        if (!app.visualizationPhase) {
            // Prevent appending style hundreds of times during "setVisualization" phase
            this.setStyleAppendText(refStyle, cssName)  
            if (setAction) {
                app.actions.push( { 
                    action: "setStyle", 
                    node: this.appId, 
                    name: name,
                    oldDesktop: oldDesktop,
                    oldPhone: oldPhone,
                    newDesktop: newDesktop,
                    newPhone: newPhone
                } )
            }
        }
    }

    setStyleFromAction (name, desktop, phone) {

        if (desktop == "initial") {
            delete this.style[name]
        } else {
            this.style[name] = desktop
        }

        if (phone == "initial") {
            delete this.phone[name]
        } else {
            this.phone[name] = phone
        }

        let cssName = "css" + this.appId
        let refStyle = app.refs["preview"].previewHead.querySelector(`style[data-css="${cssName}"]`)
        this.setStyleAppendText(refStyle, cssName)
    }

    setStylePhone (name, value) {
        let cssName = "css" + this.appId
        let refStyle = app.refs["preview"].previewHead.querySelector(`style[data-css="${cssName}"]`)

        if (value != "" && value != "initial") {
            if (this.style[name]) {
                if (this.style[name] != value) {
                    this.phone[name] = value
                } else {
                    delete this.phone[name]
                }  
            } else {
                this.phone[name] = value
            }
        } else {
            delete this.phone[name]
        }

        if (!app.visualizationPhase) {
            // Prevent appending style hundreds of times during "setVisualization" phase
            this.setStyleAppendText(refStyle, cssName)  
        }
    }

    async setStyleAppendText (refStyle, cssName) {

        if (refStyle == null) {
            refStyle = document.createElement('style')
            refStyle.setAttribute('data-css', cssName)
            refStyle.innerHTML = this.getStyleString(cssName, false)
            app.refs["preview"].previewHead.appendChild(refStyle)
        } else {
            refStyle.innerHTML = this.getStyleString(cssName, false)
        }

        if (app.refSelected) {
            app.refs["preview"].childResizeSelect(app.refSelected.refPreview)
        }
    }

    getStyle (attr) {
        let value = "initial"

        /* TODO detectar estils heredats del navegador
        if (!this.style[attr]) {
            let value = window.getComputedStyle(this.refPreview)[attr]
            if (attr == "margin") {
                console.log(value)
                console.log(window.getComputedStyle(this.refPreview)["padding"])
            }
            if (attr == "margin-top" && value != "0px") {
                return value
            }
        }
        */
        if (this.style[attr]) {
            value = this.style[attr]
        }

        if (app.refs["preview"].visualization == "phone" && this.phone[attr]) {
            value = this.phone[attr]
        }

        return value
    }

    isInheritedStyle (attr) {
        /* TODO detectar estils heredats del navegador
        if (app.refs["preview"].visualization != "phone" && !this.style[attr]) {
            let value = window.getComputedStyle(this.refPreview)[attr]
            if (attr == "margin") {
                console.log(value)
                console.log(window.getComputedStyle(this.refPreview)["padding"])
            }
            if (attr == "margin-top" && value != "0px") {
                return true
            }
        }
        */

        if (app.refs["preview"].visualization == "phone" && this.style[attr] && !this.phone[attr]) {
            return true
        }

        return false 
    }

    getStyleString (cssName) {
        let styleStr = ''
        let styleStrPhone = ''
        let keysStyle = Object.keys(this.style)
        let keysPhone = Object.keys(this.phone)

        keysStyle.sort()
        keysPhone.sort()

        keysStyle = this.swapToLower(keysStyle, 'border-color', 'border-bottom-color')
        keysStyle = this.swapToLower(keysStyle, 'border-style', 'border-bottom-style')
        keysStyle = this.swapToLower(keysStyle, 'border-style', 'border-left-style')
        keysStyle = this.swapToLower(keysStyle, 'border-style', 'border-right-style')
        keysStyle = this.swapToLower(keysStyle, 'border-radius', 'border-bottom-right-radius')
        keysStyle = this.swapToLower(keysStyle, 'border-radius', 'border-bottom-left-radius')

        keysStyle = this.addWebkitStyles(keysStyle)

        for (let cnt = 0; cnt < keysStyle.length; cnt = cnt + 1) {
            let propertyRealName = keysStyle[cnt]
            let propertyName = propertyRealName.replace("-webkit-", "")
            let propertyValueDesktop = this.style[propertyName]
            let validProperty = true
            if (propertyName.indexOf('-ts-') >= 0 || propertyName.indexOf('attributes-input') >= 0) {
                validProperty = false
            }
            if (validProperty) {
                if (propertyRealName == 'font-family' && propertyValueDesktop.indexOf(' ') >= 0) {
                    styleStr = styleStr + '\n  ' + propertyRealName + ': "' + propertyValueDesktop + '";'
                } else {
                    styleStr = styleStr + '\n  ' + propertyRealName + ': ' + propertyValueDesktop + ';'
                }
            }
        }

        if (styleStr.length > 0) {
            styleStr = `\n*[data-css="${cssName}"] { ${styleStr}\n}\n`
        }

        keysPhone = this.swapToLower(keysPhone, 'border-color', 'border-bottom-color')
        keysPhone = this.swapToLower(keysPhone, 'border-style', 'border-bottom-style')
        keysPhone = this.swapToLower(keysPhone, 'border-style', 'border-left-style')
        keysPhone = this.swapToLower(keysPhone, 'border-style', 'border-right-style')
        keysPhone = this.swapToLower(keysPhone, 'border-radius', 'border-bottom-right-radius')
        keysPhone = this.swapToLower(keysPhone, 'border-radius', 'border-bottom-left-radius')

        keysPhone = this.addWebkitStyles(keysPhone)

        for (let cnt = 0; cnt < keysPhone.length; cnt = cnt + 1) {
            let propertyRealName = keysPhone[cnt]
            let propertyName = propertyRealName.replace("-webkit-", "")
            let propertyValuePhone = this.phone[propertyName]
            let validProperty = true
            if (this.style[propertyName] != this.phone[propertyName]) {
                if (propertyName.indexOf('-ts-') >= 0 || propertyName.indexOf('attributes-input') >= 0) {
                    validProperty = false
                }
            }
            if (validProperty) {
                if (propertyRealName == 'font-family' && propertyValueDesktop.indexOf(' ') >= 0) {
                    styleStrPhone = styleStrPhone + '\n    ' + propertyRealName + ': "' + propertyValuePhone + '";'
                } else {
                    styleStrPhone = styleStrPhone + '\n    ' + propertyRealName + ': ' + propertyValuePhone + ';'
                }
            }
        }
        if (styleStrPhone.length > 0) {
            styleStrPhone = `\n@media only screen and (max-width: 768px) {\n  *[data-css="${cssName}"] { ${styleStrPhone}\n  }\n}\n`
        }

        return styleStr + styleStrPhone
    }

    swapToLower (arr, elm0, elm1) {
        let idx0 = arr.indexOf(elm0)
        let idx1 = arr.indexOf(elm1)
        if (idx0 > idx1 && idx0 != -1 && idx1 != -1) {
            let tmp = arr[idx0]
            arr[idx0] = arr[idx1]
            arr[idx1] = tmp
        }
        return arr
    }

    addWebkitStyles (arr) {
        let webkitList = ["background-clip", "max-content", "writing-mode"]
        let rst = []

        for (let cnt = 0; cnt < arr.length; cnt = cnt + 1) {
            let name = arr[cnt]
            if (webkitList.indexOf(name) >= 0) {
                rst.push('-webkit-' + name)
            }
            rst.push(name)
        }

        return rst
    }

    setAttributes (attributes) {

        let oldKeys = Object.keys(this.attributes)
        let newKeys = Object.keys(attributes)

        for (let cnt = 0; cnt < oldKeys.length; cnt = cnt + 1) {
            this.refPreview.removeAttribute(oldKeys[cnt])
        }
        this.attributes = attributes
        for (let cnt = 0; cnt < newKeys.length; cnt = cnt + 1) {
            this.refPreview.setAttribute(newKeys[cnt], this.attributes[newKeys[cnt]])
        }
    }

    getPosition () {
        if (this.parent == null) {
            return 0
        } else {
            return this.parent.childs.indexOf(this)
        }
    }

    isChildOf (ref) {
        if (this.parent == null) {
            return false
        }
        if (this == ref) {
            return true
        }
        return this.parent.isChildOf(ref)
    }

    deleteFont (name) {

        let keys = Object.keys(this.style)
        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            if (keys[cnt] == 'font-family' && this.style[keys[cnt]] == name) {
                this.setStyle('font-family', 'initial', false)
            }
        }

        keys = Object.keys(this.phone)
        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            if (keys[cnt] == 'font-family' && this.phone[keys[cnt]] == name) {
                this.setStylePhone('font-family', 'initial')
            }
        }

        for (let cnt = 0; cnt < this.childs.length; cnt = cnt + 1) {
            this.childs[cnt].deleteFont(name)
        }
    }

    setAttribute (name, value) {
        if (value != "") {
            this.attributes[name] = value
            app.refSelected.refPreview.setAttribute(name, value)
        } else {
            delete this.attributes[name]
            app.refSelected.refPreview.removeAttribute(name)
        }
    }

    printTree (ident) {
        console.log(ident, this.appId, this.description)
        for (let cnt = 0; cnt < this.childs.length; cnt = cnt + 1) {
            this.childs[cnt].printTree(ident + "  ")
        }
    }
}