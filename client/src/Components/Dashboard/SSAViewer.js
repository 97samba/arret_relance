import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { ArrowForwardIos } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ENV from "../../Env";

const SSAViewer = ({ state }) => {
    // const [state, setState] = useState();
    var docInformations = [
        { type: "service", name: "Service(s)" },
        { type: "process", name: "Processus" },
        { type: "link", name: "Lien(s)" },
        { type: "database", name: "Base de données" },
        { type: "script", name: "Script(s)" },
        { type: "command", name: "Commande(s)" },
        { type: "log", name: "Recherche de Log" },
        { type: "disk", name: "Disque(s)" },
        { type: "IIS", name: "Pool IIS" },
        { type: "rename", name: "Renommer un fichier" },
    ];

    const history = useHistory();

    const visitSSA = (ssa) => {
        history.push({
            pathname: "/create",
            state: { name: ssa.name, id: ssa._id },
            fromExcel: false,
        });
    };

    return (
        <div>
            <Card>
                <CardHeader
                    title={state.name || "Sélectionner un SSA"}
                    subheader="Description du SSA et captures d'écran de la POS"
                    action={
                        <Button
                            variant="text"
                            color="primary"
                            endIcon={<ArrowForwardIos />}
                            onClick={() => state && visitSSA(state)}
                        >
                            consulter
                        </Button>
                    }
                />
                <CardContent>
                    <Typography>PARPRE de {state.name}</Typography>
                    {state.Arret !== undefined ? (
                        // <List>
                        //     {docInformations.map((doc, index) => (
                        //         <div>
                        //             <ListItem key={index}>
                        //                 <ListItemText primary={doc.name} />
                        //                 <Typography>
                        //                     {
                        //                         state.Arret.filter(
                        //                             (element) => element.type === doc.name
                        //                         ).length
                        //                     }
                        //                 </Typography>
                        //             </ListItem>
                        //             <Divider orientation="horizontal" light />
                        //         </div>
                        //     ))}
                        // </List>
                        <div>
                            <List>
                                <ListItem key={0}>
                                    <ListItemText primary="Arrêt" />
                                    <Typography>{state.Arret.length}</Typography>
                                </ListItem>
                                <Divider light orientation="horizontal" />
                                <ListItem key={1}>
                                    <ListItemText primary="Relance" />
                                    <Typography>{state.Relance.length}</Typography>
                                </ListItem>
                                <Divider light orientation="horizontal" />
                                <ListItem key={2}>
                                    <ListItemText primary="POS" />
                                    <Typography>{state.POS.length}</Typography>
                                </ListItem>
                                <Divider light orientation="horizontal" />
                            </List>
                        </div>
                    ) : (
                        <Typography> Pas de SSA</Typography>
                    )}
                    <Typography>VABFO : Captures (s)</Typography>
                    {state.POS &&
                        state.POS.filter((element) => element.type === "webAction").map(
                            (step, index) => (
                                <img
                                    //src="'../../../server/Powershell/test_container_1-8.png'"
                                    key={index}
                                    src={`${ENV.SERVER_URI}/Images/${state.name}-${step.index}.png`}
                                    alt={`${state.name}-${step.index}`}
                                    height={800 / 3.2}
                                    width={1900 / 3.2}
                                    style={{ marginTop: 10 }}
                                />
                            )
                        )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SSAViewer;
