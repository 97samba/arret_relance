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
    Card,
    CardContent,
    CardHeader,
    Button,
} from "@material-ui/core";
import {
    ArrowForwardIos,
    Assignment,
    AssignmentTurnedIn,
    CheckCircle,
    InsertDriveFile,
    WatchLaterRounded,
} from "@material-ui/icons";
import { useEffect, useState } from "react";
import DashboardCard from "../Components/Dashboard/DashboardCard";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core";
import SSAViewer from "../Components/Dashboard/SSAViewer";
import ENV from "../Env";

//Url de contact du server
const url = ENV.SERVER_API_URI;

const useStyles = makeStyles((theme) => {
    return {
        root: {
            height: "100%",
        },
    };
});

const DashBoard = () => {
    //tous les documents
    const [documents, setDocuments] = useState([]);
    //le SSA en cours de lecture
    const [viewedSSA, setViewedSSA] = useState([]);

    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        document.title = "Dashboard";
        getAllSsa();
    }, []);

    const getAllSsa = () => {
        fetch(`${url}/DashBoard/getAllSSA`)
            .then((res) => res.json())
            .then((result) => {
                setDocuments(result);
                setViewedSSA(result[0]);
            });
    };

    const presentSSA = (ssa) => {
        setViewedSSA(ssa);
    };

    return (
        <div>
            <Container className={classes.root} maxWidth={false}>
                {/**haut */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <DashboardCard
                            name="PARPRE réalisées"
                            icon={<Assignment color="primary" />}
                            documentNumber={documents.filter((doc) => doc.Arret.length > 0).length}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <DashboardCard
                            name="POS réalisées"
                            icon={<AssignmentTurnedIn color="primary" />}
                            documentNumber={documents.filter((doc) => doc.POS.length > 0).length}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <DashboardCard
                            name="SSA traités"
                            documentNumber={documents.length}
                            icon={<InsertDriveFile color="primary" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                        <DashboardCard
                            name="Plannifiées (******)"
                            documentNumber={0}
                            icon={<WatchLaterRounded color="primary" />}
                        />
                    </Grid>
                </Grid>
                {/**Milieu */}
                <Grid container spacing={3}>
                    <Grid item md={6}>
                        <Paper>
                            <List
                                style={{ minHeight: 500 }}
                                component="nav"
                                subheader={
                                    <ListSubheader color="primary">
                                        Tests VABFO récents
                                    </ListSubheader>
                                }
                            >
                                {documents &&
                                    documents.map((doc, index) => (
                                        <div>
                                            <ListItem
                                                button
                                                key={index}
                                                onClick={() => presentSSA(doc)}
                                            >
                                                <ListItemText primary={doc.name} />

                                                <Typography>OK </Typography>
                                                <CheckCircle
                                                    style={{ color: "Green", marginLeft: 5 }}
                                                />
                                            </ListItem>
                                            <Divider orientation="horizontal" light />
                                        </div>
                                    ))}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item md={6}>
                        {viewedSSA !== undefined ? (
                            <SSAViewer state={viewedSSA} />
                        ) : (
                            <Typography>Loading</Typography>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default DashBoard;
