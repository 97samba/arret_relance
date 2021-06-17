import { Card, CardContent, CardHeader, Grid, Typography } from "@material-ui/core"
import { Code, Settings } from "@material-ui/icons"
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@material-ui/lab"

const ViewItem = () => {
    return ( 
        <div>
            <Card>
                <CardHeader 
                    title="Timeline"
                    subheader="Production"
                />
                <CardContent>
                    <Grid container>
                        <Grid item md={3}>
                            <Typography>Production</Typography>
                            <Timeline>
                                <TimelineItem>
                                    <TimelineSeparator> 
                                        <TimelineDot>
                                            <Code />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>script</TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineSeparator> 
                                        <TimelineDot>
                                            <Settings />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>Bits</TimelineContent>
                                </TimelineItem>
                            </Timeline>

                        </Grid>
                        <Grid item md={3}>
                            <Typography>Validation</Typography>

                        </Grid>
                        <Grid item md={3}>
                            <Typography>Intégration</Typography>

                        </Grid>
                        <Grid item md={3}>
                            <Typography>Dévelopement</Typography>

                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
     );
}
 
export default ViewItem;