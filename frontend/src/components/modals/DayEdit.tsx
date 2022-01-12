import * as React from 'react';
import {Day, Source} from "../../database";
import DayScheduleEditor from "../screens/edit-source/DayScheduleEditor";
import DialogTemplate from "./DialogTemplate";

interface DayEditProps {
    open: boolean;
    close: (day?: Day) => void;
    source: Source;
    createDay: () => Promise<number>;
    day?: Day;
    date: String;
}

export default function DayEdit({day, open, date, close, source, createDay}: DayEditProps) {
    return (
        <DialogTemplate
            title={"Редактировать день " + date}
            open={open}
            close={() => close()}
            childrenAlign="left">

            <DayScheduleEditor
                source={source}
                createDay={createDay}
                index={open ? 1 : -1}
                day={day}
                onAccept={(day) => {
                    close(day);
                }}
            />
        </DialogTemplate>
    );
}