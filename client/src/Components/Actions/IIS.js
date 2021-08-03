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
import { AccountTree } from "@material-ui/icons";
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

const PoolIIS = ({ index, type, initialSTate }) => {
    const classes = useStyles();
    const { deleteAction, duplicateAction, saveData, verification } = useContext(ActionContext);

    const [state, setState] = useState({ initialSTate });
    const [status, setStatus] = useState(type);
    const [elementType, setElementType] = useState("pool");
    const [openDialog, setOpenDialog] = useState(false);

    //true donc erreur donc rouge
    const [elementError, setElementError] = useState(false);
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
        setOptions({ ...options, os: "windows" });

        if (initialSTate.action) {
            setStatus(initialSTate.action.toLowerCase());
            setOptions(initialSTate.options);
        }
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
            type: "IIS",
            server: state.server,
            name: state.name,
            elementType: elementType,
            action: status,
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
                            <AccountTree color="primary" />
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
                                elementError ? "Pool ou Site Web non retrouvé" : "Pool ou Site Web"
                            }
                            error={elementError}
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
                                value={elementType}
                                onChange={(e) => setElementType(e.target.value)}
                                onBlur={saveInformations}
                            >
                                <MenuItem value="pool">Pool</MenuItem>
                                <MenuItem value="site">Site</MenuItem>
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

export default PoolIIS;
