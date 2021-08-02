import { useEffect } from "react";
import { TextField } from "@material-ui/core";
import { testPath } from "../Checker";

const PathField = ({ props }) => {
    useEffect(() => {
        //console.log("props ", props.server);
    }, []);
    return (
        <div>
            <TextField
                id={`Path-${props.index}`}
                className={props.className}
                color="primary"
                error={
                    (props.scriptError === "true" ||
                        props.scriptError === "dossier" ||
                        (props.path === "" && props.server !== undefined)) &&
                    props.verification
                }
                label={
                    props.scriptError === "true"
                        ? `${props.type} introuvable`
                        : props.scriptError === "dossier"
                        ? "Dossier ?"
                        : props.serverError && props.path !== undefined
                        ? "Ce chemin sera testé si serveur joignable"
                        : props.type
                }
                value={props.path}
                onChange={(e) => props.setPath(e.target.value)}
                onBlur={() => {
                    props.saveInformations();
                    testPath(props.path, props.server, props.setScriptError);
                }}
            />
        </div>
    );
};

export default PathField;
