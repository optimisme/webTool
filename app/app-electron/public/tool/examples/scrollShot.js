window.addEventListener("scroll", (evt) => { scrollShot(evt) })

function scrollShot (evt) {
    if (evt && evt.type == "scroll") {
        let refs = document.querySelectorAll('[data-scroll-shot="true"]')
        for (let cnt = 0; cnt < refs.length; cnt = cnt + 1) {
            let ref = refs[cnt]
            let refBounds = ref.getBoundingClientRect()
            let position = (!ref.hasAttribute("data-scroll-position")) ? 50 : parseFloat(ref.getAttribute("data-scroll-position"))
            let limitY = refBounds.y + refBounds.height
            let actionHeight = document.documentElement.clientHeight + refBounds.height
            let percentage = 0
    
            if (limitY < 0) {
                percentage = 99.9
            } else if (limitY > actionHeight) {
                percentage = 0
            } else {
                percentage = 100 - (limitY * 100 / actionHeight)
            }

            if (percentage > position) {
                ref.style.animationPlayState = "running"
                ref.style.animationFillMode = "forwards"
            }
            // TODO: Play backwards otherwise
        }
    }
}