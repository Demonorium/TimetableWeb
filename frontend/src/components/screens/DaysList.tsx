import * as React from "react";
import {useRef, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import CalendarPicker from "@mui/lab/CalendarPicker";
import {Paper} from "@mui/material";
import InfiniteDaysSlider from "../timetable/InfiniteDaysSlider";
import {ScreenInterface} from "../ScreenDisplay";
import DayDisplayDialog from "../modals/DayDisplayDialog";
import {DayProps} from "../timetable/Day";


function dateBuild(date: Dayjs) {
    return (
        date.millisecond(0)
            .second(0)
            .minute(0)
            .hour(0)
    );

}

export function DaysList({menu}: ScreenInterface) {
    const containerRef = useRef<any>();

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(dateBuild(dayjs()));
    const [state, setState] = useState<DayProps | null>(null);

    const handleCalendar = (date: Dayjs) => {
        setDate(dateBuild(date));
    };

    return (
        <TripleGrid
            rightMenu={<CalendarPicker date={date} onChange={handleCalendar}/>}
            leftMenu={menu}
            containerRef={containerRef}>
            <Paper color="main">
                {
                    state ?
                        <DayDisplayDialog open={true} close={() => setState(null)} day={state}/>
                        : undefined
                }

                <InfiniteDaysSlider containerRef={containerRef} listSize={20} downloadsForRender={1}
                                    origin={date} setDay={setState}/>
            </Paper>
        </TripleGrid>
    );
}