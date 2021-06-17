import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, TextField } from "@material-ui/core";
import {  ArrowRight } from "@material-ui/icons";

const DisconnectDialog = ({saveData,closeDialog,openDialog,state,setState}) => {

    const saveInformations = () =>{
        saveData(
            {
                index:state.index,
                type:"webAction",
                url:state.url,
                informations:
                {
                    type: "logOut",
                    logOut : state.logOut,
                    logOutSelector : state.logOutSelector, 
                    
                }
            })
    }

    return ( 
        <div>
            <Dialog
                    open={openDialog}
                    onClose={closeDialog}
                    fullWidth={200}
                    onBlur={saveInformations}
                    >
                        <DialogTitle id='dialog-title'>Déconnexion </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Le sélecteur est obtenu en faisant un click droit sur le champ à automatiser,  
                                Inspecter" puis click droit sur l'élément html et "copy selector". 
                                Ici préciser le lien de déconnection ou le sélecteur
                            </DialogContentText>
                            <div>
                                <Box display="flex" justifyContent="space-around">
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item >
                                            <Link />
                                        </Grid>
                                        <Grid item>
                                        <TextField
                                        value={state.informations.logOut}
                                        variant="outlined"
                                        autoFocus
                                        margin="dense"
                                        id="logout"
                                        label="lien de déconnexion"
                                        autoComplete={false}
                                        
                                        onChange={(e) => (setState({...state.informations, logOut:e.target.value}))}
                                        />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item >
                                            <ArrowRight />
                                        </Grid>
                                        <Grid item>
                                        <TextField
                                        value={state.informations.logOutSelector}
                                        variant="outlined"                                    
                                        margin="dense"
                                        id="logOut-selector"
                                        label="ou sélecteur"
                                        onChange={(e) => (setState({...state.informations, logOutSelector:e.target.value}))}
                                        />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>

                        </DialogContent>
                        <DialogActions>
                            <Button onclick = {closeDialog}>
                                Confirmer
                            </Button>
                            
                        </DialogActions>

                    </Dialog>
                    
        </div>
     );
}
 
export default DisconnectDialog;