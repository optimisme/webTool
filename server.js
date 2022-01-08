'use strict'
const express       = require('express')
const path          = require('path')

var app = express()
var port = process.env.PORT || 3002

// Configurar les rutes dinàmiques del servidor
// ...

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
