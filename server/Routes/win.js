//Les routes pour les fonctions qui executent du code windows
const router = require('express').Router()
const { exec } = require('child_process');


//ping from react

router.get('/PARPRE', (req, res) => {

    exec(`./Powershell/ping.ps1 ${req.query.server}`, {'shell':'powershell.exe'}, (error, stdout, stderr)=> {

        console.log("Etat du server : ",req.query.server," est : ",stdout)
        res.send({state : stdout.replace(/(\r\n|\n|\r)/gm, "")})        
    })
    
})

//Test si un site web existe
router.get('/PARPRE/link', (req, res) =>{

    console.log('Testing url : ',req.query.url)
    
    require('dns').lookup(req.query.url, (err) => (
        err !== null ? res.send({result:"DOWN "+req.query.url}) : res.send({result:"UP "+req.query.url})
        ))
    
})

//test si un service existe et renvois son etat
router.get('/PARPRE/service',(req,res)=>{

    console.log("service : ",req.query.name, "server :",req.query.server)

    exec(`$service = (Get-WmiObject Win32_Service -Filter "Name='${req.query.name}'"); write-host $service.name $service.DisplayName $service.startname`, {'shell':'powershell.exe'}, (error, stdout, stderr)=> {

        console.log(stdout.split(" ").slice(1,4))
        console.log("Etat du service : ",stdout.split(' ',2)[0]," est : ",stdout.split(' ',2)[1])
        res.send({state:stdout.replace(/(\r\n|\n|\r)/gm, "")})
        
    })

})

const generatePlaybook = ({parpre}) =>{

    parpre.map(action =>{
        
        if(action.type==="service"){

        }
    })
}

//Converti les services en action playbook
const convertService = ({element}, server) =>{
    
    let action=""

    element.action == "STOP"? action = "Arret" : action = "Démarrage"

    let serviceAction = {

        name : `${action} du service ${element.name}`,

        win_psexec:{
            
            command: `powershell .\service.ps1 stop ${element.name}`,
            hostname: server,
            nobanner: "yes",

        }
        /*
    command: netsh advfirewall set allprofiles state off
    executable: C:\Program Files\sysinternals\psexec.exe
    hostnames: [ remote_server ]
    password: some_password
    priority: low
*/
    }


}

module.exports = router
