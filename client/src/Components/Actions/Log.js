import {
    Avatar,
    Box,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useContext, useState, useEffect } from "react";
import ActionContext from "../../Context/ActionContext";
import OptionMenu from "../Creation/OptionMenu";
import OptionDialog from "../Creation/OptionDialog";
import { testPath, testPing } from "../Checker";

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
const Log = ({ index, type, initialSTate }) => {
    const classes = useStyles();
    const [state, setState] = useState(initialSTate);
    const [openDialog, setOpenDialog] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [scriptError, setScriptError] = useState("false");
    const [path, setPath] = useState("");

    const [options, setOptions] = useState({
        block: true,
        prod: true,
        hprod: true,
        inte: true,
        dev: true,
    });
    const { deleteAction, duplicateAction, saveData, verification } = useContext(ActionContext);

    useEffect(() => {
        setOptions({ ...options, os: "windows" });

        setState(initialSTate);
        setOptions(initialSTate.options);
    }, []);

    //verification du server et du service
    useEffect(() => {
        if (initialSTate.server && state.server === undefined) {
            verification && testPing(initialSTate.server, setServerError);
            verification && testPath(initialSTate.path, initialSTate.server, setScriptError);
        }

        if (state.server) {
            verification && testPing(state.server, setServerError);
            verification && testPath(state.path, initialSTate.server, setScriptError);
        }
    }, [verification]);

    const saveInformations = () => {
        if (state.name === undefined || state.server === undefined) {
            return;
        }

        saveData({
            index: index,
            type: "log",
            server: state.server,
            name: state.name,
            path: path,
            options: options,

            //os: "windows"
        });
    };

    return (
        <div>
            <Paper elevation={0} className={classes.root}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item md={1} xl={1}>
                        <Box display="flex" justifyContent="center">
                            <Search color="primary" />
                        </Box>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} xl={2}>
                        <TextField
                            onChange={(e) => setState({ ...state, server: e.target.value })}
                            onBlur={(e) => {
                                setOptions({
                                    ...options,
                                    os: e.target.value.toLowerCase().startsWith("sw")
                                        ? "windows"
                                        : "linux",
                                });
                                saveInformations();
                                verification && testPing(e.target.value, setServerError);
                            }}
                            value={state.server}
                            className={classes.fields}
                            id="server"
                            color="primary"
                            error={verification ? serverError : false}
                            label="Serveur"
                        />
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} xl={4}>
                        <TextField
                            className={classes.fields}
                            id="log"
                            value={state.name}
                            color="primary"
                            label="Log"
                            onChange={(e) => setState({ ...state, name: e.target.value })}
                            onBlur={saveInformations}
                            inputProps={{
                                style: {
                                    fontSize:
                                        state.name &&
                                        state.name.split("").length > 35 &&
                                        state.name.split("").length < 50
                                            ? 13
                                            : state.name && state.name.split("").length > 50
                                            ? 12
                                            : "1rem",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} xl={4}>
                        <TextField
                            onChange={(e) => setState({ ...state, path: e.target.value })}
                            onBlur={(e) => {
                                saveInformations();
                                verification &&
                                    testPath(e.target.value, state.server, setScriptError);
                            }}
                            value={state.path}
                            className={classes.fields}
                            id="Path"
                            color="primary"
                            label={
                                scriptError === "true"
                                    ? "Fichier non retrouvé sur le serveur"
                                    : scriptError === "dossier"
                                    ? "Dossier ? "
                                    : "Path"
                            }
                            error={
                                (state.path === "" ||
                                    scriptError === "true" ||
                                    scriptError === "dossier") &&
                                verification
                            }
                            inputProps={{
                                style: {
                                    fontSize:
                                        state.path &&
                                        state.path.split("").length > 35 &&
                                        state.path.split("").length < 50
                                            ? 13
                                            : state.path && state.path.split("").length > 50
                                            ? 12
                                            : "1rem",
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={1} sm={1} md={1} xl={1}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item md={6}>
                                <OptionMenu
                                    index={index}
                                    deleteAction={deleteAction}
                                    duplicateAction={duplicateAction}
                                    setOpenDialog={setOpenDialog}
                                />
                                <OptionDialog
                                    options={options}
                                    saveInfos={saveInformations}
                                    setOptions={setOptions}
                                    openDialog={openDialog}
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

export default Log;
