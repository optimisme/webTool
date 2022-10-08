import {actions} from "./scriptActions.js"
import {treeNode} from "./scriptTreeNode.js"
import {utils} from "./scriptUtils.js"

export class sdwTool extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}

        this.visualizationPhase = false // Prevent appending style hundreds of times during "setVisualization" phase (and setting actions)
        this.counter = 0
        this.refSelected = null
        this.drag = {
            refDragElement: null,
            refDropElement: null,
            index: Infinity,
            position: Infinity,
            allowed: false
        }
        this.site = {
            name: "siteName",
            title: "",
            googleFonts: [],
            stylesheets: [],
            scripts: []
        }

        this.actions = new actions()

        this.settingsList = ['description', 'site-name', 'site-title', 'site-stylesheets', 'site-scripts', 'site-fonts', 'text-content', 'custom-element' , 'attributes', 'css-title', 'fit', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']

        this.tagsList = {
            html:       { childs: [],           description: 'Html',                    defaultText: '',                    settings: ['description', 'site-name']},
            head:       { childs: [],           description: 'Head',                    defaultText: '',                    settings: ['description', 'site-title', 'site-stylesheets', 'site-scripts', 'site-fonts']},
            body:       { childs: ['*'],        description: 'Body',                    defaultText: '',                    settings: ['description', 'attributes', 'css-title',             'display',                        'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background',                     'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            div:        { childs: ['*'],        description: 'Block container',         defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            span:       { childs: ['*'],        description: 'Span container',          defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            br:         { childs: [],           description: 'Line break',              defaultText: '',                    settings: ['description', 'attributes']},
            hr:         { childs: [],           description: 'Horizontal rule',         defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor']},
            h1:         { childs: [],           description: 'Header 1',                defaultText: 'H1',                  settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            h2:         { childs: [],           description: 'Header 2',                defaultText: 'H2',                  settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            h3:         { childs: [],           description: 'Header 3',                defaultText: 'H3',                  settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            h4:         { childs: [],           description: 'Header 4',                defaultText: 'H4',                  settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            p:          { childs: ['a', 'text'],description: 'Paragraph of text',       defaultText: 'Paragraph of text',   settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            a:          { childs: ['*'],        description: 'Link',                    defaultText: 'Link',                settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            text:       { childs: [],           description: 'Text',                    defaultText: 'Text',                settings: ['text-content']},
            img:        { childs: [],           description: 'Image',                   defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'fit', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            button:     { childs: [],           description: 'Button',                  defaultText: 'Button',              settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            ul:         { childs: ['li'],       description: 'List',                    defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            ol:         { childs: ['li'],       description: 'Numbered list',           defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            li:         { childs: [],           description: 'List element',            defaultText: 'List element',        settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            dl:         { childs: ['dt', 'dd'], description: 'Defined list',            defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            dt:         { childs: [],           description: 'Defined list title',      defaultText: 'List title',          settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            dd:         { childs: [],           description: 'Defined list data element',defaultText: 'List data element',  settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            table:      { childs: ['tr'],       description: 'Table',                   defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            tr:         { childs: ['th', 'td'], description: 'Table row',               defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            th:         { childs: ['*'],        description: 'Table header',            defaultText: 'Table header',        settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            td:         { childs: ['*'],        description: 'Table data cell',         defaultText: 'Table cell',          settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            form:       { childs: ['*'],        description: 'Form block',              defaultText: '',                    settings: ['description', 'attributes']},
            label:      { childs: ['*'],        description: 'Form label',              defaultText: 'Form label',          settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            input:      { childs: [],           description: 'Form input',              defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            textarea:   { childs: [],           description: 'Form text area',          defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            select:     { childs: ['option'],   description: 'Form select',             defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            option:     { childs: [],           description: 'Select option',           defaultText: 'Select option',       settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            audio:      { childs: ['source'],   description: 'Audio element',           defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            video:      { childs: ['source'],   description: 'Video element',           defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            iframe:     { childs: [],           description: 'Frame element',           defaultText: '',                    settings: ['description', 'attributes', 'css-title', 'position', 'display', 'flex-child', 'float', 'margin', 'border', 'border-radius', 'padding', 'size', 'overflow', 'shadows', 'background', 'backdrop-filters', 'opacity', 'transform', 'transition', 'filter', 'cursor', 'text-shadows', 'typography', 'paragraph', 'paragraph-columns']},
            object:     { childs: [],           description: 'Object element',          defaultText: '',                    settings: ['description', 'attributes']},
            source:     { childs: [],           description: 'Media source',            defaultText: '',                    settings: ['description', 'attributes']},
            custom:     { childs: [],           description: 'Custom element',          defaultText: '',                    settings: []},
        }

        this.templatesList = {
            // undoRedo: "undoRedo", // Template to test "unod/redo" removeChilds and addChilds
            autocenter:                     "Autocenter",
            autocenterColored:              "Autocenter with colored background",
            textWithLeftEllipsis:           "... Text with left ellipsis",
            textWithRightEllipsis:          "Text with right ellipsis ...",
            linkToGoogle:                   "Link to Google",
            gradientText:                   "Text colored with a gradient",
            image:                          "Image",
            iconsMaterial:                  "Icons from material icons font",
            iconsIon:                       "Icons from Ion icons",
            titleWithSubtitle:              "Title with subtitle",
            leftTextWithPicture:            "Left text with picture in a box",
            leftTitleRightText:             "Left title right text",
            leftTitleTextWithHint:          "Left tile, text and hint",
            threeCards:                     "Three cards",
            boxesInColoredAutocenter:       "Boxes in colored autocenter",
            pictureFutura:                  "Picture with shadow and text",
            picturePolaroid:                "Polaroid styled picture with shadow and text",
            pictureVintage:                 "Vintage styled picture with shadow and text",
            heroWithText:                   "Hero with title and subtitle",
            heroLeftBox:                    "Hero with a left box",
            heroHalfSize:                   "Hero with a half size box",
            heroBottomBox:                  "Hero with one box at bottom",
            googleMap:                      "Map from 'Google maps'",
            contactWithMap:                 "Contact information with a map",
            lottieAnimation:                "Lottie animation"
        }

        this.examplesList = {
            carouselDots:                   "Carousel with dots selector",
            carouselVintage:                "Carousel in a Vintage frame",
            carouselArrows:                 "Carousel with arrows",
            carouselWithTexts:              "Carousel with texts",
            drawer:                         "Drawer from left side",
            actionSheet:                    "Action sheet with frozen background",
            formStyled:                     "Form with material styles",
            alphabetList:                   "Alphabetic list",
            scrollShot:                     "Scroll position plays animation",
            scrollMovement:                 "Scroll movement sets animation %",
            scrollAction:                   "Enter scrollview sets an action"
        }

        // Replace '*' for allowed childs
        let keys = Object.keys(this.tagsList)
        let allowedKeys = Object.keys(this.tagsList)
        allowedKeys.splice(allowedKeys.indexOf('html'), 1)
        allowedKeys.splice(allowedKeys.indexOf('head'), 1)
        allowedKeys.splice(allowedKeys.indexOf('body'), 1)
        allowedKeys.splice(allowedKeys.indexOf('li'), 1)
        allowedKeys.splice(allowedKeys.indexOf('dt'), 1)
        allowedKeys.splice(allowedKeys.indexOf('dd'), 1)
        allowedKeys.splice(allowedKeys.indexOf('tr'), 1)
        allowedKeys.splice(allowedKeys.indexOf('th'), 1)
        allowedKeys.splice(allowedKeys.indexOf('td'), 1)
        allowedKeys.splice(allowedKeys.indexOf('option'), 1)
        allowedKeys.splice(allowedKeys.indexOf('source'), 1)
        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let obj = this.tagsList[keys[cnt]]
            if (obj.childs.length == 1 && obj.childs[0] == '*') {
                obj.childs = allowedKeys;
            }
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
    
        await this.initDefault()
        this.select(this.elementsRoot)

        if (localStorage.getItem("lastSave")) {
            if (window.confirm("Restore saved data?")) {
                this.refs["preview"].addTemplate(true, JSON.parse(localStorage.getItem("lastSave")))
                this.refs["preview"].toogleAutoSave()
            } else {
                localStorage.removeItem("lastSave")
            }
        }
    }

    async initDefault () {
        let refPreviewFrame = this.refs["preview"].refs["content"]
        let refPreviewWindow = refPreviewFrame.contentWindow
        while (!refPreviewWindow.frameLoaded) { await this.wait(1) }

        refPreviewWindow.refApp = this
        app.counter = 0

        // After refPreviewWindow is loaded!
        let refPreviewDocument = refPreviewFrame.contentDocument
        let refHtml = refPreviewDocument.querySelector("html")

        if (this.elementsRoot) {
            while (this.elementsRoot.childs.length > 0) {
                this.elementsRoot.remove(this.elementsRoot.childs[0])
            }
        } else {
            this.elementsRoot = new treeNode(null)
            this.elementsRoot.tag = "html"
        }
        
        this.elementsRoot.initAsHtml(refHtml)
        this.elementsRoot.addTag('head')
        this.refs["preview"].previewHead = this.elementsRoot.childs[0].refPreview
        this.elementsRoot.addTag('body')

        // await this.addStylesheet('https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp')
        // await this.addStylesheet('/style.css')  // As an example
        // await this.addScript('/script.js')      // As an example
        // await this.addFont('Dancing Script')    // As an example
        await this.addFont('Open Sans')
        this.elementsRoot.childs[1].setStyle("font-family", "Open Sans", false)
        this.elementsRoot.childs[1].setStyle("margin", "0", false)
        this.elementsRoot.childs[1].setStyle("padding", "0", false)
        
        this.actions.init()
    }

    isCustomTag (tag) {
        if (tag != "custom" && app.tagsList[tag]) {
            return false
        } else {
            return true
        }
    }

    canDrop (desiredParent, child) {
        let desiredParentChilds = []
        
        if (!this.isCustomTag(child.tag)) {
            desiredParentChilds = app.tagsList[desiredParent.tag].childs
        } else {
            desiredParentChilds = [child.tag]
        }

        if (desiredParent == child || desiredParent.isChildOf(child)) {
            return false
        } else if (desiredParentChilds.indexOf(child.tag) >= 0) {
            return true
        }

        return false
    }

    select (ref) {
        if (this.refSelected != null) {
            this.refSelected.unselect()
        }
        this.refSelected = ref
        this.refSelected.select()

        let childs = []
        if (!this.isCustomTag(this.refSelected.tag)) {
            childs = app.tagsList[this.refSelected.tag].childs
        } else {
            childs = app.tagsList["div"].childs
        }

        let childsParent = []
        if (this.refSelected.tag != "html") {
            if (!this.isCustomTag(this.refSelected.tag)) {
                childsParent = app.tagsList[this.refSelected.parent.tag].childs
            } else {
                childsParent = [this.refSelected.tag]
            }
        } 

        if (childs.length > 0) {
            this.refs["list"].setButtonAdd(true)
        } else {
            this.refs["list"].setButtonAdd(false)
        }

        if (childsParent.length > 0 && childsParent.indexOf(this.refSelected.tag) >= 0) {
            this.refs["list"].setButtonDuplicate(true)
        } else {
            this.refs["list"].setButtonDuplicate(false)
        }

        if (this.refSelected.tag == "body") {
            this.refs["list"].setButtonTemplates(true)
        } else {
            this.refs["list"].setButtonTemplates(false)
        }

        if (this.refSelected.tag == "body") {
            this.refs["list"].setButtonExamples(true)
        } else {
            this.refs["list"].setButtonExamples(false)
        }

        if (["html", "head", "body"].indexOf(this.refSelected.tag) == -1) { 
            this.refs["list"].setButtonRemove(true)
        } else {
            this.refs["list"].setButtonRemove(false)
        }

        this.refs["settings"].setVisualization()
    }

    unselect () {
        if (this.refSelected != null) {
            this.refSelected.unselect()
        }
        this.refSelected = null
        this.refs["list"].setButtonAdd(false)
        this.refs["list"].setButtonDuplicate(false)
        this.refs["list"].setButtonTemplates(false)
        this.refs["list"].setButtonExamples(false)
        this.refs["list"].setButtonRemove(false)

        app.refs["settings"].setVisualization()
    }

    getRefById (id) {
        return this.elementsRoot.getRefById(id)
    }

    async addFont (name, setAction) {
        
        if (setAction) {
            app.actions.push( { 
                action: "addGoogleFont", 
                value: name
            } )
        }

        let safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase()

        if (this.elementsRoot && this.site.googleFonts.indexOf(name) == -1) {

            this.site.googleFonts.push(name)

            let linkTool = document.createElement('link')
            linkTool.setAttribute('href', `https://fonts.googleapis.com/css2?family=${name.replaceAll(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`)
            linkTool.setAttribute('rel', 'stylesheet')
            linkTool.setAttribute('type', 'text/css')
            linkTool.setAttribute('media', 'all')
            linkTool.setAttribute('data-ref', safeName)
            document.querySelector('head').appendChild(linkTool)

            let linkPreview = document.createElement('link')
            linkPreview.setAttribute('href', `https://fonts.googleapis.com/css2?family=${name.replaceAll(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`)
            linkPreview.setAttribute('rel', 'stylesheet')
            linkPreview.setAttribute('type', 'text/css')
            linkPreview.setAttribute('media', 'all')
            linkPreview.setAttribute('data-ref', safeName)
            app.refs["preview"].shadow.querySelector('iframe').contentDocument.head.appendChild(linkPreview)

            app.refs["settings"].setVisualization()
        }
    }

    deleteFont (name, setAction) {
        
        if (setAction) {
            app.actions.push( { 
                action: "delGoogleFont", 
                value: name
            } )
        }

        let safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        let refDocument = document.querySelector('head')
        let refFrame = app.refs["preview"].shadow.querySelector('iframe').contentDocument.head

        refDocument.removeChild(refDocument.querySelector(`[data-ref=${safeName}]`))
        refFrame.removeChild(refFrame.querySelector(`[data-ref=${safeName}]`))


        this.site.googleFonts.splice(this.site.googleFonts.indexOf(name), 1)
        app.elementsRoot.deleteFont(`${name}`)

        app.refs["settings"].setVisualization()
    }

    async addStylesheet (value, setAction) {

        if (setAction) {
            app.actions.push( { 
                action: "addStylesheet", 
                value: value
            } )
        }

        if (this.site.stylesheets.indexOf(value) == -1) {

            let srcFile = document.createElement('link')
            srcFile.setAttribute('href', value)
            srcFile.setAttribute('rel', 'stylesheet')
            app.refs["preview"].shadow.querySelector('iframe').contentDocument.head.appendChild(srcFile)
            // TODO: Detect if properly added before adding it to 'this.site.stylesheet'
            this.site.stylesheets.push(value)
        }

        app.refs["settings"].setVisualization()
    }

    deleteStylesheet (value, setAction) {
        
        if (setAction) {
            app.actions.push( { 
                action: "delStylesheet", 
                value: value
            } )
        }

        this.site.stylesheets.splice(this.site.stylesheets.indexOf(value), 1)
        app.refs["settings"].setVisualization()
    }

    async reloadStylesheet (value) {

        let srcFile = document.createElement('link')
        srcFile.setAttribute('href', value + '?' + parseInt(Math.random() * 1000000000))
        srcFile.setAttribute('rel', 'stylesheet')
        app.refs["preview"].shadow.querySelector('iframe').contentDocument.head.appendChild(srcFile)
        // TODO: Detect if properly added and remove it from 'this.site.stylesheets' if not
        app.refs["settings"].setVisualization()

        await this.wait(250)
        let refWindow = app.refs["preview"].shadow.querySelector('iframe').contentWindow
        if (typeof refWindow.init == 'function') refWindow.init()
    }

    async addScript (value, setAction) {
        
        if (setAction) {
            app.actions.push( { 
                action: "addScript", 
                value: value
            } )
        }

        if (this.site.scripts.indexOf(value) == -1) {

            let srcScript = document.createElement('script')
            srcScript.setAttribute('src', value)
            srcScript.setAttribute('type', 'text/javascript')
            app.refs["preview"].shadow.querySelector('iframe').contentDocument.head.appendChild(srcScript)
            // TODO: Detect if properly added before adding it to 'this.site.scripts'
            this.site.scripts.push(value)
        }

        app.refs["settings"].setVisualization()
    }

    deleteScript (value, setAction) {
        
        if (setAction) {
            app.actions.push( { 
                action: "delScript", 
                value: value
            } )
        }
        
        this.site.scripts.splice(this.site.scripts.indexOf(value), 1)
        app.refs["settings"].setVisualization()
    }

    async reloadScript (value) {

        let srcScript = document.createElement('script')
        srcScript.setAttribute('src', value + '?' + parseInt(Math.random() * 1000000000))
        srcScript.setAttribute('type', 'text/javascript')
        app.refs["preview"].shadow.querySelector('iframe').contentDocument.head.appendChild(srcScript)
        // TODO: Detect if properly added and remove it from 'this.site.scripts' if not
        app.refs["settings"].setVisualization()

        await this.wait(250)
        let refWindow = app.refs["preview"].shadow.querySelector('iframe').contentWindow
        if (typeof refWindow.init == 'function') refWindow.init()
    }

    capitalize (s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    wait (time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, time)
        })
    }

    showPopup (type) {
        if (type == 'add') {
            this.refs["popupAll"].show(this.refs["list"].refs["buttonAdd"])
        }
        if (type == 'templates') {
            this.refs["popupTemplates"].show(this.refs["list"].refs["buttonTemplates"])
        }
        if (type == 'examples') {
            this.refs["popupExamples"].show(this.refs["list"].refs["buttonExamples"])
        }
    }

    showPopupCss (type) {
        this.refs["popupCss"].show(app.refs["settings"].refs["css-title"].refs["popup-css"])
    }
    
    addTag (tag) {
        if (this.refSelected != null) {
            let ref = this.refSelected.addTag(tag)

            app.actions.push( { 
                action: "addTag", 
                parent: this.refSelected.appId, 
                child: ref.appId,
                position: ref.getPosition(),
                obj: ref.toString()
            } )
        }
    }

    duplicate () {
        if (this.refSelected != null) {
            let str = this.refSelected.toString()
            let objCopy = JSON.parse(str)

            this.refSelected.parent.add(objCopy)

            let position = this.refSelected.getPosition()
            let lastChild = this.refSelected.parent.childs.length - 1
            let ref = this.moveAt(this.refSelected.parent, this.refSelected.parent.childs[lastChild], position + 1)

            app.actions.push( { 
                action: "duplicate", 
                parent: this.refSelected.parent.appId, 
                child: ref.appId,
                position: ref.getPosition(),
                obj: ref.toString()
            } )
        }
    }

    remove () {
        if (this.refSelected != null && this.refSelected.tag != "html") {

            app.actions.push( { 
                action: "remove", 
                parent: this.refSelected.parent.appId, 
                child: this.refSelected.appId,
                position: this.refSelected.getPosition(),
                obj: this.refSelected.toString()
            } )

            this.refSelected.parent.remove(this.refSelected)
            this.unselect()
        }
    }

    moveAt (newParent, child, parentPosition) {

        let fixedPosition = parentPosition
        let childPosition = child.getPosition()

        // NOTE: Fix problems of dragging elements at 'sdwToolListItem.js > moveAt'
        
        child.parent.childs.splice(childPosition, 1) // Remove chid
        newParent.childs.splice(fixedPosition, 0, child) // Add to newParent
        child.parent = newParent

        app.refs["list"].setChildsPositions()
        app.refs["preview"].rebuild()

        if (!newParent.refList.expanded) {
            newParent.refList.expand()
        }
        this.select(child)

        return child
    }

    async appendTemplate (template) {

        let src = await (await fetch(`./templates/${template}.json`)).text()

        let obj = JSON.parse(src)
        await app.refs["preview"].addTemplate(false, obj)
    }

    async appendExample (template) {

        let src = await (await fetch(`./examples/${template}.json`)).text()

        let obj = JSON.parse(src)
        await app.refs["preview"].addTemplate(false, obj)
    }

    resize () {
        this.refs["settings"].setVisualization()
        if (app.refSelected) {
            app.select(app.refSelected)
        }
    }

    keydown (e) {
        if (e.code == "KeyZ" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
            e.preventDefault()
            e.stopPropagation()
            this.actions.undo()
        }

        if (e.code == "KeyZ" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
            e.preventDefault()
            e.stopPropagation()
            this.actions.redo()
        }

        if (e.path && e.path[0]
         && e.path[0].tagName 
         && e.path[0].tagName.toLowerCase() != 'input'
         && e.path[0].tagName.toLowerCase() != 'textarea') {
            if (e.code == "Delete" || e.code == "Backspace") {
                e.preventDefault()
                e.stopPropagation()
                if (this.refSelected && ["html", "head", "body"].indexOf(this.refSelected.tag) == -1) { 
                    app.remove()
                }
            }
        }
    }

    printStack () {
        let e = new Error()
        console.log(e.stack)
    }

    printTree () {
        this.elementsRoot.printTree("")
    }

    printActions () {
        console.log(app.actions)
    }
}