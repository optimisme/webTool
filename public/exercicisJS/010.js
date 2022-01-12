function mostraFoto (numero) {
    let ref = document.querySelector('.llistaFotos')
    let ample = 300
    let distancia = numero * ample

    ref.style.transform = `translate3d(-${distancia}px, 0, 0)`
}

function mostraCotxe (tipus) {
    let refBlue = document.querySelector('.cotxeBlue')
    let refGreen = document.querySelector('.cotxeGreen')
    let refRed = document.querySelector('.cotxeRed')

    if (tipus == 'vermell') {
        refRed.style.display = 'block'
    } else {
        refRed.style.display = 'none'
    }
}