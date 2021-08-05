/*
Le fichier excel du transformers comporte 18 colonnes:
    . ETAPE	
    ."PHASE(R ou A)"	
    ."Type (C, V ou I)"	
    .SERVEUR	
    .USER	
    .CMD avec paramètres ou Verif	
    ."Résultat attendu (pour la verif)"	
    .Custum	Ne pas effacer
    .3 colonnes pour les boutons				
    .SSA	
        .APP2747_TREMA	
    .AUTEUR	
        .S. NDIAYE	
    .Version PARPRE	
        .19/11/2021

*/
const router = require("express").Router();

const Excel = require("exceljs");

const fs = require("fs");

const windowsScripts = [
    "service",
    "invoke",
    "process",
    "database",
    "checkurl",
    "checklog",
    "checkdisk",
    "pool_iis",
    "rename",
];

router.post("/ConvertAll-Excel", (req, res) => {
    var files = fs.readdirSync("./excel");
    console.log(files);
    var wb = new Excel.Workbook();
    var allElements = [];

    files.map((file, index) => {
        var filePath = `./excel/${file}`;

        wb.xlsx
            .readFile(filePath)
            .then(function () {
                console.log("Start  element ", file);

                var sh = wb.getWorksheet("Accueil");

                var informations = getInformations(sh);

                var variables = getVariables(sh);
                //console.log("variables ",variables)

                var actions = getLine(sh);

                var stopActions = editLines(actions.stop, variables);
                var startActions = editLines(actions.start, variables);

                startActions = startActions.map((action) => WebFormat(action));
                startActions = startActions.map((action, index) => {
                    return (action = { ...action, index: index });
                });

                stopActions = stopActions.map((action) => WebFormat(action));
                stopActions = stopActions.map((action, index) => {
                    return (action = { ...action, index: index });
                });

                return (element = {
                    name: informations.name,
                    auteur: informations.author,
                    createdAt: informations.version,
                    type: "PARPRE",
                    Arret: stopActions,
                    Relance: startActions,
                    POS: [],
                    variables: { servers: variables },
                });
            })
            .then((element) => {
                allElements.push(element);
                console.log("Finish element ", file);

                if (index === files.length - 1 && allElements.length === files.length) {
                    console.log("last ", file, " sending datas", allElements.length);
                    res.send(allElements);
                }
                if (index !== files.length - 1 && allElements.length === files.length) {
                    console.log("last ", file, " sending datas", allElements.length);
                    res.send(allElements);
                }
            });
    });
});

//Applique le formatage web sur les actions
const WebFormat = (action) => {
    switch (action.type) {
        case "service":
            action = toService(action);
            break;
        case "database":
            action = toDatabase(action);
            //console.log("type ", action.type, " found")

            break;
        case "invoke":
            action = toScript(action);
            //console.log("type ", action.type, " found")

            break;
        case "checkurl":
            action = toCheckUrl(action);
            //console.log("type ", action.type, " found")

            break;
        case "checklog":
            action = toCheckLog(action);
            //console.log("type ", action.type, " found")

            break;
        case "process":
            action = toProcess(action);
            //console.log("type ", action.type, " found")

            break;
        case "checkdisk":
            action = toCheckDisk(action);
            //console.log("type ", action.type, " found")

            break;
        case "pool_iis":
            action = toPoolIIS(action);
            //console.log("type ", action.type, " found")

            break;
        case "rename":
            action = toRename(action);
            //console.log("type ", action.type, " found")
            break;
        default:
            action = toCommand(action);
        //console.log("Unknown type ", action.type, " found")
    }
    //console.log(action)

    return action;
};

/*
Renvoit les variables du Transformers
prends de la colonne 'M' à 'O'
les lignes à partir de 5
exemple:
    'SSA',
  'Nbre Etape Arret',
  'Nbre Etape Relance',
  'Nom logique / Alias',
  'SRV_WIN_50648',
  'SRV_WIN_50649',
  'NOM_BDD_1'

*/
const getVariables = (sheet) => {
    //tableau d'objects serveurs name, prod, hprod, integration
    var variables = [];

    console.log("nombre de variables ", sheet.getColumn("M").values.length - 4);

    //- 5 car les 5 premieres lignes cest du text
    for (let i = 5; i < sheet.getColumn("M").values.length; i++) {
        variables.push({
            name: sheet.getRow(i).getCell("M").value,
            prod: sheet.getRow(i).getCell("N").value,
            hprod: sheet.getRow(i).getCell("O").value,
            dev: sheet.getRow(i).getCell("P").value,
        });
    }

    return variables;
};

