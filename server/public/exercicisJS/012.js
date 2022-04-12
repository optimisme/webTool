let expanded = false

function changeExpandible () {
    let ref = document.querySelector('#expandible')
    let height = ref.scrollHeight + "px"

    if (expanded) {
        expanded = false
        ref.style.maxHeight = '0'
        ref.style.minHeight = '0'
    } else {
        expanded = true
        ref.style.maxHeight = height
        ref.style.minHeight = height
    }
}