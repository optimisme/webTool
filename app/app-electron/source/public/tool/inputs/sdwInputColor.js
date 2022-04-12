import { utils } from "../scriptUtils.js"

export class sdwInputColor extends HTMLElement {
    
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.refs = {}
        this.input = undefined
        this.change = undefined
        this.setAction = true
        this.attr = ""
        this.oldValue = "initial"
    }

    static get observedAttributes() { return ["disabled"]; }

    attributeChangedCallback(name, oldValue, newValue) { 

        if (name == "disabled") {
            if (newValue == "true") {
                this.refs["value"].setAttribute("disabled", "true")
                this.refs["picker"].setAttribute("disabled", "true")
            } else {
                this.refs["value"].removeAttribute("disabled")
                this.refs["picker"].removeAttribute("disabled")
            }
        }
    }

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
        let row = document.createElement("div")
        let name = document.createElement("div")
        
        this.attr = this.getAttribute("data-attr")

        row.setAttribute("class", "row")
        this.elmRoot.appendChild(row)

        name.setAttribute("class", "name")
        name.setAttribute("data-ref", "name")
        if (this.hasAttribute("data-help")) {
            let refHelp = document.createElement("a")
            refHelp.setAttribute("href", this.getAttribute("data-help"))
            refHelp.setAttribute("target", "_blank")
            refHelp.innerHTML = this.attr
            name.appendChild(refHelp)
        } else {
            name.innerHTML = this.attr
        }
        row.appendChild(name)

        let divInitial = document.createElement("div")
        divInitial.setAttribute("class", "button buttonSelected")
        divInitial.setAttribute("data-ref", "buttonInitial")
        divInitial.setAttribute("data-value", "initial")
        divInitial.setAttribute("data-tooltip", "Initial, removes this property")
        divInitial.addEventListener("click", () => {
            this.value = "initial"
            if (this.change) {
                this.change()
            }
        })
            let imgInitial = document.createElement("img")
            imgInitial.setAttribute("src", "./icons/initial.svg")
            divInitial.appendChild(imgInitial)
        row.appendChild(divInitial)

        let refInput = document.createElement("input")
        refInput.setAttribute("data-ref", "value")
        refInput.setAttribute("type", "text")
        refInput.value = ""
        refInput.addEventListener("change", () => {
            this.changeInput()
        })
        row.appendChild(refInput)

        let refColor = document.createElement("input")
        refColor.setAttribute("data-ref", "picker")
        refColor.setAttribute("type", "color")
        refColor.value = ""
        refColor.addEventListener("focus", () => {
            this.oldValue = this.value
        })
        refColor.addEventListener("input", () => {
            let refPicker = this.refs["picker"]
            this.setValueWithParams(refPicker.value, false, true)
        })
        refColor.addEventListener("change", () => {
            let refPicker = this.refs["picker"]
            let newValue = refPicker.value
            this.setValueWithParams(this.oldValue, false, true)
            this.setValueWithParams(newValue, this.setAction, true)
            if (this.change) {
                this.change()
            }
        })
        row.appendChild(refColor)

        let divIcon = document.createElement("div")
        divIcon.setAttribute("class", "icon")
            let imgIcon = document.createElement("img")
            if (this.hasAttribute("data-img")) {
                imgIcon.setAttribute("src", this.getAttribute("data-img"))
            } else {
                imgIcon.setAttribute("src", "./icons/empty.svg")
            }            
            divIcon.appendChild(imgIcon)
        row.appendChild(divIcon)

        utils.initTooltips(this.elmRoot)
        this.refs = utils.getRefs(this.elmRoot)
    }

    get value () {
        return app.refSelected.getStyle(this.attr)
    }

    set value (value) {
        this.setValueWithParams(value, true, true)
    }

    setValueWithParams (value, action, input) {
        let refInput = this.refs["value"]
        let refPicker = this.refs["picker"]
        let refInitial = this.refs["buttonInitial"]
        let classes = {
            "inputInherited":   { ref: refInput,    name: "inheritedInput",  added: false },
            "initialInherited": { ref: refInitial,  name: "buttonInherited", added: false },
            "initialSelected":  { ref: refInitial,  name: "buttonSelected",  added: false },
        }
        
        if (value == "") {
            value = "initial"
        }

        if (value == "initial") {

            app.refSelected.setStyle(this.attr, "initial", action)
            let inheritedStyle = app.refSelected.isInheritedStyle(this.attr)

            if (inheritedStyle) {
                classes["initialInherited"].added = true
                classes["inputInherited"].added = true
                let style = app.refSelected.getStyle(this.attr)
                refInput.value = style
                refPicker.value = this.anythingToHex(style)
            } else {
                classes["initialSelected"].added = true
                refInput.value = ""
                refPicker.value = "#000000"
            }

        } else {

            app.refSelected.setStyle(this.attr, value, action)
            let inheritedStyle = app.refSelected.isInheritedStyle(this.attr)

            if (inheritedStyle) {
                classes["initialInherited"].added = true
                classes["inputInherited"].added = true
                let style = app.refSelected.getStyle(this.attr)
                refInput.value = style
                refPicker.value = this.anythingToHex(style)
            } else {
                refInput.value = value
                refPicker.value = this.anythingToHex(value)
            }
        }

        utils.setInputClasses(classes)

        if (input && typeof this.input == "function") {
            this.input(refInput.value, action)
        }
    }

    changeInput () {
        let refInput = this.refs["value"]
        if (refInput.value == "") {
            this.value = "initial"
        } else {
            this.value = refInput.value
        }
        if (this.change) {
            this.change()
        }
    }

    anythingToHex (value) {
        let valuePicker = value
        if (value.indexOf("#") == -1) {
            valuePicker = this.colourNameToHex(value)
            if (valuePicker == "") {
                if (value.indexOf("rgb") == 0) {
                    valuePicker = this.colourRgbToHex(value)
                } else {
                    valuePicker = "#000000"
                }
            }
        } else {
            if (value.length == 7) {
                valuePicker = value
            } else if (value.length == 4) {
                valuePicker = this.colourHex3ToHex6(value)
            } else {
                valuePicker = "#000000"
            }
        }
        return valuePicker
    }

    colourHex3ToHex6 (value) {
       return "#" + value.charAt(1) +  value.charAt(1) + value.charAt(2) + value.charAt(2) + value.charAt(3) + value.charAt(3)
    }

    colourComponentToHex (value) {
        let hex = parseInt(value).toString(16)
        return hex.length == 1 ? "0" + hex : hex;   
    }

    colourRgbToHex (value) {
        let str = (value.substring(value.indexOf("(") + 1, value.indexOf(")"))).replace(/ /g, '')
        let arr = str.split(",")
        let r = arr[0]
        let g = arr[1]
        let b = arr[2]

        return "#" + this.colourComponentToHex(r) + this.colourComponentToHex(g) + this.colourComponentToHex(b)
    }

    colourNameToHex(colour)
    {
        var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
        "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
        "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
        "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
        "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
        "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
        "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
        "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","grey":"#808080","green":"#008000","greenyellow":"#adff2f",
        "honeydew":"#f0fff0","hotpink":"#ff69b4", "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
        "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
        "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
        "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
        "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
        "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
        "navajowhite":"#ffdead","navy":"#000080", "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
        "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
        "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
        "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
        "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0", "yellow":"#ffff00","yellowgreen":"#9acd32"}

        if (typeof colours[colour.toLowerCase()] != 'undefined')
            return colours[colour.toLowerCase()]

        return "";
    }
}