import {
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Paper,
    Typography,
} from "@material-ui/core";
import {
    Assignment,
    AssignmentTurnedIn,
    InsertDriveFile,
    WatchLaterRounded,
} from "@material-ui/icons";
import { useEffect, useState } from "react";
import DashboardCard from "../Components/Dashboard/DashboardCard";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core";

//Url de contact du server
const url = "http://localhost:5000/api";

const useStyles = makeStyles((theme) => {
    return {
        root: {
            height: "100%",
        },
    };
});

const DashBoard = () => {
    const [documents, setDocuments] = useState([]);
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        document.title = "Dashboard";
        getAlSsa();
    }, []);

    const getAlSsa = () => {
        fetch(`${url}/DashBoard/getAllSSA`)
            .then((res) => res.json())
            .then((result) => setDocuments(result));
    };
    const visitSSA = (ssa) => {
        history.push({
            pathname: "/create",
            state: { name: ssa.name, id: ssa._id },
            fromExcel: false,
        });
    };

    return (
        <div>
            <Container className={classes.root}>
                {/**haut */}
                <Grid container spacing={4}>
                    <Grid item spacing={1} xs={12} sm={6} md={3} lg={3}>
                        <DashboardCard
                            name="PARPRE réalisées"
                            icon={<Assignment color="primary" />}
                            documentNumber={documents.filter((doc) => doc.Arret.length > 0).length}
                        />
                    </Grid>
                    <Grid item spacing={1} xs={12} sm={6} md={3} lg={3}>
                        <DashboardCard
                            name="POS réalisées"
                            icon={<AssignmentTurnedIn color="primary" />}
                            documentNumber={documents.filter((doc) => doc.POS.length > 0).length}
                        />
                    </Grid>
                    <Grid item spacing={1} xs={12} sm={6} md={3} lg={3}>
                        <DashboardCard
                            name="SSA traités"
                            documentNumber={documents.length}
                            icon={<InsertDriveFile color="primary" />}
                        />
                    </Grid>
                    <Grid item spacing={1} xs={12} sm={6} md={3} lg={3}>
                        <DashboardCard
                            name="Plannifiées (******)"
                            documentNumber={0}
                            icon={<WatchLaterRounded color="primary" />}
                        />
                    </Grid>
                </Grid>
                {/**Milieu */}
                <Grid container spacing={4}>
                    <Grid item md={3}>
                        <Paper>
                            <List
                                style={{ minHeight: 500 }}
                                component="nav"
                                subheader={
                                    <ListSubheader color="primary">
                                        SSA récents (Arrêt | Relance | POS)
                                    </ListSubheader>
                                }
                            >
                                {documents &&
                                    documents.map((doc, index) => (
                                        <div>
                                            <ListItem
                                                button
                                                key={index}
                                                onClick={() => visitSSA(doc)}
                                            >
                                                <ListItemText primary={doc.name} />

                                                <Typography>
                                                    {doc.Arret.length} | {doc.Relance.length} |{" "}
                                                    {doc.POS.length}
                                                </Typography>
                                            </ListItem>
                                            <Divider orientation="horizontal" light />
                                        </div>
                                    ))}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default DashBoard;
