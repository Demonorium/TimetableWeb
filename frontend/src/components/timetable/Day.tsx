import * as React from 'react';
import {CircularProgress, Divider, List, ListItem, ListItemText} from "@mui/material";
import Lesson from "./Lesson";
import {Lesson as LessonRepresentation, ScheduleElement} from "../../database";


export interface LessonPair {
    dur: LessonDur;
    lesson: LessonRepresentation;
}

export interface LessonDur {
    start: ScheduleElement;
    end?: ScheduleElement;
}

export interface InternalDayRepresentation {
    lessons: Array<LessonPair>;
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

    //Если описание дня не было передано, то мы считаем, что день всё ещё загружается
    if (props.day == undefined) {
        return <DayContainer dayHeader = {dayHeader} list={[<CircularProgress />]} currentRef={props.currentRef} list_key={props.index}/>;
    }

    //Если расписания нет, значит нет занятий
    if (props.day.lessons.length == 0) {
        return <DayContainer dayHeader = {dayHeader} list={[<ListItemText primary={'Нет занятий'}/>]} currentRef={props.currentRef} list_key={props.index}/>;
    }


    let prev: LessonPair = props.day.lessons[0];
    for (let i = 0; i < props.day.lessons.length; ++i) {
        const pair = props.day.lessons[i];

        lessons.push(<Lesson lesson={pair.lesson}
                             start={pair.dur.start}
                             end={pair.dur.end}
                             first={(prev.dur.start.time == pair.dur.start.time) && (pair.dur.end == undefined)}
        />);
        prev = pair;
    }

    return <DayContainer dayHeader = {dayHeader} list={lessons} currentRef={props.currentRef} key={props.index}/>;
}

export default Day;

