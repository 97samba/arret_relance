import { Avatar, Box, FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core"
import { makeStyles } from '@material-ui/core'
import { Delete, FileCopy, MoreVert, Code, Autorenew } from "@material-ui/icons"
import { useContext, useState,useEffect } from "react"
import ActionContext from "../../Context/ActionContext"
import OptionMenu from "../Creation/OptionMenu"

const useStyles = makeStyles((theme) => ({
    root: {
        background: '#F6F6FB',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1)

    },
    fields: {
        width: "100%"

    },
    smallAvatar: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5)
    }
}))
const Process = ({ index, type,initialSTate }) => {
    const classes = useStyles()
    const [state, setState] = useState({initialSTate})
    const [status, setStatus] = useState(type)
    const [OS, SetOS] = useState("")

    useEffect(() =>{
        setState(initialSTate)
        if(initialSTate.action){
            setStatus(initialSTate.action)
        }
    },[]
    )

    const { deleteAction, duplicateAction, saveData, AddServer } = useContext(ActionContext)

    const saveInformations = () => {
        if (state.name === undefined || state.server === undefined) { return }

        saveData(
            {
                index: index, type: "process", server: state.server, name: state.name, action: status
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
                    alignItems="center"
                    spacing={2}
                >

                    <Grid item md={1} xl={1}  >
                        <Box display="flex" justifyContent="center">
                            <Autorenew color="primary" />
                        </Box>

                    </Grid>
                    <Grid item xs={2} sm={2} md={2} xl={2}>
                        <TextField
                            onChange={(e) => setState({ ...state, server: e.target.value })}
                            onBlur={saveInformations}
                            value={state.server}

                            className={classes.fields}
                            id='server'
                            color='primary'
                            label='Serveur' />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} xl={2}>
                        <FormControl className={classes.fields}>
                            <InputLabel>Action</InputLabel>
                            <Select value={status} onChange={(e) => setStatus(e.target.value)} onBlur={saveInformations} >
                                <MenuItem value="stop">Stop</MenuItem>
                                <MenuItem value="start">Start</MenuItem>
                                <MenuItem value="status" >Status</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} xl={6}>
                        <TextField
                            className={classes.fields}
                            id='processus'
                            value={state.name}
                            color='primary'
                            label='Processus'
                            onChange={(e) => setState({ ...state, name: e.target.value })}
                            onBlur={saveInformations}

                        />
                    </Grid>

                    <Grid item xs={1} sm={1} md={1} xl={1}>
                        <Grid container spacing={3} alignItems="center" >
                            <Grid item md={6} >
                                <OptionMenu index={index} deleteAction={deleteAction} duplicateAction={duplicateAction} />

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

export default Process;