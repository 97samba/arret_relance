import { Avatar, Box, Chip, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@material-ui/core"
import {makeStyles} from '@material-ui/core'
import { Comment, Delete, FileCopy, MoreVert, SettingsSharp } from "@material-ui/icons"
import { useContext, useState } from "react"
import ActionContext from "../../Context/ActionContext"

const useStyles = makeStyles((theme)=>({
    root:{
        background:'#F6F6FB',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1)

    },
    fields:{
        marginRight:theme.spacing(2)
    },
    smallAvatar: {
      width: theme.spacing(2.5),
      height: theme.spacing(2.5)
    }
}))
const Service = ({actionID,index}) => {
    //css
    const classes = useStyles()

    const [anchorEl, setAnchor] = useState(null)
    const [action, setAction] = useState('STOP')
    //létat du composant
    const [state, setState] = useState([])
    //l'état du server
    const [pingState, setPingState] = useState("ko")

    //context pour sauvegarder l'état dans le parent
    const { deleteAction, duplicateAction,saveData,test} = useContext(ActionContext)

    const handleClick = (event) =>{
        setAnchor(event.currentTarget)
    }
    const handleClose= () => {
        setAnchor(null)
    }

    //test si le service existe
    const testService = async(service)=>{

        if(state.server === null || pingState === "ko"){return}

        console.log("Testing service : ",service,"server ",state.server)
        fetch(`http://localhost:5000/api/PARPRE/service?name=${service}&server=${state.server}`)
            .then(res => res.json())
            .then(result => console.log(result))
            .then(() => {
                saveData(
                {
                    index:index, type:"service", server : state.server , name : state.service, login : state.login
                })
            })
    }
    //Fait un ping
    const testPing = async (e,server) =>{
        var error=''
        
        await fetch(`http://localhost:5000/api/PARPRE?server=${server}`)
            .then(res => res.json())
            .then(result => {setPingState(result); console.log(result); error= result}
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
                        onBlur={() => saveData(
                            {
                                index:index, type:"service", server : state.server , name : state.service, login : state.login
                            })
                        }

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
                        onBlur={(e) => testService(e.target.value) }

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
                        <MenuItem onclick={()=> test()} ><Comment /> Réduire</MenuItem>
                    </Menu>
                    <IconButton onClick={handleClick}>
                        <MoreVert />

                    </IconButton>

                    <Box my="auto" >
                        <Avatar className={classes.smallAvatar} >
                        
                        <Typography>
                            {index + 1}
                        </Typography> 
                        
                        </Avatar>

                    </Box>
                    
                </Box>
            </Paper>
        </div>
     );
}
 
export default Service;