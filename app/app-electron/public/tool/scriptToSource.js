export class source {

    constructor () {
        this.styles = ''
    }

    async toSource () {

        let title = app.site.title
        if (title == "") {
            title = app.site.name
        }
        if (title == "") {
            title = "Webtool site"
        }

        let fonts = ""
        if (fonts != "") {
            fonts = '<link rel="preconnect" href="https://fonts.gstatic.com" />\n' + (fonts).replace("\n", "")
        }
        for (let cnt = 0; cnt < app.site.googleFonts.length; cnt = cnt + 1) {
            fonts = fonts + `\n  <link href="https://fonts.googleapis.com/css2?family=${app.site.googleFonts[cnt].replaceAll(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />`
        }

        let stylesheets = ""
        for (let cnt = 0; cnt < app.site.stylesheets.length; cnt = cnt + 1) {
            stylesheets = stylesheets + `\n  <link href="${app.site.stylesheets[cnt]}" rel="stylesheet" />`
        }

        let scriptFiles = ""
        for (let cnt = 0; cnt < app.site.scripts.length; cnt = cnt + 1) {
            scriptFiles = scriptFiles + `\n  <script src="${app.site.scripts[cnt]}"></script>`
        }

        this.styles = (this.getStyles(app.elementsRoot)).replace("\n\n", "")
        let bodyIdented = (this.getHTMLStrings(true, app.elementsRoot.childs[1]))
        let bodyClean = (this.getHTMLStrings(false, app.elementsRoot.childs[1]))
        let body = `<!-- \n Prevent unauthorized spaces and line jumps inside body:\n 🤦‍♂️ https://css-tricks.com/fighting-the-space-between-inline-block-elements/ \n${bodyIdented}\n-->\n${bodyClean}`

        let html = (this.getHTML(title, fonts, stylesheets, scriptFiles, body))

        return html
    }

    getStyles (ref) {
        let str = ""
        let strCSS = "elm" + ref.appId
        if (ref.tag != "text") {
            str = str + "\n" + ref.getStyleString(strCSS, true)
            for (let cnt = 0; cnt < ref.childs.length; cnt = cnt + 1) {
                str = str + this.getStyles(ref.childs[cnt])
            }
        }
        return (str.replaceAll("\n\n", ""))
    }

    getHTMLStrings (idented, ref) {
        let str = ""
        let strCSS = "elm" + ref.appId
        let arrIdent = new Array(ref.refList.listIdent)
        let strIdent = idented ? "\n" + arrIdent.join("  ") : ""
        let strDescription = idented ? ` data-description="${ref.description}"` : ""
        let strAttr = this.getAttributes(ref)
        let selfContained = (["br", "hr", "img", "circle"].indexOf(ref.tag) >= 0)
        let styleAttr = `data-css="${strCSS}"`
        let strClass = ''

        if (ref.tag == "body") {
            this.styles = this.styles.replace(`*[data-css="${strCSS}"]`, '\nbody')
        } else if (ref.attributes.id) {
            this.styles = this.styles.replace(`*[data-css="${strCSS}"]`, `#${ref.attributes.id}`)
        } else if (this.styles.indexOf(styleAttr) >= 0) {
            strClass = ' ' + styleAttr
        }

        if (ref.tag != "text") {
            if (!selfContained) {
                if (ref.childs.length == 0) {
                    str = str + `${strIdent}<${ref.tag}${strClass}${strAttr}${strDescription}></${ref.tag}>`
                } else {
                    str = str + `${strIdent}<${ref.tag}${strClass}${strAttr}${strDescription}>`
                }
            } else {
                str = str + `${strIdent}<${ref.tag}${strClass}${strAttr}${strDescription}/>`
            }
        } else {
            str = str + '' + strIdent + ref.text
        }

        for (let cnt = 0; cnt < ref.childs.length; cnt = cnt + 1) {
            str = str + this.getHTMLStrings(idented, ref.childs[cnt])
        }

        if (ref.tag != "text" && !selfContained && ref.childs.length != 0) {
            str = str + `${strIdent}</${ref.tag}>`
        }
 
        return str
    }

    getAttributes (ref) {
        let keys = Object.keys(ref.attributes)
        let str = ""

        for (let cnt = 0; cnt < keys.length; cnt = cnt + 1) {
            let key = keys[cnt]
            str = str + ` ${key}="${(ref.attributes[key]).replaceAll('"', '\'')}"`
        }

        return str;
    }

    getHTML (title, fonts, stylesheets, scriptFiles, body) {
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, user-scalable=no">${fonts}${stylesheets}${scriptFiles}
  <style>${this.styles}
  </style>
</head>
${body}
</html>`
        }
}