import * as React from 'react';
import {Collapse, Divider, List, ListItem, ListItemText} from "@mui/material";
import {Lesson, LessonTemplate, Place, ScheduleElement} from "../../database";
import {useAppSelector} from "../../store/hooks";
import sourceMap from "../../store/sourceMap";

interface LessonProps {
    lesson: Lesson;
    start: ScheduleElement;
    first: boolean;
    end?: ScheduleElement;
    full?: boolean;
}
function minuteToStr(m: number) {
    if (m < 10) {
        return ':0' + m
    }
    return ':' + m;
}

function getFrom(first: boolean, start: ScheduleElement, end?: ScheduleElement) {
    if (end) {
        return (
            start.hour + minuteToStr(start.minute)
            + ' - ' +
            end.hour + minuteToStr(end.minute)
        )
    } else if (first) {
        return "c " + start.hour + minuteToStr(start.minute)
    } else {
        return "После предыдущего"
    }
}

export default function Lesson({lesson, first, start, end, full}: LessonProps) {
    const map = useAppSelector(state => state.sourceMap);
    const template: LessonTemplate = map.templates[lesson.template];
    const place: Place = map.places[lesson.place];

    const [open, setOpen] = React.useState(false);

    if (!template)
        throw new Error("No template for lesson: " + lesson);
    if (!place)
        throw new Error("No place for lesson: " + lesson);

    const onClick = () => {
        if (template && (template.note != undefined) && (template.note.length > 0))
            setOpen(true);
    };

    const offClick = () => {
        setOpen(false);
    }

    const renderTeacher = (id: number) => {
        const teacher = map.teachers[id];

        return (
            <ListItem sx={{ pl: 8 }}>
                <ListItemText primary={teacher.name + (teacher.position.length > 0 ? " (" + teacher.position + ")" : "")}
                              secondary={teacher.note}/>
            </ListItem>
        );
    }

    return (
        <React.Fragment>
            <Divider />
            <ListItem onMouseLeave={offClick} onMouseEnter={onClick}
                            secondaryAction={
                                (place && !full)
                                    ? <ListItemText  primary={place['auditory']} secondary={place['building']}  />
                                    : undefined
                            }>
                <ListItemText primary={template['name']} secondary={getFrom(first, start, end)}
                />

            </ListItem>
            <Collapse in={open || full} timeout="auto" unmountOnExit>

                <List component="div" disablePadding dense={true} onMouseLeave={offClick} onMouseEnter={onClick}>
                    <Divider />
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary={template['note']}/>
                    </ListItem>
                </List>
            </Collapse>
            {
                full ?
                    <List component="div" disablePadding dense={true}>
                        <ListItemText sx={{ pl: 6 }} primary={"Аудитория: " + place.auditory}/>
                        <ListItemText sx={{ pl: 6 }} primary={"Здание: " + place.building}/>
                        {place.note ? <ListItemText sx={{ pl: 6 }} primary={place.note}/> :undefined}
                        <ListItemText sx={{ pl: 6 }} primary={"Преподаватели"}/>
                        {
                            lesson.teachers.length > 0
                                ? lesson.teachers.map(renderTeacher)
                                : template.defaultTeachers.map(renderTeacher)
                        }

                    </List>
                    :undefined
            }
        </React.Fragment>
    );
}