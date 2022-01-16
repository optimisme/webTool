window.addEventListener('popstate', (evt) => { navegacio(evt); return false })

let seccioDefault = 'seccioIngredients'

function init () {
    let url = document.location.href
    let urlArr = url.split("#")

    if (urlArr.length == 1) {
        canviaSeccio('', true)
    } else {
        canviaSeccio(urlArr[1], true)
    }
}

function navegacio (evt) {
    let url = evt.state ? evt.state.html : ''
    let urlArr = url.split("#")

    if (urlArr.length == 1) {
        canviaSeccio('', true)
    } else {
        canviaSeccio(urlArr[1], true)
    }
}

function canviaSeccio (id, fromNavigation) {
    
    if (id == "") {
        id = seccioDefault
    }

    // Mostrar la seccio sel·leccionada
    let refMenuItems = document.querySelectorAll('.item') 
    let refSeccions = document.querySelectorAll('.seccio')

    for (let cnt = 0; cnt < refSeccions.length; cnt = cnt + 1) {
        let refMenuItem = refMenuItems[cnt]
        let refSeccio = refSeccions[cnt]
        if (refSeccio.getAttribute('id') == id) {
            refMenuItem.classList.add('selected')
            refSeccio.style.display = 'unset'
        } else {
            refMenuItem.classList.remove('selected')
            refSeccio.style.display = 'none'
        }
    }

    // Si no s'ha cridat 'canviaSeccio' des dels botons de navegacio
    if (!fromNavigation) {
        let hash = (id == '') ? '' : '#'
        // Actualitzar l'historial del navegador amb aquesta secció
        let url = `${document.location.href.split('#')[0]}${hash}${id}`
        window.history.pushState({ html: url }, '', url)
    }
}

