import React from "react";

import {
    AppBar,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import {
    AllInclusive,
    AppsSharp,
    DashboardSharp,
    FolderOpenSharp,
    SettingsSharp,
    Timeline,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";
import { useHistory, useLocation } from "react-router";

const drawerWidthRight = 260;

const drawerWidth = 200;
const useStyles = makeStyles((theme) => {
    return {
        root: {
            display: "flex",
            background: "#F6F6FB",
            //minHeight: "750px",
            height: "100%",
        },
        nav: {
            width: drawerWidth,
        },
        title: {
            fontWeight: "bold",
        },
        list: {
            padding: theme.spacing(1),
        },
        menuItem: {
            display: "flex",
        },
        button: {
            margin: theme.spacing(2),
            padding: theme.spacing(1),
        },
        logo: {
            display: "flex",
        },
        active: {
            background: "#F2F2F2",
            borderRightColor: "#3f51b5",
            paddingInline: theme.spacing(2),
            marginBottom: theme.spacing(2),
        },
        nonActive: {
            paddingInline: theme.spacing(2),
            marginBottom: theme.spacing(2),
        },
        appbar: {
            width: `calc(100% - ${drawerWidth}px -${drawerWidthRight})`,
        },
        toolbar: theme.mixins.toolbar,
        page: {
            background: "F9F9F9",
            width: "100%",
            padding: theme.spacing(2),
        },
        drawerPaper: {
            width: drawerWidth,
            backgroundColor: "#FFFFF",
            borderRight: "0px",
        },
        drawerPaperLeft: {
            width: drawerWidth,
            backgroundColor: "#FFFFF",
            borderLeft: "0px",
        },
        navRight: {
            width: drawerWidthRight,
            //display:'none'
        },
        drawerPaperRight: {
            width: drawerWidthRight,
            backgroundColor: "#FFFFF",
            borderLeft: "0px",
        },
    };
});

const Layout = ({ children }) => {
    const menuItems = [
        {
            text: "DashBoard",
            icon: <DashboardSharp color="primary" />,
            path: "/",
        },
        {
            text: "Création",
            icon: <AppsSharp color="primary" />,
            path: "/create",
        },
        {
            text: "Gestion",
            icon: <FolderOpenSharp color="primary" />,
            path: "/manage",
        },
        {
            text: "Automator",
            icon: <AllInclusive color="primary" />,
            path: "/Automator",
        } /*
        {
            text: 'Prod h-Prod',
            icon: <FindReplace color="primary"/>,
            path:'#'
        },*/,
        {
            text: "Parametres",
            icon: <SettingsSharp color="primary" />,
            path: "/settings",
        },
    ];
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
                variant="permanent"
                anchor="left"
                className={classes.nav}
                classes={{ paper: classes.drawerPaper }}
            >
                <div>
                    <div>
                        <div className={classes.logo}>
                            <Box m={4} mt={5} display="flex" fontWeight={800}>
                                <Typography variant="h6" className={classes.title} color="primary">
                                    Transformers
                                </Typography>
                            </Box>
                        </div>
                        {/*
                        <Button
                         
                        variant='contained' 
                        
                        color='primary' 
                        className = {classes.button}
                        >
                            Charger un Excel
                        </Button>
                        */}
                    </div>

                    {/**Les liens du menu */}
                    <List>
                        <Box display="block" alignItems="center" justifyContent="space-around">
                            {menuItems.map((item) => (
                                <Box
                                    //Affiche une petite bordure sur la page courante
                                    borderRight={location.pathname === item.path ? 2 : 0}
                                >
                                    <ListItem
                                        key={item.text}
                                        button
                                        onClick={() => history.push(item.path)}
                                        className={
                                            location.pathname === item.path
                                                ? classes.active
                                                : classes.nonActive
                                        }
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItem>
                                </Box>
                            ))}
                        </Box>
                    </List>
                </div>
            </Drawer>

            {/**future page */}
            <div className={classes.page}>
                <div className={classes.toolbar}></div>
                {children}
            </div>
        </div>
    );
};

export default Layout;
