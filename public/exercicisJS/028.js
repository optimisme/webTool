async function mostraLlista (tipus) {
    let llistaDades = await fetchPublicJson('./consoles/llista-dades.json')
    let refResultat = document.querySelector("#resultat")
    let codiHTML = ''

    for (let cnt = 0; cnt < llistaDades.length; cnt = cnt + 1) {
        let consola = llistaDades[cnt]
        if (tipus == 'totes' 
        || (tipus == 'nintendo' && consola.fabricant == 'Nintendo')
        ) {
            codiHTML = codiHTML + getHTMLFromTemplate("plantilla", consola)
        }
    }

    refResultat.innerHTML = codiHTML
}

function getHTMLFromTemplate(id, replacements) {
    let src = document.querySelector(`#${id}`).innerHTML
    let keys = Object.keys(replacements)

    for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
        let key = keys[cnt]
        let value = replacements[key]
        src = src.replaceAll(`{{${key}}}`, value)

    }

    return src
}

async function fetchPublicJson (url) {

    let data = undefined
    try {
        let response = await fetch(url)
        if (response.status = 200) {
            let result = JSON.parse(await response.text())
            data = result
        }
    } catch (err) {
        console.error('Server fetch error: ', err)
    }
    return data
}