/*
prends les informations a prtir de la ligne 2 de la colone 1 jusqu'à 8
*/
const getLine = (sheet) => {
    //on compte le nombre de R et A de la column 2(phases) moins deux (titre et nom colonne)

    var stopActions = [];
    var startActions = [];

    for (var i = 2; i < sheet.getColumn(2).values.length; i++) {
        var action = {};

        action = {
            server: sheet.getRow(i).values[4],
            user: sheet.getRow(i).values[5],
            cmd: sheet.getRow(i).values[6],
            custom: sheet.getRow(i).values[8],
            result: sheet.getRow(i).values[7],
        };
        getOS(action).os === "windows"
            ? (action = { ...action, type: sheet.getRow(i).values[6].split(" ")[0].toLowerCase() })
            : (action = { ...action, type: "command" });

        sheet.getRow(i).values[3] == "V"
            ? (action = { ...action, result: sheet.getRow(i).values[7] })
            : null;

        if (sheet.getRow(i).values[3] !== "I") {
            sheet.getRow(i).values[2] == "R"
                ? (startActions = [...startActions, action])
                : (stopActions = [...stopActions, action]);
        }
    }
    return { start: startActions, stop: stopActions };
};

/*
    traitement sur les actions
*/
const editLines = (actions, variables) => {
    return actions.map((action) => {
        variables.map((variable) => {
            if (variable.name.toLowerCase() === action.server.toLowerCase()) {
                action = { ...action, prod: variable.prod };
                //console.log("replacing by ",variable.prod)
            }
            if (action.user !== undefined && action.user !== "") {
                if ("$" + variable.name.toLowerCase() === action.user.toLowerCase()) {
                    //console.log("replacing ", action.user, "by ", variable.prod)

                    action = { ...action, user: variable.prod };
                }
            }
        });
        action = getOS(action);
        action = formatCommand(action, variables);

        return action;
    });
};

//determine si c'est une commande linux ou windowws
const getOS = (action) => {
    var firstWord = "linux";
    try {
        firstWord = action.cmd.split(" ")[0].toLowerCase();
    } finally {
        return windowsScripts.includes(firstWord)
            ? { ...action, os: "windows" }
            : { ...action, os: "linux" };
    }
};

//verifies s'il ya une variable dans une commande et la change en valeur prod
const formatCommand = (action, variables) => {
    var newAction;

    variables.map((variable) => {
        //console.log("cmd",action.cmd)
        action.cmd.split(" ").includes("$" + variable.name)
            ? (newAction = { ...action, cmd: action.cmd.replace(variable.name, variable.prod) })
            : (newAction = action);
    });

    return newAction;
};

//cherche le nom
const getInformations = (sh) => {
    var name = sh.getRow(1).getCell("N").value;
    var author = sh.getRow(1).getCell("P").value;
    var version = sh.getRow(1).getCell("R").value;

    return { name: name, author: author, version: version };
};

//changer en format web
const toService = (action) => {
    action = {
        type: "service",
        server: action.prod,
        name: action.cmd.split(" ").slice(2).join(" "),
        action: action.cmd.split(" ")[1],

        options: {
            block: true,
            prod: true,
            hprod: true,
            inte: true,
            dev: true,
            os: action.os,
        },
    };
    return action;
};
const toProcess = (action) => {
    action = {
        type: "process",
        server: action.prod,
        name: action.cmd.split(" ").slice(2).join(" "),
        action: action.cmd.split(" ")[1],
        options: {
            block: true,
            prod: true,
            hprod: true,
            inte: true,
            dev: true,
            os: action.os,
        },
    };
    return action;
};
const toScript = (action) => {
    action = {
        type: "script",
        server: action.prod,
        path: action.cmd.split(" ").slice(1),

        options: {
            block: true,
            prod: true,
            hprod: true,
            inte: true,
            dev: true,
            os: action.os,
        },
    };
    return action;
};
const toCommand = (action) => {
    action = {
        type: "command",
        server: action.prod,
        name: action.cmd,
        login: action.user,
        result: action.result,

        options: {
            block: true,
            prod: true,
            hprod: true,
            inte: true,
            dev: true,
            os: action.os,
        },
    };
    return action;
};
const toCheckUrl = (action) => {
    action = {
        type: "link",
        url: action.cmd.split(" ").splice(2),
        informations: {
            urlState: action.cmd.split(" ")[1],
        },
        options: {
            block: true,
            prod: true,
            hprod: true,
            inte: true,
            dev: true,
            os: "windows",
        },
    };
    return action;
};
const toCheckLog = (action) => {
    action = {
        options: {
            block: true,
            prod: true,
            hprod: true,
            inte: true,
            dev: true,
            os: "windows",
        },
    };
    return action;
};
const toCheckDisk = (action) => {
    action = {};
    return action;
};
const toRename = (action) => {
    action = {};
    return action;
};
const toPoolIIS = (action) => {
    action = {};
    return action;
};

const toDatabase = (action) => {
    action = {
        server: action.prod,
        action: action.cmd.split(" ")[1],
        type: "database",
        name: action.cmd.split(" ")[2],
        databaseType: action.cmd.split(" ")[3],

        options: {
            block: true,
            prod: true,
            hprod: true,
            inte: true,
            dev: true,
            os: action.os,
        },
    };
    return action;
};

module.exports = router;
