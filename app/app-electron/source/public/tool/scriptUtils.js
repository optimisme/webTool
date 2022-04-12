export class utils {

    constructor () {}

    static initExpandable (ref) {
        ref.refs["rowSection"].addEventListener("click", () => {
            utils.setExpandable(ref, !ref.expanded)
        })
    }

    static setExpandable (ref, expanded) {        
        ref.expanded = expanded
        if (ref.expanded) {
            ref.refs["arrow"].classList.add("arrowExpanded")
            let height = ref.refs["expandableBox"].scrollHeight + "px"
            ref.refs["expandable"].style.maxHeight = height
            ref.refs["expandable"].style.minHeight = height
        } else {
            ref.refs["arrow"].classList.remove("arrowExpanded")
            ref.refs["expandable"].style.maxHeight = "0"
            ref.refs["expandable"].style.minHeight = "0"
        }
    }

    static initTooltips (ref) {
        for (let cnt = 0; cnt < ref.childNodes.length; cnt = cnt + 1) {
            let item = ref.childNodes[cnt]
            if (item.nodeType == Node.ELEMENT_NODE) {
                if (item.hasAttribute("data-tooltip")) {
                    item.addEventListener("mouseover", (evt) => {
                        app.refs["tooltip"].show(item)
                    })
                    item.addEventListener("mouseout", (evt) => {
                        app.refs["tooltip"].hide(item)
                    })
                }
                if (item.childNodes.length > 0) {
                    this.initTooltips(item)
                }
            }
        }
    }

    static getRefs (ref) {
        let rst = {}
        for (let cnt = 0; cnt < ref.childNodes.length; cnt = cnt + 1) {
            let item = ref.childNodes[cnt]
            if (item.nodeType == Node.ELEMENT_NODE) {
                if (item.hasAttribute("data-ref")) {
                    rst[item.getAttribute("data-ref")] = item
                }
                if (item.childNodes.length > 0) {
                    Object.assign(rst, this.getRefs(item))
                }
            }
        }
        return rst
    }

    static setVisualization (ref) {
        let inputs = ref.elmRoot.querySelectorAll("[data-attr]")
        for (let cnt = 0; cnt < inputs.length; cnt = cnt + 1) {
            let refInput = inputs[cnt]
            let attr = refInput.getAttribute("data-attr")
            let value = app.refSelected.getStyle(attr)
            refInput.setValueWithParams(value, false)
        }
        utils.setModified(ref)
    }

    static initModified (ref) {
        let inputs = ref.elmRoot.querySelectorAll("[data-attr]")
        for (let cnt = 0; cnt < inputs.length; cnt = cnt + 1) {
            let refInput = inputs[cnt]
            refInput.change = () => {
                utils.setModified(ref)
            }
        }
    }

    static setModified (ref) {
        let inputs = ref.elmRoot.querySelectorAll("[data-attr]")
        let modified = false
        let refInput = undefined
        let attr = undefined
        let value = undefined

        if (app.refSelected) {
            for (let cnt = 0; cnt < inputs.length; cnt = cnt + 1) {
                refInput = inputs[cnt]
                attr = refInput.getAttribute("data-attr")
                value = app.refSelected.getStyle(attr)
                
                if (attr.indexOf("-ts") == 0) continue
                if (value != "initial") {
                    modified = true
                    break
                }
            }
        }
        
        if (modified) {
            ref.refs["modified"].classList.add("modified")
        } else {
            ref.refs["modified"].classList.remove("modified")
        }
    }

    static setInputClasses (classes) {
        let keys = Object.keys(classes)
        let item = undefined
        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            item = classes[keys[cnt]]
            if (item.added) {
                if (!item.ref.classList.contains(item.name)) {
                    item.ref.classList.add(item.name)
                }
            } else {
                if (item.ref.classList.contains(item.name)) {
                    item.ref.classList.remove(item.name)
                } 
            }
        }
    }
}