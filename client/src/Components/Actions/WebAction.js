import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,  FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, Paper, Select, TextField } from "@material-ui/core"
import {makeStyles} from '@material-ui/core'
import {  AccountCircle,  Add,  ArrowRight,  Comment, Delete, FileCopy,  Link,  Lock,  MoreVert, Mouse, Web } from "@material-ui/icons"
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
        width:200
    }
}))
const WebAction = ({index}) => {
    const classes = useStyles()
    const [anchorEl, setAnchor] = useState(null)
    const { deleteAction, duplicateAction,saveData} = useContext(ActionContext)
    const [state, setState] = useState([])
    const [actionType, setActionType] = useState("Connexion")
    const [openDialog, setOpenDialog] = useState(false)
    const [navigator, setNavigator] = useState("Chrome")
    const [navigatorMode, setNavigatorMode] = useState("normal")
    const [logOut, setLogOut] = useState("")
    const [logOutSelector, setLogOutSelector] = useState("")
    const [clickElement, setclickElement] = useState("")


    const handleClick = (event) =>{
        setAnchor(event.currentTarget)
    }
    const handleClose= () => {
        setAnchor(null)
    }
    const reduire = () =>{
 
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

    
    return ( 
        <div>
            <Paper 
                elevation={0}
                className= {classes.root}>
                    <Box 
                display='flex'
                >
                    <Box my="auto" mx={2} >
                        <Web color="primary" />

                    </Box>
                    <Box my="auto" flexGrow={0.5}>
                        <TextField
                        
                        className={classes.fields} 
                        id='url'
                        color='primary'
                        label= 'Lien'                        
                        onChange={(e) => setState({...state, url:e.target.value})}
                        onBlur={(e) => (testConnection(e))}
                        />
                    </Box>
                    <Box flexGrow={0.6} >
                        <FormControl className={classes.dropDown}>
                            <InputLabel>Action</InputLabel>
                            <Select value={actionType} onChange={(e) => (setActionType(e.target.value))}>
                                <MenuItem value="Connexion" >Connexion</MenuItem>
                                <MenuItem value="Déconnexion" >Déconnexion</MenuItem>
                                <MenuItem value="Click">Click</MenuItem>
                                <MenuItem value="Remplir">Remplir champ(s)</MenuItem>
                                <MenuItem value="Contenu">Vérifier un contenu</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    
                    <Box my="auto">
                        <FormControl >
                            <Button variant="contained" color="primary" onClick={showDialog}>options</Button>
                        </FormControl>
                    </Box>
                    
                    {actionType === "Connexion" ? 
                    /**Dialog connexion */
                    
                    (<Dialog
                    open={openDialog}
                    onClose={closeDialog}
                    fullWidth={200}
                    onBlur={() => {saveData(
                        {
                            index:index,
                            type:"webAction",
                            url:state.url,                             
                            informations:
                            {
                                type: "connection",
                                login : state.login,
                                loginSelector : state.loginSelector, 
                                password : state.password, 
                                passwordSelector : state.passwordSelector,
                                navigator : navigator,
                                navigatorMode : navigatorMode
                            }
                        })}
                    }
                    >
                        <DialogTitle id='dialog-title' >Connexion </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Le sélecteur est obtenu en faisant un click droit sur le champ à automatiser,  
                                Inspecter" puis click droit sur l'élément html et "copy selector"
                            </DialogContentText>
                            <div>
                                <Box display="flex" justifyContent="space-around">
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item >
                                            <AccountCircle />
                                        </Grid>
                                        <Grid item>
                                        <TextField
                                        value={state.login}
                                        variant="outlined"
                                        autoFocus
                                        margin="dense"
                                        id="login"
                                        label="Login"                                        
                                        onChange={(e) => (setState({...state, login:e.target.value}))}
                                        />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item >
                                            <ArrowRight />
                                        </Grid>
                                        <Grid item>
                                        <TextField
                                        value={state.loginSelector}
                                        variant="outlined"                                    
                                        margin="dense"
                                        id="login-selector"
                                        label="sélecteur"
                                        onChange={(e) => (setState({...state, loginSelector:e.target.value}))}
                                        />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box display="flex" justifyContent="space-around">
                                <Grid container spacing={1} alignItems="center">
                                        <Grid item >
                                            <Lock />
                                        </Grid>
                                        <Grid item>
                                        <TextField
                                        variant="outlined" 
                                                                        
                                        margin="dense"
                                        id="password"
                                        label="Mot de passe"
                                        type="password"
                                        onChange={(e) => (setState({...state, password:e.target.value}))}
                                        />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item >
                                            <ArrowRight />
                                        </Grid>
                                        <Grid item>
                                        <TextField
                                        value={state.passwordSelector}
                                        variant="outlined"
                                        margin="dense"
                                        id="password-selector"
                                        label="sélecteur"
                                        onChange={(e) => (setState({...state, passwordSelector:e.target.value}))}

                                        />
                                        </Grid>
                                    </Grid>                                    
                                    
                                </Box>

                                <Box display="flex" justifyContent="space-around">
                                    <FormControl className={classes.dropDown}>
                                        <InputLabel>Navigateur</InputLabel>
                                        <Select value={navigator} onChange={(e) => setNavigator(e.target.value)}>
                                            <MenuItem value="Chrome" >Chrome</MenuItem>
                                            <MenuItem value="Firefox">Firefox</MenuItem>
                                            <MenuItem value="Edge">Edge</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl className={classes.dropDown}>
                                        <InputLabel>Mode de Navigation</InputLabel>
                                        <Select value={navigatorMode} onChange={(e) => (setNavigatorMode(e.target.value))}>
                                            <MenuItem value="normal" >Normal</MenuItem>
                                            <MenuItem value="private">privé</MenuItem>                                            
                                        </Select>
                                    </FormControl>            
                                </Box>
                                
                            </div>

                        </DialogContent>
                        <DialogActions>
                            <Button onclick = {closeDialog}>
                                Confirmer
                            </Button>
                            
                        </DialogActions>

                    </Dialog>
                    ): actionType === "Déconnexion" ?
                    /**Dialog deconnexion */
                    (<Dialog
                    open={openDialog}
                    onClose={closeDialog}
                    fullWidth={200}
                    onBlur={() => {saveData(
                        {
                            index:index,
                            type:"webAction",
                            informations:
                            {
                                type: "logOut",
                                logOut : state.logOut,
                                logOutSelector : state.logOutSelector, 
                                
                            }
                        })}
                    }
                    >
                        <DialogTitle id='dialog-title'>Déconnexion </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Le sélecteur est obtenu en faisant un click droit sur le champ à automatiser,  
                                Inspecter" puis click droit sur l'élément html et "copy selector". 
                                Ici préciser le lien de déconnection ou le sélecteur
                            </DialogContentText>
                            <div>
                                <Box display="flex" justifyContent="space-around">
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item >
                                            <Link />
                                        </Grid>
                                        <Grid item>
                                        <TextField
                                        value={state.logOut}
                                        variant="outlined"
                                        autoFocus
                                        margin="dense"
                                        id="logout"
                                        label="lien de déconnexion"
                                        autoComplete={false}
                                        
                                        onChange={(e) => (setState({...state, logOut:e.target.value}))}
                                        />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item >
                                            <ArrowRight />
                                        </Grid>
                                        <Grid item>
                                        <TextField
                                        value={state.loginSelector}
                                        variant="outlined"                                    
                                        margin="dense"
                                        id="logOut-selector"
                                        label="ou sélecteur"
                                        onChange={(e) => (setState({...state, logOutSelector:e.target.value}))}
                                        />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>

                        </DialogContent>
                        <DialogActions>
                            <Button onclick = {closeDialog}>
                                Confirmer
                            </Button>
                            
                        </DialogActions>

                    </Dialog>
                    ): actionType === "Click" ?
                    /**Dialog clicke */

                    (<Dialog
                        open={openDialog}
                        onClose={closeDialog}
                        fullWidth={200}
                        onBlur={() => {saveData(
                            {
                                index:index,
                                type:"webAction",
                                url:state.url,                             
                                informations:
                                {
                                    type:"click",
                                    x : state.x,
                                    y : state.y, 
                                    clickSelector : state.clickSelector, 
                                }
                            })}
                        }
                        >
                            <DialogTitle id='dialog-title'>Effectuer un Click </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Le sélecteur est obtenu en faisant un click droit sur le champ à automatiser,  
                                    Inspecter" puis click droit sur l'élément html et "copy selector". 
                                    Ici préciser les coordonnées ou le sélecteur.
                                </DialogContentText>
                                <div>
                                    <Box display="flex" justifyContent="space-around">
                                        <Grid container spacing={1} alignItems="center">
                                            
                                            <Grid container item spacing={2}>
                                                <Box display="flex" justifyContent="inline-block">
                                                <TextField
                                                value={state.x}
                                                variant="outlined"
                                                autoFocus
                                                margin="dense"
                                                id="coords-x"
                                                label="coordonnées X"
                                                autoComplete={false}
                                                onChange={(e) => (setState({...state, x : e.target.value}))}
                                                />
                                                <TextField
                                                value={state.y}
                                                variant="outlined"
                                                autoFocus
                                                margin="dense"
                                                id="coords-y"
                                                label="coordonnées Y"
                                                autoComplete={false}
                                                
                                                onChange={(e) => (setState({...state, y : e.target.value}))}
                                                />
                                                </Box>
                                            </Grid>
                                        </Grid>
    
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item >
                                                <ArrowRight />
                                            </Grid>
                                            <Grid item>
                                            <TextField
                                            value={state.clickSelector}
                                            variant="outlined"                                    
                                            margin="dense"
                                            id="click-selector"
                                            label="Ou selecteur"
                                            onChange={(e) => (setState({...state, clickSelector:e.target.value}))}
                                            />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </div>
    
                            </DialogContent>
                            <DialogActions>
                                <Button onclick = {closeDialog}>
                                    Confirmer
                                </Button>
                                
                            </DialogActions>
    
                        </Dialog>
                    ):
                    /**Dialog remplir */

                    (<Dialog
                        open={openDialog}
                        onClose={closeDialog}
                        fullWidth={200}
                        onBlur={() => {saveData(
                            {
                                index:index,
                                type:"webAction",
                                url:state.url,                             
                                informations:
                                {
                                    type : "field"                                    
                                }
                            })}
                        }
                        >
                            <DialogTitle id='dialog-title'>Remplir un ou des champs </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Le sélecteur est obtenu en faisant un click droit sur le champ à automatiser,  
                                    Inspecter" puis click droit sur l'élément html et "copy selector". 
                                    Ici préciser le lien de déconnection ou le sélecteur
                                </DialogContentText>
                                <div>
                                    <Box display="flex" justifyContent="space-around">
                                        <Grid container spacing={1} alignItems="center">
                                            
                                            <Grid item>
                                            <TextField
                                            value={state.fields}
                                            variant="outlined"
                                            autoFocus
                                            margin="dense"
                                            label="champ"
                                            autoComplete={false}
                                            
                                            onChange={(e) => (setState({...state, fields:e.target.value}))}
                                            />
                                            </Grid>
                                        </Grid>
    
                                        <Grid container spacing={1} alignItems="center">
                                            
                                            <Grid item>
                                            <TextField
                                            value={state.fieldSelector}
                                            variant="outlined"                                    
                                            margin="dense"
                                            label="sélecteur"
                                            onChange={(e) => (setState({...state, fieldSelector:e.target.value}))}
                                            />
                                            </Grid>
                                        </Grid>
                                    
                                        <IconButton>
                                            <Add />
                                        </IconButton>
                                    
                                    </Box>
    
                                    
    
                                    
                                    
                                </div>
    
                            </DialogContent>
                            <DialogActions>
                                <Button onclick = {closeDialog}>
                                    Confirmer
                                </Button>
                                
                            </DialogActions>
    
                        </Dialog>
                    )
                    }
                    
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
                                index:index, type:"lien", url : state.link, status : actionType
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
 
export default WebAction;