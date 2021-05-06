import { Box, FormControl, IconButton, InputLabel, Menu, MenuItem, Paper, Select, TextField } from "@material-ui/core"
import {makeStyles} from '@material-ui/core'
import { Comment, Delete, FileCopy, Http, MoreVert } from "@material-ui/icons"
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
        minWidth:300,
        marginRight:theme.spacing(2)
    },
    dropDown:{
        minWidth:100,
    }
}))
const Link = ({index}) => {
    const classes = useStyles()
    const [anchorEl, setAnchor] = useState(null)
    const { deleteAction, duplicateAction,saveData} = useContext(ActionContext)
    const [state, setState] = useState([])
    const [urlState, setUrlState] = useState("UP")
    const [navigationMode, setnavigationMode] = useState("normal")

    const handleClick = (event) =>{
        setAnchor(event.currentTarget)
    }
    const handleClose= () => {
        setAnchor(null)
    }
    

    const testConnection = async (e) =>{
        saveData({
            index:index,
            type:"Link",
            url:state.link,                             
            informations:
            {
                url : state.link,
                urlState : urlState,
                navigationMode : state.navigationMode                                  
            }})
        if(e.target.value !== ''){

            console.log('accessing ',e.target.value)

            await fetch(`http://localhost:5000/api/PARPRE/link?url=${e.target.value}`)
                .then(res => res.json())
                .then(result => console.log(result.result))
        }
  
    }


    return ( 
        <div>
            <Paper 
                elevation={0}
                className= {classes.root}>
                    <Box 
                display='flex'
                >
                    <Box my="auto" mx={2} >
                        <Http color="primary" />

                    </Box>
                    <Box my="auto" flexGrow={0.5}>
                        <TextField
                        
                        className={classes.fields} 
                        id='url'
                        value = {state.link}
                        color='primary'
                        label= 'Lien'
            
                        onChange={(e) => setState({...state, link:e.target.value})}
                        onBlur={(e) => (testConnection(e))}
                        />
                    </Box>
                    <Box flexGrow={0.6} >
                    <FormControl className={classes.dropDown}>
                            <InputLabel>Etat</InputLabel>
                            <Select value={urlState} onChange={(e) => (setUrlState(e.target.value))}>
                                <MenuItem value="Down" >Down</MenuItem>
                                <MenuItem value="UP">UP</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box  >
                    <FormControl className={classes.dropDown}>
                            <InputLabel>Navigation</InputLabel>
                            <Select value={navigationMode} onChange={(e) => (setState({...state, navigationMode : e.target.value}))}>
                                <MenuItem value="Privée" >Privée</MenuItem>
                                <MenuItem value="normal">Normal</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    
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
                                index:index, type:"lien", url : state.link, status : urlState
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
 
export default Link;