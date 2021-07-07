import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, TextField } from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";
import { useEffect } from "react";

const DisconnectDialog = ({ informations, setInformations, saveInformations, openDialog, closeDialog }) => {
    useEffect(() => {
        setInformations({ ...informations, type: "logOut" })
    }, [])


    return (
        <div>
            <Dialog
                open={openDialog}
                onClose={closeDialog}

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
                                        value={informations.logOut}
                                        variant="outlined"
                                        autoFocus
                                        margin="dense"
                                        id="logout"
                                        label="lien de déconnexion"
                                        autoComplete={false}

                                        onChange={(e) => (setInformations({ ...informations, logOut: e.target.value }))}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} alignItems="center">
                                <Grid item >
                                    <ArrowRight />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        value={informations.logOutSelector}
                                        variant="outlined"
                                        margin="dense"
                                        id="logOut-selector"
                                        label="ou sélecteur"
                                        onChange={(e) => (setInformations({ ...informations, logOutSelector: e.target.value }))}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onclick={() => { closeDialog(); saveInformations() }}>
                        Confirmer
                    </Button>

                </DialogActions>

            </Dialog>

        </div >
    );
}

export default DisconnectDialog;