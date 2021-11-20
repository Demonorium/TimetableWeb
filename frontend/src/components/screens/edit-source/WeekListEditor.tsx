import * as React from 'react';
import {useState} from 'react';
import {Divider, Grid, IconButton, List, ListItem, ListItemButton, Paper, Tooltip, Typography} from "@mui/material";
import {addWeek, changeDay, removeWeek} from "../../../store/sourceMap";
import SortableArray, {SortableItem} from "../../../utils/sortableUtils";
import {ReactSortable} from "react-sortablejs";
import {Day, Source, Week, WeekDay} from "../../../database";
import ButtonWithFadeAction from "../../utils/ButtonWithFadeAction";
import {Add, Close} from "@material-ui/icons";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import axios from "axios";
import {DAY_NAMES} from "../../../utils/time";
import DayScheduleEditor from "./DayScheduleEditor";
import {findElement} from "../../../utils/arrayUtils";


interface WeekListProps {
    source: Source;
    week: number;
    setWeek: (week: number) => void;
}

function WeekList({source, week, setWeek}: WeekListProps) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const weeks = new SortableArray<Week>("week", "number", source.weeks);
    weeks.onRender = (item: SortableItem<Week>) => (
        <ButtonWithFadeAction actions={
            <Tooltip title="Удалить">
                <IconButton onClick={()=>{
                    axios.get("api/delete/week", {
                        auth: user,
                        params: {
                            id: item.object.id
                        }
                    }).then(() => {
                        dispatch(removeWeek({item: item.object, source: source.id}));
                    });
                }}>
                    <Close/>
                </IconButton>
            </Tooltip>
        } onClick={() => setWeek(item.object.id)} selected={item.object.id == week}>
            {"Неделя "+(item.object.number+1)}
        </ButtonWithFadeAction>
    );

    return (
        <Paper elevation={2}>
            <List>
                <ReactSortable list={weeks.array} setList={weeks.getSetter()}>
                        {weeks.render()}
                </ReactSortable>
                <ListItem sx={{textAlign:"center", display: "block"}}>
                    <IconButton color="primary" onClick={() => {
                        axios.get("api/create/week", {
                            auth: user,
                            params: {
                                sourceId: source.id,
                                number: weeks.array.length
                            }
                        }).then((response) => {
                            dispatch(addWeek({
                                item: {
                                    id: response.data,
                                    number: weeks.array.length,
                                    source: source.id,
                                    days: new Array<WeekDay>()
                                },
                                source: source.id
                            }))
                        });
                    }}>
                        <Add/>
                    </IconButton>
                </ListItem>
            </List>
        </Paper>
    )
}

interface DayListProps {
    source: Source;
    day: number;
    setDay: (week: number) => void;
    week?: Week;
}

function DayList({source, day, setDay, week}: DayListProps) {
    return (
        <Paper elevation={2}>
            <List>
                {[1, 2, 3, 4, 5, 6, 0].map((item) => {
                    return (
                        <ListItemButton disabled={week == undefined} onClick = {() => setDay(item)} selected={day==item}>
                            {DAY_NAMES[item]}
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    )
}



interface WeekListEditorProps {
    source: Source
}

export default function WeekListEditor({source} : WeekListEditorProps) {
    const map = useAppSelector(state => state.sourceMap);
    const dispatch = useAppDispatch();

    const [week, setWeek] = useState(-1);
    const [day, setDay] = useState(-1);

    const selectedWeek: Week = map.weeks[week];
    let item: Day | undefined = undefined;
    const resetDay = () => {
        if (selectedWeek && (day > 0)) {
            const weekDay = findElement(selectedWeek.days, (dw) => dw.number == day);
            if (weekDay)
                item = map.days[weekDay.day];
            else
                item = undefined;
        }
    }
    resetDay();

    const saveDay = async (day: Day) => {
        dispatch(changeDay({source: source.id, item: day}));
        return "ok";
    };

    return (
        <Grid container spacing={2}>
            {/*Первая строка*/}
            <Grid item xs={3}>
                <Typography variant="h6">Неделя</Typography>
                <Divider/>
                <WeekList source={source} week={week} setWeek={setWeek}/>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="h6">День недели</Typography>
                <Divider/>
                <DayList source={source} day={day} setDay={setDay} week={selectedWeek}/>
            </Grid>

            <Grid item xs={6}>
                {
                    selectedWeek && (day > 0) ?
                        <>
                            <Typography variant="h6">{DAY_NAMES[day]}</Typography>

                            <DayScheduleEditor day={item} onSave={saveDay} onReset={resetDay}/>
                        </>
                        : undefined
                }
            </Grid>

        </Grid>
    );
}