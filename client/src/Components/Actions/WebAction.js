import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Web } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import ActionContext from "../../Context/ActionContext";
import ClickDialog from "../Creation/ClickDialog";
import ConnectionDialog from "../Creation/ConnectionDialog";
import FormDialog from "../Creation/FormDialog";
import DisconnectDialog from "../Creation/isconnectialog";
import OptionMenu from "../Creation/OptionMenu";
import OptionDialog from "../Creation/OptionDialog";

const useStyles = makeStyles((theme) => ({
    root: {
        background: "#F6F6FB",
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    fields: {
        width: "100%",
    },
    dropDown: {
        width: "100%",
    },
    smallAvatar: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
    },
}));
const WebAction = ({ index, initialSTate }) => {
    const classes = useStyles();
    const [anchorEl, setAnchor] = useState(null);
    const { deleteAction, duplicateAction, saveData } = useContext(ActionContext);
    const [state, setState] = useState(initialSTate);
    const [actionType, setActionType] = useState("connection");
    const [openDialog, setOpenDialog] = useState(false);
    const [informations, setInformations] = useState({});
    const [optionDialog, setOptionDialog] = useState(false);

    const [options, setOptions] = useState({
        block: true,
        prod: true,
        hprod: true,
        inte: true,
        dev: true,
    });

    const handleClick = (event) => {
        setAnchor(event.currentTarget);
    };
    const handleClose = () => {
        setAnchor(null);
    };
    const reduire = () => {};
    useEffect(() => {
        setState(initialSTate);
        if (initialSTate.informations.type) {
            console.log("action type ", initialSTate.informations.type);
            setActionType(initialSTate.informations.type);
        }
        setInformations(initialSTate.informations);
        setOptions(initialSTate.options);
    }, []);
    const formatUrl = (url) => {
        if (url.startsWith("http")) {
            console.log("url est bonne");
            return url;
        } else {
            console.log("error url");
            return "http://" + url;
        }
    };

    const showDialog = () => {
        setOpenDialog(true);
    };

    const closeDialog = () => {
        setOpenDialog(false);
    };

    const saveInformations = () => {
        if (state.url === undefined) {
            return;
        }

        saveData({
            index: index,
            type: "webAction",
            url: state.url,
            informations: {
                ...informations,
                navigator: informations.navigator || "Chrome",
                navigatorMode: informations.navigatorMode || "normal",
            },
            options: options,
        });
    };

    return (
        <div>
            <Paper elevation={0} className={classes.root}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item md={1} xl={1} container alignContent="center" direction="column">
                        <Box display="flex" justifyContent="center">
                            <Web color="primary" />
                        </Box>
                    </Grid>
                    <Grid item md={6} xl={6}>
                        <TextField
                            className={classes.fields}
                            id="url"
                            color="primary"
                            label="Lien"
                            value={state.url}
                            onChange={(e) => setState({ ...state, url: e.target.value })}
                            onBlur={() => {
                                saveInformations();
                            }}
                        />
                    </Grid>

                    <Grid item md={2} xl={2}>
                        <FormControl className={classes.dropDown}>
                            <InputLabel>Action</InputLabel>
                            <Select
                                value={actionType}
                                onChange={(e) => {
                                    setActionType(e.target.value);
                                    setInformations({ ...informations, type: e.target.value });
                                    saveInformations();
                                }}
                            >
                                <MenuItem value="connection">Connexion</MenuItem>
                                <MenuItem value="logOut">Déconnexion</MenuItem>
                                <MenuItem value="click">Click</MenuItem>
                                <MenuItem value="form">Remplir champ(s)</MenuItem>
                                <MenuItem value="verify">Vérifier un contenu</MenuItem>
                                <MenuItem value="visit">Visite simple</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={2}>
                        <Box display="flex" justifyContent="center">
                            {actionType === "visit" ? (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            key="ScreenShot"
                                            name="ScreenShot"
                                            checked={informations.capture || true}
                                            onClick={(e) => {
                                                setInformations({
                                                    capture: e.target.checked,
                                                    type: actionType,
                                                });
                                                saveInformations();
                                            }}
                                        />
                                    }
                                    label="ScreenShot"
                                />
                            ) : (
                                <FormControl>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={showDialog}
                                    >
                                        options
                                    </Button>
                                </FormControl>
                            )}
                        </Box>
                    </Grid>

                    {openDialog && actionType === "connection" ? (
                        /**Dialog connexion */

                        <ConnectionDialog
                            informations={informations}
                            setInformations={setInformations}
                            closeDialog={closeDialog}
                            openDialog={openDialog}
                            saveInformations={saveInformations}
                        />
                    ) : actionType === "logOut" ? (
                        /**Dialog deconnexion */
                        <DisconnectDialog
                            informations={informations}
                            setInformations={setInformations}
                            closeDialog={closeDialog}
                            openDialog={openDialog}
                            saveInformations={saveInformations}
                        />
                    ) : actionType === "click" ? (
                        /**Dialog clicke */

                        <ClickDialog
                            informations={informations}
                            setInformations={setInformations}
                            closeDialog={closeDialog}
                            openDialog={openDialog}
                            saveInformations={saveInformations}
                        />
                    ) : /**Dialog remplir */
                    actionType === "form" ? (
                        <FormDialog
                            informations={informations}
                            setInformations={setInformations}
                            closeDialog={closeDialog}
                            openDialog={openDialog}
                            saveInformations={saveInformations}
                        />
                    ) : (
                        <FormDialog
                            informations={informations}
                            setInformations={setInformations}
                            closeDialog={closeDialog}
                            openDialog={openDialog}
                            saveInformations={saveInformations}
                        />
                    )}

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
                                    openDialog={optionDialog}
                                    setOpenDialog={setOptionDialog}
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

export default WebAction;
