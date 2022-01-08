function setCarouselDots (ref) {
    let index = 0
    for (let cnt = 0; cnt < ref.parentNode.children.length; cnt = cnt + 1) {
        let dot = ref.parentNode.children[cnt]
        if (ref == dot) {
            index = cnt
            let style = window.getComputedStyle(ref)["border-top-color"] // Firefox returns "" for border-color
            console.log(style)
            if (style) {
                dot.style.backgroundColor = style
            } else {
                dot.style.backgroundColor = "grey"
            }       
        } else {
            dot.style.backgroundColor = "initial"
        }
    }
    let obj = ref.parentNode.parentNode
    let refImages = obj.querySelector('*[data-carousel="images"]')
    refImages.style.transform = 'translateX(-' + (index * 100) + '%)'
}