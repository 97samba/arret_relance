import { Container, Grid } from "@material-ui/core";
import DashboardCard from "../Components/Dashboard/DashboardCard"

const DashBoard = () => {
    return ( 
        <div>
            <Container>
                <Grid container spacing={3}>
                    <Grid
                    item
                    spacing={1}
                    xs = {12} sm={6} md={3} lg={3} >
                        <DashboardCard name="Pos réalisées"/>
                    </Grid>
                    <Grid
                    item
                    spacing={1}

                    xs = {12} sm={6} md={3} lg={3} >
                        <DashboardCard name="Parpre réalisées" />
                    </Grid>
                    <Grid
                    item
                    spacing={1}

                    xs = {12} sm={6} md={3} lg={3} >
                        <DashboardCard name="SSA traitées" />
                    </Grid>
                    <Grid
                    item
                    spacing={1}

                    xs = {12} sm={6} md={3} lg={3} >
                        <DashboardCard name="Taches plannifiées"/>
                    </Grid>
                   
                    
                </Grid>
            </Container>

        </div>
     );
}
 
export default DashBoard;