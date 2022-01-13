let llista = [
    { nom: 'Mewtwo', imatge: './013-mewtwo.png'},
    { nom: 'Pikachu', imatge: './013-pikachu.png'},
    { nom: 'Suicune', imatge: './013-suicune.png'},
    { nom: 'Charizard', imatge: './013-charizard.png'},
    { nom: 'Rayquaza', imatge: './013-rayquaza.png'},
]

function mostraLlista () {
    let refLlista = document.querySelector("#llista")
    let refItem = undefined
    

    refItem = llista[0]
    
    let refImage = document.createElement('img')
    refImage.setAttribute('src', refItem.imatge)
    refImage.setAttribute('class', 'imatge')

    let refNom = document.createElement('div')
    refNom.textContent = refItem.nom

    let refInfo = document.createElement('div')
    refInfo.setAttribute('class', 'info')
    refInfo.appendChild(refImage)
    refInfo.appendChild(refNom)

    refLlista.appendChild(refInfo)

    // El mateix pel segon pokémon (això s'ha d'esborrar ...)
    
    refItem = llista[1]
    
    refImage = document.createElement('img')
    refImage.setAttribute('src', refItem.imatge)
    refImage.setAttribute('class', 'imatge')

    refNom = document.createElement('div')
    refNom.textContent = refItem.nom

    refInfo = document.createElement('div')
    refInfo.setAttribute('class', 'info')

    refInfo.appendChild(refImage)
    refInfo.appendChild(refNom)
    refLlista.appendChild(refInfo)
}