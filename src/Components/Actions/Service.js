import { Box, IconButton, Paper, TextField } from "@material-ui/core"
import {makeStyles} from '@material-ui/core'
import { MoreVert, SettingsSharp } from "@material-ui/icons"

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
const Service = () => {
    const classes = useStyles()
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
                        label= 'Serveur' />
                    </div>
                    <div>
                        <TextField 
                        className={classes.fields} 

                        id='login'
                        color='primary'
                        label= 'Login' />
                    </div>
                    <div>
                        <TextField 
                        autoComplete="false"
                        className={classes.fields} 
                        id='serviceName'
                        color='primary'
                        label= 'Service' />
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


                    <IconButton>
                        <MoreVert />

                    </IconButton>
                </Box>
            </Paper>
        </div>
     );
}
 
export default Service;