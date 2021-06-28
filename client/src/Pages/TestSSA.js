import { Accordion, AccordionSummary, AccordionDetails, CardHeader, Divider, Paper } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import { useHistory } from 'react-router';
import { ExpandMore } from '@material-ui/icons';


const TestSSA = () => {

    const history = useHistory()
    const [state, setState] = useState()
    const [services, setServices] = useState([])
    const [databases, setDatabase] = useState([])

    useEffect(() => {
        setState(history.location.state)
        getDatabases()
        getServices()

        console.log("state ", state, "hstory ", history.location)
    }, [])
    

    const getDatabases = () => {
        var DBs = new Set()
        history.location.state.Arret.map(action => {
            action.type === "database" && DBs.add(action.name)
        })
        setDatabase(Array.from(DBs))
    }
    const getServices = () => {
        var SVCs = new Set()
        history.location.state.Arret.map(action => {
            action.type === "service" && SVCs.add(action.name)
        })
        setServices(Array.from(SVCs))
    }


    return (
        <div>
            <Grid container direction="row" spacing={1} >
                <Grid item sm={4} md={4} xl={4}>
                    <Card elevation={0}>
                        <CardHeader title="Production" />


                        <CardContent>
                            <Grid container alignItems="center" justify="center" spacing={2}>
                                <Grid item md={12} direction="row" >
                                    <Card elevation={0} >
                                        <Typography>
                                            Jenkins Master
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item md={12} direction="row" >
                                    <Card elevation={0} >
                                        <Typography>
                                            Jenkins Rebond
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item md={12} direction="row" >
                                    <Card elevation={0} >
                                        {
                                            history.location.state.variables.servers.map(variable => (
                                                <Accordion>
                                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                                        <Typography>Server : {variable.prod}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Grid container spacing={2}>
                                                            {
                                                                services.length > 0 && services.map(service => (
                                                                    <Grid item md={12}>
                                                                        <Typography color="primary">
                                                                            service : {service}
                                                                        </Typography>
                                                                    </Grid>
                                                                ))
                                                            }
                                                            {
                                                                databases.map(database => (
                                                                    <Grid item md={12}>
                                                                        <Typography color="primary">
                                                                            Base de données : {database}
                                                                        </Typography>
                                                                    </Grid>
                                                                ))
                                                            }
                                                        </Grid>

                                                    </AccordionDetails>
                                                </Accordion>

                                            ))
                                        }

                                    </Card>
                                </Grid>


                            </Grid>

                            <Grid container alignItems="center" justify="center">
                                <Grid item md={6} direction="row" >
                                </Grid>
                            </Grid>

                        </CardContent>


                    </Card>

                </Grid>
                <Grid item sm={4} md={4} xl={4}>
                    <Card elevation={0}>
                        <CardHeader title="HPROD" />


                        <CardContent>
                            <Grid container alignItems="center" justify="center" spacing={2}>
                                <Grid item md={12} direction="row" >
                                    <Card elevation={0} >
                                        <Typography>
                                            Jenkins Master
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item md={12} direction="row" >
                                    <Card elevation={0} >
                                        <Typography>
                                            Jenkins Rebond
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item md={12} direction="row" >
                                    <Card elevation={0} >
                                        {
                                            history.location.state.variables.servers.map(variable => (
                                                <Accordion>
                                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                                        <Typography>Server : {variable.hprod}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {
                                                            history.location.state.Arret.map(action => (
                                                                <Typography color="primary">{action.type} : {action.name || action.path}</Typography>
                                                            ))
                                                        }

                                                    </AccordionDetails>
                                                </Accordion>

                                            ))
                                        }
                                    </Card>
                                </Grid>


                            </Grid>

                            <Grid container alignItems="center" justify="center">
                                <Grid item md={6} direction="row" >
                                </Grid>
                            </Grid>

                        </CardContent>


                    </Card>

                </Grid>
                <Grid item sm={4} md={4} xl={4}>
                    <Card elevation={0}>
                        <CardHeader title="HPROD2" />


                        <CardContent>
                            <Grid container alignItems="center" justify="center" spacing={2}>
                                <Grid item md={12} direction="row" >
                                    <Card elevation={0} >
                                        <Typography>
                                            Jenkins Master
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item md={12} direction="row" >
                                    <Card elevation={0} >
                                        <Typography>
                                            Jenkins Rebond
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item md={12} direction="row" >
                                    <Card elevation={0} >
                                        {
                                            history.location.state.variables.servers.map(variable => (
                                                <Typography gutterBottom>
                                                    Server : {variable.dev}
                                                    <Divider variant="fullWidth" />
                                                    {
                                                        variable.dev && history.location.state.Arret.map(action => (
                                                            <Typography color="primary">{action.type} : {action.name || action.path}</Typography>
                                                        ))
                                                    }
                                                </Typography>

                                            ))
                                        }
                                    </Card>
                                </Grid>


                            </Grid>

                            <Grid container alignItems="center" justify="center">
                                <Grid item md={6} direction="row" >
                                </Grid>
                            </Grid>

                        </CardContent>


                    </Card>

                </Grid>



            </Grid>
        </div>

    );
}

export default TestSSA;