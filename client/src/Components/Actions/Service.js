import { Avatar, Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core"
import { makeStyles } from '@material-ui/core'
import {  SettingsSharp } from "@material-ui/icons"
import { useContext, useEffect, useState } from "react"
import ActionContext from "../../Context/ActionContext"
import OptionMenu from "../Creation/OptionMenu"

const useStyles = makeStyles((theme) => ({
    root: {
        background: '#F6F6FB',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1)

    },
    fields: {
        //marginRight:theme.spacing(2),
        width: "100%"
    },
    smallAvatar: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5)
    }
}))
const Service = ({ index, type, initialSTate }) => {
    //css
    const classes = useStyles()

    const [action, setAction] = useState('STOP')
    //létat du composant
    const [state, setState] = useState({initialSTate})
    //l'état du server
    const [pingState, setPingState] = useState("ko")
    const [status, setStatus] = useState(type)
    const [OS, SetOS] = useState("")

    useEffect(() => {
        setState(initialSTate)
        if(initialSTate.action){
            setStatus(initialSTate.action.toLowerCase())
        }

    }, []
    )


    //context pour sauvegarder l'état dans le parent
    const { deleteAction, duplicateAction, saveData} = useContext(ActionContext)


    const saveInformations = () => {
        if (state.service === undefined || state.server === undefined) { return }
        saveData(
            {
                index: index, type: "service", server: state.server, service: state.service, action: status
            }
        )
    }
    //test si le service existe
    const testService = async (service) => {

        if (state.server === null || pingState === "ko") { return }

        console.log("Testing service : ", service, "server ", state.server)
        fetch(`http://localhost:5000/api/PARPRE/service?name=${service}&server=${state.server}`)
            .then(res => res.json())
            .then(result => console.log(result))
        //.then(() => saveInformations())
    }
    //Fait un ping
    const testPing = async (server) => {


        await fetch(`http://localhost:5000/api/PARPRE?server=${server}`)
            .then(res => res.json())
            .then(result => {
                setPingState(result)
                console.log(result.state)
                //saveInformations()

                if (result.state === "ok") {

                }

            }
            )
    }



    return (
        <div>
            <Paper
                elevation={0}
                className={classes.root}>
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                >
                    <Grid item md={1} xl={1} container alignContent="center" direction="column" >
                        <Box display="flex" justifyContent="center">
                            <SettingsSharp color="primary" />
                        </Box>


                    </Grid>
                    <Grid item md={2} xl={2}>
                        <TextField
                            className={classes.fields}
                            value={state.server}
                            id={`server- ${index}`}
                            color='primary'
                            label='Serveur'
                            onChange={(e) => setState({ ...state, server: e.target.value })}
                            onBlur={(e) => {
                                saveInformations()

                                testPing(e.target.value)

                            }
                            }
                        />
                    </Grid>
                    <Grid item md={2} xl={2}>
                        <FormControl className={classes.fields}>
                            <InputLabel>Action</InputLabel>
                            <Select
                                fullWidth
                                value={status}
                                onChange={(e) => setStatus(e.target.value)} onBlur={() => saveInformations()}

                            >

                                <MenuItem value="stop">Stop</MenuItem>
                                <MenuItem value="start">Start</MenuItem>
                                <MenuItem value="status" >Status</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xl={6}>
                        <TextField
                            value={state.service}
                            className={classes.fields}
                            id={`serviceName- ${index}`}
                            color='primary'
                            label='Service'
                            onChange={(e) => setState({ ...state, service:e.target.value })}
                            onBlur={(e) => saveInformations()}
                        //testService(e.target.value)

                        />
                    </Grid>
                    <Grid item md={1} xl={1}  >
                        <Grid container spacing={3} alignItems="center" >
                            <Grid item md={6} >
                                <OptionMenu index={index} deleteAction={deleteAction} duplicateAction={duplicateAction}  />
                                
                               
                            </Grid>

                            <Grid item md={6}>
                                <Box my="auto" >
                                    <Avatar className={classes.smallAvatar} >

                                        <Typography>
                                            {index + 1}
                                        </Typography>
                                    </Avatar>

                                </Box>
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>
            </Paper>
        </div>
    );
}

export default Service;