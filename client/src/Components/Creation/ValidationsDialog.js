import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@material-ui/core";
import { Done, Save } from "@material-ui/icons";
import { useState } from "react";

const ValidationDialog = ({ informations, setInformations, generateJson }) => {
    const [generating, setGenerating] = useState(false);
    const [buttonText, setButtonText] = useState("Début du traitement");

    const handleGenerate = async () => {
        setGenerating(true);
        if (informations.nom != "" && informations.prenom != "") {
            var state = await generateJson();
            setButtonText("Enregistrement de la PARPRE");
            await new Promise((res) => setTimeout(res, 1500));
            setButtonText("Enregistrement de la POS");
            await new Promise((res) => setTimeout(res, 1500));
            setButtonText("Création du script d'arrét/Relance");
            await new Promise((res) => setTimeout(res, 2000));
            setButtonText("Enregistré");
            //console.log("state ", state);
            setGenerating(false);
            await new Promise((res) => setTimeout(res, 3000));
            setInformations({ ...informations, open: false });
        }
    };

    return (
        <div>
            <Dialog
                open={informations.open}
                onClose={() =>
                    !generating &&
                    setInformations({ ...informations, open: false })
                }
            >
                <DialogTitle>Informations du Transformers</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Version Transformers : 2.0.4 --- EBO 01/01/2021
                    </DialogContentText>

                    <Typography
                        style={{ marginBottom: 10, fontWeight: "bold" }}
                    >
                        Auteur
                    </Typography>
                    <Grid container spacing={2} direction="row">
                        <Grid item md={6}>
                            <TextField
                                label="Prénom"
                                fullWidth
                                value={informations.prenom}
                                color="primary"
                                onChange={(e) =>
                                    setInformations({
                                        ...informations,
                                        prenom: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                label="Nom"
                                value={informations.nom}
                                fullWidth
                                color="primary"
                                onChange={(e) =>
                                    setInformations({
                                        ...informations,
                                        nom: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                    <Box
                        m={4}
                        display="flex"
                        justifyContent="center"
                        flexDirection="row"
                    >
                        <Button
                            color="primary"
                            disabled={
                                informations.nom == "" ||
                                informations.prenom == "" ||
                                generating
                            }
                            variant="contained"
                            endIcon={<Save />}
                            onClick={handleGenerate}
                        >
                            {generating ? "En cours" : "Générer"}
                        </Button>
                    </Box>
                    {generating || buttonText === "Enregistré" ? (
                        <Box
                            m={4}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography style={{ marginRight: 10 }}>
                                {buttonText}
                            </Typography>

                            {buttonText === "Enregistré" ? (
                                <Done color="primary" />
                            ) : (
                                <CircularProgress size={20} />
                            )}
                        </Box>
                    ) : (
                        <Typography></Typography>
                    )}
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography style={{ fontSize: 10, marginRight: 10 }}>
                            Sfr SN_2.0.4
                        </Typography>
                        <Typography>
                            {new Date().toLocaleString()} -{" "}
                            {informations.prenom} {informations.nom}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ValidationDialog;
