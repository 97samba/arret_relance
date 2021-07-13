import { Avatar, Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core"
import { makeStyles } from '@material-ui/core'
import { SettingsSharp } from "@material-ui/icons"
import { useContext, useEffect, useState } from "react"
import ActionContext from "../../Context/ActionContext"
import OptionDialog from "../Creation/OptionDialog"
import OptionMenu from "../Creation/OptionMenu"
import checker from "../Checker"
import ServerField from "../Fields/ServerField"

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
    const [state, setState] = useState({ initialSTate })
    //l'état du server
    const [pingState, setPingState] = useState("ko")
    const [status, setStatus] = useState(type)
    //menu options
    const [openDialog, setOpenDialog] = useState(false)

    const [serviceError, setServiceError] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [server, setServer] = useState("")

    const [options, setOptions] = useState({
        block: true,
        prod: true,
        hprod: true,
        inte: true,
        dev: true,

    })

    useEffect(() => {
        console.log("index ", index, " initial state ", initialSTate)
        setState(initialSTate)
        if (initialSTate.action) {
            setStatus(initialSTate.action.toLowerCase())
            setOptions(initialSTate.options)
        }

        if (initialSTate.server) {
            setServer(initialSTate.server)
            checker.ping(initialSTate.server,setServerError)
            //checker.testService(initialSTate.service,initialSTate.server,setServiceError)
            
        }

    }, []
    )


    //context pour sauvegarder l'état dans le parent
    const { deleteAction, duplicateAction, saveData } = useContext(ActionContext)


    const saveInformations = () => {
        if (state.name === undefined || server === undefined) { return }
        saveData(
            {
                index: index,
                type: "service",
                server: server,
                name: state.name,
                action: status,
                options: options,
                //os: "windows"
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
                    <Grid item md={1} xl={1} >
                        <Box display="flex" justifyContent="center">
                            <SettingsSharp color="primary" />
                        </Box>


                    </Grid>
                    <Grid item md={2} xl={2}>
                        <ServerField
                            NameClass={classes.fields}
                            saveInformations={saveInformations}
                            server={server}
                            setServer={setServer}
                            index={index}
                            serverError={serverError}
                            setServerError={setServerError}
                            initialServer={initialSTate.server}
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
                            value={state.name}
                            className={classes.fields}
                            id={`serviceName- ${index}`}
                            color='primary'
                            label={serviceError ? 'Service non retrouvé ' : serverError && state.name !=="" ? "Ce service sera testé si serveur joignable":'Service'}
                            error={serviceError}
                            onChange={(e) => setState({ ...state, name: e.target.value })}
                            onBlur={(e) => {
                                saveInformations()
                                !serverError && checker.testService(e.target.value, server, setServiceError)
                            }
                            }
                        //testService(e.target.value)

                        />
                    </Grid>
                    <Grid item md={1} xl={1}  >
                        <Grid container spacing={3} alignItems="center" >
                            <Grid item md={6} >
                                <OptionMenu
                                    index={index}
                                    deleteAction={deleteAction}
                                    duplicateAction={duplicateAction}
                                    setOpenDialog={setOpenDialog}
                                />
                                <OptionDialog
                                    options={options}
                                    saveInfos={saveInformations}
                                    setOptions={setOptions}
                                    openDialog={openDialog}
                                    setOpenDialog={setOpenDialog}
                                />

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