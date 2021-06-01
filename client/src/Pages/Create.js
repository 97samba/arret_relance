import { TextField, Typography } from "@material-ui/core"
import { useState } from "react";
import ARCard from "../Components/ARCard"
import ActionContext from "../Context/ActionContext";


const handleTitleChange = () =>{

}
const Create = () => {
    const [titleOpen, setTitleOpen] = useState(false)
    const [title, setTitle] = useState("APPXXXX_SSA")

    const [RelanceActions, setRelanceActions] = useState([])
    const [StopActions, setStopActions] = useState([])

    const test = () =>{
        console.log("testing provider")
    }
    return ( 
        
        <div>   
            <div>         
                { titleOpen ? (
                <TextField 
                placeholder="Changer le titre"
                onBlur={() => setTitleOpen(false)}
                margin="dense"
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                value={title}
                ></TextField>
                ) : (
                <div>
                    <Typography 
                    variant='h5'
                    gutterBottom
                    onClick={() => setTitleOpen(true)}
                    >
                        Nom Parpre : {title}

                    </Typography>
                </div>
                )}
            </div>
            
            

                <ARCard name="Arrêt" type="STOP"/>
                <ARCard name="Relance" type="START"/>

            
            

        </div>
     );
}
 
export default Create;