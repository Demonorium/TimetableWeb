import * as React from 'react';
import {useState} from 'react';
import {
    Button,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    Paper,
    Stack, Tab, Tabs,
    Tooltip,
    Typography
} from "@mui/material";
import {addDay, addWeek, changeDay, changeWeek, removeWeek} from "../../../store/sourceMap";
import SortableArray, {SortableItem} from "../../../utils/sortableUtils";
import {ReactSortable} from "react-sortablejs";
import {Day, Lesson, Source, User, Week, WeekDay} from "../../../database";
import ButtonWithFadeAction from "../../utils/ButtonWithFadeAction";
import {Add, Close} from "@material-ui/icons";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import axios from "axios";
import {DAY_NAMES, DAY_NAMES_SHRT} from "../../../utils/time";
import DayScheduleEditor from "./DayScheduleEditor";
import {addElement, containsElement, findElement} from "../../../utils/arrayUtils";
import user from "../../../store/user";
import {LoadingButton} from "@mui/lab";


interface WeekListProps {
    source: Source;
    week: number;
    setWeek: (week: number) => void;
}

function WeekList({source, week, setWeek}: WeekListProps) {
    return (
        <Paper elevation={2} sx={{overflowX:"auto"}}>
            {
                source.weeks.length > 0 ? <Tabs value={week}
                      onChange={(event,item) => setWeek(item)}
                      aria-label="basic tabs example">
                    {
                        source.weeks.map((week, index) =>
                            <Tab value={week.id} label={index+1} id={'week-tab-' + index}/>)
                    }
                </Tabs> :
                    <Tabs sx={{
                        width:"100%", display:"block!important", textAlign: "center",
                        "& .MuiTabs-flexContainer": {display:"block!important", textAlign: "center"}
                    }}
                          value={1}
                          aria-label="weeks-tabs">
                        <Tab value={1} label={"НЕТ СОЗДАННЫХ НЕДЕЛЬ"} disabled id={'lesson-tab-1'}/>
                </Tabs>
            }

        </Paper>
    );
}

interface DayListProps {
    day: number;
    setDay: (week: number) => void;
    week?: Week;
}

function DayList({day, setDay, week}: DayListProps) {
    return (
        <Tabs sx={{
            width:"100%", display:"block!important", textAlign: "center",
            "& .MuiTabs-flexContainer": {display:"block!important", textAlign: "center"}
        }}
              value={day >= 0 ? day : 1}
              onChange={(event,item) => setDay(item)}
              aria-label="days-tabs">
            {[1, 2, 3, 4, 5, 6, 0].map((item) => {
                return (
                    <Tab value={item} label={DAY_NAMES_SHRT[item]} disabled={week == undefined} id={'lesson-tab-' + item}/>
                );
            })}
        </Tabs>
    )
}

async function createLesson(dayId: number, lesson: Lesson, user: User) {
    lesson.day = dayId;
    await axios.get("api/create/lesson", {
        auth: user,
        params: {
            ...lesson,
            day: dayId
        }
    }).then((response) => {
        lesson.id = response.data;
    });
}


interface WeekListEditorProps {
    source: Source
}

export default function WeekListEditor({source} : WeekListEditorProps) {
    const map = useAppSelector(state => state.sourceMap);
    const user = useAppSelector(state => state.user);

    const dispatch = useAppDispatch();

    const [week, setWeek] = useState(source.weeks.length > 0 ? source.weeks[0].id : -1);
    const [day, setDay] = useState(1);

    const [btLoading, setBTLoading] = useState(false);


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

    const index = week * 100 + day;

    const createWeek = () => {
        setBTLoading(true);
        axios.get("api/create/week", {
            auth: user,
            params: {
                sourceId: source.id,
                number: source.weeks.length
            }
        }).then((response) => {
            const first = source.weeks.length == 0;

            dispatch(addWeek({
                item: {
                    id: response.data,
                    number: source.weeks.length,
                    source: source.id,
                    days: new Array<WeekDay>()
                },
                source: source.id
            }));

            if (first)
                setWeek(response.data);

            setBTLoading(false);
        }).catch(() => {
            setBTLoading(false);
        });
    }

    const delWeek = () => {
        setBTLoading(true);
        axios.get("api/delete/week", {
            auth: user,
            params: {
                id: week
            }
        }).then(() => {
            setWeek(source.weeks.length > 0 ? source.weeks[0].id : 0);
            dispatch(removeWeek({item: selectedWeek, source: source.id}));
            setBTLoading(false);
        }).catch(() => {
            setBTLoading(false);
        });

    }



    return (
        <Grid container spacing={2} sx={{marginTop:"0"}}>
            {/*Первая строка*/}
            <Grid item xs={12}>
                <ListItem secondaryAction={
                    <Stack direction="row" spacing={1}>
                        <LoadingButton loading={btLoading} variant="outlined" onClick={createWeek}>
                            Создать
                        </LoadingButton>
                        <LoadingButton loading={btLoading}
                                       color="error" variant="outlined"
                                       disabled={selectedWeek == undefined} onClick={delWeek}>
                            Удалить
                        </LoadingButton>
                    </Stack>

                } sx={{padding: "0"}}>
                    <Typography variant="h5">Неделя</Typography>
                </ListItem>
                <WeekList source={source} week={week} setWeek={setWeek}/>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5">День недели</Typography>
                <Divider/>
                <DayList day={day} setDay={setDay} week={selectedWeek}/>
                <Divider/>
            </Grid>

            <Grid item xs={12}>
                {
                    selectedWeek && (day >= 0) ?
                        <DayScheduleEditor
                            source={source}
                            day={item}
                            index={index}
                            createDay={async () => {
                                const data: WeekDay = (await axios.get("api/create/weekDay",{
                                    auth: user,
                                    params: {
                                        weekId: selectedWeek.id,
                                        number: day
                                    }
                                })).data;

                                dispatch(addDay({source: source.id, item: {
                                        id: data.day,
                                        source: source.id,
                                        lessons: new Array<Lesson>()
                                    }}));
                                dispatch(changeWeek({source: source.id, item: {
                                            ...selectedWeek,
                                            days: addElement(selectedWeek.days, data)
                                        }
                                    }
                                ))

                                return data.day;
                            }}
                            onReset={resetDay}/>
                        : undefined
                }
            </Grid>

        </Grid>
    );
}