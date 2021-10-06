import * as React from 'react';
import {Box, List, ListItem, ListItemText, styled} from "@mui/material";
import Lesson from "./Lesson";

interface DayProps {
    days: Array<{[key: string]: any}>
    dayIndex: string
    schedule: {[key: string]: any}
}


const DayInfo = styled(List)<{ component?: React.ElementType }>({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: '100%',
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
});

export default function Day({days, dayIndex, schedule}: DayProps) {
    //TODO: add many days support
    let lessons : Array<React.ReactElement> = new Array<React.ReactElement>();
    if (days.length == 0) {
        return (
            <Box sx={{ width: "100%"}}>
                <List sx={{width: "100%"}} >
                    <DayInfo>
                        <ListItemText primary={dayIndex}/>
                    </DayInfo>
                    <ListItemText primary={'Нет занятий'}/>
                </List>
            </Box>
        );
    }
    let tt: {[key: string]: any};
    if (days[0]['schedule'] == null) {
        tt = schedule['schedule']
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
            <List>
                <DayInfo>
                    <ListItemText primary={dayIndex}/>
                </DayInfo>
                {lessons}
            </List>
        </Box>
    );
}