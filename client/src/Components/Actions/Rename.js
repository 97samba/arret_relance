import {
    Avatar,
    Box,
    Grid,
    Inpabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { WrapText } from "@material-ui/icons";
import { useContext, useState, useEffect } from "react";
import ActionContext from "../../Context/ActionContext";
import OptionMenu from "../Creation/OptionMenu";
import OptionDialog from "../Creation/OptionDialog";
import PathField from "../Fields/PathField";
import { testPing } from "../Checker";

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
const Rename = ({ index, type, initialSTate }) => {
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
        setState(initialSTate);
        setOptions(initialSTate.options);
    }, []);
    //verification du server et du service
    useEffect(() => {
        if (initialSTate.server && state.server === undefined) {
            verification && testPing(initialSTate.server, setServerError);
            //verification && testService(initialSTate.name, initialSTate.server, setServiceError);
        }

        if (state.server) {
            verification && testPing(state.server, setServerError);
            //verification && testService(state.name, state.server, setServiceError);
        }
    }, [verification]);

    const saveInformations = () => {
        if (state.name === undefined || state.server === undefined) {
            return;
        }

        saveData({
            index: index,
            type: "rename",
            server: state.server,
            name: state.name,
            path: path,
            options: options,

            //os: "windows"
        });
    };
    const pathProps = {
        index: index,
        className: classes.fields,
        serverError: serverError,
        path: path != "" ? path : initialSTate.path,
        type: "Fichier",
        scriptError: scriptError,
        server: state.server,
        setScriptError: setScriptError,
        setPath: setPath,
        setScriptError: setScriptError,
        saveInformations: saveInformations,
    };
    return (
        <div>
            <Paper elevation={0} className={classes.root}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item md={1} xl={1}>
                        <Box display="flex" justifyContent="center">
                            <WrapText color="primary" />
                        </Box>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} xl={2}>
                        <TextField
                            onChange={(e) => setState({ ...state, server: e.target.value })}
                            onBlur={(e) => {
                                saveInformations();
                                testPing(e.target.value, setServerError);
                            }}
                            value={state.server}
                            className={classes.fields}
                            id="server"
                            color="primary"
                            error={verification ? serverError : false}
                            label="Serveur"
                        />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} xl={2}>
                        <TextField
                            className={classes.fields}
                            id="fileName"
                            value={state.name}
                            color="primary"
                            label="Nouveau Nom"
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
                    <Grid item xs={6} sm={6} md={6} xl={6}>
                        {/**
                        <TextField
                            onChange={(e) => setState({ ...state, path: e.target.value })}
                            onBlur={(e) => {
                                saveInformations()
                                checker.testPath(e.target.value, state.server, setScriptError)
                            }
                            }
                            value={state.path}
                            className={classes.fields}
                            id='Path'
                            color='primary'

                            label={scriptError === "true" ? 'Fichier non retrouvé sur le serveur' : scriptError === "dossier" ? 'Dossier ? ' : 'Path'}
                            error={state.path === "" || scriptError === "true" || scriptError === "dossier"}

                            inputProps={{
                                style: {
                                    fontSize:
                                        state.path && state.path.split("").length > 35 && state.path.split("").length < 50 ? 13 :
                                            state.path && state.path.split("").length > 50 ? 12 : "1rem"
                                }
                            }}

                        />
                         */}
                        <PathField props={pathProps} />
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

export default Rename;
