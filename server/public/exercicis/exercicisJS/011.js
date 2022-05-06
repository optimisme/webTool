function actualitzaResum () {
    let refTitol = document.querySelector("#titol")
    let refResum = document.querySelector("#resum")
    
    let valorTitol = refTitol.textContent

    refResum.innerHTML = `
        Titol: ${valorTitol}, 
        <br/>
        Text:
    `
}