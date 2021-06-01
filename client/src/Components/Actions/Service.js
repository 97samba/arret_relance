import { Box, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@material-ui/core"
import {makeStyles} from '@material-ui/core'
import { Comment, Delete, FileCopy, MoreVert, SettingsSharp } from "@material-ui/icons"
import axios from "axios"
import { useContext, useState } from "react"
import ActionContext from "../../Context/ActionContext"

const useStyles = makeStyles((theme)=>({
    root:{
        background:'#F6F6FB',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1)

    },
    fields:{
        marginRight:theme.spacing(2)
    }
}))
const Service = ({actionID,index}) => {
    const classes = useStyles()
    const [anchorEl, setAnchor] = useState(null)
    const { deleteAction, duplicateAction,saveData} = useContext(ActionContext)
    const [action, setAction] = useState('STOP')
    const [state, setState] = useState([])
    const [pingState, setPingState] = useState('ok')

    const handleClick = (event) =>{
        setAnchor(event.currentTarget)
    }
    const handleClose= () => {
        setAnchor(null)
    }
    const reduire = () =>{

        
    }

    const testPing = async (e,server) =>{
        var error=''
        
        await fetch(`http://localhost:5000/api/PARPRE?server=${server}`)
            .then(res => res.json())
            .then(result => {setPingState(result); console.log(result.result); error= result}
        )
        
  
    }


    return ( 
        <div>
            <Paper 
                elevation={0}
                className= {classes.root}>
                    <Box 
                display='flex'
                justifyContent='space-between'

                >
                    <Box my="auto">
                        <SettingsSharp color="primary" />

                    </Box>
                    <div>
                        <TextField
                        
                        className={classes.fields} 
                        id='server'
                        
                        color='primary'
                        label= 'Serveur'
            
                        onChange={(e) => setState({...state, server:e.target.value})}
                        onBlur={(e) => (testPing(e,e.target.value))
                        }

                        />
                    </div>
                    <div>
                        <TextField 
                        className={classes.fields} 

                        id='login'
                        color='primary'
                        label= 'Login' 
                        onChange={(e) => setState({...state, login:e.target.value})}
                        onBlur={reduire}

                        />
                    </div>
                    <div>
                        <TextField 
                        autoComplete="false"
                        className={classes.fields} 
                        id='serviceName'
                        color='primary'
                        label= 'Service'
                        onChange={(e) => setState({...state, service:e.target.value})}
                        

                        />
                    </div>
                    <div>
                        <TextField 
                        className={classes.fields} 

                        id='Action'
                        color='secondary'
                        label= 'STOP'
                        placeholder='STOP'
                        disabled />
                    </div>

                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => deleteAction(index)} ><Delete />Supprimer</MenuItem>
                        <MenuItem onClick={() => {saveData(
                            {
                                index:index, type:"service", server : state.server , name : state.service, login : state.login
                            })
                            ;setAnchor(null)}} ><FileCopy /> save</MenuItem>
                        <MenuItem  ><Comment /> Réduire</MenuItem>
                    </Menu>
                    <IconButton onClick={handleClick}>
                        <MoreVert />

                    </IconButton>
                </Box>
            </Paper>
        </div>
     );
}
 
export default Service;