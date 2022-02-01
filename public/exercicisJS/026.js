window.addEventListener('load', () => { formLoad() })

async function formLoad () {

    let refNom = document.querySelector('#nom')

    let obj = {
        type: 'fileRead',
        file: 'usuari.json'
    }

    let usuari = await serverFetch(obj)

    if (usuari) {
        refNom.value = usuari.nom
    }    
}

async function formSave () {

    let refNom = document.querySelector('#nom')
    let refCognom = document.querySelector('#cognom')

    let obj = {
        type: 'fileSave',
        file: 'usuari.json',
        data: {
            nom: refNom.value
        }
    }

    await serverFetch(obj)
}

function formClean () {
    let ref = document.querySelector("#formulari")   
    ref.reset()
}

async function fileDelete () {

    let obj = {
        type: 'fileDelete',
        file: 'usuari.json'
    }

    await serverFetch(obj)
}

async function serverFetch (obj) {

    let data = undefined
    try {
        let response = await fetch('/call', {
            method: 'POST', 
            body: JSON.stringify(obj),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        if (response.status = 200) {
            let result = JSON.parse(await response.text())
            if (result.status && result.status == 'ok') {
                data = result.data
            } else {
               console.warn('Server fetch warning: ', result)
            }
        }
    } catch (err) {
        console.error('Server fetch error: ', err)
    }
    return data
}