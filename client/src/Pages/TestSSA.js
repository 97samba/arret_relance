import { Button, CardActionArea, CardActions, IconButton, CardHeader, Divider } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import { Computer, DesktopWindows } from '@material-ui/icons';


const TestSSA = () => {

    return (
        <div>
            <Grid container direction="row" spacing={1} >
                <Grid item sm={4} md={4} xl={4}>
                    <Card elevation={0}>
                        <CardHeader title="Production" />


                        <CardContent>
                            <Grid container alignItems="center" justify="center">
                                <Grid item md={6} direction="row" >
                                        <DesktopWindows color="primary" style={{ fontSize: 70 }} />
                                        <Typography>Master jenkins  </Typography>
                                </Grid>
                            </Grid>
                            
                            <Grid container alignItems="center" justify="center">
                                <Grid item md={6} direction="row" >
                                        <DesktopWindows color="secondary" style={{ fontSize: 70 }} />
                                        <Typography>Master Slave  </Typography>
                                </Grid>
                            </Grid>

                        </CardContent>


                    </Card>

                </Grid>
            
                <Grid item sm={4} md={4} xl={4}>
                    <Card elevation={0}>
                        <CardHeader title="Validation" />


                        <CardContent>
                            <Grid container alignItems="center" justify="center">
                                <Grid item md={6} direction="row" >
                                        <DesktopWindows color="primary" style={{ fontSize: 70 }} />
                                        <Typography>Master jenkins  </Typography>
                                </Grid>
                            </Grid>
                            
                            <Grid container alignItems="center" justify="center">
                                <Grid item md={6} direction="row" >
                                        <DesktopWindows color="secondary" style={{ fontSize: 70 }} />
                                        <Typography>Master Slave  </Typography>
                                </Grid>
                            </Grid>

                        </CardContent>


                    </Card>

                </Grid>
            
                <Grid item sm={4} md={4} xl={4}>
                    <Card elevation={0}>
                        <CardHeader title="Intégration" />


                        <CardContent>
                            <Grid container alignItems="center" justify="center">
                                <Grid item md={6} direction="row" >
                                        <DesktopWindows color="primary" style={{ fontSize: 70 }} />
                                        <Typography>Master jenkins  </Typography>
                                </Grid>
                            </Grid>
                            
                            <Grid container alignItems="center" justify="center">
                                <Grid item md={6} direction="row" >
                                        <DesktopWindows color="secondary" style={{ fontSize: 70 }} />
                                        <Typography>Master Slave  </Typography>
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