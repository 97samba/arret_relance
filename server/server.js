const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const port =5000

const app = express()
app.use(cors())
app.use(bodyParser.json())

//les routes windows
app.use('/api',require('./Routes/db'))
app.use('/api',require('./Routes/win'))
app.use('/api',require('./Routes/excel'))

app.listen(port, () => console.log("Server started at port", port))

