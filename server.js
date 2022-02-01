'use strict'
const express       = require('express')
const path          = require('path')
const fs            = require('fs/promises')

var app = express()
var port = process.env.PORT || 3002

// Configurar les rutes dinàmiques del servidor
app.use('/call', ajaxCall)

// Configurar les rutes estàtiques del servidor
app.use('/public/favicon.ico', (crida, resposta) => { resposta.sendFile(path.join(__dirname + '/favicon.ico')) })
app.use('/',            express.static(path.join(__dirname + '/public')))
app.use('/',            (crida, resposta) => { resposta.sendFile(path.join(__dirname + '/public/index.html')) })

// Posar el servidor en funcionament
app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
    console.log(`\nNavigate to: http://localhost:${port}`)
    console.log(`\nNavigate to: http://localhost:${port}/tool`)
})

async function ajaxCall (request, response) {
    let url = request.url,
    obj = null

    // Agafa les dades que ens han enviat des de la web
    try {
        obj = await promiseGetPostData(request)
    } catch (err) {
        console.error(err)
        return
    }

    if (obj.type && obj.file && obj.type == 'fileRead') {
        try {
            let data = JSON.parse(await fs.readFile(obj.file, "binary"))
            response.json({ status: "ok", data: data })
        } catch (err) {
            response.json({ status: "ko", data: "Could not read file" })
            return
        }

    } else if (obj.type && obj.file && obj.type == 'fileSave') {
        try {
            await fs.writeFile(obj.file, JSON.stringify(obj.data, null, 2))
            response.json({ status: "ok", data: "File saved" })
        } catch (err) {
            response.json({ status: "ko", data: "Could not read file" })
            return
        }

    } else if (obj.type && obj.file && obj.type == 'fileDelete') {
        try {
            await fs.unlink(obj.file)
            response.json({ status: "ok", data: "File deleted" })
        } catch (err) {
            response.json({ status: "ko", data: "Could not delete file" })
            return
        }

    } else {
        response.json({ status: "ko", data: "Unknown query or missing parameter" })
    }
}

function promiseGetPostData (request) {
    return new Promise(async (resolve, reject) => {
        let body = '',
            error = null

        request.on('data', (data) => { body = body + data.toString() })
        request.on('close', () => { /* TODO - Client closed connection, destroy everything! */ })
        request.on('error', (err) => { error = 'Error getting data' })
        request.on('end', async () => {
            let rst = null
            if (error !== null) {
                console.log('Error getting data from post: ', error)
                return reject(error)
            } else {
                try {
                    return resolve(JSON.parse(body))
                } catch (e) {
                    console.log('Error parsing data from post: ', error)
                    return reject(e)
                }
                
            }
        })
    })
}