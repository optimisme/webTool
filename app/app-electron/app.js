const { ipcRenderer } = require('electron');

function openTools () {
    ipcRenderer.send('request-mainprocess-action', { call: "openTools" })
}

function navigateTo () {
    let url = document.querySelector('#navigationURL').value
    if (url.substring(0, 1) == '/') {
        document.querySelector('#frameServer').src = "./source/public/" + url
    } else {
        document.querySelector('#frameServer').src = url
    }
    // TODO: Check if 'iframe' loaded properly
}

function refresh () {
    if ([...document.querySelector('#buttonRefresh').classList].indexOf("buttonRefreshActive") != -1) {
        document.querySelector('#frameServer').src = document.querySelector('#frameServer').src
    }
}

function selectTab (option) {
    if (option == 'tool') {
        document.querySelector('#optionTool').classList.add("optionSelected")
        document.querySelector('#optionServer').classList.remove("optionSelected")
        document.querySelector('#navigationURL').setAttribute("disabled", "true")
        document.querySelector('#buttonRefresh').classList.remove("buttonRefreshActive")
        document.querySelector('#contentTool').style.display = 'flex'
        document.querySelector('#contentServer').style.display = 'none'
    }
    if (option == 'server') {
        document.querySelector('#optionTool').classList.remove("optionSelected")
        document.querySelector('#optionServer').classList.add("optionSelected")
        document.querySelector('#navigationURL').removeAttribute("disabled")
        document.querySelector('#buttonRefresh').classList.add("buttonRefreshActive")
        document.querySelector('#contentTool').style.display = 'none'
        document.querySelector('#contentServer').style.display = 'flex'
    }
}