import * as React from 'react';
import {Box, List, ListItem, ListItemText, styled} from "@mui/material";

interface DayProps {
    days: Array<{[key: string]: any}>
    dayIndex: string
}


const DayInfo = styled(List)<{ component?: React.ElementType }>({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
});

export default function Day({days, dayIndex}: DayProps) {
    //TODO: add many days support
    let lessons : Array<React.Component>
    if (days.length == 0) {
        return (
            <Box sx={{ display: 'flex' }}>
                <List>
                    <DayInfo>
                        <ListItemText primary={dayIndex}/>
                    </DayInfo>
                    <ListItemText primary={'Нет занятий'}/>
                </List>
            </Box>
        )
    }


    return (
        <Box sx={{ display: 'flex' }}>
            <List>
                <DayInfo>
                    <ListItemText primary={dayIndex}/>
                </DayInfo>
            </List>
        </Box>
    );
}