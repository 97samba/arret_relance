const express = require('express')
const shell = require('node-powershell')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const { response } = require('express')


//variables
var parpre=[]

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

    parpre.push(req.body)

    parpre[0].Arret.forEach(element => {
        
        if(element.type === "webAction"){
            const password = JSON.stringify(element.informations.password)
            var hashedPassword =""
            ps.addCommand(`./Powershell/PassHasher.ps1 ${password}`)
            ps.invoke()
                .then(response => hashedPassword=response.replace(/(\r\n|\n|\r)/gm, ""))
                .then(() => element.informations = {...element.informations, password:hashedPassword})
                .then(() => console.log(element.informations))
                .then(() => fs.writeFile('./Powershell/Json/ares.json',JSON.stringify(parpre),'utf8',() => console.log('file created')))            
        }
        console.log(element)
    });

    

    res.send("you are good")
})

app.get('/api/PARPRE/link', (req, res) =>{

    console.log('Testing url : ',req.query.url)
    
    require('dns').lookup(req.query.url, (err) => (
        err !== null ? res.send({result:"DOWN"}) : res.send({result:"UP"})
        ))
    
})

app.listen(port, () => console.log("Server started at port", port))

