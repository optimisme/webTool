
function setCarouselArrows(ref, direction) {
    let num = 0
    let obj = ref.parentNode.parentNode
    let refImages = obj.querySelector('*[data-carousel="images"]')
    let numImages = (refImages.children.length - 1)

    if (refImages.style.transform != '') {
        num = -1 * (parseInt((refImages.style.transform.replace('translateX(', '')).replace('%)', '')) / 100)
    }
    
    if (direction == 'left') { num = num - 1; } else { num = num + 1; }
    
    if (num <= 0) { 
        obj.querySelector('*[data-carousel="leftArrow"]').style.opacity = '0'
        obj.querySelector('*[data-carousel="leftArrow"]').style.transform = 'scale3d(0, 0, 0)'
        obj.querySelector('*[data-carousel="leftArrow"]').style.pointerEvents = 'none'
    } else {
        obj.querySelector('*[data-carousel="leftArrow"]').style.opacity = '1'
        obj.querySelector('*[data-carousel="leftArrow"]').style.transform = 'scale3d(1, 1, 1)'
        obj.querySelector('*[data-carousel="leftArrow"]').style.pointerEvents = 'initial'
    }
    if (num >= numImages) { 
        obj.querySelector('*[data-carousel="rightArrow"]').style.opacity = '0'
        obj.querySelector('*[data-carousel="rightArrow"]').style.transform = 'scale3d(0, 0, 0)'
        obj.querySelector('*[data-carousel="rightArrow"]').style.pointerEvents = 'none'
    } else {
        obj.querySelector('*[data-carousel="rightArrow"]').style.opacity = '1'
        obj.querySelector('*[data-carousel="rightArrow"]').style.transform = 'scale3d(1, 1, 1)'
        obj.querySelector('*[data-carousel="rightArrow"]').style.pointerEvents = 'initial'
    }

    refImages.style.transform = 'translateX(-' + (num * 100) + '%)'
}
