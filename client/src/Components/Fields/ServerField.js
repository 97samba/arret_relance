import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core"
import checker from "../Checker";


const ServerField = ({ NameClass, server, setServer, index, saveInformations, initialServer,serverError,setServerError }) => {


    useEffect(() => {
        server !== ""
            ? checker.ping(server, setServerError)
            : checker.ping(initialServer, setServerError)
            
    }, [])

    return (
        <div>
            <TextField
                className={NameClass}
                color="primary"
                value={server}
                id={`server-${index}`}
                error={serverError}
                label={serverError ? 'Injoignable' : 'Serveur'}
                onChange={(e) => setServer(e.target.value)}

                onBlur={(e) => {
                    saveInformations()
                    checker.ping(e.target.value, setServerError)
                    
                }
                }
            />
        </div>
    );
}

export default ServerField;