import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import { SupervisedUserCircle } from "@material-ui/icons";

//Le nombre de ssa dans Céphée
const totalDocument = 728;

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(5),
    },
}));

const DashboardCard = ({ name, icon, documentNumber }) => {
    const classes = useStyles();

    return (
        <div>
            <Paper className={classes.root} elevation={1}>
                <Box display="flex" justifyContent="center">
                    <Box mr={1}>{icon}</Box>
                    <Typography>{name}</Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                    <Typography variant="h5">
                        {documentNumber} / {totalDocument}
                    </Typography>
                </Box>
            </Paper>
        </div>
    );
};

export default DashboardCard;
