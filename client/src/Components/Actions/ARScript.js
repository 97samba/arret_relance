import { Box, IconButton, Menu, MenuItem, Paper, TextField } from "@material-ui/core"
import {makeStyles} from '@material-ui/core'
import { Delete, FileCopy, MoreVert, Description } from "@material-ui/icons"
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
const ARScript = ({index}) => {
    const classes = useStyles()
    const [anchorEl, setAnchor] = useState(null)
    const { deleteAction} = useContext(ActionContext)
    const [state, setState] = useState({})

    const handleClick = (event) =>{
        setAnchor(event.currentTarget)
    }
    const handleClose= () => {
        setAnchor(null)
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
                    <Description color="primary" />

                    </Box>
                    <div>
                        <TextField
                        onChange={(e) => setState({...state, server:e.target.value})}
                        className={classes.fields} 
                        id='server'
                        color='primary'
                        label= 'Serveur' />
                    </div>
                    <div>
                        <TextField 
                        className={classes.fields} 
                        onChange={(e) => setState({...state, login:e.target.value})}
                        id='login'
                        color='primary'
                        label= 'Login' />
                    </div>
                    <div>
                        <TextField 
                        onChange={(e) => setState({...state, path:e.target.value})}
                        className={classes.fields} 
                        id='Path'
                        color='primary'
                        label= 'Path' />
                    </div>
                    <div>
                        <TextField 
                        className={classes.fields} 
                        onChange={(e) => setState({...state, action:e.target.value})}
                        id='Action'
                        color='primary'
                        label= 'INVOKE'
                        placeholder='INVOKE'
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
                        <MenuItem onClick={handleClick} ><FileCopy /> Dupliquer</MenuItem>
                    </Menu>
                    <IconButton onClick={handleClick}>
                        <MoreVert  />

                    </IconButton>
                </Box>
            </Paper>
        </div>
     );
}
 
export default ARScript;