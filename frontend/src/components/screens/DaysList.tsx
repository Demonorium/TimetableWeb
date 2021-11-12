import {useAppDispatch, useAppSelector} from "../../store/hooks";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import axios from "axios";
import {setPriorities} from "../../store/priorities";
import {SourcePriority} from "../../database";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import CalendarPicker from "@mui/lab/CalendarPicker";
import {Box, Paper} from "@mui/material";
import InfiniteDaysSlider from "../timetable/InfiniteDaysSlider";
import {ScreenInterface} from "../ScreenDisplay";
import {arrayEq} from "../../utils/arrayUtils";

export function DaysList({menu}: ScreenInterface) {
    const user = useAppSelector((state) => state.user);
    const priorities = useAppSelector(state => state.priorities.list);
    const dispatch = useAppDispatch();

    const containerRef = useRef<any>();

    const [update, setUpdate] = useState(true);
    const [date, setDate] = useState(dayjs());

    useEffect(() => {
        if (update) {
            axios.get("/api/find/current_sources", {
                auth: user
            }).then((response) => {
                if (!arrayEq(response.data, priorities))
                    dispatch(setPriorities(response.data));
            }).catch((response) => {
                if (!arrayEq(response.data, priorities))
                    dispatch(setPriorities(new Array<SourcePriority>()));
            })
            setUpdate(false);
        }
    }, [update]);

    const handleCalendar = (date: any) => {
        setDate(date);
    };

    return (
        <TripleGrid
            rightMenu={<CalendarPicker date={date} onChange={handleCalendar}/>}
            leftMenu={menu}>
            <Box ref={containerRef} sx={{
                width: '100%', height: '100%',
                overflow: 'hidden scroll',
                padding: '0', margin: '0'
            }}>
                <Paper color="main">
                    <InfiniteDaysSlider containerRef={containerRef} listSize={20} downloadsForRender={10}
                                        origin={date}/>
                </Paper>
            </Box>
        </TripleGrid>
    );
}