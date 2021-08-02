import ENV from "../Env";
//test si le service existe
export const testService = async (service, server, setServiceError) => {
    if (server === null || service.startsWith("$")) {
        return;
    }

    console.log("Testing service : ", service, "server ", server);
    fetch(`${ENV.SERVER_API_URI}/PARPRE/service?name=${service}&server=${server}`)
        .then((res) => res.json())
        .then((result) => {
            console.log("service state ", result);
            result.state === "" ? setServiceError(true) : setServiceError(false);
        });
};

//Fait un ping
export const testPing = async (server, setServerError) => {
    fetch(`${ENV.SERVER_API_URI}/PARPRE/ping?server=${server}`)
        .then((res) => res.json())
        .then((result) => {
            console.log("resultat ping ", result);
            result.state === "True" ? setServerError(false) : setServerError(true);
        });
};

//verifie l'existence d'un chemin
export const testPath = async (path, server, setScriptError) => {
    console.log("test path ", path, server);
    if (server === "") {
        return;
    }
    fetch(`${ENV.SERVER_API_URI}/PARPRE/testPath?path=${path}&server=${server}`)
        .then((result) => result.json())
        .then((res) => {
            console.log(res.state);
            //est ce que le script existe
            res.state === "true"
                ? setScriptError("false")
                : res.state === "dossier"
                ? setScriptError("dossier")
                : setScriptError("true");
        });
};

export const testDisk = async (server, setDiskSelection) => {
    fetch(`${ENV.SERVER_API_URI}/PARPRE/testDisk?server=${server}`)
        .then((result) => result.json())
        .then((res) => {
            //console.log("les disques ", res.disks);
            setDiskSelection(res.disks);
        });
};

// Vérifie si le titre saisi existe
export const testTitle = async (title, setTitleError, setTitleOpen) => {
    fetch(`${ENV.SERVER_API_URI}/PARPRE/testTitle?title=${title}`)
        .then((res) => res.json())
        .then((result) => {
            console.log("Titre existe :", result);
            setTitleError(result);
            setTitleOpen(result);
        });
};

// const checker = {
//     ping: (server, setServerError, setPingedServers, pingedServers) => {
//         testPing(server, setServerError, setPingedServers, pingedServers);
//     },
//     testService: (service, server, setServiceError) => {
//         testService(service, server, setServiceError);
//     },
//     testDatabase: (database, server) => {},
//     testPath: (path, server, setScriptError) => {
//         testPath(path, server, setScriptError);
//     },
//     testUrl: (url, server) => {},
//     testProcess: (process, server) => {},
//     testDisk: (server, setDiskSelection) => {
//         testDisk(server, setDiskSelection);
//     },
//     testIIS: (element, server) => {},
//     testTitle: (title, setTitleError, setTitleOpen) => {
//         testTitle(title, setTitleError, setTitleOpen);
//     },
// };

//export default checker;
