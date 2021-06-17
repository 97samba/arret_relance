import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, Grid, TextField, Typography } from "@material-ui/core";

const OptionDialog = ({openDialog,closeDialog}) => {
    
    const envs = [
        {name:"Production",checked:true},
        {name:"Validation",checked:true},
        {name:"Integration",checked:true},
        {name:"Développement",checked:true}
    ]
    return ( 
        <div>
            <Dialog
                    open={openDialog}
                    onClose={closeDialog}
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
                                                { envs.map(env =>(
                                                    <FormControlLabel 
                                                    control={<Checkbox key = {env.name} name={env.name} checked={env.checked} />}
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
                                        <FormGroup row>
                                                
                                                <FormControlLabel 
                                                control={<Checkbox name="Oui" checked/>}
                                                label="Oui"
                                                />
                                                <FormControlLabel 
                                                control={<Checkbox name="Non" />}
                                                label="Non"
                                                />
                                                                                             
                                                
                                            </FormGroup>

                                        </Grid>
                                        <Grid item md={12}>
                                            <Typography>*N'arrête pas l'exécution de Jenkins*</Typography>

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
                            <Button>
                                Confirmer
                            </Button>
                            
                        </DialogActions>

                    </Dialog>
                    
        </div>
     );
}
 
export default OptionDialog;