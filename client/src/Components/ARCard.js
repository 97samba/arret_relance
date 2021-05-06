import { Button,Box,  Container,  makeStyles, Paper, Card, CardHeader, CardContent} from '@material-ui/core'
import { Code, Description, Http, KeyboardArrowRight, SettingsSharp, Storage, Web } from '@material-ui/icons';
import Service from './Actions/Service';
import Database from './Actions/Database';
import Command from './Actions/Command';
import ARScript from './Actions/ARScript';
import { useEffect, useState } from 'react';
import SpeedDial from '@material-ui/lab/SpeedDial'
import { SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import ActionContext from '../Context/ActionContext';
import {v4 as uuid} from "uuid";
import { useHistory } from 'react-router';
import axios from 'axios';
import Link from './Actions/Link'
import WebAction from './Actions/WebAction';

const cardWidth = 850
const useStyles = makeStyles(theme =>({
    root:{
        width : cardWidth,
        marginBottom : theme.spacing(2) 
    }
}))
const ARCard = ({name}) => {
    const classes = useStyles();
    const history = useHistory()
    const [actions, SetActions] = useState([])
    const [open,setOpen] = useState(false)
    const [index, setIndex] = useState(0)
    const [StopActions, setStopActions] = useState([])
    const [StartActions, setStartActions] = useState([])


    useEffect(() =>{
        //fetch("http://localhost:8000/Actions")
        //.then(res => res.json())
        //.then(data => SetActions(data))
    },[])

    const testPing = (server) =>{
        fetch(`http://localhost:5000/api/PARPRE?server=${server}`)
            .then(res => res.json())
            .then(result => {console.log("error"); return result})
    }

    const addAction = (type) =>{
        const newState = [
            ...actions,{
                index : index,
                type : type
            }
        ]
        SetActions(newState)
        setIndex(index+1)
    }
    
    const deleteAction=(actionID)=>{

        const newState = actions.filter(action => action.index !== actionID)

        console.log(actionID, actions, newState)

        SetActions(newState)
    }
    const duplicateAction=(actionID)=>{
        var actionToDuplicateIndex = actions.findIndex(e=>e.id === actionID)
        const clone = actions[actionToDuplicateIndex]
        const newClone = {...clone,id:uuid()}
        actionToDuplicateIndex=actionToDuplicateIndex+1
        
        actions.splice(actionToDuplicateIndex,0,newClone)
        SetActions(actions)

    }
    const saveData = (object) =>{
        const result = Object.values(StopActions).filter(e => e.index === object.index)

        if (result.length > 0){

            const index = StopActions.findIndex(e => e.id === object.index )

            console.log('Changement',StopActions[index])

            StopActions.splice(index,1,object)
            //console.log("datas : ", StopActions)

            setStopActions(StopActions)            
        }
        else
        {
            console.log("Nouvelle entrée")
            const newState = [
                ...StopActions, object
            ]
            setStopActions(newState) 

        }
        
    }
    const saveServiceState= (object) =>{
        
    }

    const saveWebAction = (object) =>{

    }


    const handleClose=() =>{
        setOpen(false)
    }

    const handleOpen=() =>{
        setOpen(true)
    }

    const generateJson = async () => {
        var currentDate = new Date()
        const parpre = {name : "ARES",auteur: "Samba NDIAYE", date_de_creation : new Date().toLocaleString(), Arret : StopActions}

        axios.post(`http://localhost:5000/api/PARPRE/test`, parpre)
            .then(res => console.log(res))
            
        console.log(JSON.stringify(parpre))
    }
    const iconsAction = [
        {icon : <Http />, name: 'Url', action: () => addAction("link")}, 
        {icon : <Web />, name: 'Action Web', action: () => addAction("webAction")}, 
        {icon : <SettingsSharp />, name: 'Service', action: () => addAction("service")},
        {icon : <Code />, name: 'Commande', action: () => addAction("command")},
        {icon : <Description />, name: 'Script', action: () => addAction("script")},
        {icon : <Storage />, name: 'Base de données', action: () => addAction("database")}
        
    ]
    return ( 
        <Container>
            <Card className= {classes.root}>
                <CardHeader 
                    title="Arrêt"
                    subheader="hybride"
                    action={
                        <SpeedDial
                        ariaLabel="SpeedDial"
                        icon={<SpeedDialIcon />}
                        open={ open }
                        direction = 'left'
                        onOpen={handleOpen}
                        onMouseLeave={handleClose}
                        >
                        {iconsAction.map((action) => (
                            <SpeedDialAction 
                                key={action.name}
                                icon = {action.icon}
                                tooltipTitle={action.name}
                                tooltipPlacement = 'top'
                                onClick= {action.action}
                            />
                        ))}
                    </SpeedDial>
                    }
                />

                <CardContent>
                    <ActionContext.Provider value={{actions, deleteAction, duplicateAction, saveData, testPing}}>
                        <form noValidate autoComplete='on'>
                            {actions.map(item => (
                                (
                                    item.type === "service" ?   <Service key={item.index} index={item.index}/> :
                                    item.type === "script"  ?   <ARScript key={item.index} index={item.index} /> :
                                    item.type === "database"?   <Database key={item.index} index={item.index}/> :
                                    item.type === "command" ?   <Command key={item.index}  index={item.index} /> :
                                    item.type === "link" ?      <Link key={item.index}  index={item.index} /> :
                                    item.type === "webAction" ? <WebAction key={item.index}  index={item.index} /> :
                                    null
                                )
                            ))}
                            <Button
                                
                                color="secondary" 
                                variant="contained"
                                //onClick={generateJson}
                                onClick={generateJson}
                                
                                endIcon={<KeyboardArrowRight />}>
                                Generate
                            </Button>
                        </form>
                    </ActionContext.Provider>
                </CardContent>
            </Card>
        </Container>
     ); 
}
 
export default ARCard;
