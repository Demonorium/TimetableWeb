import * as React from 'react';
import {CircularProgress, Divider, List, ListItem, ListItemText} from "@mui/material";
import Lesson from "./Lesson";
import {Changes, Lesson as LessonRepresentation, ScheduleElement} from "../database";


export interface InternalDayRepresentation {
    lessons: Array<LessonRepresentation>;
    schedule: Array<ScheduleElement>;

    priority: number;
}

export function makeInternalDayRepresentation(changes: Changes, priority: number): InternalDayRepresentation {

    return {
        lessons: changes.lessons,
        schedule: changes.schedule,
        priority: priority
    }
}

interface DayProps {
    index: number;

    date: string;
    dayOfWeek: string;
    dateOffset: string;

    day?: InternalDayRepresentation;

    currentRef?: any;
}


function DayContainer(props: any) {
    return (
        <ListItem sx={{ display: 'flex', paddingTop: "0" }} ref={props.currentRef} key={props.list_key}>
            <List sx={{width: "100%", paddingTop: "0", paddingBottom: "0"}}>
                <Divider />
                {props.dayHeader}
                {props.list.length == 0 ? <Divider /> : undefined}
                <ListItem sx = {{padding: "8px 32px"}}>
                    <List sx = {{width: "100%", paddingTop: "0", paddingBottom: "0"}}>
                        {props.list}
                    </List>
                </ListItem>
            </List>
        </ListItem>
    );
}


//Заголовок, который описывает, что за день перед нами
function DayHeader(props: any) {
    return (
        <ListItem
            secondaryAction={
                <ListItemText primary={props.date} key={1}  />
            }>
            <ListItemText primary={props.dayOfWeek} secondary={props.dateOffset} key={2}/>
        </ListItem>
    );
}

function Day(props: DayProps) {
    const lessons = new Array<React.ReactElement>();
    const dayHeader = <DayHeader date={props.date} dayOfWeek={props.dayOfWeek} dateOffset={props.dateOffset}/>

    //Если описание дня небыло передано, то мы считаем, что день всё ещё загружается
    if (props.day == undefined) {
        return <DayContainer dayHeader = {dayHeader} list={[<CircularProgress />]} currentRef={props.currentRef} list_key={props.index}/>;
        //return <DayContainer dayHeader = {dayHeader} list={[<ListItemText primary={'Идёт загрузка'}/>]} currentRef={props.currentRef} list_key={props.index}/>;
    }

    //Если расписания нет, значит нет занятий
    if (props.day.lessons.length == 0) {
        return <DayContainer dayHeader = {dayHeader} list={[<ListItemText primary={'Нет занятий'}/>]} currentRef={props.currentRef} list_key={props.index}/>;
    }

    for (let i = 0; i < props.day.lessons.length; ++i) {
        const lesson = props.day.lessons[i];
        const callNumber = lesson.number * 2;

        if ((callNumber+1) >= props.day.schedule.length) break;

        lessons.push(<Lesson lesson={lesson}
                             start={props.day.schedule[callNumber]}
                             end={props.day.schedule[callNumber + 1]}/>)
    }

    return <DayContainer dayHeader = {dayHeader} list={lessons} currentRef={props.currentRef} key={props.index}/>;
}

export default Day;