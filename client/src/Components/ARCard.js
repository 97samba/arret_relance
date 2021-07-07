import { Button, Container, makeStyles, Card, CardHeader, CardContent } from '@material-ui/core'
import { Autorenew, Code, Description, Http, KeyboardArrowRight, SettingsSharp, Storage, Web } from '@material-ui/icons';
import Service from './Actions/Service';
import Database from './Actions/Database';
import Process from './Actions/Process';
import ARScript from './Actions/ARScript';
import { useEffect, useState } from 'react';
import SpeedDial from '@material-ui/lab/SpeedDial'
import { SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import ActionContext from '../Context/ActionContext';
import Link from './Actions/Link'
import WebAction from './Actions/WebAction';
import Command from './Actions/Command';

const cardWidth = 850
const useStyles = makeStyles(theme => ({
    root: {
        // width : cardWidth,
        marginBottom: theme.spacing(2)
    }
}))
const ARCard = ({ name, actions, SetActions, autoRelance, type, AddServer, generateJson }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState(actions.length)
    var second = actions.length

    //console.log("second ", second, " index ", index)

    useEffect(() => {
        console.log("nombre d'actions ", actions.length, " actions ", actions)
    }, [])

    const testPing = (server) => {
        fetch(`http://localhost:5000/api/PARPRE?server=${server}`)
            .then(res => res.json())
            .then(result => { console.log("error"); return result })
    }

    const addAction = (_type) => {
        const newState = [
            ...actions, {
                index: second,
                type: _type,
                action: type,
                informations: {
                },
                options: {
                    block: true,
                    prod: true,
                    hprod: true,
                    inte: true,
                    dev: true,

                }
            }
        ]
        console.log("new state ", newState)

        SetActions(newState)
        setIndex(index + 1)
        second++
    }

    const deleteAction = (actionID) => {

        console.log("deleting ", actions.filter(action => action.index === actionID)
        )

        const newState = actions.filter(action => action.index !== actionID)
        var i;

        for (i = 0; i < newState.length; i++) {
            newState[i].index = i;
        }

        setIndex(newState.length)

        //newState.map(action => console.log(action))

        SetActions(newState)

        //console.log("index ", index)

    }

    const duplicateAction = (actionID) => {

        var actionToDuplicateIndex = actionID
        var clone = actions[actionToDuplicateIndex]


        console.log("action to duplicate", clone, "index ", actionToDuplicateIndex, " actionId ", actionID)

        var newClone = { ...clone, action: "status", duplicated: "duplicated" }
        actionToDuplicateIndex = actionToDuplicateIndex + 1
        console.log("before splice ", actions)

        actions.splice(actionToDuplicateIndex, 0, newClone)

        console.log("new array ", actions)


        for (var i = 0; i < actions.length; i++) {
            actions[i].index = i;
            //console.log(actions[i].server)
        }
        console.log("after array ", actions)



        //newState.map(action => console.log(action))

        SetActions(actions)
        setIndex(actions.length)
    }

    const saveData = (object) => {

        const result = actions.filter(e => e.index === object.index)

        if (result.length > 0) {

            const index = actions.findIndex(e => e.index === object.index)

            console.log('Changement', actions[index])

            actions.splice(index, 1, object)

            SetActions(actions)

        }
        else {
            console.log("Nouvelle entrée")
            const newState = [
                ...actions, object
            ]
            SetActions(newState)
        }

    }




    const iconsAction = [
        { icon: <Http />, name: 'Url', action: () => addAction("link") },
        { icon: <Web />, name: 'Action Web', action: () => addAction("webAction") },
        { icon: <SettingsSharp />, name: 'Service', action: () => addAction("service") },
        { icon: <Autorenew />, name: 'Processus', action: () => addAction("process") },
        { icon: <Description />, name: 'Script', action: () => addAction("script") },
        { icon: <Storage />, name: 'Base de données', action: () => addAction("database") },
        { icon: <Code />, name: 'Commande', action: () => addAction("command") }
    ]
    //{icon : <Save />, name: 'Disque', action: () => addAction("disk")},
    //{icon : <AccountTree />, name: 'Disque', action: () => addAction("Pool")}
    return (
        <Container>
            <Card className={classes.root}>
                <CardHeader
                    title={name}
                    subheader="hybride"
                    action={
                        <SpeedDial
                            ariaLabel="SpeedDial"
                            icon={<SpeedDialIcon />}
                            open={open}
                            direction='left'
                            onOpen={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}
                        >
                            {iconsAction.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    tooltipPlacement='top'
                                    onClick={action.action}

                                />
                            ))}
                        </SpeedDial>
                    }
                />

                <CardContent>
                    <ActionContext.Provider value={{ actions, deleteAction, duplicateAction, saveData, testPing, AddServer }}>
                        <form noValidate autoComplete='on'>
                            {actions.map((item, index) => (
                                (
                                    item.type === "service" ? <Service key={item.index} index={item.index} type={type} initialSTate={item} /> :
                                        item.type === "script" ? <ARScript key={item.index} index={item.index} initialSTate={item} /> :
                                            item.type === "database" ? <Database key={item.index} index={item.index} type={type} initialSTate={item} /> :
                                                item.type === "process" ? <Process key={item.index} index={item.index} type={type} initialSTate={item} /> :
                                                    item.type === "link" ? <Link key={item.index} index={item.index} initialSTate={item} /> :
                                                        item.type === "webAction" ? <WebAction key={item.index} index={item.index} initialSTate={item} /> :
                                                            item.type === "command" ? <Command key={item.index} index={item.index} initialSTate={item} /> :
                                                                item.type === "disk" ? <Service key={item.index} index={item.index} type={type} initialSTate={item} /> :
                                                                    null
                                )
                            ))}
                            <Button

                                color="secondary"
                                variant="contained"
                                onClick={generateJson}

                                endIcon={<KeyboardArrowRight />}>
                                Save
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{marginLeft:"10px"}}
                            >
                               Généré un Excel 
                            </Button>
                        </form>
                    </ActionContext.Provider>
                </CardContent>
            </Card>
        </Container>
    );
}

export default ARCard;
