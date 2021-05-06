import { TextField, Typography } from "@material-ui/core"
import { useState } from "react";
import ARCard from "../Components/ARCard"


const handleTitleChange = () =>{

}
const Create = () => {
    const [titleOpen, setTitleOpen] = useState(false)
    const [title, setTitle] = useState("")

    return ( 
        
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
            <ARCard name="Arrêt"/>
        </div>
     );
}
 
export default Create;