//Les routes pour les fonctions qui executent du code windows
const router = require('express').Router()
const { exec } = require('child_process');


//ping from react

router.get('/PARPRE', (req, res) => {

    exec(`./Powershell/ping.ps1 ${req.query.server}`, { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {

        console.log("Etat du server : ", req.query.server, " est : ", stdout)
        res.send({ state: stdout.replace(/(\r\n|\n|\r)/gm, "") })
    })

})

//Test si un site web existe
router.get('/PARPRE/link', (req, res) => {

    console.log('Testing url : ', req.query.url)

    require('dns').lookup(req.query.url, (err) => (
        err !== null ? res.send({ result: "DOWN " + req.query.url }) : res.send({ result: "UP " + req.query.url })
    ))

})

//test si un service existe et renvois son etat
router.get('/PARPRE/service', (req, res) => {


    exec(`$service = get-service -name ${req.query.name}; return $service.status`, { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {

        stdout === ""
            ? console.log(req.query.name, "n'existe pas sur le server ", req.query.server)
            : console.log("service : ", req.query.name, "server :", req.query.server, "state : ", stdout.replace(/(\r\n|\n|\r)/gm, ""))

        res.send({ state: stdout.replace(/(\r\n|\n|\r)/gm, "") })

    })

})

//test si un service existe et renvois son etat
router.get('/PARPRE/testPath', (req, res) => {

    $remotePath = "\\\\" + req.query.server + "\\" + req.query.path.replace(":", "$")

    exec(`return test-path ${$remotePath}`, { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {

        stdout.replace(/(\r\n|\n|\r)/gm, "") == "false"
            ? console.log(req.query.path, "n'existe pas sur le server ", req.query.server)
            : console.log("script : ", req.query.path, "server :", req.query.server, "existe : ", stdout.replace(/(\r\n|\n|\r)/gm, ""))

        res.send({ state: stdout.replace(/(\r\n|\n|\r)/gm, "") })

    })

})

module.exports = router
