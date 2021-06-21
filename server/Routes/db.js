// Les routes liées aux bases de données
const router = require("express").Router()
const util = require("util")
const exec = util.promisify(require('child_process').exec);
const fs = require('fs')

const YAML = require("yaml")


/*
    database
*/
const mongoClient = require('mongodb').MongoClient
const { ObjectId } = require('bson');

const dbname = 'AR'

//const url = 'mongodb+srv://admin:admin@cluster0.9aecc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//const url = `mongodb+srv://admin:admin@cluster0.rpq6d.mongodb.net/${dbname}?retryWrites=true&w=majority`
const url = `mongodb://127.0.0.1:27017/?snappy=disabled&gssapiServiceName=mongodb`
const collectionName = 'POS'
let parpreCollection
let MongoClient

mongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
        console.log("connected to the database")
        MongoClient = client


        listAllCollection()
        //listDatabases() 
    })

async function listDatabases() {
    const databases = await MongoClient.db().admin().listDatabases()
    console.log("databases:")
    databases.databases.forEach(db => console.log(` - ${db.name}`))
}

async function listAllCollection() {

    const db = MongoClient.db(dbname)

    db.collection(collectionName).find().toArray()
        .then(result => {
            //console.log(result)
        })
    parpreCollection = db.collection(collectionName)
}

/*
    Création de parpre et de pos
*/
router.post('/PARPRE/create', async (req, res) => {

    let element = req.body

    await treatWebAction(element, () => parpreCollection.insertOne(element))

    await treatParpre(element)

    //console.log("Traitement de la POS ", element.name)

    res.send("file inserted")


})

const treatParpre = async (element) => {

    console.log("Enregistrement de la PARPRE ", element.name)
    

    await fs.promises.writeFile(`./Powershell/Json/${element.name}.json`, JSON.stringify(element), 'utf8')

    console.log("Le Fichier json a été généré")

    exec(`./Powershell/PARPREGenerator.ps1 ./Powershell/Json/${element.name}.json`, { 'shell': 'powershell.exe' }).then((result) => {

        console.log("stdout :", result.stdout)
        if(result.stderr){
            console.log("ERROR  :", result.stderr)
        }
        
    }).then(()=>{
        console.log("Sauvegarde dans la base données")
        console.log("Fin avec succes")    
    })

    
    //parpreCollection.insertOne(element)
}



async function treatWebAction(parpre, save) {

    //treatServices(parpre)
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
        //si c'est le dernier sauvegarde dans la base
        if (i === webActions.length - 1) {
            //save()

            //console.log("string",YAML.stringify(parpre))
            //fs.writeFile(`./Powershell/Json/${parpre.name}.yaml`,YAML.stringify(parpre),'utf8',()=>console.log("yaml file created"))

            //fs.writeFile(`./Powershell/Json/${parpre.name}.json`,JSON.stringify(parpre),'utf8',() => console.log('file created'))          
        }

    }

}

function treatServices(parpre) {

    const services = parpre.Arret.filter(action => action.type === "service")
    console.log("Services found : ", services.length)
    MongoClient.db(dbname).collection("Services").insertOne({ name: services[0].name })
    console.log("service inséré")
}
//retourne les POS de la base de données
router.get('/AllPOS', (req, res) => {
    console.log("Sending pos")
    parpreCollection.find().toArray()
        .then(result => res.send(result))

})


//retourne une pos
router.get('/getAPOS', (req, res) => {
    console.log("trying to get pos with id : ", req.query.id)

    parpreCollection.findOne({ "_id": new ObjectId(req.query.id) }).then(result => {
        console.log(result)
        res.send(result)
    })
})



module.exports = router
