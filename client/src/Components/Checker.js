
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
const testPath = async (path, server, setScriptError) => {
    console.log("test path ",path,server)
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

const testDisk = async (server,setDiskSelection) =>{

    fetch(`http://localhost:5000/api/PARPRE/testDisk?server=${server}`)
        .then(result => result.json())
        .then(res => {
            console.log("les disques ",res.disks)
            setDiskSelection(res.disks)
        })
}

// Vérifie si le titre saisi existe
const testTitle = async (title,setTitleError,setTitleOpen) => {
    fetch(`http://localhost:5000/api/PARPRE/testTitle?title=${title}`)
        .then(res => res.json())
        .then(result => {
            console.log("Titre existe :",result)
            setTitleError(result)
            setTitleOpen(result)
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
    testDisk: (server,setDiskSelection) => {
        testDisk(server,setDiskSelection)
    },
    testIIS: (element, server) => {

    },
    testTitle: (title,setTitleError,setTitleOpen) => {
        testTitle(title,setTitleError,setTitleOpen)
    }
}



export default checker;