const express = require('express')
const path = require('path')

this.app = express()
this.port = process.env.PORT || 44444
this.server = this.app.listen(this.port)

this.app.use('/', express.static(path.join(__dirname + '/public')))