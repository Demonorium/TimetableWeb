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
import {Day, RIGHT_LEVELS, Rights, Source} from "../../database";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {LoadingButton} from "@mui/lab";
import {useEffect, useState} from "react";
import axios from "axios";
import {updateSource} from "../../store/sourceMap";
import DayScheduleEditor from "../screens/edit-source/DayScheduleEditor";


interface DayEditProps {
    open: boolean;
    close: (day?: Day) => void;
    source: Source;
    createDay: () => Promise<number>;
    day?: Day;
    date: String;
}

export default function DayEdit({day, open, date, close, source, createDay}: DayEditProps) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    return (
        <Dialog
            open={open}
            aria-labelledby="share-dialog-title"
            aria-describedby="share-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2, width:"600px"}}>
                {"Редактировать день " + date}
                <IconButton
                    aria-label="close"
                    onClick={() => close()}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DayScheduleEditor
                source={source}
                createDay={createDay}
                index={open ? 1 : -1}
                day={day}
                onAccept={(day) => {
                    close(day);
                }}
            />
        </Dialog>
    );



}