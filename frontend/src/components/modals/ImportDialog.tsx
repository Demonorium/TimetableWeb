import * as React from 'react';
import {useState} from 'react';
import {TextField} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import axios from "axios";
import {updateSource} from "../../store/sourceMap";
import DialogTemplate from "./DialogTemplate";

interface ShareDialogProps {
    open: boolean;
    close: () => void;
}

export default function ImportDialog({open, close}: ShareDialogProps) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [state, setState] = useState("");
    const [err, setErr] = useState("");

    return (
        <DialogTemplate
            open={open}
            close={close}
            title="Подключить источник"
            cancelText={"Назад"}
            acceptText="Импортировать"
            accept={async () => {
                const response = await axios.get( "/api/ref/"+state, {
                    auth: user
                }).catch(() => {
                    setErr("Код недоступен");
                });

                const result = await axios.get("/api/find/source", {
                    auth: user,
                    params: {
                        id: response?.data
                    }
                }).catch(()=> {
                    setErr("Произошла ошибка при загрузке, обновите страницу");
                })

                dispatch(updateSource(
                    result?.data
                ));
                setErr("");
            }}>

            <TextField sx={{width: "400px"}}
                       label="Код"
                       value={state}
                       error={err.length > 0}
                       helperText={err.length > 0 ? err : undefined}
                       onChange={(ev) => setState(ev.target.value)}/>
        </DialogTemplate>
    );



}