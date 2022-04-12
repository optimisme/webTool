function initScrollAction () {

    if (scrollActionObserver) { scrollActionObserver.disconnect() }

    let options = {
        root: null,
        rootMargin: "-100px",
        threshold: 0.25
    }

    let handle = (entries) => { 
        for (let cnt = 0; cnt < entries.length; cnt = cnt + 1) {
            let entry = entries[cnt]
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1
                entry.target.style.transform = "translate3d(0, 0, 0)"
            } else if (entry.boundingClientRect.y > 0) {
                entry.target.style.opacity = 0
                entry.target.style.transform = "translate3d(0, 50px, 0)"
            }
        }
    }
    
    scrollActionObserver = new IntersectionObserver(handle, options)

    let elms = document.querySelectorAll('.scrollAction')

    for (let cnt = 0; cnt < elms.length; cnt = cnt + 1) {
        scrollActionObserver.observe(elms[cnt])
    }
}

if (!scrollActionObserver) { 
    var scrollActionObserver = undefined 
}

window.addEventListener("load", () => { initScrollAction() })
initScrollAction()