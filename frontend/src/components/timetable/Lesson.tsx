import * as React from 'react';
import {Collapse, Divider, List, ListItem, ListItemText} from "@mui/material";
import {Lesson, ScheduleElement} from "../../database";

interface LessonProps {
    lesson: Lesson,
    start: ScheduleElement,
    end: ScheduleElement
}
function minuteToStr(m: number) {
    if (m < 10) {
        return ':0' + m
    }
    return ':' + m;
}

export default function Lesson({lesson, start, end}: LessonProps) {
    const [open, setOpen] = React.useState(false);
    const template = lesson.template;
    const place = lesson.place;

    const onClick = () => {
        setOpen(true);
    };
    const offClick = () => {
        setOpen(false);
    }

    return (
        <React.Fragment>
            <Divider />
            <ListItem onMouseLeave={offClick} onMouseEnter={onClick}
                            secondaryAction={
                                <ListItemText  primary={place['auditory']} secondary={place['building']}  />
                            }>
                <ListItemText primary={template['name']} secondary={
                    start.hour + minuteToStr(start.minute)
                    + ' - ' +
                    end.hour + minuteToStr(end.minute)}
                />

            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>

                <List component="div" disablePadding dense={true} onMouseLeave={offClick} onMouseEnter={onClick}>
                    <Divider />
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary={template['note']}/>
                    </ListItem>
                </List>
            </Collapse>
        </React.Fragment>
    );
}