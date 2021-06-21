import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, Grid, TextField, Typography } from "@material-ui/core";
import { FormControl, InputLabel, MenuItem,  Select } from "@material-ui/core"

import { useState } from "react";

const OptionDialog = ({ options, saveInfos, setOptions, openDialog, closeDialog }) => {

    const [block, setBlock] = useState(true)
    const [envs, setEnvs] = useState([
        { name: "Production", checked: true },
        { name: "Validation", checked: true },
        { name: "Intégration", checked: true },
        { name: "Développement", checked: true }
    ])

    const checkEnv = (environnement) => {
        var newEnvs = envs.map(env => {
            env.name === environnement
                ? env.checked = !env.checked
                : env.checked = env.checked
            return env
        })
        setEnvs(newEnvs)
    }

    const save=()=>{
        setOptions({
            ...options,
            block:block,
            environnements:{
                prod:envs[0].checked,
                hprod:envs[1].checked,
                inte:envs[2].checked,
                dev:envs[3].checked,
            }
        })
    }

    return (
        <div>
            <Dialog
                open={openDialog}
                onClose={() => {closeDialog();save();saveInfos()}}
                fullWidth
            >
                <DialogTitle id='dialog-option' >Options </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Personnaliser votre éxécution en fonction des environnements.
                    </DialogContentText>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Grid container>
                                <Grid item >
                                    <Typography>Environnement :</Typography>

                                </Grid>
                                <Grid item>
                                    <FormGroup row>
                                        {envs.map(env => (
                                            <FormControlLabel
                                                control={<Checkbox
                                                    key={env.name}
                                                    name={env.name}
                                                    checked={env.checked}
                                                    onClick={(e) => checkEnv(e.target.name)}
                                                />}
                                                label={env.name}
                                            />
                                        ))}

                                    </FormGroup>

                                </Grid>

                            </Grid>

                        </Grid>

                        <Divider orientation="horizontal" />


                        <Grid item>
                            <Grid container alignItems="center" direction="row" spacing={2} >
                                <Grid item md={6} >
                                    <Typography>Resultat attendu :</Typography>

                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        label="Résultat"
                                        variant="filled"
                                        fullWidth
                                    >
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider orientation="horizontal" />

                        <Grid item>
                            <Grid container alignItems="center" direction="row" spacing={2} >
                                <Grid item md={6} >
                                    <Typography>Bloquante :</Typography>
                                </Grid>
                                <Grid item md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Execution Bloquante *</InputLabel>
                                        <Select
                                            value={block}
                                            onChange={(e) => setBlock(e.target.value)}
                                        >
                                            <MenuItem value={true}>Oui</MenuItem>
                                            <MenuItem value={false}>Non</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12}>
                                    <Typography>*Arrête ou pas, l'exécution de Jenkins*</Typography>

                                </Grid>
                            </Grid>
                        </Grid>


                        <Divider orientation="horizontal" />

                        <Grid item>
                            <Grid container alignItems="center" direction="row" spacing={2} >
                                <Grid item md={6} >
                                    <TextField
                                        label="Login"
                                        variant="filled"
                                        fullWidth
                                    >

                                    </TextField>

                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        label="Mot de passe"
                                        variant="filled"
                                        type="password"
                                        fullWidth
                                    >

                                    </TextField>
                                </Grid>

                            </Grid>
                        </Grid>

                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={save}>
                        Confirmer
                    </Button>

                </DialogActions>

            </Dialog>

        </div>
    );
}

export default OptionDialog;