
function select(ref) {
    // https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    if (ref && ["html", "head"].indexOf(ref.tagName.toLowerCase()) == -1) {

        let scrollX = window.scrollX
        let scrollY = window.scrollY
        let style = undefined
        let bounds = ref.getBoundingClientRect()

        let top = (scrollY + bounds.y)
        let left = (scrollX + bounds.x)
        let height = bounds.height
        let width = bounds.width

        // Scroll to element
        if (ref.tagName.toLowerCase() != "body") {
            let positionHalfY = top + (height / 2)
            let viewMinY = scrollY
            let viewMaxY = scrollY + window.innerHeight
            if (positionHalfY < viewMinY || positionHalfY > viewMaxY) {
                let viewHalfY = (viewMaxY - viewMinY) / 2
                let positionY = positionHalfY - viewHalfY
                if (top == 0) positionY = 0
                if (positionY < 0) positionY = 0
                if (positionY > document.body.scrollHeight) positionY = document.body.scrollHeight
                window.scrollTo(0, positionY)
            }
        }

        let refSelect0 = document.createElement("div")
        refSelect0.setAttribute("class", "previewSelect0")
        refSelect0.style.left = left + "px"
        refSelect0.style.top = top + "px"
        refSelect0.style.height = (height - 2) + "px"
        refSelect0.style.width = (width - 2) + "px"
        document.body.appendChild(refSelect0)

        let refSelect1 = document.createElement("div")
        refSelect1.setAttribute("class", "previewSelect1")
        refSelect1.style.left = left + "px"
        refSelect1.style.top = top + "px"
        refSelect1.style.height = (height - 2) + "px"
        refSelect1.style.width = (width - 2) + "px"
        document.body.appendChild(refSelect1)

        style = window.getComputedStyle(ref)
        let marginTop = parseInt(style["margin-top"])
        let refMarginTop = document.createElement("div")
        refMarginTop.setAttribute("class", "margin")
        refMarginTop.style.left = left + "px"
        refMarginTop.style.top = (top - marginTop) + "px"
        refMarginTop.style.height = marginTop + "px"
        refMarginTop.style.width = width + "px"
        document.body.appendChild(refMarginTop)

        style = window.getComputedStyle(ref)
        let marginBottom = parseInt(style["margin-bottom"])
        let refMarginBottom = document.createElement("div")
        refMarginBottom.setAttribute("class", "margin")
        refMarginBottom.style.left = left + "px"
        refMarginBottom.style.top = (top + height) + "px"
        refMarginBottom.style.height = marginBottom + "px"
        refMarginBottom.style.width = width + "px"
        document.body.appendChild(refMarginBottom)
        
        style = window.getComputedStyle(ref)
        let marginLeft = parseInt(style["margin-left"])
        let refMarginLeft = document.createElement("div")
        refMarginLeft.setAttribute("class", "margin")
        refMarginLeft.style.left = (left - marginLeft) + "px"
        refMarginLeft.style.top = top + "px"
        refMarginLeft.style.height = height + "px"
        refMarginLeft.style.width = marginLeft + "px"
        document.body.appendChild(refMarginLeft)

        style = window.getComputedStyle(ref)
        let marginRight = parseInt(style["margin-right"])
        let refMarginRight = document.createElement("div")
        refMarginRight.setAttribute("class", "margin")
        refMarginRight.style.left = (left + width) + "px"
        refMarginRight.style.top = top + "px"
        refMarginRight.style.height = height + "px"
        refMarginRight.style.width = marginRight + "px"
        document.body.appendChild(refMarginRight)

        style = window.getComputedStyle(ref)
        let paddingTop = parseInt(style["padding-top"])
        let refPaddingTop = document.createElement("div")
        refPaddingTop.setAttribute("class", "padding")
        refPaddingTop.style.left = left + "px"
        refPaddingTop.style.top = (top + 1) + "px"
        refPaddingTop.style.height = (paddingTop - 1) + "px"
        refPaddingTop.style.width = width + "px"
        document.body.appendChild(refPaddingTop)

        style = window.getComputedStyle(ref)
        let paddingBottom = parseInt(style["padding-bottom"])
        let refPaddingBottom = document.createElement("div")
        refPaddingBottom.setAttribute("class", "padding")
        refPaddingBottom.style.left = left + "px"
        refPaddingBottom.style.top = (top + height - paddingBottom) + "px"
        refPaddingBottom.style.height = (paddingBottom - 1) + "px"
        refPaddingBottom.style.width = width + "px"
        document.body.appendChild(refPaddingBottom)
        
        style = window.getComputedStyle(ref)
        let paddingLeft = parseInt(style["padding-left"])
        let refPaddingLeft = document.createElement("div")
        refPaddingLeft.setAttribute("class", "padding")
        refPaddingLeft.style.left = (left + 1) + "px"
        refPaddingLeft.style.top = (top + paddingTop) + "px"
        refPaddingLeft.style.height = (height - paddingTop - paddingBottom) + "px"
        refPaddingLeft.style.width = paddingLeft + "px"
        document.body.appendChild(refPaddingLeft)

        style = window.getComputedStyle(ref)
        let paddingRight = parseInt(style["padding-right"])
        let refPaddingRight = document.createElement("div")
        refPaddingRight.setAttribute("class", "padding")
        refPaddingRight.style.left = (left + width - paddingRight - 1) + "px"
        refPaddingRight.style.top = (top + paddingTop) + "px"
        refPaddingRight.style.height = (height - paddingTop - paddingBottom) + "px"
        refPaddingRight.style.width = paddingRight + "px"
        document.body.appendChild(refPaddingRight)
    }
}

function unselect () {
    let list = [".previewSelect0", ".previewSelect1", ".margin", ".padding"]
    for (let cnt = 0; cnt < list.length; cnt = cnt + 1) {
        let name = list[cnt]
        let refs = document.querySelectorAll(name)
        for (let cntR = (refs.length - 1); cntR >= 0; cntR = cntR - 1) {
            refs[cntR].parentElement.removeChild(refs[cntR])
        }
    }
}

function resizeSelect (ref) {
    unselect()
    select(ref)
}