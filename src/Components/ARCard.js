import { Button, Card, CardContent, CardHeader,  Container,  makeStyles} from '@material-ui/core'
import { Code, Description, KeyboardArrowRight, SettingsSharp, Storage } from '@material-ui/icons';
import Service from './Actions/Service';
import Database from './Actions/Database';
import Command from './Actions/Command';
import ARScript from './Actions/ARScript';
import { useEffect, useState } from 'react';
import SpeedDial from '@material-ui/lab/SpeedDial'
import { SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import ActionContext from '../Context/ActionContext';
import {v4 as uuid} from "uuid";


const cardWidth = 950
const useStyles = makeStyles(theme =>({
    root:{
        width : cardWidth,
        marginBottom : theme.spacing(2) 
    }
}))
const ARCard = ({name}) => {
    const classes = useStyles();
    const [actions, SetActions] = useState([])
    const [open,setOpen] = useState(false)
    const [index, setIndex] = useState(0)
    const [data, setData] = useState({})
    const teststate=[]

    useEffect(() =>{
        fetch("http://localhost:8000/Actions")
        //.then(res => res.json())
        //.then(data => SetActions(data))
    },[])

    const AddScript = () =>{
        console.log("script")
        const newState = [
            ...actions,{
                index:index,
                id: uuid(),
                type:'script'
            }
        ]
        SetActions(newState)
        setIndex(index+1)
    }
    const AddDB = () =>{
        console.log("db")
        const newState = [
            ...actions,{
                index:index,
                id: uuid(),
                type:'database'
            }
        ]
        SetActions(newState)
        setIndex(index+1)
    }
    const AddCommand = () =>{
        console.log("cmd")
        const newState = [
            ...actions,{
                index:index,
                id: uuid(),
                type:'command'
            }
        ]
        SetActions(newState)
        setIndex(index+1)


    }
    const AddService = () =>{
        
        const newState = [
            ...actions,{
                index:index,
                id: uuid(),
                type:'service'
            }
        ]
        SetActions(newState)
        setIndex(index+1)
        //console.log(actions)

        {/* 
            fetch('http://localhost:8000/Actions',{
            method: 'POST',
            headers:{"Content-type": "application/json"},
            body: JSON.stringify(action)
        })
        */}
    }
    const deleteAction=(actionID)=>{

        const newState = actions.filter(action => action.id !== actionID)

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
        teststate.push(object)
        console.log(teststate)
        /*
        const result = Object.values(data).filter(e => e.id === object.id)

        if (result.length > 0){

            
            const index = data.findIndex(e => e.id === object.id )

            console.log('Changement',data[index])

            console.log("datas before splice : ", data)

            const newState = data.splice(index,1)
            console.log("datas after splice: ", data)


            //console.log("datas : ", data)
            //console.log('filter',newState, "index",index)
            
            const newData = [
                ...newState,object
            ]
            console.log("new",newData)

            setData(newData)


        }
        else
        {
            console.log("Nouvelle entrée")
            const newState = [
                ...data, object
            ]
            setData({newState}, () => {console.log("datas : ", newState)})
            
            //console.log('filter',result)
        }
        */
        

    }

    const iconsAction = [
        {icon : <SettingsSharp />, name: 'Service', action: AddService},
        {icon : <Code />, name: 'Commande', action: AddCommand},
        {icon : <Description />, name: 'Script', action: AddScript},
        {icon : <Storage />, name: 'Base de données', action: AddDB}
    ]
    const handleClose=() =>{
        setOpen(false)
    }

    const handleOpen=() =>{
        setOpen(true)
    }

    return ( 
        <Container>
            <Card className= {classes.root}>
                <CardHeader 
                title = {name}
                subheader = 'sequence'
                action = {
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
                    <ActionContext.Provider value={{actions, deleteAction, duplicateAction, saveData}}>
                        <form noValidate autoComplete='on'>
                            {actions.map(item => (
                                (
                                    item.type === "service" ?   <Service key={item.id} actionID={item.id} index={item.index}/> :
                                    item.type === "script"  ?    <ARScript key={item.id} actionID={item.id} index={item.index} /> :
                                    item.type === "database"?  <Database key={item.id} actionID={item.id} index={item.index}/> :
                                    item.type === "command" ?   <Command key={item.id} actionID={item.id} index={item.index} /> :
                                    null
                                )
                            ))}
                            <Button
                                
                                color="secondary" 
                                variant="contained"
                                
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