import { FormControlLabel, FormGroup,  Grid, makeStyles, Radio, RadioGroup, Switch, TextField, Typography } from "@material-ui/core"
import axios from "axios";
import { useEffect, useState } from "react";
import ARCard from "../Components/ARCard"
import RightNav from "../Components/Creation/RightNav";
import { useHistory } from 'react-router'

var drawerWidthRight = 260

const useStyles = makeStyles((theme) => {
    return {
        root: {
            width: `calc(100% - ${drawerWidthRight}px)`
        }

    }
})


const Create = () => {

    const [titleOpen, setTitleOpen] = useState(false)
    //titre de la parpre ou de la POS
    const [title, setTitle] = useState("APPXXXX_SSA")
    //les actions d'arrêt
    const [StopActions, setStopActions] = useState([])
    //les Actions de relance
    const [StartActions, setStartActions] = useState([])
    //les Actions auto relance
    const [AutoStartActions, setAutoStartActions] = useState([])
    //les Actions POS
    const [posActions, setPosActions] = useState([])
    //creation automatique de la verification
    const [autoCreate, setAutoCreate] = useState(false)
    //Si on fait la relance automatiquement
    const [autoRelance, setAutoRelance] = useState(false)
    //Soit PARPRE ou POS
    const [documentType, setDocumentType] = useState("PARPRE")
    //Le mode d'utilisation: creation ou modification
    const [pageMode, setPageMode] = useState("Création")

    const history = useHistory()

    const [servers, setServers] = useState([])

    //La page de création et la page de modifiation sont les mêmes, la difference est assurée par pageMode
    useEffect(() => {

        if (history.location.state !== undefined) {
            document.title = `Modification de ${history.location.state.name}`

            console.log("History ", history.location)

            history.location.fromExcel
                ? setPageMode("Création")
                : setPageMode("Modification")

            setDocumentType(history.location.state.type)
            setStopActions(history.location.state.Arret)
            setStartActions(history.location.state.Relance)
            setPosActions(history.location.state.POS)
            //setDocumentType(history.location.state.type || "PARPRE")
            //setPosActions(history.location.state.pos)
            setTitle(history.location.state.name)

            if (history.location.state.variables.servers !== undefined) {

                const initialServers = history.location.state.variables.servers.map((variable, index) => {
                    return {
                        id: index,
                        prod: variable.prod,
                        hprod: variable.hprod,
                        dev: variable.dev,
                        name: variable.name
                    }
                })
                setServers(initialServers)
            }
        } else {
            document.title = "Création de PARPRE / POS"
            setPageMode("Création")
        }
    }, [])


    const saveServer = () => {

        //noms des serveurs dans la lste des variables
        var Allservers = servers.map(server => { return server.prod.toUpperCase() })

        var serversInStopActions = new Set()
        var databasesInStopActions = new Set()

        //on recupere les servers dans les etapes d'arret
        StopActions.map(action => {
            if (action.server === undefined || action.server === "") { return };
            serversInStopActions.add(action.server.toUpperCase())
            
            if(action.type === "database"){
                databasesInStopActions.add(action.name.toUpperCase())

            }
            
        })

        //on rajoute les serveurs manquants
        serversInStopActions.forEach(server => {

            if (!Allservers.includes(server)) {
                Allservers.push(server)
                var name =""
                server.startsWith("sw")
                    ? name = server.replace("sw", "SRV_WIN_")
                    : name = server
                setServers([...servers, { id: (servers.length + 1), prod: server.toUpperCase(), hprod: "definir", dev: "definir", name:name }])

            }
        })
        
        databasesInStopActions.forEach(database => {

            if (!Allservers.includes(database)) {
                Allservers.push(database)
                var name = `BDD_${database}`
                setServers([...servers, { id: (servers.length + 1), prod: database.toUpperCase(), hprod: "definir", dev: "definir", name:name }])

            }
        })

        //On enleve les serveurs absents dans la liste des actions
        Allservers.map(server => {
            if (!serversInStopActions.has(server) && !databasesInStopActions.has(server)) {
                const newServerState = servers.filter(serverprod => serverprod.prod !== server)
                setServers(newServerState)

            }
        })
        
    }

    const classes = useStyles()

    const saveStart = (object) => {
        setStartActions(object)
        //setAutoStartActions(object)

    }


    const saveStop = (object) => {
        setStopActions(object)

        // if(autoRelance)
        //reverseStopAction(object)

        saveServer(object)
    }



    const reverseStopAction = (actions) => {
        var newRelance = actions.slice(0).reverse().map(action => {
            if (action.type === "service" || action.type === "database" || action.type === "process") {
                if (action.action === "status") {
                    action = { ...action, action: "start" }
                } else {
                    action = { ...action, action: "status", options: { result: "running" } }
                }

            }
            if (action.type === "script") {
                action = { ...action, path: "" }

            }
            if (action.type === "command") {
                action = { ...action, name: "", result: "" }
            }
            return action
        })
        //console.log("stopAction ",StopActions)
        //console.log("new relance : ",newRelance)
        console.log("input : ", actions)
        for (var i = 0; i < newRelance.length; i++) {
            if (newRelance[i]) {
                newRelance[i].index = i
            }

        }
        setAutoStartActions(newRelance)
        console.log("actions ", actions, " vs ", newRelance)
    }

    const generateJson = () => {

        console.log("name ", title)

        const parpre = {
            name: title,
            auteur: "Samba NDIAYE",
            date_de_creation: new Date().toLocaleString(),
            type: "PARPRE",
            Arret: StopActions,
            Relance: autoRelance ? AutoStartActions : StartActions,
            POS: posActions,
            variables: {
                servers: servers
            }
        }

        axios.post(`http://localhost:5000/api/PARPRE/create`, { data: parpre, mode: pageMode })
            .then(res => console.log(res))

        console.log(JSON.stringify(parpre))
    }

    return (


        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item md={6}>
                    {
                        titleOpen ?
                            (
                                <TextField
                                    placeholder="Changer le titre"
                                    onBlur={() => setTitleOpen(false)}
                                    margin="dense"
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                    value={title}
                                />
                            )
                            :
                            (
                                <div>
                                    <Typography
                                        variant='h6'
                                        gutterBottom
                                        onClick={() => setTitleOpen(true)}
                                    >
                                        Nom : {title}

                                    </Typography>
                                </div>
                            )
                    }
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



                <Grid item md={3}>
                    <FormGroup>
                        {documentType === "PARPRE" ?
                            (
                                <FormControlLabel
                                    control={<Switch onChange={() => { reverseStopAction(StopActions); setAutoRelance(!autoRelance) }} />}
                                    checked={autoRelance}
                                    label="Relance-Auto"
                                >
                                </FormControlLabel>
                            )
                            :
                            (
                                null
                            )
                        }
                    </FormGroup>

                </Grid>
                <Grid item md={3}>

                    <RadioGroup value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                        <FormGroup row >
                            <FormControlLabel value="POS" label="POS" control={<Radio color="primary" />} />
                            <FormControlLabel value="PARPRE" label="PARPRE" control={<Radio color="primary" />} />
                        </FormGroup>
                    </RadioGroup>

                </Grid>

            </Grid>

            {
                documentType === "POS" ?

                    (
                        <ARCard
                            name="Procédure d'Ouverture de Service"
                            type="status"
                            actions={posActions}
                            SetActions={setPosActions}
                            generateJson={generateJson}
                            key={4}
                        />
                    )
                    :
                    (
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

                            />
                            {autoRelance ?
                                (<ARCard
                                    name="Auto-Relance"
                                    type="start"
                                    actions={AutoStartActions}
                                    SetActions={setAutoStartActions}
                                    autoRelance={autoRelance}
                                    AddServer={saveServer}
                                    generateJson={generateJson}
                                    key={2}

                                />
                                )
                                :
                                (<ARCard
                                    name="Relance"
                                    type="start"
                                    actions={StartActions}
                                    SetActions={saveStart}
                                    AddServer={saveServer}
                                    key={3}
                                />

                                )
                            }
                        </div>
                    )
            }

            <RightNav ServerRow={servers} saveRows={setServers} />
        </div>
    );
}

export default Create;