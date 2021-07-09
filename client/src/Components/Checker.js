
//test si le service existe
const testService = async (service, server, setServiceError) => {

    if (server === null) { return }

    console.log("Testing service : ", service, "server ", server)
    fetch(`http://localhost:5000/api/PARPRE/service?name=${service}&server=${server}`)
        .then(res => res.json())
        .then(result => {
            console.log("service state ", result)
            result.state === ""
                ? setServiceError(true)
                : setServiceError(false)
        })

}

//Fait un ping
const testPing = async (server, setServerError) => {

    await fetch(`http://localhost:5000/api/PARPRE/ping?server=${server}`)
        .then(res => res.json())
        .then(result => {
            console.log(result)
            result.state === "True"
                ? setServerError(false)
                : setServerError(true)

        }
        )
}

//verifie l'existence d'un chemin
const testPath = (path, server, setScriptError) => {
    if (server === "") { return }
    fetch(`http://localhost:5000/api/PARPRE/testPath?path=${path}&server=${server}`)
        .then(result => result.json())
        .then(res => {
            console.log(res.state)
            //est ce que le script existe
            res.state === "true"
                ? setScriptError('false')
                : res.state === "dossier" ? setScriptError('dossier') : setScriptError('true')
        })
}

const checker = {

    ping: (server, setServerError) => {

        testPing(server, setServerError)
    },
    testService: (service, server,setServerError) => {

        testService(service,server,setServerError)
    },
    testDatabase: (database, server) => {

    },
    testPath: (path, server,setScriptError) => {
        testPath(path,server,setScriptError)
    },
    testUrl: (url, server) => {

    },
    testProcess: (process, server) => {

    },
    testDisk: (disk, server) => {

    },
    testIIS: (element, server) => {

    }
}



export default checker;