import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputLabel, MenuItem,
    Select, SelectChangeEvent,
    TextField, Typography
} from "@mui/material";
import {Close} from "@material-ui/icons";
import {RIGHT_LEVELS, Rights, Source} from "../../database";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {LoadingButton} from "@mui/lab";
import {useEffect, useState} from "react";
import axios from "axios";
import {updateSource} from "../../store/sourceMap";


interface ShareDialogProps {
    open: boolean;
    close: () => void;
}

export default function ImportDialog({open, close}: ShareDialogProps) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const [state, setState] = useState("");
    const [err, setErr] = useState("");

    return (
        <Dialog
            open={open}
            aria-labelledby="share-dialog-title"
            aria-describedby="share-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Подключить источник
                <IconButton
                    aria-label="close"
                    onClick={close}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{textAlign: "center"}}>
                <TextField sx={{width: "400px"}}
                           label="Код"
                           value={state}
                           error={err.length > 0}
                           helperText={err.length > 0 ? err : undefined}
                onChange={(ev) => setState(ev.target.value)}/>
            </DialogContent>
            <DialogActions>
                    <LoadingButton loading={loading}
                                   onClick={() => {
                                       setLoading(true);
                                       axios.get( "/api/ref/"+state, {
                                           auth: user
                                       }).then((response) => {
                                           axios.get("/api/find/source", {
                                               auth: user,
                                               params: {
                                                   id: response.data
                                               }
                                           }).then((resp) => {
                                               dispatch(updateSource(
                                                   resp.data
                                               ));

                                               setLoading(false);
                                               setErr("");
                                               close()
                                           }).catch(()=> {
                                               setLoading(false);
                                               setErr("Произошла ошибка при загрузке, обновите страницу");
                                           })

                                       }).catch(() => {
                                           setLoading(false);
                                           setErr("Код недоступен");
                                       });
                                   }}>
                        Импортировать
                    </LoadingButton>
                </DialogActions>
        </Dialog>
    );



}