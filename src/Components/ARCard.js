import { Button, Card, CardContent, CardHeader,  makeStyles, Typography} from '@material-ui/core'
import { Add } from '@material-ui/icons';
import Service from './Actions/Service';
import ARScript from './Actions/ARScript';
import { useState } from 'react';

const cardWidth = 950
const useStyles = makeStyles(theme =>({
    root:{
        width : cardWidth,
        marginBottom : theme.spacing(2) 
    }
}))
const ARCard = ({name}) => {
    const classes = useStyles();
    const [actions, SetActions] = useState()
    const datas = [
        {
            type: "service",
            action: "stop" 
        },
        {
            type: "script",
            path : "c:/temp/test.bat"
        }
    ]
    const handleSubmit = (action) =>{
        datas.push(action)
        SetActions(datas)
        console.log(actions)
    }
    return ( 
        <div>
            <Card className= {classes.root}>
                <CardHeader 
                title = {name}
                subheader = 'sequence'
                action = {
                    <Button 
                    color='primary' 
                    variant='contained'
                    disableElevation
                    onClick={() => (
                        
                        handleSubmit({type:"service",action:"stop"})
                    )}
                    >
                        <Add />
                        <Typography> Action</Typography>
                    </Button>
                }
                />
                <CardContent>
                        {datas.map(item => (
                            (item.type === "service" ? <Service /> : <ARScript />)
                        ))}

                </CardContent>
            </Card>
        </div>
     );
}
 
export default ARCard;