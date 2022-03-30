window.addEventListener("scroll", (evt) => { scrollMovement(evt) })

function scrollMovement (evt) {
    if (evt && evt.type == "scroll") {
        let refs = document.querySelectorAll('[data-scroll-movement="true"]')
        for (let cnt = 0; cnt < refs.length; cnt = cnt + 1) {
            let ref = refs[cnt]
            let refBounds = ref.getBoundingClientRect()
            let safeY = (!ref.hasAttribute("data-scroll-safe-y")) ? 0 : parseFloat(ref.getAttribute("data-scroll-safe-y"))
            let limitY = refBounds.y + refBounds.height - safeY
            let actionHeight = document.documentElement.clientHeight + refBounds.height - (safeY * 2)
            let percentage = 0
    
            if (limitY < 0) {
                percentage = 99.9
            } else if (limitY > actionHeight) {
                percentage = 0
            } else {
                percentage = 100 - (limitY * 100 / actionHeight)
            }

            ref.style.animationDelay = (-percentage) + "ms"
        }
    }
}