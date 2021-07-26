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
import { Storage } from "@material-ui/icons";
import { useContext, useState, useEffect } from "react";
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
        width: "100%",
    },
    smallAvatar: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
    },
}));

const Database = ({ index, type, initialSTate }) => {
    const classes = useStyles();
    const { deleteAction, duplicateAction, saveData, verification } = useContext(ActionContext);

    const [state, setState] = useState({ initialSTate });
    const [status, setStatus] = useState(type);
    const [databaseType, setDatabaseType] = useState("MSSQL");
    const [openDialog, setOpenDialog] = useState(false);

    //true donc erreur donc rouge
    const [databaseError, setDatabaseError] = useState(false);
    const [serverError, setServerError] = useState(false);

    const [options, setOptions] = useState({
        block: true,
        prod: true,
        hprod: true,
        inte: true,
        dev: true,
    });

    useEffect(() => {
        setState(initialSTate);
        if (initialSTate.action) {
            setStatus(initialSTate.action.toLowerCase());
            setOptions(initialSTate.options);
        }

        initialSTate.databaseType !== undefined
            ? setDatabaseType(initialSTate.databaseType.toUpperCase())
            : setDatabaseType("MSSQL");
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

        let result;
        if (status === "status") {
            type === "stop" ? (result = "stopped") : (result = "running");
        }

        saveData({
            index: index,
            type: "database",
            server: state.server,
            name: state.name,
            action: status,
            databaseType: databaseType,
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
                            <Storage color="primary" />
                        </Box>
                    </Grid>

                    <Grid item xs={2} md={2} xl={2}>
                        <TextField
                            value={state.server}
                            className={classes.fields}
                            id="server"
                            color="primary"
                            label="Serveur"
                            error={verification ? serverError : false}
                            onChange={(e) => {
                                setState({ ...state, server: e.target.value });
                                e.target.value.toLocaleLowerCase().startsWith("sw") ||
                                e.target.value.length < 2
                                    ? setDatabaseType("MSSQL")
                                    : setDatabaseType("Oracle");
                            }}
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
                    <Grid item xs={2} md={2} xl={2}>
                        <FormControl className={classes.fields}>
                            <InputLabel>Action</InputLabel>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                onBlur={saveInformations}
                            >
                                <MenuItem value="stop">Stop</MenuItem>
                                <MenuItem value="start">Start</MenuItem>
                                <MenuItem value="status">Status</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3} md={3} xl={3}>
                        <TextField
                            autoComplete="false"
                            className={classes.fields}
                            value={state.name}
                            id="DBName"
                            color="primary"
                            label={
                                databaseError
                                    ? "Instance non retrouvée"
                                    : serverError && state.name !== ""
                                    ? "Instance non testée"
                                    : "Instance"
                            }
                            error={databaseError}
                            onChange={(e) => setState({ ...state, name: e.target.value })}
                            onBlur={(e) => {
                                saveInformations();
                            }}
                        />
                    </Grid>
                    <Grid item xs={3} md={3} xl={3}>
                        <FormControl className={classes.fields}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={databaseType}
                                onChange={(e) => setDatabaseType(e.target.value)}
                                onBlur={saveInformations}
                            >
                                <MenuItem value="MSSQL">MSSQL</MenuItem>
                                <MenuItem value="MONGODB">MONGODB</MenuItem>
                                <MenuItem value="Oracle">Oracle</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

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

export default Database;
