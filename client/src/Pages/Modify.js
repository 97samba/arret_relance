import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory} from 'react-router'

import ARCard from "../Components/ARCard";
import RightNav from "../Components/Creation/RightNav";

const drawerWidthRight = 260

const useStyles = makeStyles((theme) =>{
    return{
        root:{
            width:`calc(100% - ${drawerWidthRight}px)`   
        }

}})
const Modify = () => {
    const url = "http://localhost:5000/api"
    const [state, setState] = useState({})
    const history = useHistory()
    const classes = useStyles()

    useEffect(()=>{
        console.log("starting ",history.location.state)
        document.title=history.location.state.name
        setState(history.location.state)
        console.log("state ",state)

    },[])

    const [servers, setServers] = useState([
        { name: 'sw11203', hprod: 'sw11213', dev: "sw11003" },
        { name: 'sw11203', hprod: 'sw11213', dev: "sw11003" },
        { name: 'sw11203', hprod: 'sw11213', dev: "sw11003" }
    ])



    return ( 
        <div className={classes.root}>
            <ARCard 
            name="Arrêt" 
            type="stop"  
            actions={history.location.state.Arret}

            />

            <ARCard 
            name="Relance" 
            type="start" 
            actions={history.location.state.Relance} />
            
            <RightNav  ServerRow={servers}/>
            
        </div>

     );
}
 
export default Modify;