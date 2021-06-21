import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,  FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core"
import {makeStyles} from '@material-ui/core'
import {  AccountCircle,  Add,  ArrowRight,  Comment, Delete, FileCopy,  Link,  Lock,  MoreVert, Mouse, Web } from "@material-ui/icons"
import { useContext, useEffect, useState } from "react"
import ActionContext from "../../Context/ActionContext"
import ClickDialog from "../Creation/ClickDialog"
import ConnectionDialog from "../Creation/ConnectionDialog"
import FormDialog from "../Creation/FormDialog"
import DisconnectDialog from "../Creation/isconnectialog"
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
    dropDown:{
        width:"100%"
    },
    smallAvatar: {
      width: theme.spacing(2.5),
      height: theme.spacing(2.5)
    }
}))
const WebAction = ({index,initialSTate}) => {
    const classes = useStyles()
    const [anchorEl, setAnchor] = useState(null)
    const { deleteAction, duplicateAction,saveData} = useContext(ActionContext)
    const [state, setState] = useState({initialSTate})
    const [actionType, setActionType] = useState("connection")
    const [openDialog, setOpenDialog] = useState(false)
    const [informations, setInformations] = useState({})



    const handleClick = (event) =>{
        setAnchor(event.currentTarget)
    }
    const handleClose= () => {
        setAnchor(null)
    }
    const reduire = () =>{
 
    }
    useEffect(() =>{
        setState(initialSTate)
        if(initialSTate.informations.type){
            console.log("action type ",initialSTate.informations.type)
            setActionType(initialSTate.informations.type)
        }
        setInformations(initialSTate.informations)

    },[]
    )
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
        setState({...state,link:formatedUrl})

        if(formatedUrl !== ''){

            console.log('accessing ',formatedUrl)

            setState({...state, url:formatedUrl})

            fetch(`http://localhost:5000/api/PARPRE/link?url=${formatedUrl}`)
                .then(res => res.json())
                .then(result => console.log(result.result))
                
        }
  
    }

    const showDialog = () =>{
        setOpenDialog(true);
    }

    const closeDialog = () =>{
        setOpenDialog(false);
    }

    


    const saveInformations = () =>{

        if(state.url ===undefined){return}

        saveData({
            index:index,
            type:"webAction",
            url:state.url,
            informations:informations
        
        })
    }
    

    return ( 
        <div>
            <Paper 
                elevation={0}
                className= {classes.root}>
                <Grid
                    container
                    spacing={2}
                    alignItems="center" 
                    
                    >
                    <Grid item md={1} xl={1} container alignContent="center" direction="column" >
                        <Box  display="flex" justifyContent="center">
                        <Web color="primary" />
                        </Box>
                        
                        
                    </Grid>
                    <Grid item md={6} xl={2}>
                        <TextField
                        
                        className={classes.fields} 
                        id='url'
                        color='primary'
                        label= 'Lien'
                        value={state.url}                        
                        onChange={(e) => setState({...state, url:e.target.value})}
                        onBlur={(e) => {testConnection(e);saveInformations()}}
                        />
                    </Grid>
                    
                    <Grid item md={2} xl={3} >
                        <FormControl className={classes.dropDown}>
                            <InputLabel>Action</InputLabel>
                            <Select value={actionType} onChange={(e) => (setActionType(e.target.value))}>
                                <MenuItem value="connection" >Connexion</MenuItem>
                                <MenuItem value="logOut" >Déconnexion</MenuItem>
                                <MenuItem value="click">Click</MenuItem>
                                <MenuItem value="field">Remplir champ(s)</MenuItem>
                                <MenuItem value="verify">Vérifier un contenu</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={2} >
                        
                        <Box  display="flex" justifyContent="center">
                            <FormControl >
                                <Button variant="contained" color="primary" onClick={showDialog}>options</Button>
                            </FormControl>
                        </Box>
                        
                    </Grid>
                    
                    {openDialog && actionType === "connection" ? 
                    /**Dialog connexion */
                    
                    (
                        <ConnectionDialog
                        informations={informations}
                        setInformations={setInformations}
                        closeDialog={closeDialog}
                        openDialog={openDialog}
                        saveInformations={saveInformations}
                        
                        
                        />
                    ): actionType === "logOut" ?
                    /**Dialog deconnexion */
                    (
                        <DisconnectDialog 
                        informations={informations}
                        setInformations={setInformations}
                        closeDialog={closeDialog}
                        openDialog={openDialog}
                        saveInformations={saveInformations}
                        />
                    ): actionType === "click" ?
                    /**Dialog clicke */

                    (
                        <ClickDialog 
                        informations={informations}
                        setInformations={setInformations}
                        closeDialog={closeDialog}
                        openDialog={openDialog}
                        saveInformations={saveInformations}
                        />
                    ):
                    /**Dialog remplir */

                    (
                        <FormDialog 
                        informations={informations}
                        setInformations={setInformations}
                        closeDialog={closeDialog}
                        openDialog={openDialog}
                        saveInformations={saveInformations}
                        />
                    )
                    }
                    

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
 
export default WebAction;