import { Avatar, Box, Chip, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography, Button, Menu } from "@material-ui/core"
import { makeStyles } from '@material-ui/core'
import { Autorenew, Save, Search } from "@material-ui/icons"
import { useContext, useState, useEffect } from "react"
import ActionContext from "../../Context/ActionContext"
import OptionMenu from "../Creation/OptionMenu"
import OptionDialog from "../Creation/OptionDialog"
import checker from "../Checker"


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
const Disk = ({ index, type, initialSTate }) => {
    const classes = useStyles()
    const [state, setState] = useState({ initialSTate })
    const [openDialog, setOpenDialog] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [diskError, setDiskError] = useState(false)
    const [diskMenuAnchor, setDiskMenuAnchor] = useState(null)
    const [diskSelection, setDiskSelection] = useState([])
    const openDiskMenu = Boolean(diskMenuAnchor)



    const [options, setOptions] = useState({
        block: true,
        prod: true,
        hprod: true,
        inte: true,
        dev: true,

    })


    useEffect(() => {
        setState(initialSTate)
        setOptions(initialSTate.options)

    }, []
    )

    const { deleteAction, duplicateAction, saveData } = useContext(ActionContext)

    const saveInformations = () => {
        if (state.server === undefined) { return }
        console.log("Saving Informations ", state.disks)
        saveData(
            {
                index: index,
                type: "disk",
                server: state.server,
                disks: state.disks,
                options: options,
                //os: "windows"

            }
        )
    }

    const handleClick = (e) => {

        setDiskMenuAnchor(e.currentTarget)
    }

    const saveDisks = (e) => {

        var notFound = e.target.value.split(" ").filter(element => !diskSelection.includes(element.toUpperCase()))
        console.log("not found ", notFound.length)
        notFound.length > 0
            ? setDiskError(true)
            : setDiskError(false)

        saveInformations()
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
                            <Save color="primary" />
                        </Box>

                    </Grid>
                    <Grid item xs={2} sm={2} md={2} xl={2}>
                        <TextField
                            onChange={(e) => setState({ ...state, server: e.target.value })}
                            onBlur={(e) => {
                                saveInformations()
                                if (e.target.value) {
                                    checker.ping(e.target.value, setServerError)
                                    checker.testDisk(e.target.value, setDiskSelection)
                                }
                            }
                            }
                            value={state.server}

                            className={classes.fields}
                            id='server'
                            color='primary'
                            error={serverError}
                            label='Serveur' />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} xl={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleClick}

                        >
                            Voir les disques ({diskSelection.length})
                        </Button>
                        <Menu
                            id="diskMenu"
                            open={openDiskMenu}
                            anchorEl={diskMenuAnchor}
                            onBlur={saveInformations}
                            style={{ minWidth: 200 }}
                            onClose={() => setDiskMenuAnchor(null)}

                        >
                            {
                                diskSelection.length
                                    ? diskSelection.map((disk, index) => (
                                        <MenuItem
                                            key={index}
                                            style={{ minWidth: 200 }}


                                        >
                                            {disk}
                                        </MenuItem>
                                    ))
                                    : <MenuItem> Veuillez renseigner le serveur SVP</MenuItem>
                            }

                        </Menu>

                    </Grid>

                    <Grid item xs={5} sm={5} md={5} xl={5}>

                        <TextField
                            id="disksNames"
                            label={diskError ? "Erreur sur les disques, vérifier SVP" : "Disques à verifier"}
                            value={state.disks}
                            error={diskError}
                            color="primary"
                            onChange={(e) => setState({ ...state, disks: e.target.value })}
                            className={classes.fields}
                            helperText="Lettres(s) uniquement, séparées par un espace ;)"
                            onBlur={saveDisks}

                        />
                    </Grid>

                    <Grid item xs={1} sm={1} md={1} xl={1}>
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

export default Disk;