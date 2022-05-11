const express = require('express')
const path = require('path')

let app = express()
var port = process.env.PORT || 44444

let server = app.listen(port)

app.use('/', express.static(path.join(__dirname + '/public')))