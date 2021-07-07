import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";
import { useEffect } from "react";

const ClickDialog = ({ informations, setInformations, saveInformations, openDialog, closeDialog }) => {

    useEffect(()=>{
        setInformations({...informations, type:"click"})
    },[])

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
                                            value={informations.x}
                                            variant="outlined"
                                            autoFocus
                                            margin="dense"
                                            id="coords-x"
                                            label="coordonnées X"
                                            autoComplete={false}
                                            onChange={(e) => (setInformations({ ...informations, x: e.target.value }))}
                                        />
                                        <TextField
                                            value={informations.y}
                                            variant="outlined"
                                            autoFocus
                                            margin="dense"
                                            id="coords-y"
                                            label="coordonnées Y"
                                            autoComplete={false}

                                            onChange={(e) => (setInformations({ ...informations, y: e.target.value }))}
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
                                        value={informations.clickSelector}
                                        variant="outlined"
                                        margin="dense"
                                        id="click-selector"
                                        label="Ou selecteur"
                                        onChange={(e) => (setInformations({ ...informations, clickSelector: e.target.value }))}
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

        </div>
    );
}

export default ClickDialog;