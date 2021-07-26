import { Button, CardActionArea, makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
        flexGrow: theme.spacing(1),
    },
    fields: {
        padding: theme.spacing(2),
        display: "flex",
        justifyContent: "space-between",
    },
}));
const ListSSA = ({ ssa, fromExcel, setLoading }) => {
    const url = "http://localhost:5000/api";
    const history = useHistory();

    const classes = useStyles();

    useEffect(() => {
        //console.log(ssa)
    });

    const visitPOS = (ssa) => {
        const futureState = fromExcel ? ssa : { name: ssa.name, id: ssa._id };
        history.push({
            pathname: "/create",
            state: futureState,
            fromExcel: fromExcel,
        });
    };

    const testSSA = (ssa) => {};

    return (
        <div>
            <Card className={classes.root} elevation={0.5}>
                <CardActionArea
                    onClick={() => {
                        setLoading(true);
                        visitPOS(ssa);
                    }}
                >
                    <CardContent>
                        <Grid container direction="row">
                            <Grid item xs={1} md={1} sm={1}>
                                <Avatar>
                                    {ssa.name.split("_").length > 1
                                        ? ssa.name
                                              .split("_")[1][0]
                                              .toUpperCase()
                                        : ssa.name[0].toUpperCase()}
                                </Avatar>
                            </Grid>

                            <Grid item xs={3} md={3} sm={3}>
                                <Typography> {ssa.name}</Typography>
                            </Grid>
                            <Grid item xs={2} md={1} sm={1}>
                                <Typography>
                                    {" "}
                                    {ssa.Arret.length} - {ssa.Relance.length}
                                </Typography>
                            </Grid>
                            <Grid item xs={2} md={2} sm={2}>
                                <Typography> {ssa.auteur}</Typography>
                            </Grid>
                            <Grid item xs={2} md={2} sm={2}>
                                <Typography>
                                    {" "}
                                    {new Date(ssa.createdAt).toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={2} md={3} sm={2}>
                                <Grid
                                    spacing={1}
                                    container
                                    justify="space-around"
                                    alignContent="center"
                                >
                                    <Grid item md={5}>
                                        <Button
                                            variant="outlined"
                                            color="default"
                                            onClick={() => visitPOS(ssa)}
                                        >
                                            PARPRE/POS
                                        </Button>
                                    </Grid>
                                    <Grid item md={4}>
                                        {!fromExcel ? (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => testSSA(ssa)}
                                            >
                                                Tester
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => testSSA(ssa)}
                                            >
                                                Importer
                                            </Button>
                                        )}
                                    </Grid>
                                    <Grid item md={3}>
                                        <Button>
                                            <Delete color="secondary" />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
};

export default ListSSA;
