async function setDrawer (name, show) {
    let refDrawer = document.querySelector(`div[data-drawer="${name}"]`)

    if (show) {
        let style = window.getComputedStyle(refDrawer)
        let now = style.getPropertyValue('display')
        let value = "block"
        let wait = () => { return new Promise((resolve, reject) => { setTimeout(() => { resolve() }, 1) }) }

        refDrawer.style.display = value
        while (now != value) {
            now = style.getPropertyValue('display')
            await wait()
        }

        refDrawer.style.opacity = 1
        refDrawer.querySelectorAll("div")[0].style.transform = "translate3d(0, 0, 0)"
    } else {
        refDrawer.style.opacity = 0
        refDrawer.querySelectorAll("div")[0].style.transform = "translate3d(-100%, 0, 0)"
        setTimeout(() => { refDrawer.style.display = "none" }, 250)
    }
}

function hideDrawerFromLit (e) {
    let ref = e.srcElement
    if (ref.hasAttribute("data-drawer")) {
        e.stopPropagation()
        e.preventDefault()
        setDrawer(ref.getAttribute("data-drawer"), false)
    }
}