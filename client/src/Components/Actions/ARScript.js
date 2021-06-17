import { Avatar, Box, Grid, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@material-ui/core"
import {makeStyles} from '@material-ui/core'
import { Delete, FileCopy, MoreVert, Description } from "@material-ui/icons"
import { useContext, useState,useEffect } from "react"
import ActionContext from "../../Context/ActionContext"
import OptionMenu from "../Creation/OptionMenu"

const useStyles = makeStyles((theme)=>({
    root:{
        background:'#F6F6FB',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1)

    },
    fields:{
        width:"100%" 
    },
    smallAvatar: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5)
      }
}))
const ARScript = ({index,initialSTate}) => {
    const classes = useStyles()
    const { deleteAction, duplicateAction,saveData,AddServer} = useContext(ActionContext)

    const [state, setState] = useState({initialSTate})

    useEffect(() =>{
        setState(initialSTate)

    },[]
    )

    const saveInformations = () =>{
        if(state.path ===undefined || state.server === undefined){return}
        saveData(
            {
                index:index, type:"script", server : state.server , path : state.path
            }
        )
    }
    return ( 
        <div>
            <Paper 
            elevation={0}
            className= {classes.root}>
                <Grid 
                container
                alignItems="center"
                spacing={2}

                >

                    <Grid  item sm={1} md={1} xl={1}>
                        <Box my="auto" display="flex" justifyContent="center">
                            <Description color="primary" />
                        </Box>
                    </Grid>
                    

                    <Grid  item sm={2} md={2} xl={2}>
                        <TextField
                        value={state.server}

                        onChange={(e) => setState({...state, server:e.target.value})}
                        onBlur={saveInformations}
                        className={classes.fields} 
                        id='server'
                        color='primary'
                        label= 'Serveur' />
                    </Grid>
                    
                    <Grid  item sm={8} md={8} xl={8}>
                        <TextField 
                        onChange={(e) => setState({...state, path:e.target.value})}
                        onBlur={saveInformations}
                        value={state.path}
                        className={classes.fields} 
                        id='Path'
                        color='primary'
                        label= 'Path' 
                        error={state.path === ""}
                        />
                    </Grid>


                    
                    <Grid item md={1} xl={1}  >
                        <Grid container spacing={3} alignItems="center" >
                            <Grid item md={6} >
                                <OptionMenu index={index} deleteAction={deleteAction} duplicateAction={duplicateAction} />
                            </Grid>
                        
                            <Grid item md={6}>
                                <Box my="auto" >
                                    <Avatar className={classes.smallAvatar} >
                                    
                                    <Typography>
                                        {index + 1}
                                    </Typography> 
                                    
                                    
                                    </Avatar>

                                </Box>
                            </Grid>
                        
                    </Grid>
                        </Grid>
                       
                    
                </Grid>
            </Paper>
        </div>
     );
}
 
export default ARScript;