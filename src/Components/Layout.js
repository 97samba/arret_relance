import React from 'react'

import { AppBar, Box, Button, CircularProgress, Fade, List, ListItem, ListItemIcon, ListItemText, TextField, Toolbar } from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import { AppsSharp, Code,  DashboardSharp, FolderOpenSharp, SettingsSharp } from '@material-ui/icons'
import {makeStyles} from '@material-ui/core'
import { useHistory, useLocation } from 'react-router'

const drawerWidth = 250
const useStyles = makeStyles((theme) =>{
    return{
        root:{
            display:'flex',
            background: '#F6F6FB'
        },
        nav:{
            width: drawerWidth,
        },
        title:{
            fontWeight:'bold',
        },
        list:{
            padding: theme.spacing(2)
        },
        menuItem: {
            display : 'flex'
        },
        button : {
            margin: theme.spacing(4),
            padding : theme.spacing(1)
        },
        logo : {
            display : 'flex'
        },
        active:{
            background:'#F2F2F2',
            borderRightColor:'#3f51b5',
            paddingInline:theme.spacing(4),
            marginBottom:theme.spacing(2)

        },
        nonActive:{
            paddingInline:theme.spacing(4),
            marginBottom:theme.spacing(2)


        },
        appbar:{
            width:`calc(100% - ${drawerWidth}px)`
        },
        toolbar:theme.mixins.toolbar,
        page: {
            background:'F9F9F9',
            width:'100%',
            padding: theme.spacing(3)
        },
        drawerPaper:{
            width : drawerWidth,
            backgroundColor:"#FFFFF",
            borderRight:'0px'

        },
        drawerPaperLeft:{
            width : drawerWidth,
            backgroundColor:"#FFFFF",
            borderLeft:'0px'

        },
        navRight:{
            width:drawerWidth
        }

}})

const Layout = ({children}) => {
    const menuItems = [
        {
            text: 'DashBoard',
            icon:<DashboardSharp color="primary" />,
            path:'/'
        },
        {
            text: 'Create',
            icon:<AppsSharp color="primary" />,
            path:'/create'
        },
        {
            text: 'Manage',
            icon:<FolderOpenSharp color="primary" />,
            path:'/manage'
        },
        {
            text: 'Settings',
            icon:<SettingsSharp color="primary" />,
            path:'/settings'
        },
    ]
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    
    return ( 

        <div className={classes.root}>

            {/** toolbar */}
            <AppBar className={classes.appbar} elevation={0}>
                <Toolbar className={classes.toolbar}>
                    <Typography></Typography>
                </Toolbar>
            </AppBar>

            {/**menu droite */}
            <Drawer
            elevation={0}
            variant = "permanent"
            anchor = 'left'
            className = {classes.nav}
            classes = {{paper : classes.drawerPaper}}


            >
                <div>
                    <div>
                        <div className={classes.logo}>
                            <Box m={4} mt={5} 
                            display='flex' 
                            fontWeight={800}
                            
                           >
                                <Box my='auto'>
                                  <Code color='primary'/>  
                                </Box>
                                <Typography 
                                variant="h6" 
                                className={classes.title}
                                color="primary"
                                
                                >
                                    Transformers 
                                </Typography>
                            </Box>


                        </div>
                        
                        <Button
                         
                        variant='contained' 
                        
                        color='primary' 
                        className = {classes.button}
                        >
                            Générer le script
                        </Button>
                    </div>

                    {/**Les liens du menu */}
                    <List>
                        <Box 
                        display='block'
                        alignItems='center'
                        justifyContent='space-around'>
                        {menuItems.map(item => (
                            <Box 
                            
                            borderRight={location.pathname === item.path ? 2 : 0 }
                            >
                            <ListItem 
                                key = {item.text}
                                button
                                onClick= { () => history.push(item.path)}
                                className = {location.pathname === item.path ? classes.active : classes.nonActive}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary = {item.text} />
                            </ListItem> 
                            </Box>   
                        ))}
                        </Box>
                        
                    </List>
                </div>
            </Drawer>

            


            {/**future page */}
            <div className={classes.page} >
                <div className={classes.toolbar}>

                </div>
                {children}

            </div>

            
            {/**Left nav bar */}
            <Drawer
            elevation={0}
            variant = "permanent"
            anchor = 'right'
            classes = {{paper : classes.drawerPaperLeft}}
            className={classes.navRight}
            >
                <Box m={3}>
                    <Typography color="primary">
                        Informations personnelles
                    </Typography>
                    <form noValidate autoComplete="off">
                        <TextField  label="prenom" margin="dense" />
                        <TextField label="Nom"  margin="dense" />
                        

                    </form>
                </Box>

                <Box m={3} display="block">
                    <Typography gutterBottom>
                        Vérification active                                       
                    </Typography>
                    <Box mt={1} display="flex" justifyContent="space-around">
                        <Fade
                            in="true"
                            style = {{transitionDelay : '800ms'}}
                            unmountOnExit
                            >
                                <CircularProgress value={10} size= {25} />
                            </Fade>
                            <Typography variant="body2">Ping serveur SW11203 </Typography>
                    </Box>
                </Box>
            </Drawer>
        </div>
     );
}
 
export default Layout;