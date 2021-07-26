import { Avatar, Box, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Description } from "@material-ui/icons";
import { useContext, useState, useEffect } from "react";
import ActionContext from "../../Context/ActionContext";
import { testPath, testPing } from "../Checker";
import OptionDialog from "../Creation/OptionDialog";
import OptionMenu from "../Creation/OptionMenu";
import PathField from "../Fields/PathField";

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
const ARScript = ({ index, initialSTate }) => {
    const classes = useStyles();
    const { deleteAction, duplicateAction, saveData, verification } = useContext(ActionContext);

    const [state, setState] = useState({ initialSTate });
    const [openDialog, setOpenDialog] = useState(false);
    const [path, setPath] = useState("");
    //true donc erreur donc rouge
    const [scriptError, setScriptError] = useState("false");
    const [serverError, setServerError] = useState(false);

    const [options, setOptions] = useState({
        block: true,
        prod: true,
        hprod: true,
        inte: true,
        dev: true,
    });

    useEffect(async () => {
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
            verification && testPath(state.path, state.server, setScriptError);
        }
    }, [verification]);
    const saveInformations = () => {
        if (path === undefined || state.server === undefined) {
            return;
        }
        saveData({
            index: index,
            type: "script",
            server: state.server,
            path: path,
            options: options,

            //os: state.server.toUpperCase().startsWith("SW") ? "windows" : "linux"
        });
    };

    const pathProps = {
        index: index,
        className: classes.fields,
        serverError: serverError,
        path: path != "" ? path : initialSTate.path,
        type: "Script",
        scriptError: scriptError,
        server: state.server,
        setScriptError: setScriptError,
        setPath: setPath,
        setScriptError: setScriptError,
        saveInformations: saveInformations,
        verification: verification,
    };

    return (
        <div>
            <Paper elevation={0} className={classes.root}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item sm={1} md={1} xl={1}>
                        <Box my="auto" display="flex" justifyContent="center">
                            <Description color="primary" />
                        </Box>
                    </Grid>

                    <Grid item sm={2} md={2} xl={2}>
                        <TextField
                            value={state.server}
                            onChange={(e) => setState({ ...state, server: e.target.value })}
                            onBlur={(e) => {
                                saveInformations();
                                verification && testPing(e.target.value, setServerError);
                                //serverError === false && checker.testPath(e.target.value,state.server,setScriptError)
                            }}
                            className={classes.fields}
                            id="server"
                            color="primary"
                            label={serverError ? "Injoignable" : "Serveur"}
                            error={verification ? serverError : false}
                        />
                    </Grid>

                    <Grid item sm={8} md={8} xl={8}>
                        <PathField props={pathProps} />
                    </Grid>

                    <Grid item md={1} xl={1}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item md={6}>
                                <OptionMenu
                                    index={index}
                                    deleteAction={deleteAction}
                                    duplicateAction={duplicateAction}
                                    setOpenDialog={setOpenDialog}
                                />{" "}
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

export default ARScript;
