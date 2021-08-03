import {
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    makeStyles,
    Radio,
    RadioGroup,
    Switch,
    TextField,
    Typography,
} from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import ARCard from "../Components/ARCard";
import RightNav from "../Components/Creation/RightNav";
import { useHistory } from "react-router";
import { testTitle } from "../Components/Checker";
import ValidationDialog from "../Components/Creation/ValidationsDialog";

var drawerWidthRight = 260;

const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: `calc(100% - ${drawerWidthRight}px)`,
        },
    };
});

const Create = () => {
    const [titleOpen, setTitleOpen] = useState(false);
    //titre de la parpre ou de la POS
    const [title, setTitle] = useState("APPXXXX_SSA");
    //erreur dans le titre
    const [titleError, setTitleError] = useState(false);
    //les actions d'arrêt
    const [StopActions, setStopActions] = useState([]);
    //les Actions de relance
    const [StartActions, setStartActions] = useState([]);
    //les Actions auto relance
    const [AutoStartActions, setAutoStartActions] = useState([]);
    //les Actions POS
    const [posActions, setPosActions] = useState([]);
    //creation automatique de la verification
    //const [autoCreate, setAutoCreate] = useState(false);
    //Si on fait la relance automatiquement
    const [autoRelance, setAutoRelance] = useState(false);
    //Soit PARPRE ou POS
    const [documentType, setDocumentType] = useState("PARPRE");
    //Le mode d'utilisation: creation ou modification
    const [pageMode, setPageMode] = useState("Création");
    const [loading, setLoading] = useState(false);
    //Les informations du transformers auteeur, date...
    const [informations, setInformations] = useState({
        open: false,
        nom: "",
        prenom: "",
    });

    //verification du checker
    const [verification, setVerification] = useState(false);

    const history = useHistory();

    const [servers, setServers] = useState([]);

    const classes = useStyles();

    //Url de contact du server
    const url = "http://localhost:5000/api";

    //La page de création et la page de modifiation sont les mêmes, la difference est assurée par pageMode
    useEffect(() => {
        if (history.location.state !== undefined) {
            //on affiche le chargement
            setLoading(true);

            //Si c'est une conversion excel ou une lecture depuis la BDD
            history.location.fromExcel ? getADocumentFromExcel() : getADocumentFromBase();
        } else {
            //Ici on crée a partir de zero
            document.title = "Création de PARPRE / POS";
            setPageMode("Création");
            setVerification(true);

            setTitleError(true);
            setLoading(false);
        }
    }, []);

    const saveServer = () => {
        //noms des serveurs dans la liste des variables qui sont créées automatiquement
        var Allservers = servers
            .filter((server) => server.auto === true)
            .map((server) => {
                return server.prod.toLowerCase();
            });

        var serversInStopActions = new Set();
        var databasesInStopActions = new Set();

        //on recupere les servers dans les etapes d'arret
        StopActions.map((action) => {
            if (action.server === undefined || action.server === "") {
                return;
            }
            serversInStopActions.add(action.server.toLowerCase());

            if (action.type === "database") {
                databasesInStopActions.add(action.name.toLowerCase().replace("$", ""));
            }
        });
        console.log("serveur ", serversInStopActions, " databases : ", databasesInStopActions);
        //on rajoute les serveurs manquants
        serversInStopActions.forEach((server) => {
            if (!Allservers.includes(server)) {
                Allservers.push(server);
                // var name = "";
                // server.startsWith("SW")
                //     ? (name = server.replace("sw", "SRV_WIN_"))
                //     : (name = server);
                setServers([
                    ...servers,
                    {
                        id: servers.length,
                        prod: server.toLowerCase(),
                        hprod: "definir",
                        dev: "definir",
                        // name: name,
                        auto: true,
                    },
                ]);
            }
        });

        databasesInStopActions.forEach((database) => {
            if (!Allservers.includes(database)) {
                Allservers.push(database);
                // var name = `BDD_${database}`;
                setServers([
                    ...servers,
                    {
                        id: servers.length,
                        prod: database.toLowerCase(),
                        hprod: "definir",
                        dev: "definir",
                        // name: name,
                        auto: true,
                    },
                ]);
            }
        });

        //On enleve les serveurs absents dans la liste des actions
        Allservers.map((server) => {
            if (!serversInStopActions.has(server) && !databasesInStopActions.has(server)) {
                const newServerState = servers.filter((serverprod) => serverprod.prod !== server);
                setServers(newServerState);
            }
        });
        //console.log("allservers ", Allservers, "server stop", serversInStopActions);
    };

    const getADocumentFromExcel = () => {
        showDocumentOnPage(history.location.state);
    };

    const getADocumentFromBase = async () => {
        fetch(`${url}/GetAPOS?id=${history.location.state.id}`)
            .then((res) => res.json())
            .then((ssa) => {
                console.log("ssa ", ssa);
                showDocumentOnPage(ssa);
            });
    };

    const showDocumentOnPage = (ssa) => {
        document.title = `Modification de ${ssa.name}`;
        let nom = ssa.auteur.split(" ")[ssa.auteur.split(" ").length - 1];
        let prenom = ssa.auteur.split(" ")[0];
        setInformations({ ...informations, nom: nom, prenom: prenom });
        history.location.fromExcel ? setPageMode("Création") : setPageMode("Modification");
        setStopActions(ssa.Arret);
        setStartActions(ssa.Relance);
        setPosActions(ssa.POS);
        setDocumentType("PARPRE");
        setTitle(ssa.name);
        if (ssa.variables.servers !== undefined) {
            const initialServers = ssa.variables.servers.map((variable, index) => {
                return {
                    id: index,
                    prod: variable.prod,
                    hprod: variable.hprod,
                    dev: variable.dev,
                    name: variable.name,
                    auto: true,
                };
            });
            setServers(initialServers);
        }
        setLoading(false);
    };

    const saveStart = (object) => {
        setStartActions(object);
    };

    const saveStop = (object) => {
        setStopActions(object);
        saveServer(object);
    };

    const reverseStopAction = (actions) => {
        var newRelance = actions
            .slice(0)
            .reverse()
            .map((action) => {
                if (
                    action.type === "service" ||
                    action.type === "database" ||
                    action.type === "process"
                ) {
                    if (action.action === "status") {
                        action = { ...action, action: "start" };
                    } else {
                        action = { ...action, action: "status" };
                    }
                }
                if (action.type === "script") {
                    action = { ...action, path: "" };
                }
                if (action.type === "command") {
                    action = { ...action, name: "", result: "" };
                }
                return action;
            });
        //console.log("stopAction ",StopActions)
        //console.log("new relance : ",newRelance)
        console.log("input : ", actions);
        for (var i = 0; i < newRelance.length; i++) {
            if (newRelance[i]) {
                newRelance[i].index = i;
            }
        }
        setAutoStartActions(newRelance);
        console.log("actions ", actions, " vs ", newRelance);
    };

    const generateJson = async () => {
        setPageMode("Modification");
        const parpre = {
            name: title,
            auteur: informations.prenom + " " + informations.nom,
            date_de_creation: new Date().toLocaleString(),
            type: "PARPRE",
            Arret: StopActions,
            Relance: autoRelance ? AutoStartActions : StartActions,
            POS: posActions,
            variables: {
                servers: servers,
            },
        };

        const resultat = await axios
            .post(`${url}/PARPRE/create`, {
                data: parpre,
                mode: pageMode,
            })
            .then((res) => {
                return res;
            });
        return resultat.data;
    };

    const handleTitle = (title) => {
        console.log("Changing title to ", title);
        pageMode === "Création"
            ? testTitle(title, setTitleError, setTitleOpen)
            : history.location.state.name !== title
            ? testTitle(title, setTitleError, setTitleOpen)
            : setTitleOpen(false);
    };

    return (
        <div>
            <div className={classes.root}>
                <Grid
                    container
                    spacing={1}
                    direction="row"
                    alignContent="center"
                    alignItems="center"
                >
                    <Grid item md={5}>
                        {titleOpen ? (
                            <TextField
                                placeholder="Changer le titre"
                                onBlur={(e) => handleTitle(e.target.value)}
                                margin="dense"
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                                value={title}
                                error={titleError}
                                label={titleError ? "Ce document existe déja" : "Titre du document"}
                                style={{ width: "60%", margin: "10px" }}
                            />
                        ) : (
                            <div>
                                <Typography
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                    }}
                                    gutterBottom
                                    onClick={() => setTitleOpen(true)}
                                    noWrap={true}
                                >
                                    {title}
                                </Typography>
                            </div>
                        )}
                    </Grid>

                    {/**
                 <Grid item md={2}>
                  <FormGroup>
                        <FormControlLabel
                            control = {<Switch onChange={()=> setAutoCreate(!autoCreate)}/>}
                            checked={autoCreate}
                            label = "Verification-Auto"
                        >
                        

                        </FormControlLabel>
                        
                    </FormGroup>
                    </Grid> 
                 */}

                    <Grid item md={4}>
                        <FormGroup>
                            {documentType === "PARPRE" ? (
                                <div>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                size="medium"
                                                onChange={() => {
                                                    reverseStopAction(StopActions);
                                                    setAutoRelance(!autoRelance);
                                                }}
                                            />
                                        }
                                        checked={autoRelance}
                                        label="Relance-Auto"
                                    ></FormControlLabel>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                color="primary"
                                                size="medium"
                                                onChange={() => {
                                                    setVerification(!verification);
                                                }}
                                            />
                                        }
                                        checked={verification}
                                        label="Vérification"
                                    ></FormControlLabel>
                                </div>
                            ) : null}
                        </FormGroup>
                    </Grid>
                    <Grid item md={3}>
                        <RadioGroup
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                        >
                            <FormGroup row>
                                <FormControlLabel
                                    style={{ fontSize: 10 }}
                                    value="POS"
                                    label="POS"
                                    control={<Radio color="primary" size="small" />}
                                />
                                <FormControlLabel
                                    value="PARPRE"
                                    label="PARPRE"
                                    control={<Radio color="primary" size="small" />}
                                />
                            </FormGroup>
                        </RadioGroup>
                    </Grid>
                </Grid>

                {documentType === "POS" ? (
                    <ARCard
                        name="Procédure d'Ouverture de Service"
                        type="status"
                        actions={posActions}
                        SetActions={setPosActions}
                        generateJson={generateJson}
                        key={4}
                        verification={verification}
                        setVerification={setVerification}
                        informations={informations}
                        setInformations={setInformations}
                        titleError={titleError}
                        cardType="POS"
                    />
                ) : (
                    <div>
                        <ARCard
                            name="Arrêt"
                            type="stop"
                            actions={StopActions}
                            SetActions={saveStop}
                            autoRelance={autoRelance}
                            AddServer={saveServer}
                            generateJson={generateJson}
                            key={1}
                            verification={verification}
                            setVerification={setVerification}
                            informations={informations}
                            setInformations={setInformations}
                            titleError={titleError}
                            cardType="STOP"
                        />
                        {autoRelance ? (
                            <ARCard
                                name="Auto-Relance"
                                type="start"
                                actions={AutoStartActions}
                                SetActions={setAutoStartActions}
                                autoRelance={autoRelance}
                                AddServer={saveServer}
                                generateJson={generateJson}
                                key={2}
                                verification={verification}
                                setVerification={setVerification}
                                informations={informations}
                                setInformations={setInformations}
                                titleError={titleError}
                                cardType="START"
                            />
                        ) : (
                            <ARCard
                                name="Relance"
                                type="start"
                                actions={StartActions}
                                SetActions={saveStart}
                                AddServer={saveServer}
                                key={3}
                                verification={verification}
                                setVerification={setVerification}
                                informations={informations}
                                setInformations={setInformations}
                                titleError={titleError}
                                cardType="START"
                            />
                        )}
                    </div>
                )}
                <RightNav ServerRow={servers} saveRows={setServers} />
            </div>
            <div>
                <Dialog open={loading} style={{ minHeight: 100, minWidth: 100 }}>
                    <Box
                        display="flex"
                        alignContent="center"
                        alignItems="center"
                        justifyContent="center"
                        m={5}
                    >
                        <CircularProgress />
                    </Box>
                    <DialogTitle>Chargement des étapes</DialogTitle>
                </Dialog>
            </div>
            <div>
                <ValidationDialog
                    informations={informations}
                    setInformations={setInformations}
                    generateJson={generateJson}
                />
            </div>
        </div>
    );
};

export default Create;
