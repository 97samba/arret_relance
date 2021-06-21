import { Button, Grid, IconButton, InputBase, makeStyles, Paper, Typography } from '@material-ui/core'
import { useEffect, useState } from 'react';
import { Add, ArrowBack, ArrowForward, SearchSharp } from '@material-ui/icons';
import ListSSA from '../Components/Manage/ListSSA';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),

    },
    fields: {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-between'
    },
    head: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3)

    }
}))


const Manage = () => {
    const url = "http://localhost:5000/api"
    const [POS, SetPOS] = useState([])
    const [ExcelTab, SetExcelTab] = useState(false)
    const [allExcel, setAllExcel] = useState([])

    useEffect(() => {
        document.title = "Modify"        
        getAllPos()
        GetAllExcel()
        
    }, [])


    const GetAllExcel =() =>{
            
        axios.post(`http://localhost:5000/api/ConvertAll-Excel`)
            .then(res =>  {setAllExcel(res.data); console.log("data ",res.data)})
            
    }

    const classes = useStyles()

    const getAllPos = async () => {
        await fetch(`${url}/AllPOS`)
            .then(Response => Response.json())
            .then(result => {
                //console.log(result)
                SetPOS(result)
            })

    }



    return (
        <div>
            <div className={classes.head}>
                <Grid container spacing={2}>
                    <Grid item sm={4}>
                        <Button
                            startIcon={
                                ExcelTab ? <ArrowBack /> : <ArrowForward />
                            }
                            variant="contained"
                            elevation={0}
                            onClick={() => SetExcelTab(!ExcelTab)}

                        > {!ExcelTab
                            ? `Importés depuis Excel ( ${allExcel.length} )`
                            : `Enregistrés ( ${POS.length} )`

                            }

                        </Button>
                    </Grid>
                    <Grid item sm={3}>
                        <Paper component="form" elevation={1} >
                            <IconButton aria-label="menu">
                                <SearchSharp />
                            </IconButton>
                            <InputBase

                                placeholder="Rechercher une SSA"
                            />

                        </Paper>
                    </Grid>
                    {/*
                    <Grid item sm={3}>
                        
                        
                        
                       
                        <FormControl size="medium" variant="filled">
                            <InputLabel id="filter">Filter par</InputLabel>
                            <Select labelId="filter" value="filtre" >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="nom">Nom</MenuItem>
                                <MenuItem value={20}>Type</MenuItem>
                                <MenuItem value={30}>état</MenuItem>
                            </Select>
                        </FormControl>
                        
                    </Grid>
                     */}
                </Grid>
            </div>

            <div>
                <Grid style={{ padding: 5 }} container direction="row" className={classes.root}>
                    <Grid item xs={3} md={1} sm={1} >
                        <Typography>Code</Typography>
                    </Grid>

                    <Grid item xs={3} md={3} sm={3}  >
                        <Typography> Nom</Typography>
                    </Grid>

                    <Grid item xs={3} md={1} sm={1}  >
                        <Typography> Etapes</Typography>
                    </Grid>

                    <Grid item xs={3} md={2} sm={2}  >
                        <Typography> Auteur</Typography>
                    </Grid>

                    <Grid item xs={3} md={2} sm={2}  >
                        <Typography> Date de création </Typography>
                    </Grid>

                    <Grid item xs={3} md={3} sm={3} spacing={1} container justify="center">
                        <Typography>Actions</Typography>
                    </Grid>
                </Grid>
                {
                    ExcelTab  ?
                        (
                            allExcel.length > 0 ?
                            (
                                allExcel.map(excel => (
                                <ListSSA ssa={excel} key={excel._id} />
                            ))  
                            )  :
                            (
                                <Typography>Chargement</Typography>
                            )                       

                        )
                        :
                        (
                            POS.map(pos => (
                                <ListSSA ssa={pos} key={pos._id} />
                            ))
                        )

                }

            </div>

        </div>
    );
}

export default Manage;