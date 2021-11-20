import * as React from "react";
import {useRef, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import CalendarPicker from "@mui/lab/CalendarPicker";
import {Paper} from "@mui/material";
import InfiniteDaysSlider from "../timetable/InfiniteDaysSlider";
import {ScreenInterface} from "../ScreenDisplay";


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


    const [date, setDate] = useState(dateBuild(dayjs()));

    const handleCalendar = (date: Dayjs) => {
        setDate(dateBuild(date));
    };

    return (
        <TripleGrid
            rightMenu={<CalendarPicker date={date} onChange={handleCalendar}/>}
            leftMenu={menu}
            containerRef={containerRef}>
            <Paper color="main">
                <InfiniteDaysSlider containerRef={containerRef} listSize={20} downloadsForRender={1}
                                    origin={date}/>
            </Paper>
        </TripleGrid>
    );
}