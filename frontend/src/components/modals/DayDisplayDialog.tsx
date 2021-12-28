import * as React from 'react';
import {DialogContent} from "@mui/material";
import Day, {DayProps} from "../timetable/Day";
import DialogTemplate from "./DialogTemplate";

interface DayDisplayDialogProps {
    open: boolean;
    close: () => void;
    day: DayProps;
}

export default function DayDisplayDialog({open, close, day}: DayDisplayDialogProps) {
    return (
        <DialogTemplate title={day.date} open={open} close={close} outsideClose>
            <DialogContent dividers sx={{textAlign: "center"}}>
                <Day {...day} full/>
            </DialogContent>
        </DialogTemplate>
    );
}