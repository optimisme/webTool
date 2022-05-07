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
    document.querySelector('#frameServer').src = document.querySelector('#frameServer').src
}

function selectTab (tab) {
    if (tab == 'tool') {
        document.querySelector('#contentTool').style.display = 'flex'
        document.querySelector('#contentServer').style.display = 'none'
    }
    if (tab == 'server') {
        document.querySelector('#contentTool').style.display = 'none'
        document.querySelector('#contentServer').style.display = 'flex'
    }
}