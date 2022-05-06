window.addEventListener('load', () => { init() })

function init () {
    formLoad()
}

function formLoad () {

    let refNom = document.querySelector('#nom')

    if (localStorage.usuari) {
        let obj = JSON.parse(localStorage.usuari)
        refNom.value = obj.nom
    }
}

function formSave () {

    let refNom = document.querySelector('#nom')
    let refCognom = document.querySelector('#cognom')

    let obj = {
        nom: refNom.value,
        cognom: refCognom.value
    }

    localStorage.usuari = JSON.stringify(obj)
}

function formClean () {
    let ref = document.querySelector("#formulari")   
    ref.reset()
}

function localStorageClean () {
    delete localStorage.usuari
}