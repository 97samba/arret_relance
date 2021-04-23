const express = require('express')
const shell = require('node-powershell')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')

//intialiser un instance powershell
const ps = new shell({
    executionPolicy: 'Bypass',
    noProfile: true
})

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port =5000

//ping from react

app.get('/api/PARPRE', (req, res) => {
    ps.addCommand(`./Powershell/ping.ps1 ${req.query.server}`)
    ps.invoke()
        .then(response =>{
            res.send({result:response.replace(/(\r\n|\n|\r)/gm, "")})
        })
        .catch(err => {
            res.json(err)
        })  
})

app.post('/api/PARPRE/test', (req, res) =>{
    //console.log('Body ', req.query.doc)
    console.log('parsed '+JSON.stringify(req.body))
    res.send("you are good")
})

app.listen(port, () => console.log("Server started at port", port))

