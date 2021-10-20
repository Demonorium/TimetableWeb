import * as React from 'react';
import {Box, List, ListItem, ListItemText, styled} from "@mui/material";
import Lesson from "./Lesson";
import {DAY, DAY_NAMES, MONTH_OF_YEAR, nameOffset, SimpleCalendar, WEEK, YEAR} from "../utils/time";
import {connect} from "react-redux";
import {RootState} from "../store/global";
import {ScheduleState} from "../store/schedule";

interface DayProps {
    index: number;
    calendar: SimpleCalendar;

    days: Array<{[key: string]: any}>;
    store: RootState;
}


function Day({index, calendar, days, store}: DayProps) {
    let lessons : Array<React.ReactElement> = new Array<React.ReactElement>();
    //Заголовок, который описывает, что за день перед нами
    let dayHeader = (
        <List>
            <ListItem
                secondaryAction={
                    <ListItemText primary={calendar.get(YEAR) + ":" + calendar.get(MONTH_OF_YEAR) + ":" + (calendar.get(DAY))}  />
                }>
                <ListItemText primary={DAY_NAMES[calendar.getValueOf(DAY, WEEK)]} secondary={nameOffset(index)}/>
            </ListItem>
        </List>
    )

    if (days.length == 0) {
        return (
            <Box sx={{ display: 'flex' }}>
                <List sx = {{width: "100%"}}>
                    {dayHeader}
                    <ListItemText primary={'Нет занятий'}/>
                </List>
            </Box>
        );
    }

    //Ищем расписание звонков
    let scheduleState: ScheduleState = store.schedule;
    for (let i = 0; i < days.length; ++i) {
        if (days[i].priority < scheduleState.priority) {
            break;
        } else if (days[i].schedule ) {

        }
    }


    if (days[0]['schedule'] == null) {
        tt = store.schedule
    } else {
        tt = days[0]['schedule']['schedule']
    }
    console.log(tt)
    let arr: Array<any> = new Array<any>()
    for (let stm in tt) {
        arr.push(tt[stm]);
    }
    arr = arr.sort((x1:any,x2:any) => x1['time'] - x2['time']);
    console.log(arr)
    for (let lesson_k in days[0]['lessons']) {
        let lesson: {[key: string]: any} = days[0]['lessons'][lesson_k]
        let lnumb: number = lesson['number'] * 2;
        lessons.push(<Lesson lesson={lesson} start={arr[lnumb]} end={arr[lnumb + 1]}/>);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <List sx = {{width: "100%"}}>
                {dayHeader}
                {lessons}
            </List>
        </Box>
    );
}

function mapStateToProps(state: any) {
    return {
        store: state
    }
}
export default connect(mapStateToProps, Day);