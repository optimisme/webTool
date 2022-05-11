const express = require('express')
const path = require('path')

let app = express()
var port = process.env.PORT || 3002

let server = app.listen(3002)

app.use('/', express.static(path.join(__dirname + '/source/public')))