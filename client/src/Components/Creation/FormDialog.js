import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,Grid,IconButton,TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";


const FormDialog = ({saveData,closeDialog,openDialog,state,setState}) => {

    const saveInformations = () =>{
        saveData(
            {
                index:state.index,
                type:"webAction",
                url:state.url,                             
                informations:
                {
                    type : "field"                                    
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
                            <DialogTitle id='dialog-title'>Remplir un ou des champs </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Le sélecteur est obtenu en faisant un click droit sur le champ à automatiser,  
                                    Inspecter" puis click droit sur l'élément html et "copy selector". 
                                    Ici préciser le lien de déconnection ou le sélecteur
                                </DialogContentText>
                                <div>
                                    <Box display="flex" justifyContent="space-around">
                                        <Grid container spacing={1} alignItems="center">
                                            
                                            <Grid item>
                                            <TextField
                                            value={state.fields}
                                            variant="outlined"
                                            autoFocus
                                            margin="dense"
                                            label="champ"
                                            autoComplete={false}
                                            
                                            onChange={(e) => (setState({...state, fields:e.target.value}))}
                                            />
                                            </Grid>
                                        </Grid>
    
                                        <Grid container spacing={1} alignItems="center">
                                            
                                            <Grid item>
                                            <TextField
                                            value={state.fieldSelector}
                                            variant="outlined"                                    
                                            margin="dense"
                                            label="sélecteur"
                                            onChange={(e) => (setState({...state, fieldSelector:e.target.value}))}
                                            />
                                            </Grid>
                                        </Grid>
                                    
                                        <IconButton>
                                            <Add />
                                        </IconButton>
                                    
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
 
export default FormDialog;