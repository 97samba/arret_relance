// Les routes liées aux bases de données
const router = require("express").Router()
const util = require("util")
const exec = util.promisify(require('child_process').exec);
const fs = require('fs')
const mongoose = require('mongoose')
const Parpre = require('../models/parpre')


/*
    database
*/
const { ObjectId } = require('bson');

const DB_NAME = 'AR'
const url = `mongodb://127.0.0.1:27017/${DB_NAME}`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("Connected to the database via mongoose ", result.connection.name))
    .catch((err) => console.log(err))



/*
    Création de parpre et de pos
*/
router.post('/PARPRE/create', async (req, res) => {

    let element = req.body.data
    let mode = req.body.mode    
    
    await treatWebAction(element)

    await treatParpre(element,mode)

    res.send("file inserted")

})

const treatParpre = async (element,mode) => {

    console.log("Enregistrement de la PARPRE ", element.name)

    await fs.promises.writeFile(`./Powershell/Json/${element.name}.json`, JSON.stringify(element), 'utf8')

    console.log("Le Fichier json a été généré")

    exec(`./Powershell/PARPREGenerator.ps1 ./Powershell/Json/${element.name}.json`, { 'shell': 'powershell.exe' }).then((result) => {

        console.log("stdout :", result.stdout)
        if (result.stderr) {
            console.log("ERROR  :", result.stderr)
        }

    }).then(() => {
        console.log("Sauvegarde dans la base données")
        console.log("Fin avec succes")
        const parpre = new Parpre({
            name: element.name,
            auteur: element.auteur,
            Arret: element.Arret,
            Relance: element.Relance,
            POS: element.POS,
            variables: element.variables
        })
        console.log("mode ",mode)
        mode !== "Modification" 
        ? parpre.save().then(result => console.log(result.name, " is saved"))
        : Parpre.updateOne({name : parpre.name},element,null,(err,result)=>{
            err && console.log(err)
            console.log(result)
            console.log(parpre.name," is updated")
        })
    })
}



async function treatWebAction(parpre) {

    const webActions = parpre.POS.filter(action => action.type === "webAction")

    console.log("Il y a ", webActions.length, " action(s) web")

    for (let i = 0; i < webActions.length; i++) {
        //console.log("working for ", i)
        if (webActions[i].informations.type === "connection") {

            console.log("Chiffrement du mot de passe de ", webActions[i].informations.login)
            const password = JSON.stringify(webActions[i].informations.password)
            var hashedPassword = ""
            //console.log(webActions[i].informations.password)

            await exec(`./Powershell/PassHasher.ps1 ${password}`, { 'shell': 'powershell.exe' }).then((result) => {

                hashedPassword = result.stdout
                console.log(hashedPassword.replace(/(\r\n|\n|\r)/gm, ""))
                webActions[i].informations = { ...webActions[i].informations, password: hashedPassword }

            })
        }

    }

}

//retourne les POS de la base de données
router.get('/AllPOS', (req, res) => {
    console.log("Sending pos")
    Parpre.find()
        .then(result => res.send(result))

})

//retourne une pos
router.get('/getAPOS', (req, res) => {
    console.log("trying to get pos with id : ", req.query.id)

    Parpre.findOne({ "_id": new ObjectId(req.query.id) }).then(result => {
        console.log(result)
        res.send(result)
    })
})



module.exports = router
