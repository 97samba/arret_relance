import { Button, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import {Avatar,  Card, CardContent, Grid, Typography} from '@material-ui/core'


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

    const classes = useStyles()

    const getAPOS = (id) =>{
        fetch(`${url}/getAPOS?id=${id}`)
            .then(Response=> Response.json())
            .then(result => console.log("pos : ",result))
    }
    return ( 
        <div>
            <Card className={classes.root} elevation={0.5}>
                <CardContent  > 
                <Grid container direction="row">
                    <Grid item xs={3} sm={1} >
                    <Avatar>{ssa.name[0]}</Avatar>
                    </Grid>
                    <Grid item xs={3} sm={3}  >
                    <Typography> {ssa.name}</Typography>
                    </Grid>
                    <Grid item xs={3} sm={1}  >
                    <Typography> {ssa.Arret.length}</Typography>
                    </Grid>
                    <Grid item xs={3} sm={2}  >
                    <Typography> {ssa.auteur}</Typography>
                    </Grid>
                    <Grid item xs={3} sm={2}  >
                    <Typography> {ssa.date_de_creation}</Typography>
                    </Grid>
                    <Grid item xs={3} sm={3} spacing={1} container justify="flex-end">
                        <Grid item>
                            <Button variant="outlined" color="default">PARPRE</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={()=>getAPOS(ssa._id)}>POS</Button>
                        </Grid>
                    </Grid>
                    
                </Grid>
                </CardContent>
            </Card>
        </div>
     );
}
 
export default ListSSA;