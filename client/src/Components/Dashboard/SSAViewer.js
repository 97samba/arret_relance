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

const SSAViewer = ({ state, image }) => {
    // const [state, setState] = useState();
    const [docInformations, setDocInformations] = useState([
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
    ]);

    const history = useHistory();
    useEffect(() => {
        var newState = docInformations;
        state.Arret &&
            newState.map((doc) => {
                var number = state.Arret.filter((element) => element.type === doc.type).length;
                doc.number = number;
            });
        setDocInformations(newState);
    }, [state]);

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
                        <List>
                            {docInformations.map(
                                (doc, index) =>
                                    doc.number > 0 && (
                                        <div>
                                            <ListItem>
                                                <ListItemText primary={doc.name} />
                                                <Typography>{doc.number}</Typography>
                                            </ListItem>
                                            <Divider orientation="horizontal" light />
                                        </div>
                                    )
                            )}
                        </List>
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
                                    alt="title"
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
