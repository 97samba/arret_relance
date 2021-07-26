import { Avatar, Box, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Code } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import ActionContext from "../../Context/ActionContext";
import OptionMenu from "../Creation/OptionMenu";
import OptionDialog from "../Creation/OptionDialog";
import { testPing } from "../Checker";

const useStyles = makeStyles((theme) => ({
    root: {
        background: "#F6F6FB",
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    fields: {
        //marginRight:theme.spacing(2),
        width: "100%",
    },
    smallAvatar: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
    },
}));

const Command = ({ index, initialSTate }) => {
    //css
    const classes = useStyles();

    const [state, setState] = useState({ initialSTate });
    //l'état du server
    const [pingState, setPingState] = useState("ko");
    const [openDialog, setOpenDialog] = useState(false);
    const [serverError, setServerError] = useState(false);

    const { deleteAction, duplicateAction, saveData, verification } = useContext(ActionContext);

    const [options, setOptions] = useState({
        block: true,
        prod: true,
        hprod: true,
        inte: true,
        dev: true,
    });

    useEffect(() => {
        setState(initialSTate);
        setOptions(initialSTate.options);
    }, []);
    useEffect(() => {
        if (initialSTate.server && state.server === undefined) {
            verification && testPing(initialSTate.server, setServerError);
        }
        if (state.server) {
            verification && testPing(state.server, setServerError);
        }
    }, [verification]);

    //context pour sauvegarder l'état dans le parent

    const saveInformations = () => {
        if (state.server === undefined || state.name === undefined) {
            return;
        }

        saveData({
            index: index,
            type: "command",
            server: state.server,
            name: state.name,
            login: state.login,
            result: state.result,
            options: options,
            //os: state.server.toUpperCase().startsWith("SW") ? "windows" : "linux"
        });
    };

    return (
        <div>
            <Paper elevation={0} className={classes.root}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item md={1} xl={1}>
                        <Box display="flex" justifyContent="center">
                            <Code color="primary" />
                        </Box>
                    </Grid>
                    <Grid item md={2} xl={2}>
                        <TextField
                            className={classes.fields}
                            value={state.server}
                            id={`server- ${index}`}
                            color="primary"
                            label="Serveur"
                            error={verification ? serverError : false}
                            onChange={(e) => setState({ ...state, server: e.target.value })}
                            onBlur={(e) => {
                                saveInformations();
                                verification && testPing(e.target.value, setServerError);
                            }}
                            inputProps={{
                                style: {
                                    fontSize:
                                        state.server &&
                                        state.server.split("").length > 20 &&
                                        state.server.split("").length < 65
                                            ? 13
                                            : state.server && state.server.split("").length > 65
                                            ? 13
                                            : "1rem",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item md={2} xl={2}>
                        <TextField
                            className={classes.fields}
                            value={state.login}
                            id={`login- ${index}`}
                            color="primary"
                            label="Login"
                            onChange={(e) => setState({ ...state, login: e.target.value })}
                            onBlur={saveInformations}
                            inputProps={{
                                style: {
                                    fontSize:
                                        state.login && state.login.split("").length > 60
                                            ? 14
                                            : "1rem",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item md={5} xl={4}>
                        <TextField
                            value={state.name}
                            className={classes.fields}
                            id={`command- ${index}`}
                            color="primary"
                            label="Commande"
                            onChange={(e) => setState({ ...state, name: e.target.value })}
                            onBlur={saveInformations}
                            error={state.name === ""}
                            inputProps={{
                                style: {
                                    fontSize:
                                        state.name &&
                                        state.name.split("").length > 40 &&
                                        state.name.split("").length < 65
                                            ? 14
                                            : state.name && state.name.split("").length > 65
                                            ? 13
                                            : "1rem",
                                },
                            }}
                        />
                    </Grid>
                    <Grid item md={1} xl={2}>
                        <TextField
                            className={classes.fields}
                            value={state.result}
                            id={`result- ${index}`}
                            color="primary"
                            label="Résultat"
                            onChange={(e) => setState({ ...state, result: e.target.value })}
                            onBlur={saveInformations}
                        />
                    </Grid>
                    <Grid item md={1} xl={1}>
                        <Grid container spacing={2} alignItems="center">
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

export default Command;
