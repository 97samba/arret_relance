import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useEffect } from "react";


const FormDialog = ({ informations, setInformations, saveInformations, openDialog, closeDialog }) => {

    useEffect(() => {
        setInformations({...informations, type:"form"})
        console.log("updated de dialog form")
    }, [])

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
                                        value={informations.field}
                                        variant="outlined"
                                        autoFocus
                                        margin="dense"
                                        label="Valeur"
                                        autoComplete={true}

                                        onChange={(e) => (setInformations({ ...informations, field: e.target.value }))}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} alignItems="center">

                                <Grid item>
                                    <TextField
                                        value={informations.fieldSelector}
                                        variant="outlined"
                                        margin="dense"
                                        label="sélecteur"
                                        autoComplete
                                        onChange={(e) => (setInformations({ ...informations, fieldSelector: e.target.value }))}
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
                    <Button onclick={() => { closeDialog(); saveInformations() }}>
                        Confirmer
                    </Button>

                </DialogActions>

            </Dialog>

        </div>
    );
}

export default FormDialog;