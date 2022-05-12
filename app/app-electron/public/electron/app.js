const { ipcRenderer } = require('electron')

window.addEventListener('load', () => { init() })

ipcRenderer.on('asynchronous-message', function (evt, message) {
    if (message.call == 'refresh') {
        refresh()
    }
});

function init () {
    let refFrame = document.querySelector('#frameServer')
    refFrame.addEventListener('load', () => {
        let refFrame = document.querySelector('#frameServer')
        let refURL = document.querySelector('#navigationURL')
        let oldUrl = refURL.value
        let newUrl = refFrame.contentDocument.location.href
        if (oldUrl != newUrl) {
            refURL.value = newUrl
        }
       // if (refFrame.contentDocument && refFrame.contentDocument.querySelector('title') == null) {
       //     refFrame.src = './app-error.html'
       // } else {
            
       // }
    })
    document.querySelector('#frameTool').src = '../tool/index.html'
    document.querySelector('#frameServer').src = '../index.html'
}

function wait (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { return resolve() }, time)
    })
}

function openTools () {
    ipcRenderer.send('request-mainprocess-action', { call: "openTools" })
}

async function navigateTo () {
    let url = document.querySelector('#navigationURL').value
    if (url.substring(0, 1) == '/') {
        document.querySelector('#frameServer').src = "./public/" + url
    } else {
        document.querySelector('#frameServer').src = url
    }
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