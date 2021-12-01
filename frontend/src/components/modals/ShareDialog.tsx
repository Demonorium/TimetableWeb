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
    TextField
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
    source: Source;
}

export default function ShareDialog({open, close, source}: ShareDialogProps) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [rights, setRights] = useState(source.refRights ? source.refRights : Rights.READ);

    const rightsMenu = new Array<any>();

    const [loading, setLoading] = useState(false);

    for (let key in RIGHT_LEVELS) {
        rightsMenu.push(
            <MenuItem value={key}>{RIGHT_LEVELS[key]}</MenuItem>
        );
    }

    useEffect(() => {
        if (open) {
            setRights(source.refRights ? source.refRights : Rights.READ)
        }
    }, [open])

    return (
        <Dialog
            open={open}
            aria-labelledby="share-dialog-title"
            aria-describedby="share-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Совместный доступ
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
                <TextField fullWidth
                           label="Код"
                           inputProps={{"aria-readonly": true}}
                           value={source.code ? source.code : ""}/>
                <InputLabel id="select-rights">Предоставленные права</InputLabel>
                <Select
                    labelId="select-rights"
                    readOnly={source.owner != user.username}
                    value={rights}
                    onChange={(event: SelectChangeEvent<string>) => {
                        // @ts-ignore
                        setRights(event.target.value);
                    }}>
                    {rightsMenu}
                </Select>
            </DialogContent>
            {
                source.owner == user.username
                    ? <DialogActions>
                        {
                            source.code
                                ? <LoadingButton loading={loading}
                                                 onClick={() => {
                                                     setLoading(true);
                                                     axios.get("/api/close_ref", {
                                                         auth: user,
                                                         params: {
                                                             id: source.id
                                                         }
                                                     }).then((response) => {
                                                         dispatch(updateSource({
                                                             ...source,
                                                             refRights: undefined,
                                                             code: undefined
                                                         }));
                                                         setLoading(false);
                                                     }).catch(() => {
                                                         setLoading(false);
                                                     })
                                                 }}>
                                    Закрыть доступ
                                </LoadingButton>
                                : undefined
                        }
                            <LoadingButton loading={loading}
                                           disabled={source.refRights && (rights == source.refRights)}
                                           onClick={() => {
                                                setLoading(true);
                                                axios.get(source.code ? "/api/change_rights" : "/api/share", {
                                                    auth: user,
                                                    params: {
                                                        id: source.id,
                                                        rights: rights
                                                    }
                                                }).then((response) => {
                                                    dispatch(updateSource({
                                                        ...source,
                                                        refRights: rights,
                                                        code: response.data
                                                    }));

                                                    setLoading(false);
                                                }).catch(() => {
                                                    setLoading(false);
                                                })
                                           }}>
                                {source.code ? "Обновить права" : "Поделиться"}
                            </LoadingButton>
                        </DialogActions>
                    : undefined
            }
        </Dialog>
    );



}