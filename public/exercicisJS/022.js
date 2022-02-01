function updateQuality () {
    let refQuality = document.querySelector("input[name='quality']:checked")
    
    let refImg240 = document.querySelector('#img240')
    let refImg480 = document.querySelector('#img480')

    console.log(`Qualitat ${refQuality.value}`)

    if (refQuality.value == '240') {
        refImg240.style.display = 'unset'
    } else {
        refImg240.style.display = 'none'
    }

    if (refQuality.value == '480') {
        refImg480.style.display = 'unset'
    } else {
        refImg480.style.display = 'none'
    }

}

function updateColor () {
    let refFilter = undefined
    let refStack = document.querySelector(".stack")
    
    console.log(`Filter ${refFilter.value}`)

    if (refFilter.value == 'unset') {
        refStack.style.filter = 'unset'
    }
    if (refFilter.value == 'grayscale') {
        refStack.style.filter = 'grayscale(100%)'
    }
    if (refFilter.value == 'saturate') {
        refStack.style.filter = 'saturate(200%)'
    }
}