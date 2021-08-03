import {
    Button,
    Container,
    makeStyles,
    Card,
    CardHeader,
    CardContent,
    Grid,
    Typography,
} from "@material-ui/core";
import {
    Autorenew,
    Code,
    Description,
    Http,
    KeyboardArrowRight,
    Save,
    Search,
    SettingsSharp,
    Storage,
    Web,
    AccountTree,
    WrapText,
    CallSplit,
} from "@material-ui/icons";
import Service from "./Actions/Service";
import Database from "./Actions/Database";
import Process from "./Actions/Process";
import ARScript from "./Actions/ARScript";
import { useEffect, useState } from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import { SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";
import ActionContext from "../Context/ActionContext";
import Link from "./Actions/Link";
import WebAction from "./Actions/WebAction";
import Command from "./Actions/Command";
import Log from "./Actions/Log";
import PoolIIS from "./Actions/IIS";
import Rename from "./Actions/Rename";
import Disk from "./Actions/Disk";
import Condition from "./Actions/Condition";

const cardWidth = 850;
const useStyles = makeStyles((theme) => ({
    root: {
        // width : cardWidth,
        marginBottom: theme.spacing(2),
    },
}));
const ARCard = ({
    name,
    actions,
    SetActions,
    type,
    AddServer,
    generateJson,
    verification,
    informations,
    setInformations,
    titleError,
    cardType,
}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(actions.length);
    const [pingedServers, setPingedServers] = useState([{ name: "sw11203", joined: false }]);
    const [errorText, setErrorText] = useState("");

    var second = actions.length;

    useEffect(() => {}, []);

    const addAction = (_type) => {
        const newState = [
            ...actions,
            {
                index: second,
                type: _type,
                action: type,
                informations: {},
                options: {
                    block: true,
                    prod: true,
                    hprod: true,
                    inte: true,
                    dev: true,
                },
            },
        ];
        console.log("new state ", newState);

        SetActions(newState);
        setIndex(index + 1);
        second++;
    };

    const deleteAction = (actionID) => {
        console.log(
            "deleting ",
            actions.filter((action) => action.index === actionID)
        );

        const newState = actions.filter((action) => action.index !== actionID);
        var i;

        for (i = 0; i < newState.length; i++) {
            newState[i].index = i;
        }

        setIndex(newState.length);

        //newState.map(action => console.log(action))

        SetActions(newState);

        //console.log("index ", index)
    };

    const duplicateAction = (actionID) => {
        var actionToDuplicateIndex = actionID;
        var clone = actions[actionToDuplicateIndex];

        console.log(
            "action to duplicate",
            clone,
            "index ",
            actionToDuplicateIndex,
            " actionId ",
            actionID
        );

        var newClone = { ...clone, action: "status", duplicated: "duplicated" };
        actionToDuplicateIndex = actionToDuplicateIndex + 1;
        console.log("before splice ", actions);

        actions.splice(actionToDuplicateIndex, 0, newClone);

        console.log("new array ", actions);

        for (var i = 0; i < actions.length; i++) {
            actions[i].index = i;
            //console.log(actions[i].server)
        }
        console.log("after array ", actions);

        //newState.map(action => console.log(action))

        SetActions(actions);
        setIndex(actions.length);
    };

    const saveData = (object) => {
        const result = actions.filter((e) => e.index === object.index);

        if (result.length > 0) {
            const index = actions.findIndex((e) => e.index === object.index);

            console.log("Changement", actions[index]);

            actions.splice(index, 1, object);

            SetActions(actions);
        } else {
            console.log("Nouvelle entrée");
            const newState = [...actions, object];
            SetActions(newState);
        }
    };

    const validateDocument = () => {
        if (actions.length > 0) {
            !titleError
                ? setInformations({ ...informations, open: true })
                : setErrorText("Veuillez changer le nom du SSA SVP");
        }
    };

    const iconsAction = [
        {
            icon: <Http />,
            name: "Vérifier Url",
            type: "link",
            action: () => addAction("link"),
        },
        {
            icon: <Web />,
            name: "Action Web",
            type: "webAction",
            action: () => addAction("webAction"),
        },
        {
            icon: <CallSplit />,
            name: "Créer une condition",
            type: "condition",
            action: () => addAction("condition"),
        },
        {
            icon: <SettingsSharp />,
            name: "Service",
            type: "service",
            action: () => addAction("service"),
        },
        {
            icon: <Autorenew />,
            name: "Processus",
            type: "process",
            action: () => addAction("process"),
        },
        {
            icon: <Description />,
            name: "Script",
            type: "script",
            action: () => addAction("script"),
        },
        {
            icon: <Storage />,
            name: "Base de données",
            type: "database",
            action: () => addAction("database"),
        },
        {
            icon: <Code />,
            name: "Commande",
            type: "command",
            action: () => addAction("command"),
        },
        {
            icon: <Search />,
            name: "Rechercher un Log",
            type: "log",
            action: () => addAction("log"),
        },
        {
            icon: <Save />,
            name: "Vérifier Disque(s)",
            type: "disk",
            action: () => addAction("disk"),
        },
        {
            icon: <AccountTree />,
            name: "Pool IIS",
            type: "IIS",
            action: () => addAction("IIS"),
        },
        {
            icon: <WrapText />,
            name: "Renommer un fichier",
            type: "rename",
            action: () => addAction("rename"),
        },
    ];
    return (
        <Container>
            <Card className={classes.root}>
                <CardHeader
                    title={name}
                    subheader="Windows"
                    action={
                        (cardType === "POS" || cardType === "STOP") && (
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={validateDocument}
                                endIcon={<KeyboardArrowRight />}
                            >
                                Save
                            </Button>
                        )
                    }
                />
                <CardContent>
                    {titleError ? (
                        <Typography style={{ color: "red", marginTop: 10 }}>{errorText}</Typography>
                    ) : null}
                    <ActionContext.Provider
                        value={{
                            actions,
                            deleteAction,
                            duplicateAction,
                            saveData,
                            AddServer,
                            setPingedServers,
                            pingedServers,
                            verification,
                            cardType,
                        }}
                    >
                        <form noValidate autoComplete="on">
                            {actions.map((item, index) =>
                                item.type === "service" ? (
                                    <Service
                                        key={index}
                                        index={index}
                                        type={type}
                                        initialSTate={item}
                                    />
                                ) : item.type === "script" ? (
                                    <ARScript key={index} index={index} initialSTate={item} />
                                ) : item.type === "database" ? (
                                    <Database
                                        key={index}
                                        index={index}
                                        type={type}
                                        initialSTate={item}
                                    />
                                ) : item.type === "process" ? (
                                    <Process
                                        key={index}
                                        index={index}
                                        type={type}
                                        initialSTate={item}
                                    />
                                ) : item.type === "link" ? (
                                    <Link key={index} index={index} initialSTate={item} />
                                ) : item.type === "webAction" ? (
                                    <WebAction key={index} index={index} initialSTate={item} />
                                ) : item.type === "command" ? (
                                    <Command key={index} index={index} initialSTate={item} />
                                ) : item.type === "log" ? (
                                    <Log
                                        key={index}
                                        index={index}
                                        type={type}
                                        initialSTate={item}
                                    />
                                ) : item.type === "IIS" ? (
                                    <PoolIIS
                                        key={index}
                                        index={index}
                                        type={type}
                                        initialSTate={item}
                                    />
                                ) : item.type === "rename" ? (
                                    <Rename
                                        key={index}
                                        index={index}
                                        type={type}
                                        initialSTate={item}
                                    />
                                ) : item.type === "disk" ? (
                                    <Disk key={index} index={index} initialSTate={item} />
                                ) : item.type === "condition" ? (
                                    <Condition
                                        key={index}
                                        index={index}
                                        type={type}
                                        verified={actions[index - 1]}
                                    />
                                ) : null
                            )}
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                style={{ marginTop: 20 }}
                            >
                                <Grid item>
                                    <SpeedDial
                                        ariaLabel="SpeedDial"
                                        icon={<SpeedDialIcon onClick={() => setOpen(!open)} />}
                                        open={open}
                                        direction="right"
                                        onMouseEnter={() => setOpen(true)}
                                    >
                                        {
                                            //si c'est une POS donc status
                                            type !== "status"
                                                ? iconsAction
                                                      .filter(
                                                          (icon) =>
                                                              icon.type != "webAction" &&
                                                              icon.type != "condition"
                                                      )
                                                      .map((action) => (
                                                          <SpeedDialAction
                                                              key={action.name}
                                                              icon={action.icon}
                                                              tooltipTitle={action.name}
                                                              tooltipPlacement="down"
                                                              onClick={action.action}
                                                          />
                                                      ))
                                                : iconsAction.map((action) => (
                                                      <SpeedDialAction
                                                          key={action.name}
                                                          icon={action.icon}
                                                          tooltipTitle={action.name}
                                                          tooltipPlacement="down"
                                                          onClick={action.action}
                                                      />
                                                  ))
                                        }
                                    </SpeedDial>
                                </Grid>
                                <Typography variant="caption" style={{ marginTop: 10 }}>
                                    {informations.prenom} {informations.nom}
                                </Typography>
                            </Grid>
                        </form>
                    </ActionContext.Provider>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ARCard;
