import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup,  Grid, Slider, TextField, Typography } from "@material-ui/core";
import { FormControl } from "@material-ui/core"

import { useEffect, useState } from "react";

const OptionDialog = ({ options, saveInfos, setOptions, openDialog, setOpenDialog }) => {

    useEffect(() => {
        setOptions({...options,timeOut:timeOut})
    },[])
    const [block, setBlock] = useState(true)
    const [timeOut, setTimeOut] = useState(0)

    const marks = [
        {
            value:0,
            label:'0 s'
        },
        {
            value:2,
            label:'2 s'
        },
        {
            value:4,
            label:'4 s'
        },
        {
            value:6,
            label:'6 s'
        },
        {
            value:8,
            label:'8 s'
        },
        {
            value:10,
            label:'10 s'
        },
    ]

    return (
        <div>
            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    saveInfos()
                }}
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
                                        <FormControlLabel
                                            control={<Checkbox
                                                key="prod"
                                                name="prod"
                                                checked={options.prod}
                                                onClick={(e) => setOptions({ ...options, prod: e.target.checked })}
                                            />}
                                            label="Production"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                key="hprod"
                                                name="hprod"
                                                checked={options.hprod}
                                                onClick={(e) => setOptions({ ...options, hprod: e.target.checked })}
                                            />}
                                            label="Validation"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                key="prod"
                                                name="prod"
                                                checked={options.inte}
                                                onClick={(e) => setOptions({ ...options, inte: e.target.checked })}
                                            />}
                                            label="Intégration"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                key="prod"
                                                name="prod"
                                                checked={options.dev}
                                                onClick={(e) => setOptions({ ...options, dev: e.target.checked })}
                                            />}
                                            label="Développement"
                                        />

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
                                    <Typography>Sleep :</Typography>
                                </Grid>
                                <Grid item md={6}>
                                    <FormControl fullWidth>
                                        <Slider
                                            defaultValue={0}
                                            value={timeOut}
                                            aria-labelledby="continuous-slider"
                                            max={10}
                                            step={2}
                                            marks={marks}
                                            onChange={(e,value)=>setTimeOut(value)}
                                        />
                                    </FormControl>
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
                    <Button >
                        Confirmer
                    </Button>

                </DialogActions>

            </Dialog>

        </div>
    );
}

export default OptionDialog;