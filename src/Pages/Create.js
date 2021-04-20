import { Typography } from "@material-ui/core"
import ARCard from "../Components/ARCard"

const Create = () => {
    return ( 
        <div>
            <Typography 
            variant='h5'
            gutterBottom
            >Parpre : ARES</Typography>
            <ARCard name="Arrêt"/>
            <ARCard name = 'Relance'/>

        </div>
     );
}
 
export default Create;