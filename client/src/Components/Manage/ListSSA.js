import { Button, CardActionArea, CardActions, IconButton, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import {Avatar,  Card, CardContent, Grid, Typography} from '@material-ui/core'
import { Delete } from '@material-ui/icons';
import { useHistory } from 'react-router';




const useStyles = makeStyles((theme)=>({
    root:{
        margin:theme.spacing(1),
        flexGrow:theme.spacing(1)

    },
    fields:{
        padding:theme.spacing(2),
        display:'flex',
        justifyContent:'space-between'
    },
    
}))
const ListSSA = ({ssa}) => {
    const url = "http://localhost:5000/api"
    const history = useHistory()

    const classes = useStyles()

    useEffect(()=>{
        //console.log(ssa)
    })

    const visitPOS = (ssa) =>{
        console.log("ssa ",ssa)
        history.push({
            pathname:'/create',
            state : ssa
        })
    }
    const getAPOS = (id) =>{
        fetch(`${url}/getAPOS?id=${id}`)
            .then(Response=> Response.json())
            .then(result => visitPOS(result))
    }
    const testSSA = (ssa) =>{
        history.push({
            pathname:'/testSSA',
            state : ssa
        })
    }

    return ( 
        <div>
            <Card className={classes.root} elevation={0.5}>
            <CardActionArea >

                <CardContent  >
 
                <Grid container direction="row">
                    <Grid item xs={1} md={1} sm={1} >
                        <Avatar onClick={()=>console.log("ssa clicked")}>
                            {
                                ssa.name.split("_").length > 1 
                                ?ssa.name.split("_")[1][0]
                                :ssa.name[0]
                            }
                            
                        
                        </Avatar>
                    </Grid>
                    
                    <Grid item xs={3} md={3} sm={3}  >
                        <Typography> {ssa.name}</Typography>
                    </Grid>
                    <Grid item xs={2} md={1} sm={1}  >
                    <Typography> {ssa.Arret.length} - {ssa.Relance.length}</Typography>
                    </Grid>
                    <Grid item xs={2} md={2} sm={2}  >
                    <Typography> {ssa.auteur}</Typography>
                    </Grid>
                    <Grid item xs={2} md={2} sm={2}  >
                    <Typography> {ssa.date_de_creation}</Typography>
                    </Grid>
                    <Grid item xs={2} md={3} sm={2} >
                        <Grid spacing={1} container justify="space-around" alignContent="center">
                            <Grid item md={5}>
                                <Button variant="outlined" color="default" onClick={() => visitPOS(ssa)}>PARPRE/POS</Button>
                            </Grid>
                            <Grid item md={4}>
                                <Button variant="outlined" color="primary" onClick={()=>testSSA(ssa)}>Test</Button>
                            </Grid>
                            <Grid item md={3}>
                                    <Button >
                                        <Delete color="secondary"/>
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
}
 
export default ListSSA;