function canviaDiv0 (manera) {
    let ref = document.querySelector("#div0")

    if (manera == 'html') {
        ref.innerHTML = `
        <h1>Titol del div 0</h1>
        <p>Nou text del div 0</p>`
    }
    if (manera == 'text') {
        ref.textContent = `
        <h1>Titol del div 0</h1>
        <p>Nou text del div 0</p>`
    }
    if (manera == 'codi') {
        // Esborrar els continguts de div0
        ref.innerHTML = ''

        // Crear un nou element h1
        let refH1 = document.createElement('h1')

        // Definir el text de l'element H1
        refH1.innerText = 'Titol del div 0'

        // Afegir l'element h1 a div0
        ref.appendChild(refH1)

        // Crear, definir el text i afegir un element p a div0
        let refP = document.createElement('p')
        refP.innerText = 'Nou text del div 0'        
        ref.appendChild(refP)
    }
}