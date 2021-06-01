import { Container, Grid } from "@material-ui/core";
import DashboardCard from "../Components/Dashboard/DashboardCard"

const DashBoard = () => {
    return ( 
        <div>
            <Container>
                <Grid container spacing={3}>
                    <Grid
                    item
                    xs = {12} sm={3} md={3} lg={3} >
                        <DashboardCard />
                    </Grid>
                    <Grid
                    item
                    xs = {12} sm={3} md={3} lg={3} >
                        <DashboardCard />
                    </Grid>
                    <Grid
                    item
                    xs = {12} sm={3} md={3} lg={3} >
                        <DashboardCard />
                    </Grid>
                    <Grid
                    item
                    xs = {12} sm={3} md={3} lg={3} >
                        <DashboardCard />
                    </Grid>
                   
                    
                </Grid>
            </Container>

        </div>
     );
}
 
export default DashBoard;