let files = {};
let app = undefined; 

window.addEventListener("load", main)
window.addEventListener("resize", () => { if (app) app.resize() })
window.addEventListener("keydown", (e) => { app.keydown(e) })

async function main () {

    // Loat CSS imports

    let importsCSS = {
        "./common-popup.css": "",
        "./inputs/common-input.css": "",
        "./settings/common-section.css": "",
        "./settings/common-site.css": "",
    }

    let importsKeys = Object.keys(importsCSS)
    for (let cnt = 0; cnt < importsKeys.length; cnt = cnt + 1) {
        let key = importsKeys[cnt]
        importsCSS[key] = await (await fetch(key)).text()

        showLoading("Loading ... ")
    }

    let shadows = [
        { path: "./",           tag: "sdw-tool" },
        { path: "./",           tag: "sdw-tool-list" },
        { path: "./",           tag: "sdw-tool-list-item" },
        { path: "./",           tag: "sdw-tool-popup" },
        { path: "./",           tag: "sdw-tool-popup-css" },
        { path: "./",           tag: "sdw-tool-preview" },
        { path: "./",           tag: "sdw-tool-settings" },
        { path: "./",           tag: "sdw-tool-tooltip" },

        { path: "./settings/",  tag: "sdw-attributes" },
        { path: "./settings/",  tag: "sdw-background" },
        { path: "./settings/",  tag: "sdw-backdrop-filters" },
        { path: "./settings/",  tag: "sdw-border" },
        { path: "./settings/",  tag: "sdw-border-radius" },
        { path: "./settings/",  tag: "sdw-cursor" },
        { path: "./settings/",  tag: "sdw-custom-element" },
        { path: "./settings/",  tag: "sdw-description" },
        { path: "./settings/",  tag: "sdw-display" },
        { path: "./settings/",  tag: "sdw-filter" },
        { path: "./settings/",  tag: "sdw-fit" },
        { path: "./settings/",  tag: "sdw-flex-child" },
        { path: "./settings/",  tag: "sdw-float" },
        { path: "./settings/",  tag: "sdw-margin" },
        { path: "./settings/",  tag: "sdw-opacity" },
        { path: "./settings/",  tag: "sdw-overflow" },
        { path: "./settings/",  tag: "sdw-padding" },
        { path: "./settings/",  tag: "sdw-paragraph" },
        { path: "./settings/",  tag: "sdw-paragraph-columns" },
        { path: "./settings/",  tag: "sdw-position" },
        { path: "./settings/",  tag: "sdw-shadows" },
        { path: "./settings/",  tag: "sdw-site-fonts" },
        { path: "./settings/",  tag: "sdw-site-name" },
        { path: "./settings/",  tag: "sdw-site-scripts" },
        { path: "./settings/",  tag: "sdw-site-stylesheets" },
        { path: "./settings/",  tag: "sdw-site-title" },
        { path: "./settings/",  tag: "sdw-size" },
        { path: "./settings/",  tag: "sdw-text-content" },
        { path: "./settings/",  tag: "sdw-text-shadows" },
        { path: "./settings/",  tag: "sdw-css-title" },
        { path: "./settings/",  tag: "sdw-transform" },
        { path: "./settings/",  tag: "sdw-transition" },
        { path: "./settings/",  tag: "sdw-typography" },
        { path: "./settings/",  tag: "sdw-list" },

        { path: "./inputs/",    tag: "sdw-input-color" },
        { path: "./inputs/",    tag: "sdw-input-float" },
        { path: "./inputs/",    tag: "sdw-input-icons" },
        { path: "./inputs/",    tag: "sdw-input-integer" },
        { path: "./inputs/",    tag: "sdw-input-range" },
        { path: "./inputs/",    tag: "sdw-input-select" },
        { path: "./inputs/",    tag: "sdw-input-size" },
        { path: "./inputs/",    tag: "sdw-input-text" },
    ]

    // Load shadow elements
    for (let cnt = 0; cnt < shadows.length; cnt = cnt + 1) {

        await addShadow(shadows[cnt], importsCSS)

        if ((cnt % 2) == 0) {
            let value = parseInt((cnt * 100) / shadows.length)
            let valueStr = value < 10 ? "0" + value : value.toString()
            showLoading(`
            <style>
            .loading { align-items: center; display: flex; flex-direction: column; }
            .loading > div:first-child { font-size: 1.5em }
            .loading > div:last-child { color: gray; font-size: 0.9em }
            </style>
            <div class="loading"><div>Web Tool</div>
            <div>Loading ... ${valueStr} %</div>
            `)
        }
    }

    // TODO: Generate compiledFile.json : console.log(JSON.stringify(files, null, 4))

    // Clean loading code
    document.body.innerHTML = ""

    app = document.createElement("sdw-tool")
    document.getElementsByTagName("body")[0].appendChild(app)
}

function wait (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { return resolve() }, time)
    })
}

function showLoading (value) {
    let html = ""

    html = "<div style='display: flex; align-items: center; justify-content: center; min-height: 100vh;'>" + value + "</div>"

    document.body.innerHTML = html
}

function replaceImportCSS (importsCSS, styleText) {
    let rst = styleText
    let importKeys = Object.keys(importsCSS)
    for (let cnt = 0; cnt < importKeys.length; cnt = cnt + 1) {
        let key = importKeys[cnt]
        rst = rst.replace(`@import url("${key}");`, importsCSS[key])
    }
    return rst
}

async function addShadow (shadow, importsCSS) {
    let path = shadow.path
    let tag = shadow.tag
    let name = ((tag.split('-')).map((x, idx) => { if (idx == 0) return x; else return (x.substring(0, 1)).toUpperCase() + x.substring(1) })).join('')

    let [tmpCSS, tmpHtml, tmpJs] = await Promise.all([
        await (await fetch(`${path}${name}.css`)).text(),
        await (await fetch(`${path}${name}.html`)).text(),
        await import(`${path}${name}.js`)
    ])

    files[name] = {
        css: replaceImportCSS(importsCSS, tmpCSS),
        html: tmpHtml
    }

    // Dynamically load imports
    eval(`${name} = tmpJs.${name}`)
    eval(`customElements.define("${tag}", ${name})`)
}