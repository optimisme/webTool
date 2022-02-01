function formSave () {

    let refNom = document.querySelector('#nom')

    let obj = {
        nom: refNom.value,
        cognom: 'Esponja'
    }

    localStorage.usuari = JSON.stringify(obj)
}

function formClean () {
    let ref = document.querySelector("#formulari")   
    ref.reset()
}