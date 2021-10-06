import * as React from 'react';
import {Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

interface LessonProps {
    lesson: {[key: string]: any},
    start: {[key: string]: any},
    end: {[key: string]: any}
}

export default  function Lesson({lesson, start, end}: LessonProps) {
    const [open, setOpen] = React.useState(false);
    let template = lesson['template']
    let place = lesson['place']
    const onClick = () => {
        setOpen(true);
    };
    const offClick = () => {
        setOpen(false);
    }
    return (
        <React.Fragment>
            <ListItem onMouseLeave={offClick} onMouseEnter={onClick}
                            secondaryAction={
                                <ListItemText  primary={place['auditory']} secondary={place['building']}  />
                            }>
                <ListItemText primary={template['name']} secondary={
                    start['hour'] + ':' + start['minute']
                    + ' - ' +
                    end['hour'] + ':' + end['minute']}
                />


                {/*{open ? <ExpandLess /> : <ExpandMore />}*/}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense={true} onMouseLeave={offClick} onMouseEnter={onClick}>
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText primary={template['note']}/>
                    </ListItem>
                </List>
            </Collapse>
        </React.Fragment>
    );
}