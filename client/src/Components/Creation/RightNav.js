import { Avatar, Box, Divider, Drawer, Grid, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { Computer, Rowing, Settings } from "@material-ui/icons";
import { useEffect, useState } from "react";
import {DataGrid} from '@material-ui/data-grid';

const drawerWidthRight = 280

const useStyles = makeStyles((theme) => {

    return {
        root: {

        },
        navRight: {
            width: drawerWidthRight,
            //display:'none'
        },
        drawerPaperRight: {
            width: drawerWidthRight,
            backgroundColor: "#FFFFF",
            borderLeft: '0px'

        }

    }
})





const RightNav = ({ ServerRow, saveRows }) => {
    const [progress, setProgress] = useState(0);
    const columns = [
        {field : 'prod', headerName: 'prod', width : 90, editable : true, sortable:false },
        {field : 'hprod', headerName: 'hprod', width : 90, editable : true, sortable:false },
        {field : 'dev', headerName: 'IPP2', width :90, editable : true, sortable:false }
    ]

    /*
    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 20));
      }, 400);
  
      return () => {
        clearInterval(timer);
      };
    }, []);
    */

    const classes = useStyles()
    
    const handleCellchange = (cell) => {
        console.log("Changing the ",cell)
        

        const editedServers = ServerRow.map(row => {
            if(row.id === cell.id){
                row = {...row, [cell.field] :cell.props.value  }
                return row
            }
            return row
        })
        saveRows(editedServers)
        console.log("edited ",editedServers)
    }

    return (
        <div>

            <Drawer
                elevation={0}
                variant="permanent"
                anchor='right'
                classes={{ paper: classes.drawerPaperRight }}
                className={classes.navRight}
            >
                <Box>
                    <Box m={2} display="flex" justifyContent="center">
                        <Typography gutterBottom>
                            Variables
                        </Typography>
                    </Box>

                        
                    <div style={{height : 300,width:"100%"}}>
                        <DataGrid 
                        rows={ServerRow}
                        columns={columns}
                        hideFooter
                        disableColumnMenu
                        rowHeight={40}
                        headerHeight={40}
                        onEditCellChangeCommitted={cell => handleCellchange(cell)}
                        
                        />
                    </div>
                </Box>

                <Box>
                    {/**
                    <Box m={2} display="flex" justifyContent="center">
                        <Typography gutterBottom>
                            Vérification Active
                        </Typography>
                    </Box>
                    
                    <Grid container spacing={1} alignItems="center" >
                        <Grid item md={2} >
                            <Box display="flex" justifyContent="center">
                                <Computer color="primary" />
                            </Box>

                        </Grid>

                        <Grid item md={10}>
                            <Typography variant="subtitle1" display="block"> Ping : SW11203</Typography>
                            <Grid container direction="row" alignItems="center" >
                                <Grid item md={5}>
                                    <Typography variant="caption">En cours</Typography>
                                </Grid>
                                <Grid item md={7}>
                                    <LinearProgress variant="determinate" value={progress} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider style={{ margin: "10px " }} />
                    <Grid container alignItems="center" >
                        <Grid item md={2} >
                            <Box display="flex" justifyContent="center" >
                                <Settings color="primary" />

                            </Box>

                        </Grid>

                        <Grid item md={10}>
                            <Typography variant="subtitle1" display="block"> Service : BITS</Typography>
                            <Grid container direction="row" alignItems="center" >
                                <Grid item md={5}>
                                    <Typography variant="caption">En cours</Typography>
                                </Grid>
                                <Grid item md={7}>
                                    <LinearProgress variant="determinate" value={progress} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                     */}
                </Box>
            </Drawer>

        </div>
    );
}

export default RightNav
