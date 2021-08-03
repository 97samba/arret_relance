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
import { SettingsSharp } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import ActionContext from "../../Context/ActionContext";
import OptionDialog from "../Creation/OptionDialog";
import OptionMenu from "../Creation/OptionMenu";
import { testPing, testService } from "../Checker";

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

const Service = ({ index, type, initialSTate }) => {
    const { deleteAction, duplicateAction, saveData, verification, cardType } =
        useContext(ActionContext);
    //css
    const classes = useStyles();

    //létat du composant
    const [state, setState] = useState(initialSTate);
    //l'état du server
    const [status, setStatus] = useState(type);
    //menu options
    const [openDialog, setOpenDialog] = useState(false);

    const [serviceError, setServiceError] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [result, setResult] = useState(cardType === "POS" ? "running" : "stopped");
    const [options, setOptions] = useState(initialSTate.options);
    //context pour sauvegarder l'état dans le parent

    useEffect(() => {
        setState(initialSTate);
        if (initialSTate.action) {
            setStatus(initialSTate.action.toLowerCase());
            setOptions(initialSTate.options);
        }
    }, []);

    //verification du server et du service
    useEffect(() => {
        if (initialSTate.server && state.server === undefined) {
            verification && testPing(initialSTate.server, setServerError);
            verification && testService(initialSTate.name, initialSTate.server, setServiceError);
        }

        if (state.server) {
            verification && testPing(state.server, setServerError);
            verification && testService(state.name, state.server, setServiceError);
        }
    }, [verification]);

    const saveInformations = () => {
        if (state.name === undefined || state.server === undefined) {
            return;
        }
        saveData({
            index: index,
            type: "service",
            server: state.server,
            name: state.name,
            action: status,
            options: options,
            //os: "windows"
        });
    };

    return (
        <div id={"service-" + index + "-" + type}>
            <Paper elevation={0} className={classes.root}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item md={1} xl={1}>
                        <Box display="flex" justifyContent="center">
                            <SettingsSharp color="primary" />
                        </Box>
                    </Grid>
                    <Grid item md={2} xl={2}>
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
                                verification &&
                                    state.name &&
                                    testService(state.name, e.target.value, setServiceError);
                            }}
                            value={state.server}
                            className={classes.fields}
                            id="server"
                            color="primary"
                            error={verification ? serverError : false}
                            label="Serveur"
                        />
                    </Grid>
                    <Grid item md={2} xl={2}>
                        <FormControl className={classes.fields}>
                            <InputLabel>Action</InputLabel>
                            <Select
                                fullWidth
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                onBlur={() => saveInformations()}
                            >
                                <MenuItem value="stop">Stop</MenuItem>
                                <MenuItem value="start">Start</MenuItem>
                                <MenuItem value="status">Status</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        //affiche le champs 'Resultat attendu' si on est en POS
                        md={cardType === "POS" && status === "status" ? 4 : 6}
                        xl={cardType === "POS" && status === "status" ? 6 : 4}
                    >
                        <TextField
                            value={state.name}
                            className={classes.fields}
                            id={`serviceName- ${index}`}
                            color="primary"
                            label={
                                serviceError
                                    ? "Service non retrouvé "
                                    : serverError && state.name !== ""
                                    ? "Ce service sera testé si serveur joignable"
                                    : "Service"
                            }
                            error={verification ? serviceError : false}
                            onChange={(e) => setState({ ...state, name: e.target.value })}
                            onBlur={(e) => {
                                saveInformations();
                                verification &&
                                    !serverError &&
                                    testService(e.target.value, state.server, setServiceError);
                            }}
                            //testService(e.target.value)
                        />
                    </Grid>
                    {cardType === "POS" && status === "status" ? (
                        <Grid item md={2} xl={2}>
                            <FormControl className={classes.fields}>
                                <InputLabel>Résultat Attendu</InputLabel>
                                <Select
                                    fullWidth
                                    value={result}
                                    onChange={(e) => setResult(e.target.value)}
                                    onBlur={() => saveInformations()}
                                >
                                    <MenuItem value="running">running</MenuItem>
                                    <MenuItem value="stopped">stopped</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    ) : null}
                    <Grid item md={1} xl={1}>
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

export default Service;
