function mostra(numero) {
    let refs = document.querySelectorAll('.foto')

    refs[0].style.zIndex = 0
    refs[1].style.zIndex = 0
    refs[2].style.zIndex = 0

    refs[numero].style.zIndex = 1
}