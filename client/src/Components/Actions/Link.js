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
import { Http } from "@material-ui/icons";
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
    dropDown: {
        width: "100%",
    },
    smallAvatar: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
    },
}));
const Link = ({ index, initialSTate }) => {
    const classes = useStyles();
    const { deleteAction, duplicateAction, saveData } = useContext(ActionContext);
    const [state, setState] = useState({ initialSTate });
    const [urlState, setUrlState] = useState("UP");
    const [navigationMode, setnavigationMode] = useState("normal");
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        setState(initialSTate);
        setState(initialSTate);
    }, []);
    const formatUrl = (url) => {
        if (url.startsWith("http") || url.length < 4) {
            //console.log("url est bonne");
            return url;
        } else {
            //console.log("error url");
            return "http://" + url;
        }
    };

    const testConnection = async (e) => {
        const formatedUrl = formatUrl(e.target.value);
        setState({ ...state, url: formatedUrl });

        if (e.target.value !== "") {
            // console.log("accessing ", formatedUrl);

            await fetch(`http://localhost:5000/api/PARPRE/link?url=${formatedUrl}`)
                .then((res) => res.json())
                .then((result) => console.log(result.result))
                .then(() => saveInformations());
        }
    };

    const saveInformations = () => {
        if (state.url === undefined) {
            return;
        }
        saveData({
            index: index,
            type: "link",
            url: state.url,
            informations: {
                urlState: urlState,
                navigationMode: navigationMode,
            },
        });
    };

    return (
        <div>
            <Paper elevation={0} className={classes.root}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item md={1} xl={1} container alignContent="center" direction="column">
                        <Box display="flex" justifyContent="center">
                            <Http color="primary" />
                        </Box>
                    </Grid>

                    <Grid item md={6} xl={6}>
                        <TextField
                            className={classes.fields}
                            id="url"
                            value={state.url}
                            color="primary"
                            label="Lien"
                            onChange={(e) => setState({ ...state, url: formatUrl(e.target.value) })}
                            onBlur={(e) => {
                                //testConnection(e);
                            }}
                        />
                    </Grid>
                    <Grid item md={2} xl={2}>
                        <FormControl className={classes.dropDown}>
                            <InputLabel>Etat du site</InputLabel>
                            <Select
                                value={urlState}
                                onChange={(e) => setUrlState(e.target.value)}
                                onBlur={saveInformations}
                            >
                                <MenuItem value="Down">Down</MenuItem>
                                <MenuItem value="UP">UP</MenuItem>
                                <MenuItem value="Null">Page blanche</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item md={2} xl={2}>
                        <FormControl className={classes.dropDown}>
                            <InputLabel>Navigation</InputLabel>
                            <Select
                                value={navigationMode}
                                onChange={(e) => setnavigationMode(e.target.value)}
                                onBlur={saveInformations}
                            >
                                <MenuItem value="Privée">Privée</MenuItem>
                                <MenuItem value="normal">Normal</MenuItem>
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

export default Link;
