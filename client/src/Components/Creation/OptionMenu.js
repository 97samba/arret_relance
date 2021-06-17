import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem } from "@material-ui/core";
import {  Comment, Delete, FileCopy, MoreVert } from "@material-ui/icons";
import { useState } from "react";
import OptionDialog from "./OptionDialog";

const OptionMenu = ({index,deleteAction,duplicateAction}) => {

    const [anchorEl, setAnchor] = useState(null)

    const handleClick = (event) =>{
        setAnchor(event.currentTarget)
    }

    const handleClose= () => {
        setAnchor(null)
    }
    const [openDialog, setOpenDialog] = useState(false)
    
    const showDialog = () =>{
        setOpenDialog(true);
    }

    const closeDialog = () =>{
        setOpenDialog(false);
    }
    

    return ( 
        <div>
            <IconButton onClick={handleClick}>
                <MoreVert />
            </IconButton>
            <Menu
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >

                <MenuItem onClick={() => {

                    deleteAction(index)
                    setAnchor(null)
                    
                    }} >
                    
                    <Delete />Supprimer
                
                </MenuItem>
                <MenuItem onClick={() => {
                        
                        handleClose()
                        duplicateAction(index)
                    }
                } 
                >
                    <FileCopy /> Dupliquer
                        
                </MenuItem>
                <MenuItem onClick={() => {showDialog(); handleClose()}} >
                    <Comment /> Options

                </MenuItem>
            </Menu>
            
            <OptionDialog openDialog={openDialog} closeDialog={closeDialog} />

        </div>
      );
}
 
export default OptionMenu;