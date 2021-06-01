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

    const formatUrl = (url) =>{

        if(url.startsWith("http")){

            console.log('url est bonne')
            return url
        }else{
            console.log('error url')    
            return "http://"+url       
        }
        
    }


    const testConnection = async (e) =>{

        const formatedUrl = formatUrl(e.target.value)

        saveData({
            index:index,
            type:"link",
            url:formatedUrl,                             
            informations:
            {
                urlState : urlState,
                navigationMode : navigationMode                                  
            }})
        if(e.target.value !== ''){

            console.log('accessing ',formatedUrl)

            await fetch(`http://localhost:5000/api/PARPRE/link?url=${formatedUrl}`)
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
                            <InputLabel>Etat du site</InputLabel>
                            <Select value={urlState} onChange={(e) => (setUrlState(e.target.value))} onBlur={(e) => (testConnection(e))}>
                                <MenuItem value="Down" >Down</MenuItem>
                                <MenuItem value="UP">UP</MenuItem>
                                <MenuItem value="Null">Page blanche</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box  >
                    <FormControl className={classes.dropDown}>
                            <InputLabel>Navigation</InputLabel>
                            <Select value={navigationMode} onChange={(e) => (setnavigationMode(e.target.value))} onBlur={(e) => (testConnection(e))}>
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