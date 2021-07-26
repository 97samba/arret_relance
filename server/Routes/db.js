// Les routes liées aux bases de données
const router = require("express").Router();
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const mongoose = require("mongoose");
const Parpre = require("../models/parpre");
require("dotenv").config();

const jenkinsARRepo = "/outil/jenkins/applicatifs/gitbranchrepo";

/*
    database
*/
const { ObjectId } = require("bson");

const DB_NAME = "AR";

const url = `${process.env.REACT_APP_BDD_URI}${DB_NAME}`;

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) =>
        console.log("Connected to the database via mongoose ", result.connection.name)
    )
    .catch((err) => console.log(err));

/*
    Création de parpre et de pos
*/
router.post("/PARPRE/create", async (req, res) => {
    let element = req.body.data;
    let mode = req.body.mode;

    await treatWebAction(element);

    await treatParpre(element, mode, res);

    //copy vers les serveurs master
    //copyARandPOSToMaster(element.name, process.env.JENKINS_MASTER_PROD);
    copyARandPOSToMaster(element.name, process.env.JENKINS_MASTER_HPROD);
    //copyARandPOSToMaster(element.name, process.env.JENKINS_MASTER_IPP2);
    //copyARandPOSToMaster(element.name, process.env.JENKINS_MASTER_DEV);
});

const treatParpre = async (element, mode, res) => {
    console.log("Enregistrement de la PARPRE ", element.name);

    await fs.promises.writeFile(
        `./Powershell/Json/${element.name}.json`,
        JSON.stringify(element),
        "utf8"
    );

    console.log("Le Fichier json a été généré");

    exec(`./Powershell/PARPREGenerator.ps1 ./Powershell/Json/${element.name}.json`, {
        shell: "powershell.exe",
    })
        .then((result) => {
            console.log("stdout :", result.stdout);
            if (result.stderr) {
                console.log("ERROR  :", result.stderr);
            }
        })
        .then(() => {
            console.log("Sauvegarde dans la base données");
            console.log("Fin avec succes");
            const parpre = new Parpre({
                name: element.name,
                auteur: element.auteur,
                Arret: element.Arret,
                Relance: element.Relance,
                POS: element.POS,
                variables: element.variables,
            });
            console.log("mode ", mode);
            mode !== "Modification"
                ? parpre.save().then((result) => console.log(result.name, " is saved"))
                : Parpre.updateOne({ name: parpre.name }, element, null, (err, result) => {
                      err && console.log(err);
                      console.log(result);
                      console.log(parpre.name, " is updated");
                  });
        })
        .then(() => {
            res.send("done");
        });
};

async function treatWebAction(parpre) {
    const webActions = parpre.POS.filter((action) => action.type === "webAction");

    console.log("Il y a ", webActions.length, " action(s) web");

    if (webActions.length > 0) {
        await HashPassword(webActions);
    }
}

//Chiffre les mots de passe
const HashPassword = async (webActions) => {
    for (let i = 0; i < webActions.length; i++) {
        //console.log("working for ", i)
        if (webActions[i].informations.type === "connection") {
            if (webActions[i].informations.password.length < 30) {
                console.log("Chiffrement du mot de passe de ", webActions[i].informations.login);
                const password = JSON.stringify(webActions[i].informations.password);
                var hashedPassword = "";
                //console.log(webActions[i].informations.password)
                await exec(`./Powershell/PassHasher.ps1 ${password}`, {
                    shell: "powershell.exe",
                }).then((result) => {
                    hashedPassword = result.stdout;
                    console.log("Chiffré ", hashedPassword.replace(/(\r\n|\n|\r)/gm, ""));
                    webActions[i].informations = {
                        ...webActions[i].informations,
                        password: hashedPassword,
                    };
                });
            }
        }
    }
};

//Copy les scripts vers les masters (PROD HPROD IPP2 et DEV)
const copyARandPOSToMaster = async (ssaName, server) => {
    exec(
        `./../Powershell/copyDocumentsToMaster.ps1 ${ssaName} ${server}`,
        { shell: "powershell" },
        (error, stdout, stderr) => {
            console.log("copy script :", stdout);
            console.log("err script :", stderr);
            console.log("error script :", error);
        }
    );
};

//retourne les documents (ssas) de la base de données
router.get("/AllPOS", async (req, res) => {
    console.log("Sending pos");
    Parpre.find().then((result) => res.send(result));
});

//retourne un ssa
router.get("/getAPOS", (req, res) => {
    Parpre.findOne({ _id: new ObjectId(req.query.id) }).then((result) => {
        res.send(result);
    });
});

router.get("/PARPRE/testTitle", (req, res) => {
    Parpre.findOne({ name: req.query.title }, (err, results) => {
        res.send(results !== null);
    });
});

// Dashboard REST
router.get("/DashBoard/getAllSSA", (req, res) => {
    Parpre.find().then((result) => {
        res.send(result);
    });
});

module.exports = router;
