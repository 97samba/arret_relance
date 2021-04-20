import { Box, IconButton, Menu, MenuItem, Paper, TextField } from "@material-ui/core"
import {makeStyles} from '@material-ui/core'
import { Comment, Delete, FileCopy, MoreVert, SettingsSharp } from "@material-ui/icons"
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
    const [state, setState] = useState({})

    const handleClick = (event) =>{
        setAnchor(event.currentTarget)
    }
    const handleClose= () => {
        setAnchor(null)
    }
    const reduire = () =>{

        setState({ ...state, id:actionID, index:index})

        //console.log(state,actionID)
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
                        onBlur={reduire}
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
                        <MenuItem onClick={() => deleteAction(actionID)} ><Delete />Supprimer</MenuItem>
                        <MenuItem onClick={() => saveData({state:state, id:index})} ><FileCopy /> save</MenuItem>
                        <MenuItem onClick={reduire} ><Comment onClick={reduire} /> Réduire</MenuItem>
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