import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    TextField,
    Typography,
} from "@material-ui/core";
import { FormControl } from "@material-ui/core";

import { useEffect, useState } from "react";

const OptionDialog = ({ options, saveInfos, setOptions, openDialog, setOpenDialog }) => {
    useEffect(() => {
        setOptions({ ...options, timeOut: timeOut });
    }, []);

    const [block, setBlock] = useState(true);
    const [timeOut, setTimeOut] = useState(0);
    const marks = [
        {
            value: 0,
            label: "0 s",
        },
        {
            value: 5,
            label: "5 s",
        },
        {
            value: 10,
            label: "10 s",
        },
        {
            value: 20,
            label: "20 s",
        },
        {
            value: 30,
            label: "30 s",
        },
        {
            value: 40,
            label: "40 s",
        },
    ];

    return (
        <div>
            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    saveInfos();
                }}
                fullWidth
            >
                <DialogTitle id="dialog-option">Options </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Personnaliser votre éxécution en fonction des environnements.
                    </DialogContentText>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Grid container>
                                <Grid item>
                                    <Typography>Environnement :</Typography>
                                </Grid>
                                <Grid item>
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    key="prod"
                                                    name="prod"
                                                    checked={options.prod}
                                                    onClick={(e) =>
                                                        setOptions({
                                                            ...options,
                                                            prod: e.target.checked,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Production"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    key="hprod"
                                                    name="hprod"
                                                    checked={options.hprod}
                                                    onClick={(e) =>
                                                        setOptions({
                                                            ...options,
                                                            hprod: e.target.checked,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Validation"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    key="prod"
                                                    name="prod"
                                                    checked={options.inte}
                                                    onClick={(e) =>
                                                        setOptions({
                                                            ...options,
                                                            inte: e.target.checked,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Intégration"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    key="prod"
                                                    name="prod"
                                                    checked={options.dev}
                                                    onClick={(e) =>
                                                        setOptions({
                                                            ...options,
                                                            dev: e.target.checked,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Développement"
                                        />
                                    </FormGroup>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Divider orientation="horizontal" light />

                        <Grid item>
                            <Grid container alignItems="flex-end" direction="row" spacing={2}>
                                <Grid item md={6}>
                                    <Typography>Systéme d'exploitation</Typography>
                                </Grid>
                                <Grid item md={6}>
                                    <FormControl style={{ width: "100%" }}>
                                        <InputLabel>OS</InputLabel>

                                        <Select
                                            value={options.os || "null"}
                                            label="OS"
                                            fullWidth
                                            onChange={(e) => {
                                                setOptions({ ...options, os: e.target.value });
                                            }}
                                        >
                                            <MenuItem value="linux">Linux</MenuItem>
                                            <MenuItem value="windows">Windows</MenuItem>
                                            <MenuItem value="null">Non défini</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider orientation="horizontal" light style={{ marginTop: 10 }} />

                        <Grid item>
                            <Grid container alignItems="center" direction="row" spacing={2}>
                                <Grid item md={6}>
                                    <Typography>Sleep :</Typography>
                                </Grid>
                                <Grid item md={6}>
                                    <FormControl fullWidth>
                                        <Slider
                                            defaultValue={0}
                                            value={timeOut}
                                            aria-labelledby="continuous-slider"
                                            max={40}
                                            //step={2}
                                            marks={marks}
                                            onChange={(e, value) => setTimeOut(value)}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Divider orientation="horizontal" light />

                        <Grid item>
                            <Grid container alignItems="center" direction="row" spacing={2}>
                                <Grid item md={6}>
                                    <Typography>Resultat attendu :</Typography>
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        label="Résultat"
                                        variant="filled"
                                        fullWidth
                                    ></TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button>Confirmer</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OptionDialog;
