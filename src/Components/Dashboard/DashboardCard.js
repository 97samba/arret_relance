import { Box, makeStyles, Paper, Typography} from '@material-ui/core'
import { SupervisedUserCircle } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    root:{
        padding:theme.spacing(1),
        
    }
}))

const DashboardCard = () => {
    const classes = useStyles()
    return ( 
        <div>
            <Paper className = {classes.root} elevation={1,0} >
                <Box p={3} display='block' 
                justifyContent='center'>
                    
                    
                    <Box mx={3}>
                       <SupervisedUserCircle  /> 
                    </Box>
                    <Box mx={3}>
                       <Typography>
                            Administrators
                        </Typography> 
                    </Box>
                    <Box mx={3}>
                        <Typography variant='h5'> 125,282</Typography>
                    </Box>
                
                
                
                
                </Box>
            </Paper>

        </div>
     );
}
 
export default DashboardCard;