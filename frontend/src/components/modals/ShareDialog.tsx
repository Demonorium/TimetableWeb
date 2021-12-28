import * as React from 'react';
import {useEffect, useState} from 'react';
import {InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {RIGHT_LEVELS, Rights, Source} from "../../database";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import axios from "axios";
import {updateSource} from "../../store/sourceMap";
import DialogTemplate from "./DialogTemplate";

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

    const hasReset = source.code != undefined;
    const resetText = hasReset ? "Закрыть доступ" : undefined;
    const reset = hasReset ? async () => {
        const response = await axios.get("/api/close_ref", {
            auth: user,
            params: {
                id: source.id
            }
        })

        dispatch(updateSource({
            ...source,
            refRights: undefined,
            code: undefined
        }));
    }: undefined;

    const hasAccept = source.owner == user.username;
    const acceptText = hasAccept ? (source.code ? "Обновить права" : "Поделиться") : undefined;
    const accept = async () => {
        const response = await axios.get(source.code ? "/api/change_rights" : "/api/share", {
            auth: user,
            params: {
                id: source.id,
                rights: rights
            }
        })

        dispatch(updateSource({
            ...source,
            refRights: rights,
            code: response.data
        }));
    }

    return (
        <DialogTemplate open={open}
                        close={close}
                        title="Совместный доступ"
                        reset={reset}
                        resetText={resetText}
                        accept={accept}
                        acceptText={acceptText}
                        isAcceptPossible={rights != source.refRights}>

            <TextField fullWidth
                       label="Код"
                       inputProps={{"aria-readonly": true}}
                       value={source.code ? source.code : ""}/>

            <InputLabel id="select-rights">Предоставленные права</InputLabel>

            <Select
                labelId="select-rights"
                readOnly={source.owner != user.username}
                value={rights}
                sx={{width: "60%"}}
                onChange={(event: SelectChangeEvent<string>) => {
                    // @ts-ignore
                    setRights(event.target.value);
                }}>
                {rightsMenu}
            </Select>
        </DialogTemplate>
    );
}