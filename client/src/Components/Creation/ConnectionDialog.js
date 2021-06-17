import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import { AccountCircle, ArrowRight, Lock } from "@material-ui/icons";
import { useEffect, useState } from "react";



const ConnectionDialog = ({saveData,initState,setInitState,openDialog, closeDialog}) => {
    
    const [state, setState] = useState({initState})

    useEffect(()=>{
        setState({initState})
    },[])
    
    const saveInformations = () =>{
        if(state.url !== ""){return}
        saveData(
            {
                index:state.index,
                type:"webAction",
                url:state.url,                             
                informations:
                {
                    type: "connection",
                    login : state.login,
                    loginSelector : state.loginSelector, 
                    password : state.password, 
                    passwordSelector : state.passwordSelector,
                    navigator : state.navigator,
                    navigatorMode : state.navigatorMode
                }
            })
    }

    return ( 
        <div>
            <Dialog
                    open={openDialog}
                    onClose={closeDialog}
                    fullWidth
                    onBlur={saveInformations}
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
                                        value={state.informations.login}
                                        variant="outlined"
                                        autoFocus
                                        margin="dense"
                                        id="login"
                                        label="Login"                                        
                                        onChange={(e) => (setState({...state.informations, login:e.target.value}))}
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
                                        //value={state.informations.password}
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
                                        //value={state.informations.passwordSelector}
                                        variant="outlined"
                                        margin="dense"
                                        id="password-selector"
                                        label="sélecteur"
                                        onChange={(e) => (setState({...state, passwordSelector:e.target.value}))}

                                        />
                                        </Grid>
                                    </Grid>                                    
                                    
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item md={6}>
                                        <FormControl fullWidth >
                                            <InputLabel>Navigateur</InputLabel>
                                            <Select value={state.navigator || "Chrome"} onChange={(e) => setState({...state, navigator:e.target.value})}>
                                                <MenuItem value="Chrome" >Chrome</MenuItem>
                                                <MenuItem value="Firefox">Firefox</MenuItem>
                                                <MenuItem value="Edge">Edge</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Mode de Navigation</InputLabel>
                                            <Select value={state.navigatorMode||"normal"} onChange={(e) => (setState({...state, navigatorMode:e.target.value})) }>
                                                <MenuItem value="normal" >Normal</MenuItem>
                                                <MenuItem value="private">privé</MenuItem>                                            
                                            </Select>
                                        </FormControl> 
                                    </Grid>

                                </Grid>

                            </div>

                        </DialogContent>
                        <DialogActions>
                            <Button onclick = {()=> {closeDialog() ;saveInformations()}}>
                                Confirmer
                            </Button>
                            
                        </DialogActions>

                    </Dialog>
        </div>
     );
}
 
export default ConnectionDialog;