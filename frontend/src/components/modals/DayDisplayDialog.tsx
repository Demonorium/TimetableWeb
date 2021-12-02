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
import Day, {DayProps} from "../timetable/Day";


interface DayDisplayDialogProps {
    open: boolean;
    close: () => void;
    day: DayProps;
}

export default function DayDisplayDialog({open, close, day}: DayDisplayDialogProps) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    return (
        <Dialog
            open={open}
            aria-labelledby="share-dialog-title"
            aria-describedby="share-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2, width: "600px"}}>
                {day.date}
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
                <Day {...day} full/>
            </DialogContent>
        </Dialog>
    );



}