async function setModal (name, show) {
    let refSheet = document.querySelector(name)

    if (show) {
        let style = window.getComputedStyle(refSheet)
        let now = style.getPropertyValue('display')
        let value = "block"
        let wait = () => { return new Promise((resolve, reject) => { setTimeout(() => { resolve() }, 1) }) }

        refSheet.style.display = value
        while (now != value) {
            now = style.getPropertyValue('display')
            await wait()
        }

        refSheet.style.opacity = 1
        refSheet.querySelectorAll("div")[0].style.transform = "translate3d(0, 0, 0)"
    } else {
        refSheet.style.opacity = 0
        refSheet.querySelectorAll("div")[0].style.transform = "translate3d(0, calc(100% + 25px), 0)"
        setTimeout(() => { refSheet.style.display = "none" }, 250)
    }
}

function hideModalFromBack (e) {
    let ref = e.srcElement
    if (ref.hasAttribute("id")) {
        e.stopPropagation()
        e.preventDefault()
        setModal(`#${ref.getAttribute("id")}`, false)
    }
}