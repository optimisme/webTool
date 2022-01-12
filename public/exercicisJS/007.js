function posiciona(vertical, horizontal) {
    let x = 0
    let y = 0

    let refCaixa = document.querySelector('#caixa')
    let estilCaixa = window.getComputedStyle(refCaixa)
    let ampleCaixa = parseInt(estilCaixa.width)
    let altCaixa = parseInt(estilCaixa.height)

    let refAutocenter = document.querySelector(".autocenter")
    let estilAutocenter = window.getComputedStyle(refAutocenter)
    let ampleAutocenter = parseInt(estilAutocenter.width)
    let altAutocenter = parseInt(estilAutocenter.height)

    if (vertical == 'bottom' && horizontal == 'right') {
        x = ampleAutocenter - ampleCaixa;
        y = altAutocenter - altCaixa
    }

    refCaixa.style.transform = `translate3d(${x}px, ${y}px, 0)`
    refCaixa.innerHTML = `
        Posició: ${x},${y}
        <br/>
        Mida: ${ampleCaixa}x${altCaixa}
        <br/>
        Espai: ${ampleAutocenter}x${altAutocenter}
    `
}