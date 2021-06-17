import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,  Grid, TextField } from "@material-ui/core";
import {  ArrowRight } from "@material-ui/icons";

const ClickDialog = ({saveData,state,setState,closeDialog,openDialog}) => {

    const saveInformations = () =>{
        saveData(
            {
                index:state.index,
                type:"webAction",
                url:state.url,                             
                informations:
                {
                    type:"click",
                    x : state.x,
                    y : state.y, 
                    clickSelector : state.clickSelector, 
                }
            })
    }

    return ( 
        <div>
            <Dialog
                        open={openDialog}
                        onClose={closeDialog}
                        fullWidth
                        onBlur={saveInformations}
                        >
                            <DialogTitle id='dialog-title'>Effectuer un Click </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Le sélecteur est obtenu en faisant un click droit sur le champ à automatiser,  
                                    Inspecter" puis click droit sur l'élément html et "copy selector". 
                                    Ici préciser les coordonnées ou le sélecteur.
                                </DialogContentText>
                                <div>
                                    <Box display="flex" justifyContent="space-around">
                                        <Grid container spacing={1} alignItems="center">
                                            
                                            <Grid container item spacing={2}>
                                                <Box display="flex" justifyContent="inline-block">
                                                <TextField
                                                value={state.informations.x}
                                                variant="outlined"
                                                autoFocus
                                                margin="dense"
                                                id="coords-x"
                                                label="coordonnées X"
                                                autoComplete={false}
                                                onChange={(e) => (setState({...state.informations, x : e.target.value}))}
                                                />
                                                <TextField
                                                value={state.informations.y}
                                                variant="outlined"
                                                autoFocus
                                                margin="dense"
                                                id="coords-y"
                                                label="coordonnées Y"
                                                autoComplete={false}
                                                
                                                onChange={(e) => (setState({...state.informations, y : e.target.value}))}
                                                />
                                                </Box>
                                            </Grid>
                                        </Grid>
    
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item >
                                                <ArrowRight />
                                            </Grid>
                                            <Grid item>
                                            <TextField
                                            value={state.informations.clickSelector}
                                            variant="outlined"                                    
                                            margin="dense"
                                            id="click-selector"
                                            label="Ou selecteur"
                                            onChange={(e) => (setState({...state.informations, clickSelector:e.target.value}))}
                                            />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </div>
    
                            </DialogContent>
                            <DialogActions>
                                <Button onclick = {()=> {closeDialog(); saveInformations()}}>
                                    Confirmer
                                </Button>
                                
                            </DialogActions>
    
                        </Dialog>
                    
        </div>
     );
}
 
export default ClickDialog;