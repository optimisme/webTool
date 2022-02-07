function mostraConsola (consola) {
    let refDades = document.querySelector("#dades")

    let nintendoSwitch = {
        "nom": "Nintendo Switch",
        "data": "2017-3-3",
        "processador": "4xARM Cortex-A57",
        "velocitat": 1.02,
        "fabricant": "Nintendo",
        "color": "negre",
        "venudes": 70000000,
        "imatge": "./consoles/nintendo-switch.png"
    }

    let nintengoGC = {
        "nom": "GameCube",
        "data": "2001-11-14",
        "processador": "IBM PowerPC Gekko",
        "velocitat": 0.486,
        "fabricant": "Nintendo",
        "color": "lila",
        "venudes": 22000000,
        "imatge": "./consoles/nintendo-gamecube.png"
    }

    refDades.innerHTML = getHTMLFromTemplate("plantilla", nintendoSwitch)
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