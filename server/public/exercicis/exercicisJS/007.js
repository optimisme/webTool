function posiciona(vertical, horizontal) {
    let x = 0
    let y = 0

    // Agafem la referència a l'objecte caixa i les seves mides actuals
    let refCaixa = document.querySelector('#caixa')
    let estilCaixa = window.getComputedStyle(refCaixa)
    let ampleCaixa = parseInt(estilCaixa.width)
    let altCaixa = parseInt(estilCaixa.height)

    // Agafem la referència a l'objecte autocenter i les seves mides actuals
    let refAutocenter = document.querySelector(".autocenter")
    let estilAutocenter = window.getComputedStyle(refAutocenter)
    let ampleAutocenter = parseInt(estilAutocenter.width)
    let altAutocenter = parseInt(estilAutocenter.height)

    // Calcula la posició x,y si s'escull abaix a la dreta
    if (vertical == 'bottom' && horizontal == 'right') {
        x = ampleAutocenter - ampleCaixa
        y = altAutocenter - altCaixa
    }

    // Canvia l'estil a la nova posició x, y
    refCaixa.style.transform = `translate3d(${x}px, ${y}px, 0)`

    // Actualitza el text de la caixa
    refCaixa.innerHTML = `
        Posició: ${x},${y}
        <br/>
        Mida: ${ampleCaixa}x${altCaixa}
        <br/>
        Espai: ${ampleAutocenter}x${altAutocenter}
    `
}