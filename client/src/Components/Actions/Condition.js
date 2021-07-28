import {
    Avatar,
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { CallSplit } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import ActionContext from "../../Context/ActionContext";
import OptionMenu from "../Creation/OptionMenu";

const useStyles = makeStyles((theme) => ({
    root: {
        background: "#F6F6FB",
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    fields: {
        width: "100%",
    },
    smallAvatar: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
    },
}));
const Condition = ({ index, initialSTate, verified }) => {
    const classes = useStyles();
    const { deleteAction, duplicateAction, saveData } = useContext(ActionContext);

    const [state, setState] = useState({ initialSTate });
    //const [recieved, setRecieved] = useState({ ...verified });
    const [openDialog, setOpenDialog] = useState(false);

    const [type, setType] = useState("If");
    const [action, setAction] = useState("");
    const [sortie, setSortie] = useState("");

    const [options, setOptions] = useState({
        block: true,
        prod: true,
        hprod: true,
        inte: true,
        dev: true,
    });

    useEffect(() => {
        verified ? setAction(verified.type) : setAction("");
    }, []);

    const saveInformations = () => {
        if (state.out) {
            saveData({
                index: index,
                type: "condition",
                out: state.out,
                type: type,
            });
        }
    };

    const ActionType = [
        {
            name: "Vérifier Url",
            type: "link",
            console: ["ok", "ko", "PAGE_BLANCHE"],
        },
        {
            name: "Action Web",
            type: "webAction",
            console: ["ok", "erreur"],
        },
        {
            name: "Service",
            type: "service",
            console: ["running", "stopped"],
        },
        {
            name: "Processus",
            type: "process",
            console: ["running", "stopped"],
        },
        {
            name: "Script",
            type: "script",
        },
        {
            name: "Base de données",
            type: "database",
            console: ["ok", "ko", "autre erreur"],
        },
        {
            name: "Commande",
            type: "command",
        },
        {
            name: "Log",
            type: "log",
            console: ["ok", "ko"],
        },
        {
            name: "Disque",
            type: "disk",
            console: ["ok", "ko"],
        },
        {
            name: "Pool ou Site IIS",
            type: "IIS",
            console: ["running", "stopped"],
        },
    ];

    return (
        <div id={"condition-" + index} style={{ marginLeft: -15 }}>
            <Paper elevation={0} className={classes.root}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item sm={1} md={1} xl={1}>
                        <Box my="auto" display="flex" justifyContent="center">
                            <CallSplit color="primary" />
                        </Box>
                    </Grid>

                    <Grid item sm={2} md={2} xl={2}>
                        <FormControl className={classes.fields}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                fullWidth
                                onBlur={saveInformations}
                            >
                                <MenuItem value="If">If</MenuItem>
                                <MenuItem value="Else">Else</MenuItem>
                                <MenuItem value="fi">End If</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={3} md={3} xl={3}>
                        <FormControl className={classes.fields}>
                            <InputLabel>Action Précedente</InputLabel>
                            <Select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                fullWidth
                                onBlur={saveInformations}
                            >
                                {ActionType.map((action) => (
                                    <MenuItem value={action.type}>{action.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item sm={3} md={3} xl={3}>
                        <TextField
                            onChange={(e) => setState({ ...state, out: e.target.value })}
                            onBlur={(e) => {
                                saveInformations();
                            }}
                            value={verified.name || verified.path}
                            className={classes.fields}
                            id="sortie"
                            color="primary"
                            label={"Nom " + action}
                        />
                    </Grid>
                    {verified.type === "script" || verified.type === "command" ? (
                        <Grid item sm={2} md={2} xl={2}>
                            <TextField
                                onChange={(e) => setState({ ...state, out: e.target.value })}
                                onBlur={(e) => {
                                    saveInformations();
                                }}
                                value={state.out}
                                className={classes.fields}
                                id={"sortie " + index + "-" + type}
                                color="primary"
                                label={"Sortie " + action}
                            />
                        </Grid>
                    ) : (
                        <Grid item sm={2} md={2} xl={2}>
                            <FormControl className={classes.fields}>
                                <InputLabel>Sortie attendue</InputLabel>
                                <Select
                                    value={sortie}
                                    onChange={(e) => setSortie(e.target.value)}
                                    fullWidth
                                    onBlur={saveInformations}
                                >
                                    {ActionType.filter(
                                        (element) =>
                                            element.type != "script" && element.type != "command"
                                    ).map(
                                        (item) =>
                                            item.type == action &&
                                            item.console.map((out) => (
                                                <MenuItem value={out}>{out}</MenuItem>
                                            ))
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    <Grid item md={1} xl={1}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item md={6}>
                                <OptionMenu
                                    index={index}
                                    deleteAction={deleteAction}
                                    duplicateAction={duplicateAction}
                                    setOpenDialog={setOpenDialog}
                                />
                            </Grid>

                            <Grid item md={6}>
                                <Box my="auto">
                                    <Avatar className={classes.smallAvatar}>
                                        <Typography>{index + 1}</Typography>
                                    </Avatar>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default Condition;
