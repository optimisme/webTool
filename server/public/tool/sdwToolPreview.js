import {source} from "./scriptToSource.js"
import {utils} from "./scriptUtils.js"

export class sdwToolPreview extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.previewHead = undefined
        this.visualization = "desktop"
        this.showingList = true
        this.showingSettings = true
        this.autoSaveData = {
            active: false,
            stackSize: 0,
            lastTime: 0,
            interval: undefined
        }
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

        this.refs["toggleAutoSave"].addEventListener('click', () => {
            this.toogleAutoSave()
        })

        this.refs["buttonSave"].addEventListener('click', () => {
            this.downloadWebtemplate()
        })

        this.refs["buttonLoad"].addEventListener('click', () => {
            this.refs["fileInputRefresh"].click()
        })
        this.refs["buttonLoad"].addEventListener('dragover', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.refs["buttonLoad"].classList.add('dragOver')
        })
        this.refs["buttonLoad"].addEventListener('dragleave', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.refs["buttonLoad"].classList.remove('dragOver')
        })
        this.refs["buttonLoad"].addEventListener('drop', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.refs["buttonLoad"].classList.remove('dragOver')
            if(e.dataTransfer.files[0]) {
                this.uploadWebTemplate(true, e.dataTransfer.files[0])
            }
        })

        this.refs["buttonAppend"].addEventListener('click', () => {
            this.refs["fileInputAppend"].click()
        })
        this.refs["buttonAppend"].addEventListener('dragover', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.refs["buttonAppend"].classList.add('dragOver')
        })
        this.refs["buttonAppend"].addEventListener('dragleave', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.refs["buttonAppend"].classList.remove('dragOver')
        })
        this.refs["buttonAppend"].addEventListener('drop', (e) => {
            e.preventDefault()
            e.stopPropagation()
            this.refs["buttonAppend"].classList.remove('dragOver')
            if(e.dataTransfer.files[0]) {
                this.uploadWebTemplate(false, e.dataTransfer.files[0])
            }
        })

        this.refs["buttonCode"].addEventListener('click', () => {
            this.toSource()
        })

        this.refs["buttonPhone"].addEventListener('click', () => {
            if (this.visualization != "phone") {
                app.actions.push( { 
                    action: "setVisualization", 
                    oldValue: this.visualization,
                    newValue: 'phone'
                } )
            }
            this.setVisualization('phone')
        })

        this.refs["buttonTablet"].addEventListener('click', () => {
            if (this.visualization != "tablet") {
                app.actions.push( { 
                    action: "setVisualization", 
                    oldValue: this.visualization,
                    newValue: 'tablet'
                } )
            }
            this.setVisualization('tablet')
        })

        this.refs["buttonDesktop"].addEventListener('click', () => {
            if (this.visualization != "desktop") {
                app.actions.push( { 
                    action: "setVisualization", 
                    oldValue: this.visualization,
                    newValue: 'desktop'
                } )
            }
            this.setVisualization('desktop')
        })

        this.refs["buttonSidebarList"].addEventListener('click', () => {
            this.setSidebar('list')
        })

        this.refs["buttonSidebarSettings"].addEventListener('click', () => {
            this.setSidebar('settings')
        })

        this.refs["undo"].addEventListener('click', () => {
            app.actions.undo()
        })

        this.refs["redo"].addEventListener('click', () => {
            app.actions.redo()
        })

        utils.initTooltips(this.elmRoot)
    }

    downloadWebtemplate () {
        let element = document.createElement('a');
        let template = this.getTemplate(2)
        let siteName = app.site.name ? app.site.name : "siteName"

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(template));
        element.setAttribute('download', siteName + '.json');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    getTemplate (spaces) {
        let str = app.elementsRoot.toString()
        let siteName = app.site.name ? app.site.name : "siteName"
        let siteTitle = app.site.title ? app.site.title : "siteTitle"
        let obj = {
            settings: {
                appVersion: 1.0,
                name: siteName,
                title: siteTitle,
                googleFonts: app.site.googleFonts,
                stylesheets: app.site.stylesheets,
                scripts: app.site.scripts
            },
            elementsRoot: JSON.parse(str)
        }
        if (spaces == 0) {
            return JSON.stringify(obj)
        } else {
            return JSON.stringify(obj, null, spaces)
        }
    }

    uploadWebTemplate (refresh, file) {
        let reader = new FileReader()

        if (!file) { return }

        reader.onload = async (e) => {
            try {

                let obj = JSON.parse(e.target.result)
                await this.addTemplate(refresh, obj)

            } catch (e) {
                console.error('Could not parse file')
                console.log(e)
            }
        }
        reader.readAsText(file)
    }

    async addTemplate (refresh, obj) {

        let oldName = app.site.name
        let oldTitle = app.site.title
        let newName = obj.settings.name ? obj.settings.name : "siteName"
        let newTitle = obj.settings.title ? obj.settings.title : "siteTitle"

        if (refresh) {
            await app.initDefault()
            app.refs["settings"].refs["site-name"].refs["input"].value = newName
            app.refs["settings"].refs["site-title"].refs["input"].value = newTitle
            app.site.name = newName
            app.site.title = newTitle
        }

        let childs = []
        let fonts = []
        let styles = []
        let scripts = []
        let refBody = this.getRefByTag(app.elementsRoot, "body")
        let objBody = this.getRefByTag(obj.elementsRoot, "body")

        if (refresh) {
            app.elementsRoot.remove(refBody)
            app.elementsRoot.addWithKeepId(objBody, refresh)
            refBody = this.getRefByTag(app.elementsRoot, "body")
            for (let cnt = 0; cnt < refBody.childs.length; cnt = cnt + 1) {
                let tmpRef = refBody.childs[cnt]
                tmpRef.refList.collapse()
                childs.push({
                    child: tmpRef.appId,
                    position: tmpRef.getPosition(),
                    obj: tmpRef.toString()
                })
            }
            app.refs["list"].setChildsPositions()

        }  else {
            for (let cnt = 0; cnt < objBody.childs.length; cnt = cnt + 1) {
                let tmpRef = refBody.addWithKeepId(objBody.childs[cnt], refresh)
                childs.push({
                    child: tmpRef.appId,
                    position: tmpRef.getPosition(),
                    obj: tmpRef.toString()
                })
            }
        }

        app.site.name = obj.settings.name

        if (obj.settings.googleFonts) {
            for (let cnt = 0; cnt < obj.settings.googleFonts.length; cnt = cnt + 1) {
                let name = obj.settings.googleFonts[cnt]
                if (app.site.googleFonts.indexOf(name) == -1) {
                    app.addFont(name)
                    fonts.push(name)
                }
            }
        }

        if (obj.settings.stylesheets) {
            for (let cnt = 0; cnt < obj.settings.stylesheets.length; cnt = cnt + 1) {
                let name = obj.settings.stylesheets[cnt]
                if (app.site.stylesheets.indexOf(name) == -1) {
                    app.addStylesheet(name)
                    styles.push(name)
                }
            }
        }

        if (obj.settings.scripts) {
            for (let cnt = 0; cnt < obj.settings.scripts.length; cnt = cnt + 1) {
                let name = obj.settings.scripts[cnt]
                if (app.site.scripts.indexOf(name) == -1) {
                    app.addScript(obj.settings.scripts[cnt])
                    scripts.push(name)
                }
            }
        }

        // TODO: falta undo/redo del sitename i el sitetitle
        app.actions.push( { 
            action: "addTemplate", 
            refresh: refresh,
            parent: refBody.appId, 
            childs: childs,
            fonts: fonts,
            styles: styles,
            scripts: scripts,
            oldName: oldName,
            oldTitle: oldTitle,
            newName: newName,
            newTitle: newTitle
        } )

        // TODO: Select view when everything is loaded
        await app.wait(200)
        if (app.refSelected) {
            this.refs["content"].contentWindow.resizeSelect(app.refSelected.refPreview)
        }
    }

    getRefByTag (obj, tag) {
        let ref = undefined
        if (obj.childs.length > 0 && obj.childs[0].tag == tag) {
            return obj.childs[0]
        }
        if (obj.childs.length > 1 && obj.childs[1].tag == tag) {
            return obj.childs[1]
        }
        return ref
    }

    async toSource () {
        let str = await (new source()).toSource()

        if (str.indexOf('./examples/') == -1) {
            await this.saveHtmlAs(str, app.site.name + '.html')
        } else {
            let files = this.getToolFilesFromHtml(str)
            let zip = new JSZip();

            var fls = zip.folder("files")
            var img = zip.folder("images")

            for (let cnt = 0; cnt < files.length; cnt = cnt + 1) {
                let obj = files[cnt]
                let res = (await fetch(obj.path))
                let tmpBlob = await res.blob()
                if (obj.search.indexOf('examples') != -1) {
                    fls.file(obj.file, tmpBlob, {base64: true})
                }
                if (obj.search.indexOf('images') != -1) {
                    img.file(obj.file, tmpBlob, {base64: true})
                }
            }

            str = str.replaceAll("./examples/", "./files/")
            zip.file('index.html', str);

            let blob = await zip.generateAsync({type:"blob"})
            await this.saveBlobAs(blob, app.site.name + '.zip')
        }
    }

    async saveHtmlAs (str, file) {
        let element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str))
        element.setAttribute('download', file)
        element.style.display = 'none'
        element.click()
    }

    async saveBlobAs (blob, file) {
        var element = document.createElement('a')
        element.setAttribute('href', window.URL.createObjectURL(blob))
        element.setAttribute('download', file)
        element.style.display = 'none'
        element.click()
    }

    getToolFilesFromHtml (str) {
        let rst = []
        let prevIdx = 0
        let idx = 0
        let search = '"./examples/'

        while ((idx = str.indexOf(search, prevIdx)) > -1) {
            let fileEnd = str.indexOf('"', idx + 1)            
            let file = str.substring(idx + search.length, fileEnd)
            rst.push({
                search: search,
                file: file,
                path: search.substring(1) + file
            })
            prevIdx = idx + 1
        }

        prevIdx = 0
        search = '"./images/'
        while ((idx = str.indexOf(search, prevIdx)) > -1) {
            let fileEnd = str.indexOf('"', idx + 1)            
            let file = str.substring(idx + search.length, fileEnd)
            rst.push({
                search: search,
                file: file,
                path: search.substring(1) + file
            })
            prevIdx = idx + 1
        }

        return rst.filter((item, pos) => { return rst.indexOf(item) == pos }) // remove duplicates
    }

    addChild (parent, child) {
        let newItem = undefined
        
        if (child.tag == "head") {
            return this.refs["content"].contentDocument.head
        } else if (child.tag == "body") {
            newItem = this.refs["content"].contentDocument.body
        } else {
            newItem = document.createElement(child.tag)
            parent.refPreview.appendChild(newItem)
        }

        if (["svg","circle"].indexOf(child.tag) >= 0) {
            newItem = document.createElementNS('http://www.w3.org/2000/svg', child.tag)
        }

        for (let cnt = 0; cnt < child.attributes.length; cnt = cnt + 1) {
            if (child.attributes[cnt][1] != 'initial') {
                newItem.setAttribute(child.attributes[cnt][0], child.attributes[cnt][1])
            }    
        }

        let classStr = newItem.getAttribute('class')
        let classArr = []
        if (classStr != null) { classArr = classStr.split(' ') }

        if (child.tag == "text") {

            let newText = document.createTextNode(child.text)
            newItem.appendChild(newText)

        } else {

            let cssName = "css" + child.appId
            newItem.setAttribute("data-css", cssName)

            let styleStr = child.getStyleString(cssName, false)
            if (styleStr.length > 0) {
                let newStyle = document.createElement('style')
                newStyle.setAttribute('data-css', cssName)
                newStyle.innerHTML = styleStr
                this.previewHead.appendChild(newStyle)
            }
        }

        return newItem
    }

    remove (parent, child) {
        let cssName = child.getAttribute("data-css")
        let cssRef = this.previewHead.querySelector(`*[data-css="${cssName}"`)
        if(cssRef) {
            this.previewHead.removeChild(cssRef)
        }

        if (["html", "head", "body"].indexOf(child.tagName.toLowerCase()) == -1) {
            parent.removeChild(child)
        }
    }
    
    childSelect (ref) {
        app.refs["preview"].refs["content"].contentWindow.select(ref.refPreview)
    }

    childUnselect (ref) {
        app.refs["preview"].refs["content"].contentWindow.unselect()
        if (ref.refPreview.classList.length == 0) {
            ref.refPreview.removeAttribute("class")
        }
    }

    childResizeSelect (ref) {
        app.refs["preview"].refs["content"].contentWindow.resizeSelect(ref)
    }

    setText (ref, value) {
        ref.refPreview.innerText = value.replace(/\r?\n|\r/g, " ")
    }

    setDescription (ref, value) {
        ref.refPreview.setAttribute('data-desription', value)
    }

    async setVisualization (type) {

        this.refs["content"].classList.remove('contentSizePhone')
        this.refs["content"].classList.remove('contentSizeTablet')
        this.refs["content"].classList.remove('contentSizeDesktop')

        this.refs["buttonPhone"].classList.remove('buttonSelected')
        this.refs["buttonTablet"].classList.remove('buttonSelected')
        this.refs["buttonDesktop"].classList.remove('buttonSelected')

        if (type == 'phone') {
            this.refs["content"].classList.add('contentSizePhone')
            this.refs["buttonPhone"].classList.add('buttonSelected')
        }

        if (type == 'tablet') {
            this.refs["content"].classList.add('contentSizeTablet')
            this.refs["buttonTablet"].classList.add('buttonSelected')
        }

        if (type == 'desktop') {
            this.refs["content"].classList.add('contentSizeDesktop')
            this.refs["buttonDesktop"].classList.add('buttonSelected')
        }

        this.visualization = type

        app.refs["settings"].setVisualization()

        if (app.refSelected) {
            app.refs["preview"].refs["content"].contentWindow.unselect()
            await app.wait(250)
            app.refs["preview"].refs["content"].contentWindow.select(app.refSelected.refPreview)
        }
    }

    setSidebar (type) {
        if (type == "list") {
            if (this.showingList) {
                this.refs["buttonSidebarList"].classList.remove('buttonSelected')
            } else {
                this.refs["buttonSidebarList"].classList.add('buttonSelected')
            }
            this.showingList = !this.showingList
        } 
        if (type == "settings") {
            if (this.showingSettings) {
                this.refs["buttonSidebarSettings"].classList.remove('buttonSelected')
            } else {
                this.refs["buttonSidebarSettings"].classList.add('buttonSelected')
            }
            this.showingSettings = !this.showingSettings
        }
        let previewWidth = ""
        let listRight = ""
        let settingsRight = ""

        if (this.showingList && this.showingSettings) {
            previewWidth = "calc(100% - 550px)"
            listRight = "275px"
            settingsRight = "0"
        }

        if (!this.showingList && this.showingSettings) {
            previewWidth = "calc(100% - 275px)"
            listRight = "-275px"
            settingsRight = "0"
        }

        if (this.showingList && !this.showingSettings) {
            previewWidth = "calc(100% - 275px)"
            listRight = "0"
            settingsRight = "-275px"
        }

        if (!this.showingList && !this.showingSettings) {
            previewWidth = "100%"
            listRight = "-275px"
            settingsRight = "-275px"
        }

        app.refs.preview.elmRoot.style.width = previewWidth;
        app.refs.list.elmRoot.style.right = listRight;
        app.refs.settings.elmRoot.style.right = settingsRight;
    }

    setScript (value) {
        this.refs["content"].contentWindow.eval(value)
    }

    rebuild () {
        let refHead = this.refs["content"].contentDocument.head
        let refBody = this.refs["content"].contentDocument.body
        let refStyles = refHead.querySelectorAll("[data-css]")

        for (let cnt = 0; cnt < refStyles.length; cnt = cnt + 1) {
            refHead.removeChild(refStyles[cnt])
        }

        while (refBody.childNodes.length > 0) {
            refBody.removeChild(refBody.childNodes[0])
        }

        this.rebuildElement(app.elementsRoot)
    }

    rebuildElement (refApp) {

        for (let cnt = 0; cnt < refApp.childs.length; cnt = cnt + 1) {
            let child = refApp.childs[cnt]
            let ref = this.addChild(refApp, child)

            child.refPreview = ref
            child.setAttributes(child.attributes)

            if (child.childs.length > 0) {
                this.rebuildElement(child)
            }
        }
    }

    setCustomElementTag (refApp, value) {
        var origin = refApp.refPreview
        var dest = document.createElement(value)
        var index = 0

        // Move children
        while (origin.firstChild) {
            dest.appendChild(origin.firstChild)
        }

        // Copy attributes
        for (index = origin.attributes.length - 1; index >= 0; --index) {
            dest.attributes.setNamedItem(origin.attributes[index].cloneNode())
        }

        // Replace the element
        origin.parentNode.replaceChild(dest, origin)
        refApp.refPreview = dest
    }

    scrollToBottom () {
        this.refs["content"].contentWindow.scrollToBottom()
    }

    actionsEnable (action) {
        this.refs[action].classList.remove("disabled")
    }

    actionsDisable (action) {
        this.refs[action].classList.add("disabled")
    }

    toogleAutoSave () {
        let refAut = this.refs["toggleAutoSave"]
        let refInd = this.refs["toogleIndicator"]

        this.autoSaveData.active = !this.autoSaveData.active

        if (this.autoSaveData.active) {
            refAut.style.backgroundColor = "#a9c2dc"
            refInd.style.backgroundColor = "#f9f9f9"
            refInd.style.left = "16px"

            localStorage.removeItem("lastSave")
            this.autoSave(true)
            this.autoSaveData.interval = setInterval(() => { this.autoSave(false) }, 5000)
        } else {
            refAut.style.backgroundColor = ""
            refInd.style.backgroundColor = "#dadada"
            refInd.style.left = "2px"

            if (this.autoSaveData.interval) {
                clearInterval(this.autoSaveData.interval)
                this.autoSaveData.interval = undefined
            }
            localStorage.removeItem("lastSave")
        }        
    }

    autoSave (force) {
        let now = (new Date()).getTime()
        let doIt = (this.autoSaveData.stackSize != app.actions.stack.length && (now - this.autoSaveData.lastTime) > 5)
        let time = 0

        if (doIt || force) {
            this.autoSaveData.stackSize = app.actions.stack.length
            this.autoSaveData.lastTime = now
            localStorage.setItem("lastSave", app.refs["preview"].getTemplate(2))
            time = (new Date()).getTime()
        }
    }
}