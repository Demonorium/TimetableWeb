import * as React from 'react';
import {Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

interface LessonProps {
    lesson: {[key: string]: any},
    start: {[key: string]: any},
    end: {[key: string]: any}
}

export default  function Lesson({lesson, start, end}: LessonProps) {
    const [open, setOpen] = React.useState(true);
    let template = lesson['template']
    let place = lesson['place']
    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <React.Fragment>
            <ListItemButton onMouseLeave={handleClick} onMouseEnter={handleClick}>
                <ListItemText primary={template['name']} secondary={
                    start['hour'] + ':' + start['minute']
                    + ' - ' +
                    end['hour'] + ':' + end['minute']}
                />
                <ListItemText primary={place['auditory']} secondary={place['building']}  />

                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary={template['note']}/>
                    </ListItemButton>
                </List>
            </Collapse>
        </React.Fragment>
    );
}