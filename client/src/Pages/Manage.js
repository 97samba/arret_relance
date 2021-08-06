import {
    Box,
    Button,
    Grid,
    makeStyles,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    Divider,
    TextField,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import ListSSA from "../Components/Manage/ListSSA";
import axios from "axios";
import { Autocomplete } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import ENV from "../Env";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
    },
    fields: {
        padding: theme.spacing(2),
        display: "flex",
        justifyContent: "space-between",
    },
    head: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
}));

const Manage = () => {
    const url = ENV.SERVER_API_URI;
    const [POS, SetPOS] = useState([]);
    const [ExcelTab, SetExcelTab] = useState(false);
    const [allExcel, setAllExcel] = useState([]);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        document.title = "Modify";
        getAllPos();
    }, []);

    const GetAllExcel = () => {
        setLoading(true);

        axios.post(`${ENV.SERVER_API_URI}/ConvertAll-Excel`).then((res) => {
            setAllExcel(res.data);
            // console.log("data ", res.data);
            setLoading(false);
        });
    };

    const classes = useStyles();

    const getAllPos = async () => {
        setLoading(true);
        await fetch(`${url}/AllPOS`)
            .then((Response) => Response.json())
            .then((result) => {
                //console.log(result)
                SetPOS(result);
                setLoading(false);
            });
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
            <div className={classes.head}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item sm={4}>
                        {ExcelTab ? (
                            <Button
                                startIcon={<ArrowBack />}
                                variant="contained"
                                elevation={0}
                                onClick={() => SetExcelTab(!ExcelTab)}
                            >
                                Retour ({POS.length})
                            </Button>
                        ) : (
                            <Button
                                endIcon={<ArrowForward />}
                                variant="contained"
                                elevation={0}
                                onClick={() => {
                                    SetExcelTab(!ExcelTab);
                                    allExcel.length === 0 && GetAllExcel();
                                }}
                                style={{ background: "#a6db9e" }}
                            >
                                Convertir un Excel ({allExcel.length})
                            </Button>
                        )}
                    </Grid>
                    <Grid item sm={3}>
                        <Autocomplete
                            id="autocomplete-ssa"
                            onChange={(event, newDoc) => {
                                visitSSA(newDoc);
                            }}
                            options={POS}
                            getOptionLabel={(option) => option.name}
                            noOptionsText="SSA inconnu"
                            style={{ width: 300 }}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Rechercher un SSA"
                                    fullWidth
                                    style={{ background: "white" }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item sm={5}>
                        <Box display="flex" justifyContent="center">
                            <Typography variant="h6" color="primary">
                                {ExcelTab ? "Transformers Excel" : "Transformers format Web"}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </div>

            <div>
                <Divider light />
                <Grid style={{ padding: 5 }} container direction="row" className={classes.root}>
                    <Grid item xs={3} md={1} sm={1}>
                        <Typography>Code</Typography>
                    </Grid>

                    <Grid item xs={3} md={3} sm={3}>
                        <Typography> Nom</Typography>
                    </Grid>

                    <Grid item xs={3} md={1} sm={1}>
                        <Typography> Etapes</Typography>
                    </Grid>

                    <Grid item xs={3} md={2} sm={2}>
                        <Typography> Auteur</Typography>
                    </Grid>

                    <Grid item xs={3} md={2} sm={2}>
                        <Typography> Date de création </Typography>
                    </Grid>

                    <Grid item xs={3} md={3} sm={3} spacing={1} container justify="center">
                        <Typography>Actions</Typography>
                    </Grid>
                </Grid>

                <div>
                    <Dialog open={loading} style={{ minHeight: 100, minWidth: 100 }}>
                        <Box
                            display="flex"
                            alignContent="center"
                            alignItems="center"
                            justifyContent="center"
                            m={2}
                        >
                            <CircularProgress style={{ marginLeft: 10 }} />
                        </Box>
                        <DialogTitle>
                            {ExcelTab
                                ? "Conversion des fichiers Excel en format Web"
                                : "Chargement des documents de la base"}
                        </DialogTitle>
                    </Dialog>
                </div>

                <div>
                    {ExcelTab ? (
                        allExcel.length > 0 ? (
                            allExcel
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((excel) => (
                                    <ListSSA
                                        ssa={excel}
                                        fromExcel={true}
                                        key={excel._id}
                                        setLoading={setLoading}
                                    />
                                ))
                        ) : (
                            <div>chargement</div>
                        )
                    ) : (
                        POS.sort((a, b) => a.name.localeCompare(b.name)).map((pos) => (
                            <ListSSA
                                ssa={pos}
                                key={pos._id}
                                fromExcel={false}
                                setLoading={setLoading}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Manage;
