//Les routes pour les fonctions qui executent du code windows
const router = require("express").Router();
const { exec } = require("child_process");

//ping from react

router.get("/PARPRE/ping", async (req, res) => {
    // console.log("Ping du server ",req.query.server)
    exec(
        `if(test-connection ${req.query.server} -count 1){return $true}`,
        { shell: "powershell.exe" },
        (error, stdout, stderr) => {
            //   console.log("Etat du server : ", req.query.server, " est : ", stdout)
            res.send({ state: stdout.replace(/(\r\n|\n|\r)/gm, "") });
        }
    );
});

//Test si un site web existe
router.get("/PARPRE/link", (req, res) => {
    console.log("Testing url : ", req.query.url);

    require("dns").lookup(req.query.url, (err) =>
        err !== null
            ? res.send({ result: "DOWN " + req.query.url })
            : res.send({ result: "UP " + req.query.url })
    );
});

//test si un service existe et renvois son etat
router.get("/PARPRE/service", (req, res) => {
    exec(
        `$service = get-service -cn ${req.query.server} -name '${req.query.name}'; return $service.status`,
        { shell: "powershell.exe" },
        (error, stdout, stderr) => {
            // console.log("out ",stderr)
            stdout === ""
                ? console.log(req.query.name, "n'existe pas sur le server ", req.query.server)
                : console.log(
                      "service : ",
                      req.query.name,
                      "server :",
                      req.query.server,
                      "state : ",
                      stdout.replace(/(\r\n|\n|\r)/gm, "")
                  );

            res.send({ state: stdout.replace(/(\r\n|\n|\r)/gm, "") });
        }
    );
});

router.get("/PARPRE/database", (req, res) => {
    //console.log("req ",req.query)
    exec(
        `$service = get-service -cn ${req.query.server} -name 'SQL Server Agent(${req.query.database})'; return $service.status`,
        { shell: "powershell.exe" },
        (erro, stdout, stderr) => {
            // console.log("out ",stdout)
            // console.log("error ",stderr)

            stdout === ""
                ? console.log(req.query.database, "n'existe pas sur le server ", req.query.server)
                : console.log(
                      "database : ",
                      req.query.databae,
                      "server :",
                      req.query.server,
                      "state : ",
                      stdout.replace(/(\r\n|\n|\r)/gm, "")
                  );

            res.send({ state: stdout.replace(/(\r\n|\n|\r)/gm, "") });
        }
    );
});

//test si un service existe et renvois son etat
router.get("/PARPRE/testPath", (req, res) => {
    $remotePath = "\\\\" + req.query.server + "\\" + req.query.path.replace(":", "$");

    exec(
        `
        $result = test-path '${$remotePath}'; 
        if($result -and (test-path '${$remotePath}' -PathType container)){
            write-host dossier
            exit
        }
        return $result
    `,
        { shell: "powershell.exe" },
        (error, stdout, stderr) => {
            console.log("out ", stdout);
            stdout.replace(/(\r\n|\n|\r)/gm, "") == "false"
                ? console.log(req.query.path, "n'existe pas sur le server ", req.query.server)
                : console.log(
                      "script : ",
                      req.query.path,
                      "server :",
                      req.query.server,
                      "existe : ",
                      stdout.replace(/(\r\n|\n|\r)/gm, "")
                  );

            res.send({
                state: stdout.toLowerCase().replace(/(\r\n|\n|\r)/gm, ""),
            });
        }
    );
});

router.get("/PARPRE/testDisk", (req, res) => {
    console.log("testing disk ", req.query.server);

    //exec(`./../Powershell/scripts/testDisk.ps1 ${req.query.server}`,{shell:'powershell.exe'},(error,stdout,stderr) =>{
    exec(
        `(get-psdrive -PSProvider FileSystem ).name -join ","`,
        { shell: "powershell.exe" },
        (error, stdout, stderr) => {
            console.log("out ", stdout.trim());

            stderr && console.log("Erreur ", stderr);
            res.send({
                disks: stdout.replace(/(\r\n|\n|\r)/gm, "").split(","),
            });
        }
    );
});

module.exports = router;
